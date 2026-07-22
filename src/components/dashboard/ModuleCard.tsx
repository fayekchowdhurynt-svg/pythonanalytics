import { Link } from "react-router-dom";
import type { Module } from "../../types/content";
import { useProgress } from "../../hooks/useProgress";

export function ModuleCard({ module }: { module: Module }) {
  const { progress } = useProgress();
  const completedInModule = module.lessons.filter((l) =>
    progress.completedLessonIds.includes(l.id)
  ).length;
  const firstLesson = module.lessons[0];

  return (
    <Link
      to={`/lesson/${firstLesson.id}`}
      className="block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent)] transition-colors"
    >
      <div className="row-index mb-2">{String(module.order).padStart(2, "0")}</div>
      <h3 className="font-display font-semibold mb-1">{module.title}</h3>
      <p className="text-xs text-[var(--color-text-muted)] mb-3 capitalize">{module.businessDomain}</p>
      <div className="text-xs text-[var(--color-text-muted)]">
        {completedInModule}/{module.lessons.length} lessons · {module.xpReward} XP
      </div>
    </Link>
  );
}
