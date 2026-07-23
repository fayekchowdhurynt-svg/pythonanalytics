import type { Module } from "../types/content";
import module01 from "./modules/module-01.json";

// As modules 2–12 are authored, import and append them here. Kept as a
// static list (not a dynamic glob) so module order is explicit and
// intentional rather than filesystem-dependent.
export const MODULES: Module[] = [module01 as unknown as Module];

export function getModuleById(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

export function getLessonById(lessonId: string) {
  for (const module of MODULES) {
    const lesson = module.lessons.find((l) => l.id === lessonId);
    if (lesson) return { module, lesson };
  }
  return undefined;
}

export function totalLessonCount(): number {
  return MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
}
