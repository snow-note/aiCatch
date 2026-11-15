import { describe, expect, it } from 'vitest';
import {
  FIRST_SPAWN_DELAY,
  GAME_OVER_DURATION,
  HUMAN_SPEED,
  PLAY_H,
  PLAY_W,
  POINTS,
  START_LIVES,
  STAGES,
  STAGE_CLEAR_DURATION,
  STAGE_INTRO_DURATION,
  STAGE_TIME_LIMIT,
  TIME_BONUS_PER_SECOND,
  VICTORY_DURATION,
} from '../../src/game/config';
import { createObject } from '../../src/game/objects';
import { GameState, type HighScoreLike } from '../../src/game/state';
import type { GameEvent, GameView, ObjectKind } from '../../src/game/types';

const STEP = 1 / 60;

/** Never a VIRUS (0.99 is above every share), always the last collectible, far to the right. */
const noVirus = () => 0.99;

function fakeStore(initial = 0): HighScoreLike & { submitted: number[] } {
  const store = {
    best: initial,
    submitted: [] as number[],
    submit(score: number): boolean {
      store.submitted.push(score);
      if (score > store.best) {
        store.best = score;
        return true;
      }
      return false;
    },
  };
  return store;
}

/** Runs `seconds` of fixed 1/60 s steps. */
function run(g: GameState, seconds: number): void {
  const steps = Math.round(seconds * 60);
  for (let i = 0; i < steps; i++) g.update(STEP);
}

function newGame(highScore?: HighScoreLike): GameState {
  return new GameState({ random: noVirus, ...(highScore ? { highScore } : {}) });
}

/** Starts a run and waits out the stage intro, so the game is playing Stage 1. */
function playing(highScore?: HighScoreLike): GameState {
  const g = newGame(highScore);
  g.pressStart();
  run(g, STAGE_INTRO_DURATION);
  g.drainEvents();
  return g;
}

/** Drops an object of `kind` right onto HUMAN and runs one small update. */
let order = 1000;
function drop(g: GameState, kind: ObjectKind): void {
  const o = createObject(kind, g.human.x, order++);
  o.y = g.human.y - 4;
  g.objects.push(o);
  g.update(0.001);
}

function loseAllLives(g: GameState): void {
  for (let i = 0; i < START_LIVES; i++) drop(g, 'virus');
}

/** Catches the stage's required count, then waits through stage-clear and the next intro. */
function clearStageAndAdvance(g: GameState): void {
  const stage = g.stage;
  for (let i = 0; i < stage.requiredCount; i++) drop(g, stage.collectibles[0] as ObjectKind);
  run(g, STAGE_CLEAR_DURATION);
}

describe('title and start (BR1.1-BR1.3, BR1.9)', () => {
  it('starts on the title with a fresh run', () => {
    const g = newGame();
    expect(g.phase).toBe('title');
    expect(g.stageIndex).toBe(0);
    expect(g.caught).toBe(0);
    expect(g.aiRestoration).toBe(0);
    expect(g.score).toBe(0);
    expect(g.lives).toBe(START_LIVES);
    expect(g.canReturnToTitle).toBe(false);
  });

  it('an arrow inputDown on the title does not start; pressStart does, with ordered events', () => {
    const g = newGame();
    g.inputDown('key:ArrowRight', 1);
    g.update(1);
    expect(g.phase).toBe('title');
    g.pressStart();
    expect(g.phase).toBe('stage-intro');
    expect(g.drainEvents()).toEqual<GameEvent[]>([
      { type: 'run-start' },
      { type: 'stage-start', stageIndex: 0 },
    ]);
    expect(g.stageIndex).toBe(0);
    expect(g.score).toBe(0);
    expect(g.lives).toBe(START_LIVES);
  });
});

