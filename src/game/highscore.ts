/** The slice of the Web Storage API that the high-score store needs. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const HIGH_SCORE_KEY = 'ai-catch:high-score';

/** Parses a stored value; anything that is not a non-negative whole number is 0 (FR6.6). */
export function parseStoredScore(raw: string | null | undefined): number {
  if (typeof raw !== 'string' || !/^\d+$/.test(raw.trim())) return 0;
  const n = Number(raw.trim());
  return Number.isSafeInteger(n) ? n : 0;
}

/**
 * High score over a storage object. If storage throws (private browsing, disabled),
 * the best score is kept in memory for the session and no error is shown (FR6.6).
 */
export class HighScoreStore {
  private value = 0;

  constructor(
    private readonly storage: StorageLike | null,
    private readonly key: string = HIGH_SCORE_KEY,
  ) {
    this.value = this.load();
  }

  /** Reads the stored high score, or 0 when it is missing, invalid or unreadable. */
  load(): number {
    try {
      const stored = this.storage ? parseStoredScore(this.storage.getItem(this.key)) : 0;
      this.value = Math.max(this.value, stored);
    } catch {
      // keep the in-memory value
    }
    return this.value;
  }

  get best(): number {
    return this.value;
  }

  /** Returns true when `score` is a new high score; saves it only then (FR6.3, FR6.5). */
  submit(score: number): boolean {
    if (!Number.isSafeInteger(score) || score < 0 || score <= this.value) return false;
    this.value = score;
    try {
      this.storage?.setItem(this.key, String(score));
    } catch {
      // storage unavailable: the session keeps the score in memory
    }
    return true;
  }
}
