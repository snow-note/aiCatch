import { describe, expect, it } from 'vitest';
import { overlaps, resolveCollisions } from '../../src/game/collision';

const human = { x: 100, y: 140, w: 20, h: 20 };
const obj = (kind: string, order: number, x: number, y: number) => ({
  kind,
  order,
  x,
  y,
  w: 16,
  h: 16,
});

describe('overlaps', () => {
  it('counts an overlap of one pixel', () => {
    expect(overlaps(human, { x: 119, y: 140, w: 16, h: 16 })).toBe(true);
    expect(overlaps(human, { x: 100, y: 125, w: 16, h: 16 })).toBe(true);
  });

  it('does not count boxes that are apart or only share an edge', () => {
    expect(overlaps(human, { x: 120, y: 140, w: 16, h: 16 })).toBe(false);
    expect(overlaps(human, { x: 100, y: 124, w: 16, h: 16 })).toBe(false);
    expect(overlaps(human, { x: 10, y: 10, w: 16, h: 16 })).toBe(false);
  });
});

describe('resolveCollisions', () => {
  it('handles a single touching object', () => {
    const a = obj('llm', 0, 105, 135);
    const r = resolveCollisions(human, [a, obj('gpu', 1, 10, 10)]);
    expect(r.handled).toBe(a);
    expect(r.touched).toEqual([a]);
  });

  it('returns nothing when nothing touches', () => {
    const r = resolveCollisions(human, [obj('llm', 0, 10, 10)]);
    expect(r.handled).toBeNull();
    expect(r.touched).toHaveLength(0);
  });

  it('handles the VIRUS even when a rescue object appeared earlier', () => {
    const rescue = obj('robot', 0, 102, 138);
    const virus = obj('virus', 5, 104, 138);
    const r = resolveCollisions(human, [rescue, virus]);
    expect(r.handled).toBe(virus);
    expect(r.touched).toHaveLength(2);
  });

  it('handles the earliest-spawned object when there is no VIRUS', () => {
    const late = obj('gpu', 7, 102, 138);
    const early = obj('llm', 3, 104, 138);
    const r = resolveCollisions(human, [late, early]);
    expect(r.handled).toBe(early);
  });
});
