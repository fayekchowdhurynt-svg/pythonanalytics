import { useState } from "react";
import type { Challenge } from "../../types/content";
import { usePyodide } from "../../hooks/usePyodide";
import { CodeEditor } from "../editor/CodeEditor";
import { OutputConsole } from "../editor/OutputConsole";
import { validateChallenge } from "../../utils/validateChallenge";
import { buildAstProbeCode, checkAstTokens } from "../../utils/astCheck";

interface ChallengePanelProps {
  challenge: Challenge;
  onPassed: () => void;
}

export function ChallengePanel({ challenge, onPassed }: ChallengePanelProps) {
  const { run, status: pyodideStatus, loadingPackages } = usePyodide();
  const [runState, setRunState] = useState<"idle" | "running" | "done">("idle");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [outcome, setOutcome] = useState<{ passed: boolean; failures: string[] } | null>(null);

  const variableNames = challenge.validators
    .filter((v): v is Extract<typeof v, { kind: "variables" }> => v.kind === "variables")
    .flatMap((v) => Object.keys(v.expected));

  const functionCalls = challenge.validators
    .filter((v): v is Extract<typeof v, { kind: "function" }> => v.kind === "function")
    .map((v) => ({ functionName: v.functionName, args: v.cases.map((c) => c.args) }));

  const astValidators = challenge.validators.filter(
    (v): v is Extract<typeof v, { kind: "ast" }> => v.kind === "ast"
  );

  const handleRun = async (code: string) => {
    setRunState("running");
    setOutcome(null);

    const result = await run(code, {
      captureVariables: variableNames,
      functionCalls,
    });
    setStdout(result.stdout);
    setStderr(result.stderr);

    const runtimeOutcome = validateChallenge(result, challenge.validators);

    let astFailures: string[] = [];
    if (astValidators.length > 0) {
      const astResult = await run(buildAstProbeCode(code), { captureVariables: ["__ast_tokens__"] });
      const tokens = (astResult.variables.__ast_tokens__ as string[]) ?? [];
      astFailures = astValidators.flatMap((v) => checkAstTokens(tokens, v));
    }

    const combined = {
      passed: runtimeOutcome.passed && astFailures.length === 0,
      failures: [...runtimeOutcome.failures, ...astFailures],
    };
    setOutcome(combined);
    setRunState("done");
    if (combined.passed) onPassed();
  };

  const consoleStatus =
    runState === "running"
      ? pyodideStatus === "loading-runtime"
        ? "loading-runtime"
        : pyodideStatus === "loading-packages"
        ? "loading-packages"
        : "running"
      : runState;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
        <p className="text-[var(--color-text)]">{challenge.prompt}</p>
      </div>
      <CodeEditor starterCode={challenge.starterCode} onRun={handleRun} isRunning={runState === "running"} />
      <OutputConsole
        stdout={stdout}
        stderr={stderr}
        status={consoleStatus}
        loadingPackages={loadingPackages}
      />
      {outcome && (
        <div
          className={`rounded-lg border p-4 ${
            outcome.passed
              ? "border-[var(--color-positive)] bg-[var(--color-positive)]/10"
              : "border-[var(--color-negative)] bg-[var(--color-negative)]/10"
          }`}
        >
          {outcome.passed ? (
            <p className="text-[var(--color-positive)] font-semibold">
              ✓ Correct — that matches what the business needed.
            </p>
          ) : (
            <ul className="text-[var(--color-negative)] text-sm space-y-1">
              {outcome.failures.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
