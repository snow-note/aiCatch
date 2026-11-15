import {
  FALL_TIME,
  OBJECT_H,
  OBJECT_W,
  PLAY_H,
  PLAY_W,
  ROBOT_SWAY_AMPLITUDE,
  ROBOT_SWAY_PERIOD,
  VIRUS_JITTER_AMPLITUDE,
} from './config';

import type { CollectibleKind, ObjectKind } from './types';

export interface FallingObject {
  kind: ObjectKind;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Spawn order: lower means it appeared earlier (FR4.7). */
  order: number;
  /** Centre line of the sideways movement. */
  baseX: number;
  /** Seconds since this object appeared. */
  age: number;
  /** Fall speed in logical pixels per second. */
  vy: number;
  /** Random phase for the VIRUS jitter. */
  phase: number;
}

export function isCollectible(kind: ObjectKind): kind is CollectibleKind {
  return kind !== 'virus';
}

function clampX(x: number): number {
  return Math.min(PLAY_W - OBJECT_W, Math.max(0, x));
}

/** Creates an object at the top of the play area. Speeds are full height per fall time. */
export function createObject(
  kind: ObjectKind,
  x: number,
  order: number,
  speedMult = 1,
  phase = 0,
): FallingObject {
  const baseX = clampX(Number.isFinite(x) ? x : 0);
  return {
    kind,
    x: baseX,
    y: 0,
    w: OBJECT_W,
    h: OBJECT_H,
    order,
    baseX,
    age: 0,
    vy: (PLAY_H / FALL_TIME[kind]) * speedMult,
    phase,
  };
}

/** Moves an object by `dt` seconds. Position stays inside the play area sideways (FR3.1-FR3.4). */
export function stepObject(o: FallingObject, dt: number): void {
  o.age += dt;
  o.y += o.vy * dt;
  switch (o.kind) {
    case 'robot':
      o.x = clampX(
        o.baseX + ROBOT_SWAY_AMPLITUDE * Math.sin((o.age * 2 * Math.PI) / ROBOT_SWAY_PERIOD),
      );
      break;
    case 'virus': {
      const a = o.age;
      const jitter =
        Math.sin(a * 5.1 + o.phase) * 0.6 + Math.sin(a * 11.7 + o.phase * 1.9) * 0.4;
      o.x = clampX(o.baseX + VIRUS_JITTER_AMPLITUDE * jitter);
      break;
    }
    default:
      o.x = o.baseX;
  }
}

/** True once the object has fallen past the bottom of the play area. */
export function isBelowPlayArea(o: FallingObject): boolean {
  return o.y >= PLAY_H;
}
