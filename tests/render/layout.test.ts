import { describe, expect, it } from 'vitest';
import {
  CASING_H,
  CASING_W,
  SETTLE_DELAY_MS,
  chooseFit,
  fitArea,
  fitCasing,
  orientationOf,
  placeCasing,
  touchSide,
} from '../../src/render/layout';

const PORTRAIT = { x: 0, y: 0, width: 390, height: 664 };
const PORTRAIT_INSETS = { top: 47, right: 0, bottom: 34, left: 0 };
const LANDSCAPE = { x: 0, y: 0, width: 844, height: 390 };
const LANDSCAPE_INSETS = { top: 0, right: 0, bottom: 0, left: 47 };

describe('fitArea', () => {
  it('subtracts insets and keeps the viewport offset (FR3.1, FR3.2)', () => {
    const a = fitArea({ x: 5, y: 10, width: 390, height: 664 }, PORTRAIT_INSETS);
    expect(a).toEqual({ x: 5, y: 57, width: 390, height: 583 });
  });

  it('treats negative and NaN insets as 0', () => {
    const a = fitArea(PORTRAIT, { top: -5, right: Number.NaN, bottom: 0, left: -1 });
    expect(a).toEqual(PORTRAIT);
  });

  it('gives a non-positive size when insets exceed the viewport', () => {
    const a = fitArea(LANDSCAPE, { top: 200, right: 0, bottom: 200, left: 0 });
    expect(a.height).toBeLessThanOrEqual(0);
  });
});

describe('placeCasing', () => {
  it('equals fitCasing with no insets and no offset (NFR2)', () => {
    expect(placeCasing(fitArea(PORTRAIT, { top: 0, right: 0, bottom: 0, left: 0 }))).toEqual(
      fitCasing(390, 664),
    );
  });

  it('centres the casing inside an offset, inset area (FR3.3)', () => {
    const area = fitArea({ x: 0, y: 12, width: 844, height: 390 }, LANDSCAPE_INSETS);
    const f = placeCasing(area);
    expect(f.offsetX).toBeGreaterThanOrEqual(area.x - 1e-9);
    expect(f.offsetY).toBeGreaterThanOrEqual(area.y - 1e-9);
    expect(f.offsetX + f.width).toBeLessThanOrEqual(area.x + area.width + 1e-9);
    expect(f.offsetY + f.height).toBeLessThanOrEqual(area.y + area.height + 1e-9);
    expect(f.offsetX - area.x).toBeCloseTo(area.x + area.width - (f.offsetX + f.width), 8);
  });
});

describe('chooseFit', () => {
  const good = fitCasing(390, 664);
  it('keeps the previous fit when the next one has scale 0 (regression)', () => {
    expect(chooseFit(fitCasing(0, 0), good)).toBe(good);
  });
  it('returns the next fit when valid, and null with nothing valid', () => {
    const next = fitCasing(844, 390);
    expect(chooseFit(next, good)).toBe(next);
    expect(chooseFit(fitCasing(0, 0), null)).toBeNull();
  });
});

describe('touchSide', () => {
  it('splits at the centre of the area', () => {
    const area = fitArea(LANDSCAPE, LANDSCAPE_INSETS); // x 47, width 797, centre 445.5
    expect(touchSide(445, area)).toBe(-1);
    expect(touchSide(446, area)).toBe(1);
    expect(touchSide(421.9, LANDSCAPE)).toBe(-1); // plain viewport centre 422
    expect(touchSide(422, LANDSCAPE)).toBe(1);
  });
});

describe('orientationOf', () => {
  it('returns portrait, landscape, and landscape for a square', () => {
    expect(orientationOf(390, 664)).toBe('portrait');
    expect(orientationOf(844, 390)).toBe('landscape');
    expect(orientationOf(500, 500)).toBe('landscape');
  });
});

describe('SETTLE_DELAY_MS', () => {
  it('is 300', () => {
    expect(SETTLE_DELAY_MS).toBe(300);
  });
});

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
