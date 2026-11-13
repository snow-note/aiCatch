/** Logical size of the console casing (FR9.5). */
export const CASING_W = 320;
export const CASING_H = 240;

export interface Fit {
  /** Scale applied to the whole casing. */
  scale: number;
  /** Top-left position of the scaled casing inside the viewport. */
  offsetX: number;
  offsetY: number;
  /** Scaled casing size. */
  width: number;
  height: number;
}

/**
 * Largest scale at which the whole casing fits the visible viewport, keeping its
 * aspect ratio, centred (FR9.5, NFR1). A zero, negative or non-finite viewport
 * gives a zero-size fit instead of NaN.
 */
export function fitCasing(viewportW: number, viewportH: number): Fit {
  const w = Number.isFinite(viewportW) ? Math.max(0, viewportW) : 0;
  const h = Number.isFinite(viewportH) ? Math.max(0, viewportH) : 0;
  const scale = Math.min(w / CASING_W, h / CASING_H);
  const width = CASING_W * scale;
  const height = CASING_H * scale;
  return {
    scale,
    offsetX: (w - width) / 2,
    offsetY: (h - height) / 2,
    width,
    height,
  };
}
