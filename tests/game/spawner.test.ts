import { describe, expect, it } from 'vitest';
import { FALL_TIME, OBJECT_W, PLAY_H, PLAY_W, STAGES, VIRUS_AIM_SHARE, VIRUS_AIM_SPREAD } from '../../src/game/config';
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
    const slow = spawnObject(['mainframe'], { ...d, fallSpeedMultiplier: 1 }, 0, scripted([0.9, 0.5, 0.5, 0]), undefined, 1.2);
    const fast = spawnObject(['mainframe'], { ...d, fallSpeedMultiplier: 1.5 }, 1, scripted([0.9, 0.5, 0.5, 0]), undefined, 1.2);
    expect(fast.vy / slow.vy).toBeCloseTo(1.5, 10);
    expect(slow.vy).toBeCloseTo((PLAY_H / 4.0) * 1.2, 10);
  });

  it('speeds up a collectible by the stage factor but not a VIRUS (FR2.1, FR2.2)', () => {
    const mult = { ...d, fallSpeedMultiplier: 1.3 };
    const c = spawnObject(['tape'], mult, 0, scripted([0.9, 0.5, 0.5, 0]), undefined, 1.3);
    expect(c.vy).toBeCloseTo((PLAY_H / FALL_TIME.tape) * 1.3 * 1.3, 10);
    const v = spawnObject(['tape'], mult, 1, scripted([0, 0.5, 0]), undefined, 1.3);
    expect(v.kind).toBe('virus');
    expect(v.vy).toBeCloseTo((PLAY_H / FALL_TIME.virus) * 1.3, 10);
  });

  it('creates a virus when the draw is below the virus share and keeps the order', () => {
    const o = spawnObject(['mainframe'], d, 7, scripted([0.0, 0.5, 0]));
    expect(o.kind).toBe('virus');
    expect(o.order).toBe(7);
  });
});

describe('aimed VIRUS spawn (FR3.1-FR3.3)', () => {
  const d = STAGES[0]!.difficultyStart;
  const maxX = PLAY_W - OBJECT_W;
  // Draws: kind (virus), aim decision (aimed), spread, phase.
  const aimedAt = (aimX: number, spread: number) =>
    spawnObject(['mainframe'], d, 0, scripted([0, VIRUS_AIM_SHARE / 2, spread, 0]), aimX);

  it('puts an aimed VIRUS within the spread of the aim x', () => {
    const centre = aimedAt(120, 0.5);
    expect(centre.x).toBeCloseTo(120 - OBJECT_W / 2, 8);
    const left = aimedAt(120, 0);
    expect(left.x).toBeCloseTo(120 - OBJECT_W / 2 - VIRUS_AIM_SPREAD, 8);
    const right = aimedAt(120, 1);
    expect(right.x).toBeCloseTo(120 - OBJECT_W / 2 + VIRUS_AIM_SPREAD, 8);
  });

  it('clamps an aimed VIRUS to the play area at both edges', () => {
    expect(aimedAt(0, 0).x).toBe(0);
    expect(aimedAt(PLAY_W, 1).x).toBe(maxX);
  });

  it('lands exactly on the aim when the spread is zero', () => {
    // A zero spread is the mid draw of a symmetric range: random() = 0.5 gives no offset.
    expect(aimedAt(100, 0.5).x).toBeCloseTo(100 - OBJECT_W / 2, 8);
  });

  it('keeps a random x when the aim decision fails', () => {
    const o = spawnObject(['mainframe'], d, 0, scripted([0, VIRUS_AIM_SHARE, 0.5, 0]), 10);
    expect(o.kind).toBe('virus');
    expect(o.x).toBeCloseTo(0.5 * maxX, 8);
  });

  it('keeps a random x for a collectible even with an aim x', () => {
    const o = spawnObject(['mainframe'], d, 0, scripted([0.9, 0.5, 0.25, 0]), 200);
    expect(o.kind).toBe('mainframe');
    expect(o.x).toBeCloseTo(0.25 * maxX, 8);
  });

  it('keeps today\'s behaviour without an aim x', () => {
    const o = spawnObject(['mainframe'], d, 0, scripted([0, 0.25, 0]));
    expect(o.kind).toBe('virus');
    expect(o.x).toBeCloseTo(0.25 * maxX, 8);
  });
});
