import { RoadmapPhase, RoadmapLesson } from '../types/cyber';
import { ROADMAP_PHASES_1_TO_4 } from './roadmap/phases1to4';
import { ROADMAP_PHASES_5_TO_8 } from './roadmap/phases5to8';
import { ROADMAP_PHASES_9_TO_12 } from './roadmap/phases9to12';

export const ALL_ROADMAP_PHASES: RoadmapPhase[] = [
  ...ROADMAP_PHASES_1_TO_4,
  ...ROADMAP_PHASES_5_TO_8,
  ...ROADMAP_PHASES_9_TO_12,
];

export const ROADMAP_PHASES = ALL_ROADMAP_PHASES;
export const ALL_ROADMAP_LESSONS: RoadmapLesson[] = ALL_ROADMAP_PHASES.flatMap((p) => p.lessons);

// Helper to look up a single lesson by ID
export function findLessonById(lessonId: string): { lesson: RoadmapLesson; phase: RoadmapPhase } | undefined {
  for (const phase of ALL_ROADMAP_PHASES) {
    const lesson = phase.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      return { lesson, phase };
    }
  }
  return undefined;
}

// Helper to find the next lesson in sequence
export function findNextLesson(currentLessonId: string): { lesson: RoadmapLesson; phase: RoadmapPhase } | undefined {
  let foundCurrent = false;
  for (const phase of ALL_ROADMAP_PHASES) {
    for (const lesson of phase.lessons) {
      if (foundCurrent) {
        return { lesson, phase };
      }
      if (lesson.id === currentLessonId) {
        foundCurrent = true;
      }
    }
  }
  return undefined;
}

// Helper to search lessons across all phases
export function searchLessons(query: string): { lesson: RoadmapLesson; phase: RoadmapPhase }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: { lesson: RoadmapLesson; phase: RoadmapPhase }[] = [];

  for (const phase of ALL_ROADMAP_PHASES) {
    for (const lesson of phase.lessons) {
      if (
        lesson.title.toLowerCase().includes(q) ||
        lesson.theory.toLowerCase().includes(q) ||
        phase.title.toLowerCase().includes(q) ||
        (lesson.steps && lesson.steps.some((s) => s.toLowerCase().includes(q)))
      ) {
        results.push({ lesson, phase });
      }
    }
  }

  return results;
}

export const TOTAL_LESSON_COUNT = ALL_ROADMAP_PHASES.reduce(
  (acc, phase) => acc + phase.lessons.length,
  0
);
