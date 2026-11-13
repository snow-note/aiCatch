import {
  BASE_SPAWN_INTERVAL,
  DIFFICULTY_STEP_SECONDS,
  INTERVAL_FACTOR,
  MAX_SPEED_MULTIPLIER,
  MIN_SPAWN_INTERVAL,
  SPEED_FACTOR,
  VIRUS_MAX_SHARE,
  VIRUS_SHARE_STEP,
  VIRUS_START_SHARE,
  VIRUS_START_TIME,
} from './config';

/** Number of whole 15 s difficulty steps completed after `t` seconds of play. */
function steps(t: number): number {
  if (!Number.isFinite(t) || t <= 0) return 0;
  return Math.floor(t / DIFFICULTY_STEP_SECONDS);
}

/** Seconds between new objects after `t` seconds of play (FR3.5, FR3.6). */
export function spawnInterval(t: number): number {
  const v = BASE_SPAWN_INTERVAL * Math.pow(INTERVAL_FACTOR, steps(t));
  return Math.max(MIN_SPAWN_INTERVAL, v);
}

/** Fall speed multiplier after `t` seconds of play (FR3.5). */
export function speedMultiplier(t: number): number {
  const v = Math.pow(SPEED_FACTOR, steps(t));
  return Math.min(MAX_SPEED_MULTIPLIER, v);
}

/** Probability that a new object is a VIRUS after `t` seconds of play (FR3.7). */
export function virusShare(t: number): number {
  if (!Number.isFinite(t) || t < VIRUS_START_TIME) return 0;
  const n = Math.floor((t - VIRUS_START_TIME) / DIFFICULTY_STEP_SECONDS);
  return Math.min(VIRUS_MAX_SHARE, VIRUS_START_SHARE + VIRUS_SHARE_STEP * n);
}
