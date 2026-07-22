import { useState } from "react";
import type { Hint } from "../../types/content";

export function HintPanel({ hints }: { hints: [Hint, Hint, Hint] }) {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-3">
      <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wide">Hints</div>
      {hints.slice(0, revealed).map((hint) => (
        <div key={hint.level} className="flex gap-3">
          <span className="row-index shrink-0">H{hint.level}</span>
          <p className="text-sm text-[var(--color-text)]">{hint.text}</p>
        </div>
      ))}
      {revealed < hints.length && (
        <button
          onClick={() => setRevealed(revealed + 1)}
          className="text-xs px-3 py-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
        >
          Reveal hint {revealed + 1} of {hints.length}
        </button>
      )}
    </div>
  );
}
