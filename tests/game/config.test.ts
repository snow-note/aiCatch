import { describe, expect, it } from 'vitest';
import {
  AI_RESTORATION_STEP,
  ENDING_BLANK_STEP,
  ENDING_LINE_STEP,
  ENDING_TYPE_SHARE,
  EPS,
  FALL_TIME,
  FIRST_SPAWN_DELAY,
  GAME_OVER_DURATION,
  HUMAN_H,
  HUMAN_SPEED,
  HUMAN_W,
  OBJECT_H,
  OBJECT_W,
  PLAY_H,
  POINTS,
  VIRUS_AIM_SHARE,
  VIRUS_AIM_SPREAD,
  VIRUS_JITTER_AMPLITUDE,
  STAGES,
  STAGE_CLEAR_DURATION,
  STAGE_INTRO_DURATION,
  STAGE_TIME_LIMIT,
  TIME_BONUS_PER_SECOND,
  TIME_WARNING_SECONDS,
  VICTORY_DURATION,
  VICTORY_RESTORE_END,
} from '../../src/game/config';
import { ENDING_LINES } from '../../src/render/ending';
import { endingDuration } from '../../src/render/screen-timing';
import type { DifficultyValues, ObjectKind } from '../../src/game/types';

const COLLECTIBLES: ObjectKind[] = ['mainframe', 'tape', 'floppy', 'llm', 'gpu', 'robot'];

/** True when `b` is equal or harder than `a` on every value (BR5.3). */
function notEasier(a: DifficultyValues, b: DifficultyValues): boolean {
  return (
    b.fallSpeedMultiplier >= a.fallSpeedMultiplier &&
    b.spawnInterval <= a.spawnInterval &&
    b.virusShare >= a.virusShare &&
    b.maxObjects >= a.maxObjects
  );
}

function strictlyHarder(a: DifficultyValues, b: DifficultyValues): boolean {
  return (
    b.fallSpeedMultiplier > a.fallSpeedMultiplier ||
    b.spawnInterval < a.spawnInterval ||
    b.virusShare > a.virusShare ||
    b.maxObjects > a.maxObjects
  );
}

describe('stage catalogue (BR2.1)', () => {
  it('has four stages in order with the computing-history names', () => {
    expect(STAGES.map((s) => s.name)).toEqual(['FORTRAN', 'COBOL', 'BASIC', 'LLM']);
    expect(STAGES.map((s) => s.stageNumber)).toEqual([1, 2, 3, 4]);
  });

  it('lists the stage collectibles and never the virus', () => {
    expect(STAGES.map((s) => s.collectibles)).toEqual([
      ['mainframe'],
      ['tape'],
      ['floppy'],
      ['llm', 'gpu', 'robot'],
    ]);
    for (const s of STAGES) expect(s.collectibles).not.toContain('virus');
  });

  it('requires 10, 12, 14, 16 catches and gives a 500 clear bonus', () => {
    expect(STAGES.map((s) => s.requiredCount)).toEqual([10, 12, 14, 16]);
    for (const s of STAGES) expect(s.clearBonus).toBe(500);
  });

  it('restores AI in 25% steps so four stages reach 100', () => {
    expect(AI_RESTORATION_STEP).toBe(25);
    expect(AI_RESTORATION_STEP * STAGES.length).toBe(100);
  });
});

