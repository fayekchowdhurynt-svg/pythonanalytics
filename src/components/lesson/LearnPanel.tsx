import type { Lesson } from "../../types/content";

export function LearnPanel({ learn }: { learn: Lesson["learn"] }) {
  const rows: [string, string][] = [
    ["What it is", learn.whatItIs],
    ["Why it matters", learn.whyItMatters],
    ["When to use it", learn.whenToUseIt],
  ];
  return (
    <div className="space-y-4">
      {rows.map(([label, text], i) => (
        <div key={label} className="flex gap-4 border-b border-[var(--color-border)] pb-4 last:border-none">
          <span className="row-index w-6 shrink-0">{String(i).padStart(2, "0")}</span>
          <div>
            <div className="font-display font-semibold text-sm text-[var(--color-accent)] mb-1">{label}</div>
            <p className="text-[var(--color-text)] leading-relaxed">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
