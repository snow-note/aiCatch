import { describe, expect, it } from 'vitest';
import {
  AI_RESTORATION_STEP,
  EPS,
  FALL_TIME,
  GAME_OVER_DURATION,
  POINTS,
  STAGES,
  STAGE_CLEAR_DURATION,
  STAGE_INTRO_DURATION,
  VICTORY_DURATION,
} from '../../src/game/config';
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
      virusShare: 0.1,
      maxObjects: 3,
    });
    expect(STAGES[0]!.difficultyCap).toEqual({
      fallSpeedMultiplier: 1.2,
      spawnInterval: 1.0,
      virusShare: 0.15,
      maxObjects: 4,
    });
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
    expect(VICTORY_DURATION).toBe(3.5);
    expect(GAME_OVER_DURATION).toBe(2.0);
    expect(EPS).toBe(1e-9);
  });
});
