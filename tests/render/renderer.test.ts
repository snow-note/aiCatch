import { describe, expect, it } from 'vitest';
import { OBJECT_H, OBJECT_W, STAGES } from '../../src/game/config';
import type { GameEvent, GameView, ObjectKind, Phase } from '../../src/game/types';
import { Renderer } from '../../src/render/renderer';

/** Hand-written fake 2D context: records calls, draws nothing. */
class FakeCtx {
  fillStyle = '';
  globalAlpha = 1;
  imageSmoothingEnabled = true;
  fillRectCalls = 0;
  drawImageCalls = 0;
  fillRect(): void {
    this.fillRectCalls++;
  }
  clearRect(): void {}
  save(): void {}
  restore(): void {}
  translate(): void {}
  drawImage(): void {
    this.drawImageCalls++;
  }
  getImageData(): unknown {
    return { data: new Uint8ClampedArray(4) };
  }
  putImageData(): void {}
}

function makeRenderer(): { renderer: Renderer; ctx: FakeCtx } {
  const ctx = new FakeCtx();
  const canvas = { getContext: () => ctx } as unknown as HTMLCanvasElement;
  return { renderer: new Renderer(canvas), ctx };
}

const stageAt = (i: number) => STAGES[i] ?? STAGES[0]!;

function view(phase: Phase, over: Partial<GameView> = {}): GameView {
  const stageIndex = over.stageIndex ?? 0;
  return {
    phase,
    phaseTime: 0,
    canReturnToTitle: false,
    score: 1234,
    lives: 3,
    best: 5000,
    newHighScore: false,
    stage: stageAt(stageIndex),
    stageIndex,
    caught: 2,
    aiRestoration: 25,
    timeLeft: 90,
    gameOverReason: null,
    human: { x: 100, y: 130, w: 16, h: 14 },
    objects: [],
    ...over,
  };
}

const KINDS: ObjectKind[] = ['mainframe', 'tape', 'floppy', 'llm', 'gpu', 'robot', 'virus'];

function drawAndCheck(v: GameView, now = 1): FakeCtx {
  const { renderer, ctx } = makeRenderer();
  expect(() => renderer.draw(v, now)).not.toThrow();
  expect(ctx.fillRectCalls).toBeGreaterThan(0);
  return ctx;
}

describe('Renderer constructor', () => {
  it('turns image smoothing off', () => {
    const { ctx } = makeRenderer();
    expect(ctx.imageSmoothingEnabled).toBe(false);
  });
});

describe('Renderer.draw per phase', () => {
  it('draws the title screen in both blink states', () => {
    drawAndCheck(view('title', { phaseTime: 0 }));
    drawAndCheck(view('title', { phaseTime: 0.6 }));
  });

  it('draws the stage intro for Stage 1 and Stage 4', () => {
    drawAndCheck(view('stage-intro', { stageIndex: 0 }));
    drawAndCheck(view('stage-intro', { stageIndex: 3, aiRestoration: 75 }));
  });

  it('draws playing with every object kind and 1 or 3 lives', () => {
    const objects = KINDS.map((kind, i) => ({ kind, x: 10 + i * 20, y: 30 + i * 5, w: OBJECT_W, h: OBJECT_H }));
    drawAndCheck(view('playing', { objects, lives: 3 }));
    drawAndCheck(view('playing', { objects, lives: 1 }));
  });

  it('falls back to a sprite for an unknown object kind', () => {
    const objects = [{ kind: 'bogus' as unknown as ObjectKind, x: 5, y: 40, w: OBJECT_W, h: OBJECT_H }];
    drawAndCheck(view('playing', { objects }));
  });

  it('draws the HUD timer in both blink states and at zero (FR4.1, FR4.2)', () => {
    const ctx = drawAndCheck(view('playing', { timeLeft: 90 }));
    drawAndCheck(view('playing', { timeLeft: 8, phaseTime: 0.2 }));
    const off = drawAndCheck(view('playing', { timeLeft: 8, phaseTime: 0.7 }));
    drawAndCheck(view('playing', { timeLeft: 0 }));
    // The blink-off frame skips the timer text, so it draws fewer rectangles.
    expect(off.fillRectCalls).toBeLessThan(ctx.fillRectCalls);
  });

  it('draws TIME UP on a time-out game over only (FR5.2)', () => {
    const lives = drawAndCheck(view('game-over', { gameOverReason: 'lives' }));
    const time = drawAndCheck(view('game-over', { gameOverReason: 'time' }));
    expect(time.fillRectCalls).toBeGreaterThan(lives.fillRectCalls);
  });

  it('draws stage clear at 0 s and 1 s', () => {
    drawAndCheck(view('stage-clear', { phaseTime: 0 }));
    drawAndCheck(view('stage-clear', { phaseTime: 1, aiRestoration: 50, stageIndex: 1 }));
  });

  it('draws game over with and without a new high score, before and after return is allowed', () => {
    for (const newHighScore of [false, true]) {
      for (const canReturnToTitle of [false, true]) {
        drawAndCheck(view('game-over', { newHighScore, canReturnToTitle, phaseTime: 0.1 }));
        drawAndCheck(view('game-over', { newHighScore, canReturnToTitle, phaseTime: 0.6 }));
      }
    }
  });

  it.each([0.5, 2.0, 3.0, 4.0])('draws victory at %s s', (phaseTime) => {
    drawAndCheck(view('victory', { phaseTime, stageIndex: 3, aiRestoration: 100 }));
  });

  it('draws the victory hold with new high score and return prompt in both blink states', () => {
    for (const phaseTime of [4.0, 4.6]) {
      drawAndCheck(
        view('victory', { phaseTime, stageIndex: 3, aiRestoration: 100, newHighScore: true, canReturnToTitle: true }),
      );
    }
  });

  it('survives non-finite numbers in the view', () => {
    drawAndCheck(view('stage-clear', { aiRestoration: Number.NaN, score: Number.NaN, phaseTime: 2 }));
    drawAndCheck(view('game-over', { aiRestoration: 500, score: 99999999 }));
  });
});

