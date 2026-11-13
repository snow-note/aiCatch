import { DIFFICULTY_STEPS_TO_CAP, DIFFICULTY_STEP_SECONDS, EPS } from './config';
import type { DifficultyValues, StageDefinition } from './types';

function lerp(start: number, cap: number, f: number): number {
  return f >= 1 ? cap : start + (cap - start) * f;
}

/**
 * Difficulty of a stage after `stageTime` seconds of play (BR5.1): equal steps from the
 * start values to the cap. An invalid time gives the start values.
 */
export function difficultyAt(stage: StageDefinition, stageTime: number): DifficultyValues {
  const { difficultyStart: a, difficultyCap: b } = stage;
  const valid = Number.isFinite(stageTime) && stageTime > 0;
  const n = valid ? Math.floor((stageTime + EPS) / DIFFICULTY_STEP_SECONDS) : 0;
  const f = Math.min(n, DIFFICULTY_STEPS_TO_CAP) / DIFFICULTY_STEPS_TO_CAP;
  return {
    fallSpeedMultiplier: lerp(a.fallSpeedMultiplier, b.fallSpeedMultiplier, f),
    spawnInterval: lerp(a.spawnInterval, b.spawnInterval, f),
    virusShare: lerp(a.virusShare, b.virusShare, f),
    maxObjects: Math.floor(lerp(a.maxObjects, b.maxObjects, f) + EPS),
  };
}