describe('stage intro (BR1.4, BR7.3)', () => {
  it('moves to playing after exactly 2.0 s of 1/60 steps, not one step earlier', () => {
    const g = newGame();
    g.pressStart();
    for (let i = 0; i < 119; i++) g.update(STEP);
    expect(g.phase).toBe('stage-intro');
    g.update(STEP);
    expect(g.phase).toBe('playing');
    expect(g.phaseTime).toBe(0);
  });

  it('spawns nothing and ignores start presses during the intro', () => {
    const g = newGame();
    g.pressStart();
    for (let i = 0; i < 100; i++) {
      g.pressStart();
      g.update(STEP);
    }
    expect(g.phase).toBe('stage-intro');
    expect(g.objects).toHaveLength(0);
  });

  it('does not move HUMAN during the intro, but a held direction moves it on the first playing update', () => {
    const g = newGame();
    g.pressStart();
    const x0 = g.human.x;
    g.inputDown('key:ArrowRight', 1);
    run(g, STAGE_INTRO_DURATION);
    expect(g.phase).toBe('playing');
    expect(g.human.x).toBe(x0);
    g.update(STEP);
    expect(g.human.x).toBeCloseTo(x0 + HUMAN_SPEED * STEP, 8);
  });
});

describe('catching and VIRUS (BR3.x, BR4.x, BR2.2, BR2.6)', () => {
  it('scores a collectible, counts progress and emits a catch event', () => {
    const g = playing();
    drop(g, 'mainframe');
    expect(g.score).toBe(POINTS.mainframe);
    expect(g.caught).toBe(1);
    const events = g.drainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: 'catch', kind: 'mainframe', points: POINTS.mainframe });
  });

  it('scores a kind outside the stage but adds no progress', () => {
    const g = playing();
    drop(g, 'tape');
    expect(g.score).toBe(POINTS.tape);
    expect(g.caught).toBe(0);
  });

  it('a VIRUS costs a life, emits virus-hit then life-lost, and leaves the score alone', () => {
    const g = playing();
    drop(g, 'mainframe');
    g.drainEvents();
    drop(g, 'virus');
    expect(g.lives).toBe(START_LIVES - 1);
    expect(g.score).toBe(POINTS.mainframe);
    expect(g.drainEvents().map((e) => e.type)).toEqual(['virus-hit', 'life-lost']);
  });

  it('handles the VIRUS and drops both when a collectible is touched in the same update', () => {
    const g = playing();
    const m = createObject('mainframe', g.human.x, 1);
    const v = createObject('virus', g.human.x, 2);
    m.y = v.y = g.human.y - 4;
    g.objects.push(m, v);
    g.update(0.001);
    expect(g.lives).toBe(START_LIVES - 1);
    expect(g.score).toBe(0);
    expect(g.objects).toHaveLength(0);
    expect(g.drainEvents().map((e) => e.type)).toEqual(['virus-hit', 'life-lost']);
  });

  it('removes a missed object with no penalty', () => {
    const g = playing();
    const o = createObject('mainframe', 0, 1);
    o.y = PLAY_H - 1;
    g.objects.push(o);
    g.update(0.1);
    expect(g.objects).toHaveLength(0);
    expect(g.score).toBe(0);
    expect(g.lives).toBe(START_LIVES);
    expect(g.caught).toBe(0);
  });
});

