import { describe, expect, it } from 'vitest';
import { OBJECT_H, OBJECT_W } from '../../src/game/config';
import type { ObjectKind } from '../../src/game/types';
import {
  AI_FACE_BROKEN,
  AI_FACE_RESTORED,
  ALL_SPRITES,
  FONT,
  FONT_H,
  FONT_W,
  OBJECT_SPRITES,
  SEVEN_SEGMENT,
} from '../../src/render/sprites';

const ALL_KINDS: ObjectKind[] = ['mainframe', 'tape', 'floppy', 'llm', 'gpu', 'robot', 'virus'];

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

  it('has an object sprite for every object kind, each fitting 16x16', () => {
    for (const kind of ALL_KINDS) {
      const bm = OBJECT_SPRITES[kind];
      expect(bm, kind).toBeDefined();
      expect(bm.length, kind).toBeLessThanOrEqual(16);
      for (const row of bm) expect(row.length, kind).toBeLessThanOrEqual(16);
    }
  });

  it('every object sprite differs from every other object sprite', () => {
    const keys = ALL_KINDS.map((k) => OBJECT_SPRITES[k].join('/'));
    expect(new Set(keys).size).toBe(ALL_KINDS.length);
  });

  it('the AI faces are 24x24, monochrome, and differ', () => {
    for (const face of [AI_FACE_BROKEN, AI_FACE_RESTORED]) {
      expect(face).toHaveLength(24);
      for (const row of face) expect(row).toMatch(/^[#.]{24}$/);
    }
    expect(AI_FACE_BROKEN.join('/')).not.toBe(AI_FACE_RESTORED.join('/'));
  });

  it('the restored AI face is left-right symmetric', () => {
    for (const row of AI_FACE_RESTORED) expect(row).toBe([...row].reverse().join(''));
  });

  it.each(['%', '.', ':', '/', '—', ',', '?', "'"])('the font has a 3x5 glyph for %s', (ch) => {
    const glyph = FONT[ch];
    expect(glyph).toBeDefined();
    expect(glyph).toHaveLength(FONT_H);
    for (const row of glyph ?? []) expect(row).toMatch(new RegExp(`^[#.]{${FONT_W}}$`));
  });

  it('has seven-segment shapes for every digit and a font for every label letter', () => {
    for (const d of '0123456789') expect(SEVEN_SEGMENT[d]).toBeTruthy();
    for (const ch of 'AICTHGMEOVRSPNWKY+') expect(FONT[ch]).toBeTruthy();
  });
});
