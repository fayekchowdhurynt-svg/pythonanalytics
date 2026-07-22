import { MODULES, totalLessonCount } from "../data/moduleRegistry";
import { useProgress } from "../hooks/useProgress";
import { calculateCompletionPercent } from "../utils/progressStore";
import { ProgressRing } from "../components/dashboard/ProgressRing";
import { ModuleCard } from "../components/dashboard/ModuleCard";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { progress } = useProgress();
  const percent = calculateCompletionPercent(progress, totalLessonCount());
  const nextLesson =
    MODULES.flatMap((m) => m.lessons).find((l) => !progress.completedLessonIds.includes(l.id)) ??
    MODULES[0].lessons[0];
  const remainingMinutes = MODULES.flatMap((m) => m.lessons)
    .filter((l) => !progress.completedLessonIds.includes(l.id))
    .reduce((sum, l) => sum + l.estimatedMinutes, 0);

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <ProgressRing percent={percent} />
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-[var(--color-text-muted)] text-sm mb-4">
            {progress.completedLessonIds.length} of {totalLessonCount()} lessons complete ·{" "}
            ~{remainingMinutes} min remaining
          </p>
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="inline-block text-sm px-4 py-2 rounded-md bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold hover:bg-[var(--color-accent-dim)] transition-colors"
          >
            Continue learning →
          </Link>
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Modules</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </div>
  );
}
