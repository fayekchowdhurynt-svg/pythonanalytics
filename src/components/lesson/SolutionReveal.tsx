import { useState } from "react";
import type { Challenge } from "../../types/content";

export function SolutionReveal({ challenge }: { challenge: Challenge }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-4 py-2 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors"
      >
        Reveal solution
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-wide mb-2">Solution</div>
        <pre className="rounded-lg border border-[var(--color-border)] bg-[var(--color-code-bg)] p-4 font-mono text-sm overflow-x-auto">
          {challenge.solutionCode}
        </pre>
      </div>
      <p className="text-[var(--color-text)] leading-relaxed">{challenge.solutionExplanation}</p>
      <div className="rounded-lg border border-[var(--color-accent-dim)] bg-[var(--color-surface-raised)] p-4">
        <div className="text-xs font-semibold text-[var(--color-accent)] mb-1">Business context</div>
        <p className="text-sm text-[var(--color-text-muted)]">{challenge.businessContext}</p>
      </div>
      {challenge.alternativeSolution && (
        <div>
          <div className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">Alternative approach</div>
          <p className="text-sm text-[var(--color-text-muted)]">{challenge.alternativeSolution}</p>
        </div>
      )}
      <div>
        <div className="text-xs font-semibold text-[var(--color-positive)] mb-1">Best practices</div>
        <ul className="text-sm text-[var(--color-text-muted)] list-disc list-inside space-y-1">
          {challenge.bestPractices.map((bp, i) => (
            <li key={i}>{bp}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