describe('spawning (BR6.1)', () => {
  it('never holds more than the stage maximum on screen', () => {
    const g = playing();
    const max = STAGES[0]!.difficultyStart.maxObjects;
    let peak = 0;
    // Small steps: Stage 1 collectibles fall 1.2x faster, so coarse steps drop them before a third spawns.
    for (let i = 0; i < 15; i++) {
      g.update(0.4);
      peak = Math.max(peak, g.objects.length);
      expect(g.objects.length).toBeLessThanOrEqual(max);
    }
    expect(peak).toBe(max);
  });

  it('spawns the first object at FIRST_SPAWN_DELAY of play, then one interval later (FR2.2)', () => {
    const g = playing();
    const interval = STAGES[0]!.difficultyStart.spawnInterval;
    run(g, FIRST_SPAWN_DELAY - 0.05);
    expect(g.objects).toHaveLength(0);
    run(g, 0.1);
    expect(g.objects).toHaveLength(1);
    run(g, interval - 0.15);
    expect(g.objects).toHaveLength(1);
    run(g, 0.1);
    expect(g.objects).toHaveLength(2);
  });

  it('uses the same first-spawn delay at the start of Stage 2 (FR2.2)', () => {
    const g = playing();
    clearStageAndAdvance(g);
    run(g, STAGE_INTRO_DURATION);
    expect(g.stageIndex).toBe(1);
    expect(g.objects).toHaveLength(0);
    run(g, FIRST_SPAWN_DELAY - 0.05);
    expect(g.objects).toHaveLength(0);
    run(g, 0.1);
    expect(g.objects).toHaveLength(1);
  });

  it('stays bounded and finishes with a huge dt', () => {
    const g = playing();
    g.update(1e6);
    expect(g.objects.length).toBeLessThanOrEqual(STAGES[0]!.difficultyCap.maxObjects);
    expect(['playing', 'game-over']).toContain(g.phase);
  });
});

describe('lives (FR4.1, FR5.1)', () => {
  it('a new run has exactly 3 lives', () => {
    expect(START_LIVES).toBe(3);
    expect(playing().lives).toBe(3);
  });

  it('two VIRUS contacts in a row each cost exactly one life (no invulnerability)', () => {
    const g = playing();
    drop(g, 'virus');
    expect(g.lives).toBe(2);
    drop(g, 'virus');
    expect(g.lives).toBe(1);
  });
});

describe('stage clear (BR2.3-BR2.5, BR1.5, BR1.8)', () => {
  it('clears the stage on the last catch: objects removed, +500, AI +25, catch before stage-clear', () => {
    const g = playing();
    const stage = g.stage;
    for (let i = 0; i < stage.requiredCount - 1; i++) drop(g, 'mainframe');
    g.drainEvents();
    const far = createObject('virus', 0, 5000);
    g.objects.push(far);
    drop(g, 'mainframe');
    expect(g.phase).toBe('stage-clear');
    expect(g.objects).toHaveLength(0);
    const timeBonus = Math.floor(g.timeLeft) * TIME_BONUS_PER_SECOND;
    expect(g.score).toBe(POINTS.mainframe * stage.requiredCount + stage.clearBonus + timeBonus);
    expect(g.aiRestoration).toBe(25);
    expect(g.stageIndex).toBe(0);
    expect(g.stage.name).toBe('FORTRAN');
    expect(g.caught).toBe(stage.requiredCount);
    expect(g.drainEvents().map((e) => e.type)).toEqual(['catch', 'stage-clear']);
  });

  it('carries score and lives into the next intro after 2.5 s', () => {
    const g = playing();
    drop(g, 'virus');
    g.drainEvents();
    const livesBefore = g.lives;
    for (let i = 0; i < STAGES[0]!.requiredCount; i++) drop(g, 'mainframe');
    const scoreBefore = g.score;
    g.drainEvents();
    for (let i = 0; i < 149; i++) g.update(STEP);
    expect(g.phase).toBe('stage-clear');
    g.update(STEP);
    expect(g.phase).toBe('stage-intro');
    expect(g.stageIndex).toBe(1);
    expect(g.stage.name).toBe('COBOL');
    expect(g.caught).toBe(0);
    expect(g.score).toBe(scoreBefore);
    expect(g.lives).toBe(livesBefore);
    expect(g.aiRestoration).toBe(25);
    expect(g.drainEvents()).toEqual<GameEvent[]>([{ type: 'stage-start', stageIndex: 1 }]);
  });
});

