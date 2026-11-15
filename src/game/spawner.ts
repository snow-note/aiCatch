import { OBJECT_W, PLAY_W } from './config';
import { createObject, type FallingObject } from './objects';
import type { CollectibleKind, DifficultyValues, ObjectKind } from './types';

/** A source of numbers in [0, 1), injectable for tests. */
export type Random = () => number;

/**
 * Picks the next object kind: VIRUS by its share from the first spawn, otherwise the
 * stage collectibles in equal parts (BR6.2).
 */
export function pickKind(
  collectibles: ReadonlyArray<CollectibleKind>,
  virusShare: number,
  random: Random,
): ObjectKind {
  if (random() < virusShare) return 'virus';
  const raw = Math.floor(random() * collectibles.length);
  const i = Math.min(collectibles.length - 1, Math.max(0, Number.isFinite(raw) ? raw : 0));
  return collectibles[i] ?? 'virus';
}

/** Creates the next falling object at a random x inside the play area (BR6.3). */
export function spawnObject(
  collectibles: ReadonlyArray<CollectibleKind>,
  difficulty: DifficultyValues,
  order: number,
  random: Random,
): FallingObject {
  const kind = pickKind(collectibles, difficulty.virusShare, random);
  const x = random() * (PLAY_W - OBJECT_W);
  const phase = random() * Math.PI * 2;
  return createObject(kind, x, order, difficulty.fallSpeedMultiplier, phase);
}
