import { describe, expect, it } from 'vitest';
import { HIGH_SCORE_KEY, HighScoreStore, parseStoredScore } from '../../src/game/highscore';

function memoryStorage(initial?: string) {
  const data = new Map<string, string>();
  if (initial !== undefined) data.set(HIGH_SCORE_KEY, initial);
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  };
}

const throwing = {
  getItem: (): string | null => {
    throw new Error('storage disabled');
  },
  setItem: (): void => {
    throw new Error('storage disabled');
  },
};

describe('HighScoreStore', () => {
  it('saves a higher score and reports it as new', () => {
    const s = memoryStorage('300');
    const store = new HighScoreStore(s);
    expect(store.best).toBe(300);
    expect(store.submit(450)).toBe(true);
    expect(store.best).toBe(450);
    expect(s.data.get(HIGH_SCORE_KEY)).toBe('450');
  });

  it('does not save an equal or lower score', () => {
    const s = memoryStorage('300');
    const store = new HighScoreStore(s);
    expect(store.submit(300)).toBe(false);
    expect(store.submit(100)).toBe(false);
    expect(s.data.get(HIGH_SCORE_KEY)).toBe('300');
  });

  it('starts at 0 with nothing stored, and a first score counts as new', () => {
    const store = new HighScoreStore(memoryStorage());
    expect(store.best).toBe(0);
    expect(store.submit(0)).toBe(false);
    expect(store.submit(100)).toBe(true);
  });

  it.each(['abc', '-5', '1.5', '', '1e3', 'NaN'])('loads invalid stored value %j as 0', (raw) => {
    expect(new HighScoreStore(memoryStorage(raw)).best).toBe(0);
  });

  it('rejects invalid scores passed to submit', () => {
    const store = new HighScoreStore(memoryStorage());
    expect(store.submit(-10)).toBe(false);
    expect(store.submit(2.5)).toBe(false);
    expect(store.submit(Number.NaN)).toBe(false);
    expect(store.best).toBe(0);
  });

  it('keeps the session high score when storage throws', () => {
    const store = new HighScoreStore(throwing);
    expect(store.best).toBe(0);
    expect(store.submit(200)).toBe(true);
    expect(store.best).toBe(200);
    expect(store.submit(150)).toBe(false);
    expect(store.load()).toBe(200);
  });

  it('works with no storage at all', () => {
    const store = new HighScoreStore(null);
    expect(store.submit(50)).toBe(true);
    expect(store.best).toBe(50);
  });
});

describe('parseStoredScore', () => {
  it('parses whole numbers', () => {
    expect(parseStoredScore('1200')).toBe(1200);
    expect(parseStoredScore('0')).toBe(0);
  });

  it('returns 0 for null, huge or malformed values', () => {
    expect(parseStoredScore(null)).toBe(0);
    expect(parseStoredScore('99999999999999999999')).toBe(0);
  });
});
