import { Link, useLocation } from "react-router-dom";
import { MODULES } from "../../data/moduleRegistry";
import { useProgress } from "../../hooks/useProgress";

export function Sidebar() {
  const { progress } = useProgress();
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] h-screen sticky top-0 overflow-y-auto">
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link to="/" className="font-display font-bold text-lg tracking-tight">
          Py<span className="text-[var(--color-accent)]">Analytics</span>
        </Link>
      </div>
      <nav className="p-3 space-y-1">
        {MODULES.map((module) => (
          <div key={module.id} className="mb-3">
            <div className="row-index px-3 py-1">{String(module.order).padStart(2, "0")} — {module.title}</div>
            {module.lessons.map((lesson) => {
              const isComplete = progress.completedLessonIds.includes(lesson.id);
              const isActive = location.pathname === `/lesson/${lesson.id}`;
              return (
                <Link
                  key={lesson.id}
                  to={`/lesson/${lesson.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--color-surface-raised)] text-[var(--color-text)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-raised)]"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isComplete ? "bg-[var(--color-positive)]" : "bg-[var(--color-border)]"
                    }`}
                  />
                  {lesson.title}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
