import { useState } from "react";
import type { GuidedLine } from "../../types/content";

export function GuidedWalkthrough({ lines }: { lines: GuidedLine[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = lines[activeIndex];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-code-bg)] font-mono text-sm overflow-hidden">
        {lines.map((line, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-full text-left flex gap-3 px-4 py-2 border-l-2 transition-colors ${
              i === activeIndex
                ? "bg-[var(--color-surface-raised)] border-l-[var(--color-accent)]"
                : "border-l-transparent hover:bg-[var(--color-surface)]"
            }`}
          >
            <span className="row-index shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <code className="text-[var(--color-text)]">{line.code}</code>
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-3">
        <p className="text-[var(--color-text)] leading-relaxed">{active.explanation}</p>
        {active.commonMistakes && active.commonMistakes.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-[var(--color-negative)] mb-1">Common mistakes</div>
            <ul className="text-sm text-[var(--color-text-muted)] list-disc list-inside space-y-1">
              {active.commonMistakes.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
        {active.bestPractice && (
          <div>
            <div className="text-xs font-semibold text-[var(--color-positive)] mb-1">Best practice</div>
            <p className="text-sm text-[var(--color-text-muted)]">{active.bestPractice}</p>
          </div>
        )}
      </div>
    </div>
  );
}
