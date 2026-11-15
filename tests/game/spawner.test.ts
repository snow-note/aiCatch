import { describe, expect, it } from 'vitest';
import { OBJECT_W, PLAY_H, PLAY_W, STAGES } from '../../src/game/config';
import { pickKind, spawnObject } from '../../src/game/spawner';
import type { CollectibleKind } from '../../src/game/types';

/** A scripted random source: returns the values in order, then repeats the last one. */
function scripted(values: number[]): () => number {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)] as number;
}

const STAGE4: readonly CollectibleKind[] = ['llm', 'gpu', 'robot'];

describe('pickKind (BR6.2)', () => {
  it('returns virus when random is below the share, even at time 0 (no grace period)', () => {
    expect(pickKind(['mainframe'], 0.1, scripted([0.05]))).toBe('virus');
    expect(pickKind(['mainframe'], 0.1, scripted([0]))).toBe('virus');
  });

  it('returns a collectible when random is at or above the share', () => {
    expect(pickKind(['mainframe'], 0.1, scripted([0.1, 0.5]))).toBe('mainframe');
    expect(pickKind(['tape'], 0.1, scripted([0.99, 0.99]))).toBe('tape');
  });

  it('never picks virus with a share of 0', () => {
    expect(pickKind(['floppy'], 0, scripted([0, 0]))).toBe('floppy');
  });

  it('splits Stage 4 collectibles in equal shares', () => {
    expect(pickKind(STAGE4, 0.1, scripted([0.5, 0.0]))).toBe('llm');
    expect(pickKind(STAGE4, 0.1, scripted([0.5, 0.34]))).toBe('gpu');
    expect(pickKind(STAGE4, 0.1, scripted([0.5, 0.67]))).toBe('robot');
  });

  it('clamps the index when random returns 1 or more', () => {
    expect(pickKind(STAGE4, 0.1, scripted([0.5, 1]))).toBe('robot');
    expect(pickKind(STAGE4, 0.1, scripted([0.5, 7]))).toBe('robot');
  });

  it('only returns kinds of the given stage', () => {
    const kinds = new Set<string>();
    for (let i = 0; i < 100; i++) {
      kinds.add(pickKind(['tape'], 0.2, scripted([(i % 10) / 10, (i % 7) / 7])));
    }
    expect([...kinds].every((k) => k === 'tape' || k === 'virus')).toBe(true);
  });
});

describe('spawnObject (BR6.3)', () => {
  const d = STAGES[0]!.difficultyStart;

  it('places x inside the play area', () => {
    const lo = spawnObject(['mainframe'], d, 0, scripted([0.9, 0.5, 0, 0]));
    const hi = spawnObject(['mainframe'], d, 1, scripted([0.9, 0.5, 1, 0]));
    expect(lo.x).toBe(0);
    expect(hi.x).toBeLessThanOrEqual(PLAY_W - OBJECT_W);
    expect(hi.x).toBeGreaterThanOrEqual(0);
    expect(lo.y).toBe(0);
  });

  it('applies the fall speed multiplier to the object speed', () => {
    const slow = spawnObject(['mainframe'], { ...d, fallSpeedMultiplier: 1 }, 0, scripted([0.9, 0.5, 0.5, 0]));
    const fast = spawnObject(['mainframe'], { ...d, fallSpeedMultiplier: 1.5 }, 1, scripted([0.9, 0.5, 0.5, 0]));
    expect(fast.vy / slow.vy).toBeCloseTo(1.5, 10);
    expect(slow.vy).toBeCloseTo(PLAY_H / 4.0, 10);
  });

  it('creates a virus when the draw is below the virus share and keeps the order', () => {
    const o = spawnObject(['mainframe'], d, 7, scripted([0.0, 0.5, 0]));
    expect(o.kind).toBe('virus');
    expect(o.order).toBe(7);
  });
});
