import { useProgress } from "../../hooks/useProgress";
import { XpTicker } from "./XpTicker";

export function TopNav() {
  const { progress } = useProgress();
  return (
    <header className="h-14 border-b border-[var(--color-border)] flex items-center justify-end px-6 gap-6 bg-[var(--color-bg)]">
      <XpTicker xp={progress.xp} />
    </header>
  );
}
