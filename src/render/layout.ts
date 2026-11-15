/** Logical size of the console casing (FR9.5). */
export const CASING_W = 320;
export const CASING_H = 240;

/** Delay of the last re-fit after a resize or rotation, once browser chrome settles (FR1.1, NFR6). */
export const SETTLE_DELAY_MS = 300;

export interface ViewportRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

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

const inset = (v: number): number => (Number.isFinite(v) && v > 0 ? v : 0);

/**
 * Visible viewport minus safe-area insets (FR3.1, FR3.2). Bad insets count as 0.
 * Width or height can be 0 or negative: that is an invalid area.
 */
export function fitArea(viewport: ViewportRect, insets: Insets): ViewportRect {
  const top = inset(insets.top);
  const right = inset(insets.right);
  const bottom = inset(insets.bottom);
  const left = inset(insets.left);
  return {
    x: viewport.x + left,
    y: viewport.y + top,
    width: viewport.width - left - right,
    height: viewport.height - top - bottom,
  };
}

/** Fit the casing inside an area, offsets measured from the viewport origin (FR3.3, NFR2). */
export function placeCasing(area: ViewportRect): Fit {
  const f = fitCasing(area.width, area.height);
  return { ...f, offsetX: f.offsetX + area.x, offsetY: f.offsetY + area.y };
}

/** A fit is usable when its scale is finite and positive (FR2.1). */
export function isValidFit(fit: Fit): boolean {
  return Number.isFinite(fit.scale) && fit.scale > 0;
}

/** Keep the last valid fit when the next one is invalid; null when none exists (FR2.1, FR2.2). */
export function chooseFit(next: Fit, previous: Fit | null): Fit | null {
  return isValidFit(next) ? next : previous;
}

/** Which half of the area a touch is on, measured at the area centre (FR4.1). */
export function touchSide(clientX: number, area: ViewportRect): -1 | 1 {
  return clientX < area.x + area.width / 2 ? -1 : 1;
}

/** Portrait when taller than wide; a square counts as landscape (FR5.1). */
export function orientationOf(width: number, height: number): 'portrait' | 'landscape' {
  return height > width ? 'portrait' : 'landscape';
}
