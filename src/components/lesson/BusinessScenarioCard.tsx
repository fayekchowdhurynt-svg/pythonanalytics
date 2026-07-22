import type { Lesson } from "../../types/content";

export function BusinessScenarioCard({ scenario }: { scenario: Lesson["businessScenario"] }) {
  return (
    <div className="rounded-lg border border-[var(--color-accent-dim)] bg-[var(--color-surface-raised)] p-5">
      <div className="text-xs font-mono text-[var(--color-accent)] mb-2 tracking-wide uppercase">
        Business Scenario
      </div>
      <h3 className="font-display text-lg font-semibold mb-2">{scenario.title}</h3>
      <p className="text-[var(--color-text-muted)] leading-relaxed">{scenario.narrative}</p>
    </div>
  );
}
