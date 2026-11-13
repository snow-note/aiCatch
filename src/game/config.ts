/** Every tunable number of the game, taken from the requirements (FR1-FR8). */

/** Logical play area, in logical pixels (FR9.1, FR9.5). */
export const PLAY_W = 240;
export const PLAY_H = 160;

/** Falling object and HUMAN sizes (logical pixels). */
export const OBJECT_W = 16;
export const OBJECT_H = 16;
export const HUMAN_W = 20;
export const HUMAN_H = 20;
/** HUMAN walking speed in logical pixels per second. */
export const HUMAN_SPEED = 130;

/** Starting fall time: seconds to fall the full play-area height (FR3.1-FR3.4). */
export const FALL_TIME = {
  llm: 4.0,
  robot: 3.5,
  virus: 3.0,
  gpu: 2.5,
} as const;

/** Points per rescue object (FR4.1-FR4.3). */
export const POINTS = {
  llm: 100,
  gpu: 150,
  robot: 200,
} as const;

export const START_LIVES = 3;

/** Difficulty (FR3.5-FR3.7, assumption A2). */
export const BASE_SPAWN_INTERVAL = 1.2;
export const DIFFICULTY_STEP_SECONDS = 15;
export const INTERVAL_FACTOR = 0.9;
export const SPEED_FACTOR = 1.1;
export const MIN_SPAWN_INTERVAL = 0.6;
export const MAX_SPEED_MULTIPLIER = 2.0;

/** VIRUS ramp (FR3.7). */
export const VIRUS_START_TIME = 10;
export const VIRUS_START_SHARE = 0.2;
export const VIRUS_SHARE_STEP = 0.05;
export const VIRUS_MAX_SHARE = 0.4;

/** Sequences, in seconds (FR7.1, FR7.7). */
export const STARTUP_DURATION = 2.0;
export const GAME_OVER_DURATION = 2.0;

/** ROBOT sway and VIRUS jitter shapes (open design question: chosen here). */
export const ROBOT_SWAY_AMPLITUDE = 22;
export const ROBOT_SWAY_PERIOD = 1.6;
export const VIRUS_JITTER_AMPLITUDE = 16;
