import { useCallback, useEffect, useRef, useState } from "react";

export type PyodideStatus = "idle" | "loading-runtime" | "loading-packages" | "ready" | "error";

export interface RunOptions {
  packages?: string[];
  captureVariables?: string[];
  functionCalls?: { functionName: string; args: unknown[] }[];
}

export interface RunResult {
  stdout: string;
  stderr: string;
  variables: Record<string, unknown>;
  functionResults: Record<string, unknown[]>;
  error: string | null;
}

export function usePyodide() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<string, (result: RunResult) => void>>(new Map());
  const [status, setStatus] = useState<PyodideStatus>("idle");
  const [loadingPackages, setLoadingPackages] = useState<string[]>([]);

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("../services/pyodide.worker.ts", import.meta.url));
      workerRef.current.onmessage = (event: MessageEvent) => {
        const msg = event.data;
        if (msg.type === "status") {
          setStatus(msg.status);
          if (msg.status === "loading-packages") setLoadingPackages(msg.packages);
        } else if (msg.type === "result") {
          setStatus("ready");
          const resolve = pendingRef.current.get(msg.executionId);
          if (resolve) {
            resolve({
              stdout: msg.stdout,
              stderr: msg.stderr,
              variables: msg.variables,
              functionResults: msg.functionResults,
              error: msg.error,
            });
            pendingRef.current.delete(msg.executionId);
          }
        }
      };
    }
    return workerRef.current;
  }, []);

  const run = useCallback(
    (code: string, options: RunOptions = {}): Promise<RunResult> => {
      const worker = getWorker();
      const executionId = crypto.randomUUID();
      return new Promise((resolve) => {
        pendingRef.current.set(executionId, resolve);
        worker.postMessage({
          type: "run",
          executionId,
          code,
          packages: options.packages ?? [],
          captureVariables: options.captureVariables ?? [],
          functionCalls: options.functionCalls ?? [],
        });
      });
    },
    [getWorker]
  );

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  return { run, status, loadingPackages };
}
