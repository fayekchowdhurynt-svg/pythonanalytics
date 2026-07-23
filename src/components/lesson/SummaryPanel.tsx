import type { LessonSummary } from "../../types/content";

const SECTIONS: { key: keyof LessonSummary; label: string }[] = [
  { key: "keyTakeaways", label: "Key takeaways" },
  { key: "commonMistakes", label: "Common mistakes" },
  { key: "interviewTips", label: "Interview tips" },
  { key: "realWorldApplications", label: "Real-world applications" },
];

export function SummaryPanel({ summary }: { summary: LessonSummary }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {SECTIONS.map(({ key, label }) => (
        <div key={key} className="rounded-lg border border-[var(--color-border)] p-4">
          <div className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wide mb-2">
            {label}
          </div>
          <ul className="text-sm text-[var(--color-text-muted)] space-y-1.5 list-disc list-inside">
            {summary[key].map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