describe('stage difficulty (BR5.3, BR5.4)', () => {
  it('each cap is equal or harder than its start', () => {
    for (const s of STAGES) expect(notEasier(s.difficultyStart, s.difficultyCap)).toBe(true);
  });

  it('each later stage is equal or harder on every value, and strictly harder on one', () => {
    for (let i = 0; i < STAGES.length - 1; i++) {
      const a = STAGES[i]!;
      const b = STAGES[i + 1]!;
      expect(notEasier(a.difficultyStart, b.difficultyStart)).toBe(true);
      expect(strictlyHarder(a.difficultyStart, b.difficultyStart)).toBe(true);
      expect(notEasier(a.difficultyCap, b.difficultyCap)).toBe(true);
      expect(strictlyHarder(a.difficultyCap, b.difficultyCap)).toBe(true);
    }
  });

  it('Stage 1 starts gentle with the specified values', () => {
    expect(STAGES[0]!.difficultyStart).toEqual({
      fallSpeedMultiplier: 1.0,
      spawnInterval: 1.2,
      virusShare: 0.4,
      maxObjects: 3,
    });
    expect(STAGES[0]!.difficultyCap).toEqual({
      fallSpeedMultiplier: 1.2,
      spawnInterval: 1.0,
      virusShare: 0.45,
      maxObjects: 4,
    });
  });

  it('has the early-heart-loss tunables (FR2.2, FR3.1, FR3.2)', () => {
    expect(FIRST_SPAWN_DELAY).toBe(0.5);
    expect(VIRUS_AIM_SHARE).toBeCloseTo(1 / 3, 10);
    expect(VIRUS_AIM_SPREAD).toBe(HUMAN_W);
    expect(FALL_TIME.virus).toBe(2.2);
  });

  it('pins the Stage 2-4 start and cap values (FR1.1, FR1.2)', () => {
    const v = (fallSpeedMultiplier: number, spawnInterval: number, virusShare: number, maxObjects: number) => ({
      fallSpeedMultiplier,
      spawnInterval,
      virusShare,
      maxObjects,
    });
    expect(STAGES[1]!.difficultyStart).toEqual(v(1.3, 0.9, 0.55, 5));
    expect(STAGES[1]!.difficultyCap).toEqual(v(1.7, 0.7, 0.6, 6));
    expect(STAGES[2]!.difficultyStart).toEqual(v(1.35, 0.88, 0.56, 5));
    expect(STAGES[2]!.difficultyCap).toEqual(v(1.75, 0.69, 0.61, 6));
    expect(STAGES[3]!.difficultyStart).toEqual(v(1.4, 0.85, 0.58, 5));
    expect(STAGES[3]!.difficultyCap).toEqual(v(1.8, 0.68, 0.62, 6));
  });

  it('gives collectibles a speed factor of 1.2, 1.3, 1.4, 1.5 by stage (FR2.1)', () => {
    expect(STAGES.map((s) => s.collectibleSpeedFactor)).toEqual([1.2, 1.3, 1.4, 1.5]);
  });

  it('pins the timer constants (FR3.1, FR6.2, NFR1)', () => {
    expect(STAGE_TIME_LIMIT).toBe(90);
    expect(TIME_WARNING_SECONDS).toBe(10);
    expect(TIME_BONUS_PER_SECOND).toBe(10);
  });

  it('lets every stage be cleared in 60 s or less at best (NFR3)', () => {
    for (const s of STAGES) {
      const collectiblesPerSecond = (1 - s.difficultyStart.virusShare) / s.difficultyStart.spawnInterval;
      expect(s.requiredCount / collectiblesPerSecond + FIRST_SPAWN_DELAY).toBeLessThanOrEqual(60);
    }
  });

  it('gives a VIRUS at least 1.2 s to reach HUMAN at Stage 1 start, enough to step aside (NFR2)', () => {
    const mult = STAGES[0]!.difficultyStart.fallSpeedMultiplier;
    const vy = (PLAY_H / FALL_TIME.virus) * mult;
    // First possible contact: the object bottom reaches the top of HUMAN.
    const contactTime = (PLAY_H - HUMAN_H - OBJECT_H) / vy;
    expect(contactTime).toBeGreaterThanOrEqual(1.2);
    const overlapZone = HUMAN_W + OBJECT_W + 2 * VIRUS_JITTER_AMPLITUDE;
    expect(HUMAN_SPEED * contactTime).toBeGreaterThanOrEqual(overlapZone);
  });
});

describe('tables and durations', () => {
  it('POINTS and FALL_TIME cover every collectible kind; FALL_TIME covers virus', () => {
    for (const k of COLLECTIBLES) {
      expect(POINTS[k as keyof typeof POINTS]).toBeGreaterThan(0);
      expect(FALL_TIME[k as keyof typeof FALL_TIME]).toBeGreaterThan(0);
    }
    expect(FALL_TIME.virus).toBeGreaterThan(0);
    expect(POINTS.gpu).toBe(150);
    expect(POINTS.robot).toBe(200);
  });

  it('phase durations match contract C1', () => {
    expect(STAGE_INTRO_DURATION).toBe(2.0);
    expect(STAGE_CLEAR_DURATION).toBe(2.5);
    expect(VICTORY_DURATION).toBe(22.3);
    expect(GAME_OVER_DURATION).toBe(2.0);
    expect(EPS).toBe(1e-9);
  });
});

describe('ending message timing (FR2.3, FR3.3, NFR4)', () => {
  it('pins the ending tunables', () => {
    expect(ENDING_LINE_STEP).toBe(1.2);
    expect(ENDING_BLANK_STEP).toBe(0.7);
    expect(ENDING_TYPE_SHARE).toBe(0.6);
  });

  it('ends the victory phase when the message is complete', () => {
    expect(VICTORY_DURATION).toBeCloseTo(VICTORY_RESTORE_END + endingDuration(ENDING_LINES), 9);
  });
});
