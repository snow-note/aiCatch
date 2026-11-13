import { OBJECT_W, PLAY_W } from './config';
import { speedMultiplier, virusShare } from './difficulty';
import { createObject, type FallingObject, type ObjectKind } from './objects';

/** A source of numbers in [0, 1), injectable for tests. */
export type Random = () => number;

const RESCUE_KINDS: readonly ObjectKind[] = ['llm', 'gpu', 'robot'];

/** Picks the next object kind: VIRUS by its share, the rest in equal parts (FR3.7, FR3.8). */
export function pickKind(t: number, random: Random): ObjectKind {
  if (random() < virusShare(t)) return 'virus';
  const i = Math.min(RESCUE_KINDS.length - 1, Math.floor(random() * RESCUE_KINDS.length));
  return RESCUE_KINDS[i] as ObjectKind;
}

/** Creates the next falling object at a random x inside the play area (FR3.6). */
export function spawnObject(t: number, order: number, random: Random): FallingObject {
  const kind = pickKind(t, random);
  const x = random() * (PLAY_W - OBJECT_W);
  const phase = random() * Math.PI * 2;
  return createObject(kind, x, order, speedMultiplier(t), phase);
}