describe('victory (BR2.7, BR8.1)', () => {
  it('clearing Stage 4 goes stage-clear then victory with AI 100 and a submitted high score', () => {
    const store = fakeStore();
    const g = playing(store);
    for (let s = 0; s < 3; s++) {
      clearStageAndAdvance(g);
      expect(g.phase).toBe('stage-intro');
      run(g, STAGE_INTRO_DURATION);
      expect(g.phase).toBe('playing');
    }
    expect(g.stageIndex).toBe(3);
    g.drainEvents();
    for (let i = 0; i < STAGES[3]!.requiredCount; i++) drop(g, i % 3 === 0 ? 'llm' : i % 3 === 1 ? 'gpu' : 'robot');
    expect(g.phase).toBe('stage-clear');
    expect(g.aiRestoration).toBe(100);
    g.drainEvents();
    run(g, STAGE_CLEAR_DURATION);
    expect(g.phase).toBe('victory');
    expect(g.aiRestoration).toBe(100);
    expect(g.newHighScore).toBe(true);
    expect(store.submitted).toHaveLength(1);
    const events = g.drainEvents();
    expect(events).toEqual<GameEvent[]>([{ type: 'victory', score: g.score, newHighScore: true }]);
  });

  it('returns to the title only after 3.5 s on a new press', () => {
    const g = playing(fakeStore());
    for (let s = 0; s < 3; s++) {
      clearStageAndAdvance(g);
      run(g, STAGE_INTRO_DURATION);
    }
    for (let i = 0; i < STAGES[3]!.requiredCount; i++) drop(g, 'llm');
    run(g, STAGE_CLEAR_DURATION);
    expect(g.phase).toBe('victory');
    g.pressStart();
    expect(g.phase).toBe('victory');
    run(g, VICTORY_DURATION - 0.1);
    expect(g.canReturnToTitle).toBe(false);
    run(g, 0.2);
    expect(g.canReturnToTitle).toBe(true);
    g.inputDown('key:Enter', null);
    g.pressStart();
    expect(g.phase).toBe('title');
    expect(g.aiRestoration).toBe(0);
    expect(g.stageIndex).toBe(0);
    expect(g.score).toBe(0);
  });
});

describe('game over (BR4.3, BR1.6, BR1.9, BR8.1)', () => {
  it('ends on the last life with the event order, a submitted score and kept run values', () => {
    const store = fakeStore();
    const g = playing(store);
    drop(g, 'mainframe');
    g.drainEvents();
    loseAllLives(g);
    expect(g.phase).toBe('game-over');
    expect(g.lives).toBe(0);
    expect(g.objects).toHaveLength(0);
    expect(g.caught).toBe(1);
    expect(g.stageIndex).toBe(0);
    expect(g.newHighScore).toBe(true);
    expect(store.submitted).toEqual([POINTS.mainframe]);
    expect(g.drainEvents().map((e) => e.type)).toEqual([
      'virus-hit',
      'life-lost',
      'virus-hit',
      'life-lost',
      'virus-hit',
      'life-lost',
      'game-over',
    ]);
  });

  it('allows returning to the title only after 2.0 s', () => {
    const g = playing();
    loseAllLives(g);
    g.pressStart();
    expect(g.phase).toBe('game-over');
    for (let i = 0; i < 119; i++) g.update(STEP);
    expect(g.canReturnToTitle).toBe(false);
    g.update(STEP);
    expect(g.canReturnToTitle).toBe(true);
    expect(g.phaseTime).toBeGreaterThanOrEqual(GAME_OVER_DURATION - 1e-9);
  });

  it('does not treat a key held from play as a new press', () => {
    const g = playing();
    g.inputDown('key:Enter', null);
    loseAllLives(g);
    run(g, GAME_OVER_DURATION + 0.1);
    g.inputDown('key:Enter', null);
    expect(g.phase).toBe('game-over');
    g.inputUp('key:Enter');
    g.inputDown('key:Enter', null);
    expect(g.phase).toBe('title');
  });

  it('Enter (inputDown then pressStart) on game over reaches only the title; a later press starts a run', () => {
    const g = playing();
    loseAllLives(g);
    run(g, GAME_OVER_DURATION + 0.1);
    g.drainEvents();
    g.inputDown('key:Enter', null);
    g.pressStart();
    expect(g.phase).toBe('title');
    expect(g.drainEvents()).toEqual([]);
    g.update(STEP);
    g.inputUp('key:Enter');
    g.inputDown('key:Enter', null);
    g.pressStart();
    expect(g.phase).toBe('stage-intro');
    expect(g.score).toBe(0);
    expect(g.lives).toBe(START_LIVES);
  });
});

