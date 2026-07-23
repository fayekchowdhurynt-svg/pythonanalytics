/// <reference lib="webworker" />

// Runs in a dedicated Worker so Pyodide's WASM execution never blocks the UI
// thread (important: student code can contain infinite loops).
//
// Pyodide itself is loaded from CDN at runtime rather than bundled, keeping
// the app's own build small and avoiding committing ~200MB of wasm/data
// files into the repo that GitHub Pages would need to serve.

declare const self: DedicatedWorkerGlobalScope;

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type LoadedPyodide = Awaited<ReturnType<typeof loadPyodideFromCdn>>;

let pyodideInstance: LoadedPyodide | null = null;
let loadedPackages = new Set<string>();

declare function importScripts(...urls: string[]): void;

async function loadPyodideFromCdn() {
  importScripts(`${PYODIDE_CDN}pyodide.js`);
  // @ts-expect-error injected globally by pyodide.js
  return await self.loadPyodide({ indexURL: PYODIDE_CDN });
}

async function ensurePyodide(packages: string[]): Promise<LoadedPyodide> {
  if (!pyodideInstance) {
    self.postMessage({ type: "status", status: "loading-runtime" });
    pyodideInstance = await loadPyodideFromCdn();
  }
  const missing = packages.filter((p) => !loadedPackages.has(p));
  if (missing.length > 0) {
    self.postMessage({ type: "status", status: "loading-packages", packages: missing });
    await pyodideInstance.loadPackage(missing);
    missing.forEach((p) => loadedPackages.add(p));
  }
  return pyodideInstance;
}

const EXECUTION_TIMEOUT_MS = 8000;

interface RunRequest {
  type: "run";
  executionId: string;
  code: string;
  packages?: string[];
  /** Variable names to introspect after execution, for the "variables" validator. */
  captureVariables?: string[];
  /** Names of student-defined functions to call with test-case args. */
  functionCalls?: { functionName: string; args: unknown[] }[];
}

self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const msg = event.data;
  if (msg.type !== "run") return;

  const { executionId, code, packages = [], captureVariables = [], functionCalls = [] } = msg;

  try {
    const pyodide = await ensurePyodide(packages);

    let stdout = "";
    let stderr = "";
    pyodide.setStdout({ batched: (s: string) => (stdout += s + "\n") });
    pyodide.setStderr({ batched: (s: string) => (stderr += s + "\n") });

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TIMEOUT")), EXECUTION_TIMEOUT_MS)
    );

    const globals = pyodide.globals;

    await Promise.race([pyodide.runPythonAsync(code), timeout]);

    const variables: Record<string, unknown> = {};
    for (const name of captureVariables) {
      if (globals.has(name)) {
        const val = globals.get(name);
        variables[name] = typeof val?.toJs === "function" ? val.toJs({ dict_converter: Object.fromEntries }) : val;
      }
    }

    const functionResults: Record<string, unknown[]> = {};
    for (const call of functionCalls) {
      if (globals.has(call.functionName)) {
        const fn = globals.get(call.functionName);
        const results = call.args.map((argSet) => {
          const argsArray = Array.isArray(argSet) ? argSet : [argSet];
          const result = fn(...argsArray);
          return typeof result?.toJs === "function" ? result.toJs() : result;
        });
        functionResults[call.functionName] = results;
      }
    }

    self.postMessage({
      type: "result",
      executionId,
      stdout,
      stderr,
      variables,
      functionResults,
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({
      type: "result",
      executionId,
      stdout: "",
      stderr: "",
      variables: {},
      functionResults: {},
      error: message === "TIMEOUT"
        ? "Your code took too long to run — check for an infinite loop."
        : message,
    });
  }
};

export {};
