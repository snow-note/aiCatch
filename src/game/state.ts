import { resolveCollisions } from './collision';
import {
  GAME_OVER_DURATION,
  HUMAN_H,
  HUMAN_SPEED,
  HUMAN_W,
  PLAY_H,
  PLAY_W,
  POINTS,
  START_LIVES,
  STARTUP_DURATION,
} from './config';
import { spawnInterval } from './difficulty';
import { InputTracker } from './input';
import {
  isBelowPlayArea,
  isRescue,
  stepObject,
  type FallingObject,
  type ObjectKind,
} from './objects';
import { spawnObject, type Random } from './spawner';

export type Phase = 'power-off' | 'startup' | 'title' | 'playing' | 'game-over';

export type GameEvent =
  | { type: 'power-on' }
  | { type: 'game-start' }
  | { type: 'catch'; kind: ObjectKind; points: number; x: number; y: number }
  | { type: 'virus-hit'; x: number; y: number }
  | { type: 'life-lost'; lives: number }
  | { type: 'game-over'; score: number; newHighScore: boolean };

/** The part of the high-score store that the game rules need. */
export interface HighScoreLike {
  readonly best: number;
  submit(score: number): boolean;
}

export interface GameOptions {
  random?: Random;
  highScore?: HighScoreLike;
}

const EPS = 1e-9;

export class GameState {
  phase: Phase = 'power-off';
  score = 0;
  lives = START_LIVES;
  /** Seconds of play in the current game (drives difficulty). */
  elapsed = 0;
  startupTime = 0;
  gameOverTime = 0;
  newHighScore = false;
  readonly human = { x: (PLAY_W - HUMAN_W) / 2, y: PLAY_H - HUMAN_H, w: HUMAN_W, h: HUMAN_H };
  objects: FallingObject[] = [];

  private readonly input = new InputTracker();
  private readonly random: Random;
  private readonly highScore: HighScoreLike | undefined;
  private spawnTimer = 0;
  private nextOrder = 0;
  private events: GameEvent[] = [];

  constructor(options: GameOptions = {}) {
    this.random = options.random ?? Math.random;
    this.highScore = options.highScore;
  }

  /** Best score so far, for the title and game-over screens (FR6.4). */
  get best(): number {
    return this.highScore?.best ?? 0;
  }

  /** True once the GAME OVER sequence has finished and a new press restarts (FR1.5). */
  get canRestart(): boolean {
    return this.phase === 'game-over' && this.gameOverTime >= GAME_OVER_DURATION - EPS;
  }

  drainEvents(): GameEvent[] {
    const e = this.events;
    this.events = [];
    return e;
  }

  /** POWER button (click, key or tap). Only does something while the console is off (FR1.1). */
  pressPower(): void {
    if (this.phase !== 'power-off') return;
    this.phase = 'startup';
    this.startupTime = 0;
    this.events.push({ type: 'power-on' });
  }

  /** START button, Enter or Space. Arrow keys and other taps must not call this (FR1.2). */
  pressStart(): void {
    if (this.phase === 'title' || this.canRestart) this.startGame();
  }

  /**
   * Any key or touch going down. `dir` is -1/1 for a left/right source, else null.
   * During GAME OVER a new press restarts once the sequence is over (FR1.5).
   */
  inputDown(id: string, dir: -1 | 1 | null = null): void {
    const isNew = this.input.press(id, dir);
    if (isNew && this.canRestart) this.startGame();
  }

  inputUp(id: string): void {
    this.input.release(id);
  }

  /** Advances the game by `dt` seconds. */
  update(dt: number): void {
    if (!Number.isFinite(dt) || dt <= 0) return;
    switch (this.phase) {
      case 'startup':
        this.startupTime += dt;
        if (this.startupTime >= STARTUP_DURATION - EPS) this.phase = 'title';
        break;
      case 'playing':
        this.updatePlaying(dt);
        break;
      case 'game-over':
        this.gameOverTime += dt;
        break;
      default:
        break;
    }
  }

  private startGame(): void {
    this.phase = 'playing';
    this.score = 0;
    this.lives = START_LIVES;
    this.elapsed = 0;
    this.spawnTimer = 0;
    this.objects = [];
    this.newHighScore = false;
    this.gameOverTime = 0;
    this.human.x = (PLAY_W - HUMAN_W) / 2;
    this.events.push({ type: 'game-start' });
  }

  private updatePlaying(dt: number): void {
    this.elapsed += dt;

    const dir = this.input.direction();
    this.human.x = Math.min(PLAY_W - HUMAN_W, Math.max(0, this.human.x + dir * HUMAN_SPEED * dt));

    this.spawnTimer += dt;
    for (let guard = 0; guard < 100; guard++) {
      const interval = spawnInterval(this.elapsed);
      if (this.spawnTimer < interval) break;
      this.spawnTimer -= interval;
      this.objects.push(spawnObject(this.elapsed, this.nextOrder++, this.random));
    }

    for (const o of this.objects) stepObject(o, dt);

    const { handled, touched } = resolveCollisions(this.human, this.objects);
    if (touched.length > 0) {
      this.objects = this.objects.filter((o) => !touched.includes(o));
    }
    if (handled) this.handle(handled);

    // Rescue objects (and anything else) that reach the bottom vanish with no penalty (FR4.5).
    this.objects = this.objects.filter((o) => !isBelowPlayArea(o));
  }

  private handle(o: FallingObject): void {
    if (isRescue(o.kind)) {
      const points = POINTS[o.kind];
      this.score += points;
      this.events.push({ type: 'catch', kind: o.kind, points, x: o.x, y: o.y });
      return;
    }
    this.lives = Math.max(0, this.lives - 1);
    this.events.push({ type: 'virus-hit', x: o.x, y: o.y });
    this.events.push({ type: 'life-lost', lives: this.lives });
    if (this.lives === 0) this.endGame();
  }

  private endGame(): void {
    this.phase = 'game-over';
    this.gameOverTime = 0;
    this.objects = [];
    this.newHighScore = this.highScore ? this.highScore.submit(this.score) : false;
    this.events.push({ type: 'game-over', score: this.score, newHighScore: this.newHighScore });
  }
}