/** Runs `seconds` of 1/60 s steps and returns every event raised on the way. */
function runCollect(g: GameState, seconds: number): GameEvent[] {
  const all: GameEvent[] = [];
  const steps = Math.round(seconds * 60);
  for (let i = 0; i < steps; i++) {
    g.update(STEP);
    all.push(...g.drainEvents());
  }
  return all;
}

describe('stage timer (FR3.x)', () => {
  it('starts at the time limit and counts play time only (FR3.1, FR3.2, FR3.6)', () => {
    const g = newGame();
    g.pressStart();
    expect(g.timeLeft).toBe(STAGE_TIME_LIMIT);
    run(g, STAGE_INTRO_DURATION - 0.5);
    expect(g.timeLeft).toBe(STAGE_TIME_LIMIT);
    run(g, 0.5);
    expect(g.phase).toBe('playing');
    expect(g.timeLeft).toBe(STAGE_TIME_LIMIT);
    run(g, 10);
    expect(g.timeLeft).toBeCloseTo(STAGE_TIME_LIMIT - 10, 6);
  });

  it('stops during stage-clear and starts over in the next stage (FR3.2, FR3.3)', () => {
    const g = playing();
    run(g, 5);
    for (let i = 0; i < g.stage.requiredCount; i++) drop(g, 'mainframe');
    expect(g.phase).toBe('stage-clear');
    const frozen = g.timeLeft;
    expect(frozen).toBeCloseTo(STAGE_TIME_LIMIT - 5, 1);
    run(g, 1);
    expect(g.timeLeft).toBe(frozen);
    run(g, STAGE_CLEAR_DURATION - 1);
    expect(g.phase).toBe('stage-intro');
    expect(g.timeLeft).toBe(STAGE_TIME_LIMIT);
  });

  it('ends the run with reason time and lives left when the time is up (FR3.4, FR5.1)', () => {
    const g = playing();
    run(g, STAGE_TIME_LIMIT - 1);
    expect(g.phase).toBe('playing');
    expect(g.gameOverReason).toBeNull();
    const events = runCollect(g, 1.2);
    expect(g.phase).toBe('game-over');
    expect(g.lives).toBe(START_LIVES);
    expect(g.timeLeft).toBe(0);
    expect(g.gameOverReason).toBe('time');
    expect(events.filter((e) => e.type === 'game-over')).toEqual([
      { type: 'game-over', score: 0, newHighScore: false, reason: 'time' },
    ]);
  });

  it('lets a clearing catch win a tie with the time-out (FR3.5)', () => {
    const g = playing();
    run(g, STAGE_TIME_LIMIT - 0.01);
    for (let i = 0; i < g.stage.requiredCount - 1; i++) drop(g, 'mainframe');
    expect(g.phase).toBe('playing');
    g.drainEvents();
    const last = createObject('mainframe', g.human.x, order++);
    last.y = g.human.y - 4;
    g.objects.push(last);
    g.update(0.01);
    expect(g.phase).toBe('stage-clear');
    const types = g.drainEvents().map((e) => e.type);
    expect(types).toContain('stage-clear');
    expect(types).not.toContain('game-over');
  });

  it('reports reason lives when the last life is lost (FR5.1)', () => {
    const g = playing();
    expect(g.gameOverReason).toBeNull();
    loseAllLives(g);
    expect(g.gameOverReason).toBe('lives');
    const over = g.drainEvents().find((e) => e.type === 'game-over');
    expect(over).toMatchObject({ type: 'game-over', reason: 'lives' });
  });

  it('raises time-warning once each for 10 down to 1 (FR4.3)', () => {
    const g = playing();
    run(g, STAGE_TIME_LIMIT - 12);
    g.drainEvents();
    const warnings = runCollect(g, 13).filter((e) => e.type === 'time-warning');
    expect(warnings).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => ({ type: 'time-warning', secondsLeft: n })));
  });

  it('adds floor(timeLeft) x 10 at a clear and reports it in the event (FR6.1)', () => {
    const g = playing();
    run(g, 10);
    for (let i = 0; i < g.stage.requiredCount - 1; i++) drop(g, 'mainframe');
    g.drainEvents();
    const before = g.score;
    drop(g, 'mainframe');
    const expectedBonus = Math.floor(g.timeLeft) * TIME_BONUS_PER_SECOND;
    expect(expectedBonus).toBe(790);
    expect(g.score).toBe(before + POINTS.mainframe + g.stage.clearBonus + expectedBonus);
    const clear = g.drainEvents().find((e) => e.type === 'stage-clear');
    expect(clear).toMatchObject({ type: 'stage-clear', timeBonus: expectedBonus });
  });
});

