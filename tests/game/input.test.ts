import { describe, expect, it } from 'vitest';
import { InputTracker } from '../../src/game/input';

describe('InputTracker direction', () => {
  it('is 0 with nothing held', () => {
    expect(new InputTracker().direction()).toBe(0);
  });

  it('follows a single held direction', () => {
    const t = new InputTracker();
    t.press('key:Left', -1);
    expect(t.direction()).toBe(-1);
    t.release('key:Left');
    expect(t.direction()).toBe(0);
  });

  it('uses the most recently pressed direction (Left then Right gives right)', () => {
    const t = new InputTracker();
    t.press('key:Left', -1);
    t.press('key:Right', 1);
    expect(t.direction()).toBe(1);
  });

  it('falls back to the direction still held on release', () => {
    const t = new InputTracker();
    t.press('key:Left', -1);
    t.press('key:Right', 1);
    t.release('key:Right');
    expect(t.direction()).toBe(-1);
  });

  it('ignores keys without a direction', () => {
    const t = new InputTracker();
    t.press('key:Enter', null);
    expect(t.direction()).toBe(0);
  });

  it('mixes keys and touches the same way', () => {
    const t = new InputTracker();
    t.press('touch:1', -1);
    t.press('touch:2', 1);
    expect(t.direction()).toBe(1);
    t.release('touch:2');
    expect(t.direction()).toBe(-1);
  });
});

describe('InputTracker clear (BR7.4)', () => {
  it('leaves no direction after clear()', () => {
    const t = new InputTracker();
    t.press('key:Left', -1);
    t.press('touch:1', 1);
    t.clear();
    expect(t.direction()).toBe(0);
  });

  it('counts a press of a previously held id as new after clear()', () => {
    const t = new InputTracker();
    t.press('key:Enter');
    expect(t.press('key:Enter')).toBe(false);
    t.clear();
    expect(t.press('key:Enter')).toBe(true);
  });
});

describe('InputTracker new-press detection', () => {
  it('reports a first press as new and a held repeat as not new', () => {
    const t = new InputTracker();
    expect(t.press('key:A')).toBe(true);
    expect(t.press('key:A')).toBe(false);
  });

  it('reports a press as new again after release', () => {
    const t = new InputTracker();
    t.press('key:A');
    t.release('key:A');
    expect(t.press('key:A')).toBe(true);
  });

  it('keeps direction order when a held key repeats', () => {
    const t = new InputTracker();
    t.press('key:Left', -1);
    t.press('key:Right', 1);
    t.press('key:Left', -1); // auto-repeat must not make Left the latest
    expect(t.direction()).toBe(1);
  });
});
