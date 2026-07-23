export interface ProgressState {
  xp: number;
  completedLessonIds: string[];
  badgeIds: string[];
  lastVisitedLessonId?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  /** Predicate is evaluated against ProgressState after every completion. */
  isUnlocked: (state: ProgressState) => boolean;
}