describe('input control (BR7.4, BR1.7, BR9.2)', () => {
  it('releaseAll clears held directions', () => {
    const g = playing();
    const x0 = g.human.x;
    g.inputDown('key:ArrowLeft', -1);
    g.releaseAll();
    g.update(STEP);
    expect(g.human.x).toBe(x0);
  });

  it('keeps HUMAN inside the play area', () => {
    const g = playing();
    g.inputDown('key:ArrowLeft', -1);
    run(g, 5);
    expect(g.human.x).toBe(0);
    g.inputUp('key:ArrowLeft');
    g.inputDown('key:ArrowRight', 1);
    run(g, 5);
    expect(g.human.x + g.human.w).toBe(PLAY_W);
  });

  it('ignores invalid dt and unknown inputUp without throwing', () => {
    const g = playing();
    const t = g.phaseTime;
    expect(() => {
      g.update(Number.NaN);
      g.update(-1);
      g.update(0);
      g.update(Number.POSITIVE_INFINITY);
      g.inputUp('nope');
    }).not.toThrow();
    expect(g.phaseTime).toBe(t);
  });

  it('view returns the same object typed as GameView', () => {
    const g = newGame();
    const v: GameView = g.view;
    expect(v).toBe(g);
  });

  it('has best 0 and no high-score flag when no store is injected', () => {
    const g = playing();
    expect(g.best).toBe(0);
    loseAllLives(g);
    expect(g.newHighScore).toBe(false);
  });
});

describe('long simulated run (value ranges)', () => {
  it('keeps every value in range over 20000 steps with random input', () => {
    let seed = 12345;
    const lcg = (): number => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const g = new GameState({ random: lcg, highScore: fakeStore() });
    let held = false;
    for (let i = 0; i < 20000; i++) {
      if (i % 45 === 0) {
        if (held) g.inputUp('k');
        g.inputDown('k', lcg() < 0.5 ? -1 : 1);
        held = true;
      }
      if (g.phase === 'title' || g.canReturnToTitle) g.pressStart();
      g.update(STEP);
      g.drainEvents();
      expect(g.score).toBeGreaterThanOrEqual(0);
      expect(g.lives).toBeGreaterThanOrEqual(0);
      expect(g.lives).toBeLessThanOrEqual(START_LIVES);
      expect([0, 25, 50, 75, 100]).toContain(g.aiRestoration);
      expect(g.caught).toBeLessThanOrEqual(g.stage.requiredCount);
      expect(g.human.x).toBeGreaterThanOrEqual(0);
      expect(g.human.x + g.human.w).toBeLessThanOrEqual(PLAY_W);
      expect(g.objects.length).toBeLessThanOrEqual(6);
    }
  });
});
