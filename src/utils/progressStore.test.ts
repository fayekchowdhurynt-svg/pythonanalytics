import { describe, it, expect } from "vitest";
import { EMPTY_PROGRESS, calculateCompletionPercent, markLessonComplete } from "./progressStore";

describe("markLessonComplete", () => {
  it("adds XP and marks the lesson complete", () => {
    const next = markLessonComplete(EMPTY_PROGRESS, "lesson-1", 100);
    expect(next.xp).toBe(100);
    expect(next.completedLessonIds).toContain("lesson-1");
  });

  it("is idempotent — completing the same lesson twice doesn't double-award XP", () => {
    const once = markLessonComplete(EMPTY_PROGRESS, "lesson-1", 100);
    const twice = markLessonComplete(once, "lesson-1", 100);
    expect(twice.xp).toBe(100);
    expect(twice.completedLessonIds).toEqual(["lesson-1"]);
  });
});

describe("calculateCompletionPercent", () => {
  it("computes a rounded percentage", () => {
    const state = markLessonComplete(EMPTY_PROGRESS, "lesson-1", 100);
    expect(calculateCompletionPercent(state, 3)).toBe(33);
  });

  it("returns 0 when there are no lessons", () => {
    expect(calculateCompletionPercent(EMPTY_PROGRESS, 0)).toBe(0);
  });
});
