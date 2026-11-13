import { describe, expect, it } from 'vitest';
import { FALL_TIME, PLAY_H, PLAY_W } from '../../src/game/config';
import { createObject, type ObjectKind } from '../../src/game/objects';
import { GameState, type HighScoreLike } from '../../src/game/state';

/** A random source that always puts new objects at the far left, away from HUMAN. */
const farLeft = () => 0;

function newGame(highScore?: HighScoreLike): GameState {
  const g = new GameState({ random: farLeft, ...(highScore ? { highScore } : {}) });
  g.pressPower();
  g.update(2.0);
  g.pressStart();
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
  drop(g, 'virus');
  drop(g, 'virus');
  drop(g, 'virus');
}

describe('power and title', () => {
  it('does nothing before POWER is pressed', () => {
    const g = new GameState({ random: farLeft });
    g.update(5);
    g.pressStart();
    g.inputDown('key:Enter');
    expect(g.phase).toBe('power-off');
    expect(g.drainEvents()).toEqual([]);
  });

  it('POWER starts the startup sequence, then the title appears', () => {
    const g = new GameState({ random: farLeft });
    g.pressPower();
    expect(g.phase).toBe('startup');
    expect(g.drainEvents()).toEqual([{ type: 'power-on' }]);
    g.update(1.0);
    expect(g.phase).toBe('startup');
    g.update(1.0);
    expect(g.phase).toBe('title');
  });

  it('ignores START during the startup sequence', () => {
    const g = new GameState({ random: farLeft });
    g.pressPower();
    g.pressStart();
    expect(g.phase).toBe('startup');
  });

  it('arrow keys and other taps do not start the game; START does', () => {
    const g = new GameState({ random: farLeft });
    g.pressPower();
    g.update(2);
    g.inputDown('key:ArrowLeft', -1);
    g.inputDown('touch:1', 1);
    g.inputDown('key:KeyQ');
    expect(g.phase).toBe('title');
    g.pressStart();
    expect(g.phase).toBe('playing');
    expect(g.drainEvents().some((e) => e.type === 'game-start')).toBe(true);
  });
});

describe('falling speeds', () => {
  it('starts each kind at its fall time for the full play height', () => {
    const times: Record<ObjectKind, number> = { llm: 4.0, gpu: 2.5, robot: 3.5, virus: 3.0 };
    for (const kind of Object.keys(times) as ObjectKind[]) {
      const o = createObject(kind, 50, 0);
      expect(PLAY_H / o.vy).toBeCloseTo(times[kind], 10);
      expect(FALL_TIME[kind]).toBe(times[kind]);
    }
  });
});

describe('playing', () => {
  it('starts with 3 lives and score 0', () => {
    const g = newGame();
    expect(g.lives).toBe(3);
    expect(g.score).toBe(0);
  });

  it('adds 100 / 150 / 200 for LLM MODEL / GPU / ROBOT', () => {
    const g = newGame();
    drop(g, 'llm');
    expect(g.score).toBe(100);
    drop(g, 'gpu');
    expect(g.score).toBe(250);
    drop(g, 'robot');
    expect(g.score).toBe(450);
    expect(g.lives).toBe(3);
  });

  it('removes a caught object right away', () => {
    const g = newGame();
    drop(g, 'llm');
    expect(g.objects).toHaveLength(0);
  });

  it('VIRUS removes one life and leaves the score', () => {
    const g = newGame();
    drop(g, 'llm');
    drop(g, 'virus');
    expect(g.lives).toBe(2);
    expect(g.score).toBe(100);
  });

  it('a second VIRUS straight after removes another life (no invulnerability)', () => {
    const g = newGame();
    drop(g, 'virus');
    drop(g, 'virus');
    expect(g.lives).toBe(1);
  });

  it('a missed rescue object changes nothing', () => {
    const g = newGame();
    const o = createObject('gpu', 0, 1);
    o.y = PLAY_H - 1;
    g.objects.push(o);
    g.update(0.5);
    expect(g.objects.includes(o)).toBe(false);
    expect(g.score).toBe(0);
    expect(g.lives).toBe(3);
  });

  it('handles only one object per update, VIRUS first', () => {
    const g = newGame();
    const a = createObject('llm', g.human.x, 1);
    const b = createObject('virus', g.human.x, 2);
    a.y = b.y = g.human.y - 4;
    g.objects.push(a, b);
    g.update(0.001);
    expect(g.lives).toBe(2);
    expect(g.score).toBe(0);
    expect(g.objects).toHaveLength(0);
  });

  it('moves HUMAN and stops at both edges', () => {
    const g = newGame();
    g.inputDown('key:ArrowLeft', -1);
    g.update(10);
    expect(g.human.x).toBe(0);
    g.inputUp('key:ArrowLeft');
    g.inputDown('key:ArrowRight', 1);
    g.update(10);
    expect(g.human.x).toBe(PLAY_W - g.human.w);
  });

  it('has no time limit', () => {
    const g = newGame();
    for (let i = 0; i < 6000; i++) g.update(0.05);
    expect(g.phase).toBe('playing');
    expect(g.lives).toBe(3);
  });
});

