import { AI_RESTORATION_STEP, STAGES } from './config';
import type { CollectibleKind, StageDefinition } from './types';

/** Progress of one run through the four stages (BR2.2-BR2.4). */
export interface Run {
  stageIndex: number;
  caught: number;
  /** 0, 25, 50, 75 or 100 percent. */
  aiRestoration: number;
  complete: boolean;
}

export function newRun(): Run {
  return { stageIndex: 0, caught: 0, aiRestoration: 0, complete: false };
}

export function currentStage(run: Run): StageDefinition {
  return STAGES[run.stageIndex] ?? (STAGES[0] as StageDefinition);
}

/**
 * Records a catch. Returns true when this catch clears the stage; the AI percentage
 * is raised and, after the last stage, the run is marked complete (BR2.2-BR2.4).
 */
export function recordCatch(run: Run, kind: CollectibleKind): boolean {
  const stage = currentStage(run);
  if (!stage.collectibles.includes(kind)) return false;
  run.caught += 1;
  if (run.caught < stage.requiredCount) return false;
  run.aiRestoration = Math.min(100, run.aiRestoration + AI_RESTORATION_STEP);
  if (run.stageIndex >= STAGES.length - 1) run.complete = true;
  return true;
}

/** Moves to the next stage with progress reset. Stays on the last stage. */
export function advanceStage(run: Run): void {
  run.stageIndex = Math.min(STAGES.length - 1, run.stageIndex + 1);
  run.caught = 0;
}
