import { describe, expect, it } from 'vitest';
import { CASING_H, CASING_W, fitCasing } from '../../src/render/layout';

describe('fitCasing', () => {
  it.each([
    [375, 520],
    [667, 320],
  ])('fits the whole casing inside %i x %i with no overflow', (w, h) => {
    const f = fitCasing(w, h);
    expect(f.width).toBeLessThanOrEqual(w + 1e-9);
    expect(f.height).toBeLessThanOrEqual(h + 1e-9);
    expect(f.offsetX).toBeGreaterThanOrEqual(0);
    expect(f.offsetY).toBeGreaterThanOrEqual(0);
    expect(f.offsetX + f.width).toBeLessThanOrEqual(w + 1e-9);
    expect(f.offsetY + f.height).toBeLessThanOrEqual(h + 1e-9);
  });

  it('keeps the aspect ratio', () => {
    for (const [w, h] of [
      [375, 520],
      [667, 320],
      [1920, 1080],
    ] as const) {
      const f = fitCasing(w, h);
      expect(f.width / f.height).toBeCloseTo(CASING_W / CASING_H, 10);
    }
  });

  it('centres the casing', () => {
    const portrait = fitCasing(375, 520);
    expect(portrait.offsetX).toBeCloseTo(0, 10); // width-limited
    expect(portrait.offsetY).toBeCloseTo((520 - portrait.height) / 2, 10);
    const landscape = fitCasing(667, 320);
    expect(landscape.offsetY).toBeCloseTo(0, 10); // height-limited
    expect(landscape.offsetX).toBeCloseTo((667 - landscape.width) / 2, 10);
  });

  it('scales up on a large desktop viewport and down on a tiny one', () => {
    expect(fitCasing(1920, 1080).scale).toBeCloseTo(4.5, 10);
    expect(fitCasing(160, 120).scale).toBeCloseTo(0.5, 10);
  });

  it('gives a zero-size fit for an empty or invalid viewport', () => {
    for (const f of [fitCasing(0, 0), fitCasing(-10, 300), fitCasing(Number.NaN, Number.NaN)]) {
      expect(f.scale).toBe(0);
      expect(Number.isFinite(f.offsetX)).toBe(true);
      expect(Number.isFinite(f.offsetY)).toBe(true);
    }
  });
});
