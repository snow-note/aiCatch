export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Bounding-box overlap of at least one pixel (FR4.9). Edges that only touch do not count. */
export function overlaps(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export interface CollisionObject extends Box {
  kind: string;
  order: number;
}

export interface CollisionResult<T extends CollisionObject> {
  /** The one object to handle this update, or null. */
  handled: T | null;
  /** Every object touching HUMAN; all of them are removed (FR4.6, FR4.7). */
  touched: T[];
}

/** One object per update: a VIRUS first, otherwise the earliest-spawned (FR4.7, A4). */
export function resolveCollisions<T extends CollisionObject>(
  human: Box,
  objects: readonly T[],
): CollisionResult<T> {
  const touched = objects.filter((o) => overlaps(human, o));
  let handled: T | null = null;
  for (const o of touched) {
    if (handled === null) {
      handled = o;
      continue;
    }
    const oVirus = o.kind === 'virus';
    const hVirus = handled.kind === 'virus';
    if (oVirus && !hVirus) handled = o;
    else if (oVirus === hVirus && o.order < handled.order) handled = o;
  }
  return { handled, touched };
}
