/**
 * Pure display helpers: timing, bar fill, and HUD strings. They take numbers and
 * GameView fields only, so they run without a canvas (BR1.4-BR1.6, BR2.1, BR3.2).
 */
import {
  AI_RESTORATION_STEP,
  BLINK_HZ,
  CLEAR_BAR_FILL,
  EPS,
  VICTORY_DURATION,
  VICTORY_MESSAGE_STEP,
  VICTORY_REBOOT_END,
  VICTORY_RESTORE_END,
} from '../game/config';
import type { GameView } from '../game/types';

export type VictoryStep = 'reboot' | 'restore' | 'messages' | 'hold';

/** Number of noise lines at the start of the victory reboot. */
const NOISE_LINES_MAX = 6;
/** AI restoration shown at the start of the victory bar. */
const VICTORY_BAR_START = 100 - AI_RESTORATION_STEP;

/** Bad time (negative or not a number) counts as the start of the screen. */
function safeTime(t: number): number {
  return Number.isFinite(t) && t > 0 ? t : 0;
}

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** BR1.6: which part of the victory sequence `t` seconds into the phase belongs to. */
export function victoryStep(t: number): VictoryStep {
  const s = safeTime(t);
  if (s < VICTORY_REBOOT_END) return 'reboot';
  if (s < VICTORY_RESTORE_END) return 'restore';
  if (s < VICTORY_DURATION) return 'messages';
  return 'hold';
}

/** BR1.6: how many of the three victory messages are visible (0-3). */
export function messagesShown(t: number): number {
  const s = safeTime(t);
  if (s < VICTORY_RESTORE_END) return 0;
  return Math.min(3, Math.floor((s - VICTORY_RESTORE_END + EPS) / VICTORY_MESSAGE_STEP) + 1);
}

/** BR1.4: stage-clear bar fill in percent, from (ai - 25) to ai over CLEAR_BAR_FILL. */
export function barFill(t: number, ai: number): number {
  const progress = Math.min(1, safeTime(t) / CLEAR_BAR_FILL);
  return clamp(ai - AI_RESTORATION_STEP + AI_RESTORATION_STEP * progress, 0, 100);
}

/** BR1.6: victory bar fill, 75 to 100 over the reboot step. */
export function victoryBarFill(t: number): number {
  const progress = Math.min(1, safeTime(t) / VICTORY_REBOOT_END);
  return VICTORY_BAR_START + (100 - VICTORY_BAR_START) * progress;
}

/** BR1.6: noise lines left during the reboot step, falling from 6 to 0. */
export function noiseLines(t: number): number {
  const progress = Math.min(1, safeTime(t) / VICTORY_REBOOT_END);
  return Math.round(NOISE_LINES_MAX * (1 - progress));
}

/** BR3.2: true during the first half of each blink period. */
export function blinkOn(t: number): boolean {
  if (!Number.isFinite(t)) return true;
  const period = 1 / BLINK_HZ;
  const phase = ((t % period) + period) % period;
  return phase < period / 2 - EPS;
}

/** BR2.1: the three HUD strings. Stage 4 shows one combined count. */
export function hudTexts(view: Pick<GameView, 'stage' | 'caught' | 'aiRestoration'>): {
  name: string;
  ai: string;
  progress: string;
} {
  return {
    name: view.stage.name,
    ai: `AI ${Math.round(view.aiRestoration)}%`,
    progress: `${view.caught}/${view.stage.requiredCount}`,
  };
}

/** BR1.5: the game-over "reached" line. */
export function reachedLine(view: Pick<GameView, 'stage'>): string {
  return `REACHED STAGE ${view.stage.stageNumber} ${view.stage.name}`;
}
