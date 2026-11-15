import { OBJECT_W, PLAY_W, VIRUS_AIM_SHARE, VIRUS_AIM_SPREAD } from './config';
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

/**
 * Creates the next falling object (BR6.3). x is random inside the play area, except that a
 * VIRUS is aimed at `aimX` (HUMAN's centre) with a share of VIRUS_AIM_SHARE (FR3.1-FR3.3).
 * Collectibles keep their draw order.
 */
export function spawnObject(
  collectibles: ReadonlyArray<CollectibleKind>,
  difficulty: DifficultyValues,
  order: number,
  random: Random,
  aimX?: number,
): FallingObject {
  const kind = pickKind(collectibles, difficulty.virusShare, random);
  const aimed = kind === 'virus' && aimX !== undefined && random() < VIRUS_AIM_SHARE;
  const x = aimed
    ? Math.min(
        PLAY_W - OBJECT_W,
        Math.max(0, (aimX as number) - OBJECT_W / 2 + (random() * 2 - 1) * VIRUS_AIM_SPREAD),
      )
    : random() * (PLAY_W - OBJECT_W);
  const phase = random() * Math.PI * 2;
  return createObject(kind, x, order, difficulty.fallSpeedMultiplier, phase);
}
