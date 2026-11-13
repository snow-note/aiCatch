export type Direction = -1 | 0 | 1;

interface Held {
  id: string;
  dir: -1 | 1 | null;
}

/**
 * Tracks every held key and touch. The direction is the most recently pressed
 * left/right source that is still held (FR2.4, A5). A press of an id that is
 * already held is not new, so a key held from earlier never counts (FR1.5).
 */
export class InputTracker {
  private held: Held[] = [];

  /** Registers a press. Returns true only when it is a new press. */
  press(id: string, dir: -1 | 1 | null = null): boolean {
    if (this.held.some((h) => h.id === id)) return false;
    this.held.push({ id, dir });
    return true;
  }

  release(id: string): void {
    this.held = this.held.filter((h) => h.id !== id);
  }

  direction(): Direction {
    for (let i = this.held.length - 1; i >= 0; i--) {
      const d = (this.held[i] as Held).dir;
      if (d !== null) return d;
    }
    return 0;
  }

  clear(): void {
    this.held = [];
  }
}
