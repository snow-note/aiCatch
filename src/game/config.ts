/** Every tunable number of the game (FR1-FR8). Starting values, tuned by playtesting. */
import type { CollectibleKind, ObjectKind, StageDefinition } from './types';

/** Logical play area, in logical pixels. */
export const PLAY_W = 240;
export const PLAY_H = 160;

/** Falling object and HUMAN sizes (logical pixels). */
export const OBJECT_W = 16;
export const OBJECT_H = 16;
export const HUMAN_W = 20;
export const HUMAN_H = 20;
/** HUMAN walking speed in logical pixels per second. */
export const HUMAN_SPEED = 130;

/** Seconds to fall the full play-area height, per kind (BR6.3). */
export const FALL_TIME: Readonly<Record<ObjectKind, number>> = {
  mainframe: 4.0,
  tape: 4.0,
  floppy: 4.0,
  llm: 4.0,
  robot: 3.5,
  virus: 2.2,
  gpu: 2.5,
};

/** Points per collectible (BR3.1). */
export const POINTS: Readonly<Record<CollectibleKind, number>> = {
  mainframe: 100,
  tape: 100,
  floppy: 100,
  llm: 100,
  gpu: 150,
  robot: 200,
};

export const START_LIVES = 3;

/** Phase durations in seconds (contract C1). */
export const STAGE_INTRO_DURATION = 2.0;
export const STAGE_CLEAR_DURATION = 2.5;
export const VICTORY_DURATION = 3.5;
export const GAME_OVER_DURATION = 2.0;

/** Display sub-steps inside the phase durations (U2 drawing only). The hold step starts at VICTORY_DURATION. */
export const VICTORY_REBOOT_END = 1.5;
export const VICTORY_RESTORE_END = 2.5;
export const VICTORY_MESSAGE_STEP = 0.33;
/** Seconds the stage-clear AI bar takes to fill. */
export const CLEAR_BAR_FILL = 1.0;
/** Blinks per second of "PRESS START" style prompts. */
export const BLINK_HZ = 1;

/** AI restoration gained per cleared stage, in percent (BR2.4). */
export const AI_RESTORATION_STEP = 25;

/** In-stage difficulty steps (BR5.1). */
export const DIFFICULTY_STEP_SECONDS = 8;
export const DIFFICULTY_STEPS_TO_CAP = 4;

/** Floating-point tolerance for timer and step boundaries (BR1.10). */
export const EPS = 1e-9;

/** Upper bound of spawns in one update, so a huge dt cannot loop for long (BR6.1). */
export const MAX_SPAWNS_PER_UPDATE = 100;

/** The four stages in play order (BR2.1, BR5.3, BR5.4). */
export const STAGES: ReadonlyArray<StageDefinition> = [
  {
    stageNumber: 1,
    name: 'FORTRAN',
    collectibles: ['mainframe'],
    requiredCount: 10,
    difficultyStart: { fallSpeedMultiplier: 1.0, spawnInterval: 1.2, virusShare: 0.4, maxObjects: 3 },
    difficultyCap: { fallSpeedMultiplier: 1.2, spawnInterval: 1.0, virusShare: 0.45, maxObjects: 4 },
    clearBonus: 500,
  },
  {
    stageNumber: 2,
    name: 'COBOL',
    collectibles: ['tape'],
    requiredCount: 12,
    difficultyStart: { fallSpeedMultiplier: 1.1, spawnInterval: 1.1, virusShare: 0.45, maxObjects: 4 },
    difficultyCap: { fallSpeedMultiplier: 1.35, spawnInterval: 0.9, virusShare: 0.5, maxObjects: 5 },
    clearBonus: 500,
  },
  {
    stageNumber: 3,
    name: 'BASIC',
    collectibles: ['floppy'],
    requiredCount: 14,
    difficultyStart: { fallSpeedMultiplier: 1.2, spawnInterval: 1.0, virusShare: 0.5, maxObjects: 4 },
    difficultyCap: { fallSpeedMultiplier: 1.5, spawnInterval: 0.8, virusShare: 0.55, maxObjects: 5 },
    clearBonus: 500,
  },
  {
    stageNumber: 4,
    name: 'LLM',
    collectibles: ['llm', 'gpu', 'robot'],
    requiredCount: 16,
    difficultyStart: { fallSpeedMultiplier: 1.3, spawnInterval: 0.9, virusShare: 0.55, maxObjects: 5 },
    difficultyCap: { fallSpeedMultiplier: 1.7, spawnInterval: 0.7, virusShare: 0.6, maxObjects: 6 },
    clearBonus: 500,
  },
];

/** Seconds of play before the first object of every stage appears (FR2.2). */
export const FIRST_SPAWN_DELAY = 0.5;
/** Share of VIRUS spawns aimed at HUMAN's position at spawn time (FR3.1). */
export const VIRUS_AIM_SHARE = 1 / 3;
/** Sideways spread, in logical pixels, around the aim point of an aimed VIRUS (FR3.2). */
export const VIRUS_AIM_SPREAD = HUMAN_W;

/** ROBOT sway and VIRUS jitter shapes. */
export const ROBOT_SWAY_AMPLITUDE = 22;
export const ROBOT_SWAY_PERIOD = 1.6;
export const VIRUS_JITTER_AMPLITUDE = 16;