describe('Renderer effects', () => {
  const playing = view('playing', {
    objects: [{ kind: 'mainframe', x: 20, y: 50, w: OBJECT_W, h: OBJECT_H }],
  });

  it('draws catch popup, spark and flash, then ages them out', () => {
    const { renderer, ctx } = makeRenderer();
    const e: GameEvent = { type: 'catch', kind: 'mainframe', points: 100, x: 300, y: 5 };
    renderer.onEvent(e);
    expect(() => renderer.draw(playing, 1)).not.toThrow();
    const active = ctx.fillRectCalls;
    renderer.update(0.1);
    renderer.draw(playing, 1.1);
    expect(ctx.fillRectCalls).toBeGreaterThan(active);

    renderer.update(5);
    const before = ctx.fillRectCalls;
    renderer.draw(playing, 7);
    const plain = ctx.fillRectCalls - before;
    const { renderer: fresh, ctx: freshCtx } = makeRenderer();
    fresh.draw(playing, 7);
    expect(plain).toBe(freshCtx.fillRectCalls);
  });

  it('draws the glitch on virus-hit, in playing and game over, and it expires', () => {
    const { renderer, ctx } = makeRenderer();
    renderer.onEvent({ type: 'virus-hit', x: 10, y: 10 });
    renderer.draw(playing, 1);
    renderer.draw(view('game-over'), 1);
    expect(ctx.drawImageCalls).toBeGreaterThan(0);

    renderer.update(1);
    const calls = ctx.drawImageCalls;
    renderer.draw(playing, 2);
    expect(ctx.drawImageCalls).toBe(calls);
  });

  it('draws the warning frame and blinking life after life-lost', () => {
    const { renderer, ctx } = makeRenderer();
    const base = makeRenderer();
    base.renderer.draw(view('playing', { lives: 2 }), 0);
    renderer.onEvent({ type: 'life-lost', lives: 2 });
    renderer.draw(view('playing', { lives: 2 }), 0);
    expect(ctx.fillRectCalls).not.toBe(base.ctx.fillRectCalls);
    renderer.update(0.05);
    expect(() => renderer.draw(view('playing', { lives: 1 }), 0.1)).not.toThrow();
  });

  it('ignores stage-clear events', () => {
    const { renderer, ctx } = makeRenderer();
    renderer.onEvent({ type: 'stage-clear', stageIndex: 0, bonus: 500, timeBonus: 0, aiRestoration: 25 });
    renderer.draw(playing, 1);
    const { renderer: fresh, ctx: freshCtx } = makeRenderer();
    fresh.draw(playing, 1);
    expect(ctx.fillRectCalls).toBe(freshCtx.fillRectCalls);
  });

  it('clears every effect on run-start', () => {
    const { renderer, ctx } = makeRenderer();
    renderer.onEvent({ type: 'catch', kind: 'tape', points: 100, x: 50, y: 50 });
    renderer.onEvent({ type: 'virus-hit', x: 1, y: 1 });
    renderer.onEvent({ type: 'life-lost', lives: 2 });
    renderer.onEvent({ type: 'run-start' });
    renderer.draw(playing, 1);
    const { renderer: fresh, ctx: freshCtx } = makeRenderer();
    fresh.draw(playing, 1);
    expect(ctx.fillRectCalls).toBe(freshCtx.fillRectCalls);
    expect(ctx.drawImageCalls).toBe(0);
  });

  it('ignores other events such as stage-start', () => {
    const { renderer } = makeRenderer();
    expect(() => renderer.onEvent({ type: 'stage-start', stageIndex: 1 })).not.toThrow();
  });
});

describe('Renderer without a 2D context (NFR5.6)', () => {
  it('draw, update and onEvent do not throw when getContext returns null', () => {
    const canvas = { getContext: () => null } as unknown as HTMLCanvasElement;
    const renderer = new Renderer(canvas);
    expect(() => {
      renderer.onEvent({ type: 'catch', kind: 'tape', points: 100, x: 1, y: 1 });
      renderer.update(0.1);
      renderer.draw(view('title'), 0);
      renderer.draw(view('playing'), 0);
    }).not.toThrow();
  });
});
