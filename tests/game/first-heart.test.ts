import { describe, expect, it } from 'vitest';
import { GameState } from '../../src/game/state';
import type { GameControls, GameView } from '../../src/game/types';

/** FR1.1-FR1.3, NFR1, NFR4: a beginner model must lose the first heart 5-10 s after START. */

const STEP = 1 / 60;
const TIME_LIMIT = 60;
const SEEDS = 200;
const TARGET_MIN = 5.0;
const TARGET_MAX = 10.0;

/** Seeded generator (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * FR1.2 beginner: walks toward the collectible whose centre is horizontally nearest, holds
 * nothing when none is on screen or already under it, and never reacts to a VIRUS.
 * Uses only GameControls and GameView.
 */
function beginnerDirection(view: GameView): -1 | 0 | 1 {
  const hc = view.human.x + view.human.w / 2;
  let best: number | null = null;
  for (const o of view.objects) {
    if (o.kind === 'virus' || o.y >= view.human.y) continue;
    const dx = o.x + o.w / 2 - hc;
    if (best === null || Math.abs(dx) < Math.abs(best)) best = dx;
  }
  if (best === null || Math.abs(best) <= 1) return 0;
  return best < 0 ? -1 : 1;
}

/** Game time (s) from pressStart() to the first life-lost event, or TIME_LIMIT. */
function firstLifeLostTime(random: () => number): number {
  const game = new GameState({ random });
  const controls: GameControls = game;
  const view: GameView = game;
  controls.pressStart();
  controls.drainEvents();
  let held: -1 | 0 | 1 = 0;
  const steps = Math.round(TIME_LIMIT / STEP);
  for (let i = 1; i <= steps; i++) {
    const want = beginnerDirection(view);
    if (want !== held) {
      if (held === -1) controls.inputUp('key:ArrowLeft');
      if (held === 1) controls.inputUp('key:ArrowRight');
      if (want === -1) controls.inputDown('key:ArrowLeft', -1);
      if (want === 1) controls.inputDown('key:ArrowRight', 1);
      held = want;
    }
    controls.update(STEP);
    if (controls.drainEvents().some((e) => e.type === 'life-lost')) return i * STEP;
  }
  return TIME_LIMIT;
}

function percentile(sorted: number[], p: number): number {
  const i = Math.min(sorted.length - 1, Math.floor(p * sorted.length));
  return sorted[i] as number;
}

describe('first heart loss for a beginner (FR1.1-FR1.3)', () => {
  it('has a median of 5-10 s from START over 200 seeds', () => {
    const t0 = Date.now();
    const times: number[] = [];
    for (let seed = 1; seed <= SEEDS; seed++) times.push(firstLifeLostTime(mulberry32(seed)));
    const elapsedMs = Date.now() - t0;
    times.sort((a, b) => a - b);
    const median = (percentile(times, 0.5) + percentile(times, 0.49)) / 2;
    expect(median).toBeGreaterThanOrEqual(TARGET_MIN);
    expect(median).toBeLessThanOrEqual(TARGET_MAX);
    expect(elapsedMs).toBeLessThan(5000);
  });

  it('reports the time limit when no VIRUS ever appears', () => {
    // 0.99 is above every virus share and picks the last collectible, always at the right edge.
    expect(firstLifeLostTime(() => 0.99)).toBe(TIME_LIMIT);
  });
});
