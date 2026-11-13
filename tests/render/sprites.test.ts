import { describe, expect, it } from 'vitest';
import { OBJECT_H, OBJECT_W } from '../../src/game/config';
import { ALL_SPRITES, FONT, FONT_H, FONT_W, OBJECT_SPRITES, SEVEN_SEGMENT } from '../../src/render/sprites';

describe('sprites', () => {
  it.each(Object.entries(ALL_SPRITES))('%s has rows of equal width using only # and .', (_name, bm) => {
    expect(bm.length).toBeGreaterThan(0);
    const width = bm[0]?.length ?? 0;
    expect(width).toBeGreaterThan(0);
    for (const row of bm) {
      expect(row.length).toBe(width);
      expect(row).toMatch(/^[#.]+$/);
    }
  });

  it('the five character sprites are all different from each other', () => {
    const names = ['human', 'llm', 'gpu', 'robot', 'virus'] as const;
    const keys = names.map((n) => (ALL_SPRITES[n] ?? []).join('/'));
    expect(new Set(keys).size).toBe(names.length);
  });

  it('falling-object sprites fit their hit box', () => {
    for (const bm of Object.values(OBJECT_SPRITES)) {
      expect(bm[0]?.length).toBeLessThanOrEqual(OBJECT_W);
      expect(bm.length).toBeLessThanOrEqual(OBJECT_H);
    }
  });

  it('every font glyph is 3x5 and monochrome', () => {
    for (const [ch, glyph] of Object.entries(FONT)) {
      expect(glyph, ch).toHaveLength(FONT_H);
      for (const row of glyph) expect(row).toMatch(new RegExp(`^[#.]{${FONT_W}}$`));
    }
  });

  it('has seven-segment shapes for every digit and a font for every label letter', () => {
    for (const d of '0123456789') expect(SEVEN_SEGMENT[d]).toBeTruthy();
    for (const ch of 'AICTHGMEOVRSPNWKY+') expect(FONT[ch]).toBeTruthy();
  });
});
