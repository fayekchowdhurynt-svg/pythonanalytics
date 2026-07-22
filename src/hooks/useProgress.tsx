import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ProgressState } from "../types/progress";
import { EMPTY_PROGRESS, loadProgress, markLessonComplete, saveProgress } from "../utils/progressStore";

interface ProgressContextValue {
  progress: ProgressState;
  completeLesson: (lessonId: string, xpReward: number) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const completeLesson = (lessonId: string, xpReward: number) => {
    setProgress((prev) => markLessonComplete(prev, lessonId, xpReward));
  };

  return (
    <ProgressContext.Provider value={{ progress, completeLesson }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
