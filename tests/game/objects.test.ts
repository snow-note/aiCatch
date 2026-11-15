import { describe, expect, it } from 'vitest';
import { FALL_TIME, OBJECT_W, PLAY_H, PLAY_W } from '../../src/game/config';
import { createObject, isBelowPlayArea, isCollectible, stepObject } from '../../src/game/objects';
import type { ObjectKind } from '../../src/game/types';

describe('FallingObject straight fallers (BR6.3)', () => {
  it.each<ObjectKind>(['mainframe', 'tape', 'floppy', 'llm', 'gpu'])(
    '%s falls straight at PLAY_H / FALL_TIME',
    (kind) => {
      const o = createObject(kind, 100, 0);
      stepObject(o, 0.5);
      expect(o.x).toBe(100);
      expect(o.y).toBeCloseTo((PLAY_H / FALL_TIME[kind]) * 0.5, 10);
    },
  );

  it('multiplies the fall speed', () => {
    const o = createObject('mainframe', 10, 0, 1.5);
    stepObject(o, 1);
    expect(o.y).toBeCloseTo((PLAY_H / FALL_TIME.mainframe) * 1.5, 10);
  });

  it('a mainframe, tape and floppy reach the bottom after their fall time', () => {
    for (const kind of ['mainframe', 'tape', 'floppy'] as const) {
      const o = createObject(kind, 0, 0);
      for (let i = 0; i < 245; i++) stepObject(o, 1 / 60);
      expect(isBelowPlayArea(o)).toBe(true);
    }
  });
});

describe('FallingObject sideways motion', () => {
  it('ROBOT sways but stays inside the play area', () => {
    for (const x0 of [0, 100, PLAY_W - OBJECT_W]) {
      const o = createObject('robot', x0, 0);
      let moved = false;
      for (let i = 0; i < 200; i++) {
        stepObject(o, 1 / 60);
        if (o.x !== x0) moved = true;
        expect(o.x).toBeGreaterThanOrEqual(0);
        expect(o.x).toBeLessThanOrEqual(PLAY_W - OBJECT_W);
      }
      expect(moved).toBe(true);
    }
  });

  it('VIRUS jitters but stays inside the play area', () => {
    const o = createObject('virus', 0, 0, 1, 1.3);
    for (let i = 0; i < 200; i++) {
      stepObject(o, 1 / 60);
      expect(o.x).toBeGreaterThanOrEqual(0);
      expect(o.x).toBeLessThanOrEqual(PLAY_W - OBJECT_W);
    }
  });

  it('treats a non-finite x as 0 and clamps into the play area', () => {
    expect(createObject('tape', Number.NaN, 0).x).toBe(0);
    expect(createObject('tape', 9999, 0).x).toBe(PLAY_W - OBJECT_W);
    expect(createObject('tape', -50, 0).x).toBe(0);
  });
});

describe('isBelowPlayArea and isCollectible', () => {
  it('is false above the bottom and true at it', () => {
    const o = createObject('llm', 0, 0);
    o.y = PLAY_H - 0.01;
    expect(isBelowPlayArea(o)).toBe(false);
    o.y = PLAY_H;
    expect(isBelowPlayArea(o)).toBe(true);
  });

  it('only virus is not a collectible', () => {
    expect(isCollectible('virus')).toBe(false);
    for (const k of ['mainframe', 'tape', 'floppy', 'llm', 'gpu', 'robot'] as const) {
      expect(isCollectible(k)).toBe(true);
    }
  });
});
