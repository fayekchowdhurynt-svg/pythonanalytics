interface OutputConsoleProps {
  stdout: string;
  stderr: string;
  status: "idle" | "loading-runtime" | "loading-packages" | "running" | "done";
  loadingPackages?: string[];
}

export function OutputConsole({ stdout, stderr, status, loadingPackages }: OutputConsoleProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-code-bg)] font-mono text-sm">
      <div className="px-4 py-2 border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
        Output
      </div>
      <div className="p-4 min-h-[80px] whitespace-pre-wrap">
        {status === "loading-runtime" && (
          <span className="text-[var(--color-accent)]">Starting Python runtime… (first run only)</span>
        )}
        {status === "loading-packages" && (
          <span className="text-[var(--color-accent)]">
            Loading {loadingPackages?.join(", ")}…
          </span>
        )}
        {status === "running" && <span className="text-[var(--color-accent)]">Running…</span>}
        {status === "done" && (
          <>
            {stdout && <div className="text-[var(--color-text)]">{stdout}</div>}
            {stderr && <div className="text-[var(--color-negative)]">{stderr}</div>}
            {!stdout && !stderr && (
              <span className="text-[var(--color-text-muted)]">No output.</span>
            )}
          </>
        )}
        {status === "idle" && (
          <span className="text-[var(--color-text-muted)]">Click Run to execute your code.</span>
        )}
      </div>
    </div>
  );
}
