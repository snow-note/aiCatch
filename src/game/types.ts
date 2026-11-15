/** Shared type contracts C1-C4 of the four-stage game. Type-only: no runtime code. */

export type ObjectKind = 'mainframe' | 'tape' | 'floppy' | 'llm' | 'gpu' | 'robot' | 'virus';
export type CollectibleKind = Exclude<ObjectKind, 'virus'>;

export type Phase =
  | 'title'
  | 'stage-intro'
  | 'playing'
  | 'stage-clear'
  | 'victory'
  | 'game-over';

/** C3: difficulty numbers of one moment inside a stage. */
export interface DifficultyValues {
  readonly fallSpeedMultiplier: number;
  /** Seconds between spawns. */
  readonly spawnInterval: number;
  /** Probability 0..1 that a spawn is a VIRUS. */
  readonly virusShare: number;
  readonly maxObjects: number;
}

/** C3: one stage of the catalogue. */
export interface StageDefinition {
  readonly stageNumber: 1 | 2 | 3 | 4;
  readonly name: 'FORTRAN' | 'COBOL' | 'BASIC' | 'LLM';
  /** Never includes 'virus'. */
  readonly collectibles: ReadonlyArray<CollectibleKind>;
  readonly requiredCount: number;
  readonly difficultyStart: DifficultyValues;
  readonly difficultyCap: DifficultyValues;
  readonly clearBonus: number;
  /** Extra fall speed of collectibles only; VIRUS is excluded (FR2.1, FR2.2). */
  readonly collectibleSpeedFactor: number;
}

export type GameOverReason = 'lives' | 'time';

/** C1: read-only view for drawing and announcements. */
export interface GameView {
  readonly phase: Phase;
  /** Seconds since the current phase began. */
  readonly phaseTime: number;
  /** True once game-over or victory accepts a new press to return to the title. */
  readonly canReturnToTitle: boolean;

  readonly score: number;
  readonly lives: number;
  readonly best: number;
  readonly newHighScore: boolean;

  readonly stage: StageDefinition;
  readonly stageIndex: number;
  readonly caught: number;
  readonly aiRestoration: number;
  /** Seconds left in the current stage; the full limit until play starts (FR3.6). */
  readonly timeLeft: number;
  /** Why the run ended, or null while it has not (FR5.1). */
  readonly gameOverReason: GameOverReason | null;

  readonly human: { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
  readonly objects: ReadonlyArray<{
    readonly kind: ObjectKind;
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
  }>;
}

/** C2: events drained once per frame. */
export type GameEvent =
  | { type: 'run-start' }
  | { type: 'stage-start'; stageIndex: number }
  | { type: 'catch'; kind: CollectibleKind; points: number; x: number; y: number }
  | { type: 'virus-hit'; x: number; y: number }
  | { type: 'life-lost'; lives: number }
  | { type: 'stage-clear'; stageIndex: number; bonus: number; timeBonus: number; aiRestoration: number }
  | { type: 'time-warning'; secondsLeft: number }
  | { type: 'victory'; score: number; newHighScore: boolean }
  | { type: 'game-over'; score: number; newHighScore: boolean; reason: GameOverReason };

/** C4: how Bootstrap drives the game. None of these methods throw. */
export interface GameControls {
  /** Enter, Space, or the START button. */
  pressStart(): void;
  /** Any key or touch going down. dir is -1/1 for a left/right source, else null. */
  inputDown(id: string, dir: -1 | 1 | null): void;
  inputUp(id: string): void;
  /** Window lost focus: release every held input. */
  releaseAll(): void;
  /** Advance by dt seconds. Non-finite or non-positive dt is ignored. */
  update(dt: number): void;
  /** Take and clear the queued events. */
  drainEvents(): GameEvent[];
}
