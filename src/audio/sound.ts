/**
 * Sounds are note lists played with square-wave oscillators. No audio files are
 * shipped, so there is nothing to license or download (FR8, NFR5).
 */

export interface Note {
  /** Frequency in Hz. */
  freq: number;
  /** Start time in seconds from the start of the sound. */
  start: number;
  /** Length in seconds. */
  dur: number;
  /** Optional frequency the note slides to. */
  slideTo?: number;
}

export type SoundName =
  | 'startup'
  | 'game-start'
  | 'catch-llm'
  | 'catch-gpu'
  | 'catch-robot'
  | 'virus-hit'
  | 'game-over';

export const SOUNDS: Readonly<Record<SoundName, readonly Note[]>> = {
  startup: [
    { freq: 262, start: 0.0, dur: 0.12 },
    { freq: 330, start: 0.14, dur: 0.12 },
    { freq: 392, start: 0.28, dur: 0.12 },
    { freq: 523, start: 0.42, dur: 0.12 },
    { freq: 392, start: 0.56, dur: 0.12 },
    { freq: 523, start: 0.7, dur: 0.12 },
    { freq: 784, start: 0.86, dur: 0.4 },
  ],
  'game-start': [
    { freq: 440, start: 0.0, dur: 0.08 },
    { freq: 660, start: 0.1, dur: 0.08 },
    { freq: 880, start: 0.2, dur: 0.16 },
  ],
  'catch-llm': [
    { freq: 660, start: 0.0, dur: 0.06 },
    { freq: 880, start: 0.07, dur: 0.1 },
  ],
  'catch-gpu': [
    { freq: 880, start: 0.0, dur: 0.05 },
    { freq: 1109, start: 0.06, dur: 0.05 },
    { freq: 1319, start: 0.12, dur: 0.1 },
  ],
  'catch-robot': [
    { freq: 784, start: 0.0, dur: 0.05 },
    { freq: 988, start: 0.06, dur: 0.05 },
    { freq: 1319, start: 0.12, dur: 0.05 },
    { freq: 1760, start: 0.18, dur: 0.14 },
  ],
  'virus-hit': [
    { freq: 220, start: 0.0, dur: 0.1, slideTo: 90 },
    { freq: 140, start: 0.1, dur: 0.1, slideTo: 60 },
    { freq: 110, start: 0.2, dur: 0.15, slideTo: 40 },
  ],
  'game-over': [
    { freq: 523, start: 0.0, dur: 0.22 },
    { freq: 392, start: 0.28, dur: 0.22 },
    { freq: 330, start: 0.56, dur: 0.22 },
    { freq: 262, start: 0.84, dur: 0.22 },
    { freq: 196, start: 1.12, dur: 0.5, slideTo: 98 },
  ],
};

/** Total length of a note list in seconds. */
export function soundDuration(notes: readonly Note[]): number {
  return notes.reduce((end, n) => Math.max(end, n.start + n.dur), 0);
}

type AudioCtor = typeof AudioContext;

/** Plays the note lists. Created on the POWER press; every failure is swallowed (FR8.1). */
export class SoundPlayer {
  private ctx: AudioContext | null = null;

  /** Creates (or resumes) the AudioContext. Call from a user gesture. */
  unlock(): void {
    try {
      if (!this.ctx) {
        const w = globalThis as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor };
        const Ctor = w.AudioContext ?? w.webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume().catch(() => undefined);
    } catch {
      this.ctx = null;
    }
  }

  play(name: SoundName): void {
    const ctx = this.ctx;
    if (!ctx) return;
    try {
      const t0 = ctx.currentTime + 0.01;
      for (const n of SOUNDS[name]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        const s = t0 + n.start;
        const e = s + n.dur;
        osc.frequency.setValueAtTime(n.freq, s);
        if (n.slideTo) osc.frequency.linearRampToValueAtTime(n.slideTo, e);
        gain.gain.setValueAtTime(0.0001, s);
        gain.gain.linearRampToValueAtTime(0.12, s + 0.005);
        gain.gain.setValueAtTime(0.12, Math.max(s + 0.005, e - 0.02));
        gain.gain.linearRampToValueAtTime(0.0001, e);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(s);
        osc.stop(e + 0.02);
      }
    } catch {
      // audio failure must never crash the game
    }
  }
}