describe('game over and restart', () => {
  it('ends the game at 0 lives and reports the event', () => {
    const g = newGame();
    g.drainEvents();
    loseAllLives(g);
    expect(g.phase).toBe('game-over');
    expect(g.drainEvents().some((e) => e.type === 'game-over')).toBe(true);
  });

  it('ignores a press at 1.9 s and restarts at 2.0 s with 3 lives and score 0', () => {
    const g = newGame();
    drop(g, 'llm');
    loseAllLives(g);
    g.update(1.9);
    g.inputDown('key:Space');
    g.pressStart();
    expect(g.phase).toBe('game-over');
    g.inputUp('key:Space');
    g.update(0.1);
    expect(g.canRestart).toBe(true);
    g.inputDown('touch:9');
    expect(g.phase).toBe('playing');
    expect(g.lives).toBe(3);
    expect(g.score).toBe(0);
    expect(g.objects).toHaveLength(0);
  });

  it('a direction-less mouse press is ignored at 1.9 s and restarts at 2.0 s', () => {
    const g = newGame();
    drop(g, 'llm');
    loseAllLives(g);
    g.update(1.9);
    g.inputDown('mouse:1', null);
    expect(g.phase).toBe('game-over');
    g.inputUp('mouse:1');
    g.update(0.1);
    expect(g.canRestart).toBe(true);
    g.inputDown('mouse:2', null);
    expect(g.phase).toBe('playing');
    expect(g.lives).toBe(3);
    expect(g.score).toBe(0);
  });

  it('a direction-less mouse press does not start a game from the title', () => {
    const g = new GameState({ random: farLeft });
    g.pressPower();
    g.update(2);
    expect(g.phase).toBe('title');
    g.inputDown('mouse:1', null);
    g.update(0.5);
    expect(g.phase).toBe('title');
  });

  it('a direction-less mouse press does not move HUMAN during play', () => {
    const g = newGame();
    const x = g.human.x;
    g.inputDown('mouse:1', null);
    g.update(1);
    expect(g.phase).toBe('playing');
    expect(g.human.x).toBe(x);
  });

  it('a key held from play does not restart until released and pressed again', () => {
    const g = newGame();
    g.inputDown('key:ArrowLeft', -1);
    loseAllLives(g);
    g.update(2.5);
    g.inputDown('key:ArrowLeft', -1); // auto-repeat of the held key
    expect(g.phase).toBe('game-over');
    g.inputUp('key:ArrowLeft');
    g.inputDown('key:ArrowLeft', -1);
    expect(g.phase).toBe('playing');
  });

  it('saves a new high score and flags it on the game-over screen', () => {
    let best = 50;
    const store: HighScoreLike = {
      get best() {
        return best;
      },
      submit(score: number) {
        if (score > best) {
          best = score;
          return true;
        }
        return false;
      },
    };
    const g = newGame(store);
    drop(g, 'robot');
    loseAllLives(g);
    expect(g.newHighScore).toBe(true);
    expect(g.best).toBe(200);
  });

  it('does not flag a score that does not beat the high score', () => {
    const store: HighScoreLike = { best: 9999, submit: () => false };
    const g = newGame(store);
    drop(g, 'llm');
    loseAllLives(g);
    expect(g.newHighScore).toBe(false);
  });
});
