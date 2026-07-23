import type { ProgressState } from "../types/progress";

const STORAGE_KEY = "pyanalytics.progress.v1";

export const EMPTY_PROGRESS: ProgressState = {
  xp: 0,
  completedLessonIds: [],
  badgeIds: [],
};

// Persistence is isolated behind these two functions so the storage
// mechanism (localStorage today) can be swapped for a backend later
// without touching any component or reducer logic.
export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as ProgressState;
    return { ...EMPTY_PROGRESS, ...parsed };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing, quota) — fail silently,
    // progress just won't persist across reloads this session.
  }
}

export function markLessonComplete(
  state: ProgressState,
  lessonId: string,
  xpReward: number
): ProgressState {
  if (state.completedLessonIds.includes(lessonId)) return state;
  return {
    ...state,
    xp: state.xp + xpReward,
    completedLessonIds: [...state.completedLessonIds, lessonId],
    lastVisitedLessonId: lessonId,
  };
}

export function calculateCompletionPercent(
  state: ProgressState,
  totalLessons: number
): number {
  if (totalLessons === 0) return 0;
  return Math.round((state.completedLessonIds.length / totalLessons) * 100);
}
