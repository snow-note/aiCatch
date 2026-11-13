import { describe, expect, it } from 'vitest';
import { SOUNDS, SoundPlayer, soundDuration, type Note } from '../../src/audio/sound';

describe('sound note lists', () => {
  it('the game-over sound ends within the 2.0 s GAME OVER sequence', () => {
    expect(soundDuration(SOUNDS['game-over'])).toBeLessThanOrEqual(2.0);
    expect(soundDuration(SOUNDS['game-over'])).toBeGreaterThan(0.5);
  });

  it('each of the three catch sounds is different', () => {
    const key = (n: readonly Note[]) => JSON.stringify(n);
    const keys = [SOUNDS['catch-llm'], SOUNDS['catch-gpu'], SOUNDS['catch-robot']].map(key);
    expect(new Set(keys).size).toBe(3);
  });

  it('every note has a positive frequency, length and non-negative start', () => {
    for (const [name, notes] of Object.entries(SOUNDS)) {
      expect(notes.length, name).toBeGreaterThan(0);
      for (const n of notes) {
        expect(n.freq, name).toBeGreaterThan(0);
        expect(n.dur, name).toBeGreaterThan(0);
        expect(n.start, name).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('soundDuration of an empty list is 0', () => {
    expect(soundDuration([])).toBe(0);
  });
});

describe('SoundPlayer', () => {
  it('does not throw when no Web Audio is available', () => {
    const p = new SoundPlayer();
    expect(() => p.play('startup')).not.toThrow(); // not unlocked yet
    expect(() => p.unlock()).not.toThrow(); // Node has no AudioContext
    expect(() => p.play('game-over')).not.toThrow();
  });
});
