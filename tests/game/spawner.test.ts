import { describe, expect, it } from 'vitest';
import { OBJECT_W, PLAY_W } from '../../src/game/config';
import { pickKind, spawnObject, type Random } from '../../src/game/spawner';

function seq(values: number[]): Random {
  let i = 0;
  return () => values[i++ % values.length] as number;
}

describe('pickKind', () => {
  it('never returns VIRUS in the first 10 s', () => {
    // 0 would be below any VIRUS share, but the share is 0 before 10 s
    expect(pickKind(5, () => 0)).not.toBe('virus');
    expect(pickKind(9.9, () => 0)).not.toBe('virus');
  });

  it('returns VIRUS when the roll is under the share', () => {
    expect(pickKind(10, seq([0.19]))).toBe('virus');
    expect(pickKind(10, seq([0.21, 0.5]))).not.toBe('virus');
  });

  it('splits rescue objects equally into thirds', () => {
    // first value fails the VIRUS roll, second picks the kind
    expect(pickKind(0, seq([0.9, 0.1]))).toBe('llm');
    expect(pickKind(0, seq([0.9, 0.4]))).toBe('gpu');
    expect(pickKind(0, seq([0.9, 0.7]))).toBe('robot');
  });

  it('handles a roll of exactly 1 without going out of range', () => {
    expect(pickKind(0, seq([0.9, 1]))).toBe('robot');
  });
});

describe('spawnObject', () => {
  it('keeps x inside the play area at both extremes', () => {
    const left = spawnObject(0, 0, seq([0.9, 0.1, 0, 0]));
    const right = spawnObject(0, 1, seq([0.9, 0.1, 0.999999, 0]));
    expect(left.x).toBe(0);
    expect(right.x).toBeGreaterThanOrEqual(0);
    expect(right.x + right.w).toBeLessThanOrEqual(PLAY_W);
    expect(OBJECT_W).toBe(left.w);
  });

  it('speeds up new objects with the difficulty multiplier', () => {
    const early = spawnObject(0, 0, seq([0.9, 0.1, 0.5, 0]));
    const late = spawnObject(120, 1, seq([0.99, 0.1, 0.5, 0]));
    expect(late.vy).toBeCloseTo(early.vy * 2, 10);
  });
});
