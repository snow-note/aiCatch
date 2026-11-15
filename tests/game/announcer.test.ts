import { describe, expect, it } from 'vitest';
import { STAGES } from '../../src/game/config';
import { screenAnnouncement } from '../../src/game/announcer';
import type { GameView, Phase } from '../../src/game/types';

/** Build a literal GameView for one stage; overrides replace any field (FR13.2). */
function makeView(phase: Phase, stageIndex: number, over: Partial<GameView> = {}): GameView {
  return {
    phase,
    phaseTime: 0,
    canReturnToTitle: false,
    score: 0,
    lives: 3,
    best: 0,
    newHighScore: false,
    stage: STAGES[stageIndex]!,
    stageIndex,
    caught: 0,
    aiRestoration: stageIndex * 25,
    timeLeft: 90,
    gameOverReason: null,
    human: { x: 0, y: 0, w: 20, h: 20 },
    objects: [],
    ...over,
  };
}

describe('screenAnnouncement text', () => {
  it('announces the title with the high score (BR1.2)', () => {
    expect(screenAnnouncement(makeView('title', 0, { best: 1200 })).text).toBe(
      'AI CATCH. Press Start. Arrow keys to move. High score 1200.',
    );
  });

  it('announces the title with no high score yet (BR1.2)', () => {
    expect(screenAnnouncement(makeView('title', 0, { best: 0 })).text).toBe(
      'AI CATCH. Press Start. Arrow keys to move. High score 0.',
    );
  });

  it('announces each stage intro with its item names (BR1.2, BR1.3)', () => {
    const texts = [0, 1, 2, 3].map((i) => screenAnnouncement(makeView('stage-intro', i)).text);
    expect(texts[0]).toBe('Stage 1, FORTRAN. Collect 10 mainframes. Avoid virus. AI 0%.');
    expect(texts[1]).toBe('Stage 2, COBOL. Collect 12 magnetic tapes. Avoid virus. AI 25%.');
    expect(texts[2]).toBe('Stage 3, BASIC. Collect 14 floppy disks. Avoid virus. AI 50%.');
    expect(texts[3]).toBe('Stage 4, LLM. Collect 16 LLM, GPU, and robot parts. Avoid virus. AI 75%.');
  });

  it('announces playing progress (BR1.2, BR1.4)', () => {
    const v = makeView('playing', 0, { score: 300, caught: 3, lives: 3 });
    expect(screenAnnouncement(v).text).toBe('Stage 1 FORTRAN, AI 0%, score 300, 3 of 10, 3 lives');
  });

  it('uses "1 life" in the singular (BR1.4)', () => {
    const v = makeView('playing', 0, { lives: 1 });
    expect(screenAnnouncement(v).text).toMatch(/, 1 life$/);
  });

  it('uses "0 lives" for a defensive view (BR1.4)', () => {
    const v = makeView('playing', 0, { lives: 0 });
    expect(screenAnnouncement(v).text).toMatch(/, 0 lives$/);
  });

  it('announces stage clear with the raised AI value (BR1.2)', () => {
    const v = makeView('stage-clear', 0, { aiRestoration: 25 });
    expect(screenAnnouncement(v).text).toBe('FORTRAN recovered. AI 25%.');
  });

  it('announces game over, with the suffix only for a new high score (BR1.2, BR1.5)', () => {
    const plain = makeView('game-over', 1, { score: 800, best: 1200, aiRestoration: 25 });
    expect(screenAnnouncement(plain).text).toBe('Game over. AI 25%. Score 800. High score 1200.');
    const fresh = makeView('game-over', 1, { score: 800, best: 800, newHighScore: true, aiRestoration: 25 });
    expect(screenAnnouncement(fresh).text).toBe(
      'Game over. AI 25%. Score 800. High score 800. New high score.',
    );
  });

  it('starts a time-out game over with "Time up." and leaves a lives game over unchanged (FR5.3)', () => {
    const time = makeView('game-over', 1, { score: 800, best: 1200, aiRestoration: 25, gameOverReason: 'time' });
    expect(screenAnnouncement(time).text).toBe('Time up. Game over. AI 25%. Score 800. High score 1200.');
    const lives = makeView('game-over', 1, { score: 800, best: 1200, aiRestoration: 25, gameOverReason: 'lives' });
    expect(screenAnnouncement(lives).text).toBe('Game over. AI 25%. Score 800. High score 1200.');
  });

  it('announces victory, with the suffix only for a new high score (BR1.2, BR1.5)', () => {
    const base = 'AI restored, 100%. Humans saved AI. Save the AI, save the future. Score 4000.';
    const plain = makeView('victory', 3, { score: 4000, best: 5000, aiRestoration: 100 });
    expect(screenAnnouncement(plain).text).toBe(base);
    const fresh = makeView('victory', 3, { score: 4000, best: 4000, newHighScore: true, aiRestoration: 100 });
    expect(screenAnnouncement(fresh).text).toBe(`${base} New high score.`);
  });

  it('gives equal results for the same view (BR1.1)', () => {
    const v = makeView('playing', 2, { score: 500, caught: 4 });
    expect(screenAnnouncement(v)).toEqual(screenAnnouncement(v));
  });
});

describe('screenAnnouncement key', () => {
  it('uses phase and stage number, plus lives only while playing (BR2.1)', () => {
    expect(screenAnnouncement(makeView('title', 0)).key).toBe('title:1');
    expect(screenAnnouncement(makeView('stage-intro', 3)).key).toBe('stage-intro:4');
    expect(screenAnnouncement(makeView('playing', 0, { lives: 3 })).key).toBe('playing:1:3');
  });

  it('keeps the key when only score and caught change while playing (BR1.6)', () => {
    const a = screenAnnouncement(makeView('playing', 0, { score: 0, caught: 0 }));
    const b = screenAnnouncement(makeView('playing', 0, { score: 300, caught: 3 }));
    expect(a.key).toBe(b.key);
  });

  it('changes the key when lives change (BR1.6)', () => {
    const a = screenAnnouncement(makeView('playing', 0, { lives: 3 }));
    const b = screenAnnouncement(makeView('playing', 0, { lives: 2 }));
    expect(a.key).not.toBe(b.key);
  });

  it('keeps the key when only phaseTime or canReturnToTitle change', () => {
    for (const phase of ['game-over', 'victory'] as const) {
      const a = screenAnnouncement(makeView(phase, 3, { phaseTime: 0.1, canReturnToTitle: false }));
      const b = screenAnnouncement(makeView(phase, 3, { phaseTime: 9, canReturnToTitle: true }));
      expect(a.key).toBe(b.key);
    }
  });

  it('changes the key between different phases and stages', () => {
    const keys = new Set([
      screenAnnouncement(makeView('stage-intro', 0)).key,
      screenAnnouncement(makeView('stage-intro', 1)).key,
      screenAnnouncement(makeView('stage-clear', 0)).key,
    ]);
    expect(keys.size).toBe(3);
  });
});
