import { resolveCollisions } from './collision';
import {
  EPS,
  FIRST_SPAWN_DELAY,
  GAME_OVER_DURATION,
  HUMAN_H,
  HUMAN_SPEED,
  HUMAN_W,
  MAX_SPAWNS_PER_UPDATE,
  PLAY_H,
  PLAY_W,
  POINTS,
  STAGE_CLEAR_DURATION,
  STAGE_INTRO_DURATION,
  START_LIVES,
  STAGE_TIME_LIMIT,
  TIME_BONUS_PER_SECOND,
  TIME_WARNING_SECONDS,
  VICTORY_DURATION,
} from './config';
import { difficultyAt } from './difficulty';
import { InputTracker } from './input';
import { isBelowPlayArea, isCollectible, stepObject, type FallingObject } from './objects';
import { advanceStage, currentStage, newRun, recordCatch, type Run } from './run';
import { spawnObject, type Random } from './spawner';
import type {
  GameControls,
  GameEvent,
  GameOverReason,
  GameView,
  Phase,
  StageDefinition,
} from './types';

/** The part of the high-score store that the game rules need. */
export interface HighScoreLike {
  readonly best: number;
  submit(score: number): boolean;
}

export interface GameOptions {
  random?: Random;
  highScore?: HighScoreLike;
}

/**
 * The phase machine of the four-stage game. It is both the read-only `GameView` (C1) and
 * the `GameControls` (C4). It holds no DOM, drawing or sound code (BR9.1) and none of its
 * methods throw (BR9.2).
 */
export class GameState implements GameView, GameControls {
  phase: Phase = 'title';
  /** Seconds since the current phase began. */
  phaseTime = 0;
  score = 0;
  lives = START_LIVES;
  newHighScore = false;
  gameOverReason: GameOverReason | null = null;
  readonly human = { x: (PLAY_W - HUMAN_W) / 2, y: PLAY_H - HUMAN_H, w: HUMAN_W, h: HUMAN_H };
  objects: FallingObject[] = [];

  private run: Run = newRun();
  private readonly input = new InputTracker();
  private readonly random: Random;
  private readonly highScore: HighScoreLike | undefined;
  /** Seconds of play inside the current stage (drives difficulty). */
  private stageTime = 0;
  /** Last whole second shown on the timer, so each warning beep is raised once (FR4.3). */
  private lastTimerSecond = STAGE_TIME_LIMIT;
  private spawnTimer = 0;
  private nextOrder = 0;
  private events: GameEvent[] = [];
  /** Set when the title was entered by a press, so the same press cannot also start a run (BR1.9). */
  private titleEnteredByPress = false;

  constructor(options: GameOptions = {}) {
    this.random = options.random ?? Math.random;
    this.highScore = options.highScore;
  }

  // ---- GameView ------------------------------------------------------------

  get view(): GameView {
    return this;
  }

  get best(): number {
    return this.highScore?.best ?? 0;
  }

  get stage(): StageDefinition {
    return currentStage(this.run);
  }

  get stageIndex(): number {
    return this.run.stageIndex;
  }

  get caught(): number {
    return this.run.caught;
  }

  get aiRestoration(): number {
    return this.run.aiRestoration;
  }

  /** Seconds left in the stage. Only play time uses it up (FR3.2, FR3.6). */
  get timeLeft(): number {
    const left = STAGE_TIME_LIMIT - this.stageTime;
    // Same tolerance as the time-out check, so the timer reads 0 exactly when time is up.
    return left <= EPS ? 0 : left;
  }

  get canReturnToTitle(): boolean {
    if (this.phase === 'game-over') return this.reached(GAME_OVER_DURATION);
    if (this.phase === 'victory') return this.reached(VICTORY_DURATION);
    return false;
  }

  // ---- GameControls --------------------------------------------------------

  drainEvents(): GameEvent[] {
    const e = this.events;
    this.events = [];
    return e;
  }

  /** START button, Enter or Space (BR1.2, BR1.6, BR1.9). */
  pressStart(): void {
    if (this.phase === 'title') {
      if (this.titleEnteredByPress) {
        this.titleEnteredByPress = false;
        return;
      }
      this.startRun();
    } else if (this.canReturnToTitle) {
      this.returnToTitle();
    }
  }

  /** Any key or touch going down. A new press can return to the title after the end screens. */
  inputDown(id: string, dir: -1 | 1 | null = null): void {
    const isNew = this.input.press(id, dir);
    if (isNew && this.canReturnToTitle) this.returnToTitle();
  }

  inputUp(id: string): void {
    this.input.release(id);
  }

  releaseAll(): void {
    this.input.clear();
  }

  update(dt: number): void {
    if (!Number.isFinite(dt) || dt <= 0) return;
    this.titleEnteredByPress = false;
    this.phaseTime += dt;
    switch (this.phase) {
      case 'stage-intro':
        if (this.reached(STAGE_INTRO_DURATION)) {
          this.phase = 'playing';
          this.phaseTime = 0;
        }
        break;
      case 'playing':
        this.updatePlaying(dt);
        break;
      case 'stage-clear':
        if (this.reached(STAGE_CLEAR_DURATION)) this.finishStageClear();
        break;
      default:
        break;
    }
  }

  // ---- phase changes -------------------------------------------------------

  private reached(duration: number): boolean {
    return this.phaseTime >= duration - EPS;
  }

  /** W1 */
  private startRun(): void {
    this.run = newRun();
    this.score = 0;
    this.lives = START_LIVES;
    this.newHighScore = false;
    this.gameOverReason = null;
    this.objects = [];
    this.events.push({ type: 'run-start' });
    this.enterStageIntro();
  }

  /** W2 */
  private enterStageIntro(): void {
    this.phase = 'stage-intro';
    this.phaseTime = 0;
    this.stageTime = 0;
    this.lastTimerSecond = STAGE_TIME_LIMIT;
    // The first spawn comes FIRST_SPAWN_DELAY into play, then every spawn interval (FR2.2).
    this.spawnTimer = this.stage.difficultyStart.spawnInterval - FIRST_SPAWN_DELAY;
    this.objects = [];
    this.human.x = (PLAY_W - HUMAN_W) / 2;
    this.events.push({ type: 'stage-start', stageIndex: this.run.stageIndex });
  }

  /** W4 (the catch that reached the target has already raised the run values) */
  private clearStage(): void {
    const stage = this.stage;
    this.objects = [];
    // Whole seconds left are worth points (FR6.1).
    const timeBonus = Math.floor(this.timeLeft) * TIME_BONUS_PER_SECOND;
    this.score += stage.clearBonus + timeBonus;
    this.phase = 'stage-clear';
    this.phaseTime = 0;
    this.events.push({
      type: 'stage-clear',
      stageIndex: this.run.stageIndex,
      bonus: stage.clearBonus,
      timeBonus,
      aiRestoration: this.run.aiRestoration,
    });
  }

  private finishStageClear(): void {
    if (this.run.complete) {
      this.enterVictory();
    } else {
      advanceStage(this.run);
      this.enterStageIntro();
    }
  }

  /** W5 */
  private enterVictory(): void {
    this.phase = 'victory';
    this.phaseTime = 0;
    this.objects = [];
    this.newHighScore = this.highScore ? this.highScore.submit(this.score) : false;
    this.events.push({ type: 'victory', score: this.score, newHighScore: this.newHighScore });
  }

  /** W6 */
  private enterGameOver(reason: GameOverReason): void {
    this.phase = 'game-over';
    this.phaseTime = 0;
    this.objects = [];
    this.gameOverReason = reason;
    this.newHighScore = this.highScore ? this.highScore.submit(this.score) : false;
    this.events.push({ type: 'game-over', score: this.score, newHighScore: this.newHighScore, reason });
  }

  /** W7 */
  private returnToTitle(): void {
    this.phase = 'title';
    this.phaseTime = 0;
    this.run = newRun();
    this.score = 0;
    this.lives = START_LIVES;
    this.newHighScore = false;
    this.gameOverReason = null;
    this.objects = [];
    this.titleEnteredByPress = true;
  }

  // ---- playing -------------------------------------------------------------

  /** W3 */
  private updatePlaying(dt: number): void {
    this.stageTime += dt;
    this.raiseTimeWarning();

    const dir = this.input.direction();
    this.human.x = Math.min(PLAY_W - HUMAN_W, Math.max(0, this.human.x + dir * HUMAN_SPEED * dt));

    const stage = this.stage;
    const d = difficultyAt(stage, this.stageTime);
    this.spawnTimer += dt;
    for (let n = 0; n < MAX_SPAWNS_PER_UPDATE && this.spawnTimer >= d.spawnInterval; n++) {
      this.spawnTimer -= d.spawnInterval;
      if (this.objects.length < d.maxObjects) {
        this.objects.push(spawnObject(
            stage.collectibles,
            d,
            this.nextOrder++,
            this.random,
            this.human.x + HUMAN_W / 2,
            stage.collectibleSpeedFactor,
          ),
        );
      }
    }
    // A huge dt must not leave a backlog that bursts out later.
    this.spawnTimer = Math.min(this.spawnTimer, d.spawnInterval);

    for (const o of this.objects) stepObject(o, dt);

    const { handled, touched } = resolveCollisions(this.human, this.objects);
    if (touched.length > 0) this.objects = this.objects.filter((o) => !touched.includes(o));
    if (handled && this.handle(handled)) return;

    // Objects that reach the bottom vanish with no penalty (BR2.6).
    this.objects = this.objects.filter((o) => !isBelowPlayArea(o));

    // Checked last, so a clearing catch or a fatal VIRUS hit in this update wins (FR3.5).
    if (this.stageTime >= STAGE_TIME_LIMIT - EPS) this.enterGameOver('time');
  }

  /** Raises one time-warning each time the displayed second drops into the last ones (FR4.3). */
  private raiseTimeWarning(): void {
    const second = Math.ceil(this.timeLeft);
    if (second >= this.lastTimerSecond) return;
    this.lastTimerSecond = second;
    if (second >= 1 && second <= TIME_WARNING_SECONDS) {
      this.events.push({ type: 'time-warning', secondsLeft: second });
    }
  }

  /** Handles one touched object. Returns true when it ended the playing phase. */
  private handle(o: FallingObject): boolean {
    if (isCollectible(o.kind)) {
      const points = POINTS[o.kind];
      this.score += points;
      this.events.push({ type: 'catch', kind: o.kind, points, x: o.x, y: o.y });
      if (recordCatch(this.run, o.kind)) {
        this.clearStage();
        return true;
      }
      return false;
    }
    this.lives = Math.max(0, this.lives - 1);
    this.events.push({ type: 'virus-hit', x: o.x, y: o.y });
    this.events.push({ type: 'life-lost', lives: this.lives });
    if (this.lives === 0) {
      this.enterGameOver('lives');
      return true;
    }
    return false;
  }
}
