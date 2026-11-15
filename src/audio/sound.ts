/**
 * Sounds are note lists played with square-wave oscillators. No audio files are
 * shipped, so there is nothing to license or download (FR8, NFR5).
 */

import type { GameEvent } from '../game/types';

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
  | 'game-start'
  | 'catch-mainframe'
  | 'catch-tape'
  | 'catch-floppy'
  | 'catch-llm'
  | 'catch-gpu'
  | 'catch-robot'
  | 'stage-clear'
  | 'victory'
  | 'virus-hit'
  | 'time-tick'
  | 'game-over';

export const SOUNDS: Readonly<Record<SoundName, readonly Note[]>> = {
  'game-start': [
    { freq: 440, start: 0.0, dur: 0.08 },
    { freq: 660, start: 0.1, dur: 0.08 },
    { freq: 880, start: 0.2, dur: 0.16 },
  ],
  // Mainframe: two low relay blips.
  'catch-mainframe': [
    { freq: 330, start: 0.0, dur: 0.08 },
    { freq: 392, start: 0.12, dur: 0.08 },
  ],
  // Magnetic tape: one rising glide.
  'catch-tape': [{ freq: 440, start: 0.0, dur: 0.2, slideTo: 660 }],
  // Floppy disk: three short seek clicks.
  'catch-floppy': [
    { freq: 587, start: 0.0, dur: 0.05 },
    { freq: 523, start: 0.08, dur: 0.05 },
    { freq: 784, start: 0.16, dur: 0.09 },
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
  // Stage clear: rising C major arpeggio (C5 E5 G5 C6).
  'stage-clear': [
    { freq: 523, start: 0.0, dur: 0.15 },
    { freq: 659, start: 0.2, dur: 0.15 },
    { freq: 784, start: 0.4, dur: 0.15 },
    { freq: 1047, start: 0.6, dur: 0.2 },
  ],
  // Victory: three rising phrases ending on a held high note.
  victory: [
    { freq: 523, start: 0.0, dur: 0.15 },
    { freq: 659, start: 0.2, dur: 0.15 },
    { freq: 784, start: 0.4, dur: 0.15 },
    { freq: 659, start: 0.7, dur: 0.15 },
    { freq: 784, start: 0.9, dur: 0.15 },
    { freq: 1047, start: 1.1, dur: 0.15 },
    { freq: 784, start: 1.4, dur: 0.15 },
    { freq: 1047, start: 1.6, dur: 0.15 },
    { freq: 1319, start: 1.8, dur: 0.2 },
    { freq: 1568, start: 2.1, dur: 0.4 },
  ],
  'virus-hit': [
    { freq: 220, start: 0.0, dur: 0.1, slideTo: 90 },
    { freq: 140, start: 0.1, dur: 0.1, slideTo: 60 },
    { freq: 110, start: 0.2, dur: 0.15, slideTo: 40 },
  ],
  // Last-10-seconds beep: one short high tick (FR4.3).
  'time-tick': [{ freq: 1047, start: 0.0, dur: 0.06 }],
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

/** Pure mapping from a game event to the cue it triggers, or null for silence (BR1.1). */
export function soundForEvent(e: GameEvent): SoundName | null {
  switch (e.type) {
    case 'run-start':
      return 'game-start';
    case 'catch':
      return `catch-${e.kind}`;
    case 'virus-hit':
      return 'virus-hit';
    case 'stage-clear':
      return 'stage-clear';
    case 'victory':
      return 'victory';
    case 'game-over':
      return 'game-over';
    case 'time-warning':
      return 'time-tick';
    default:
      return null;
  }
}

type AudioCtor = typeof AudioContext;

/** Plays the note lists. Unlocked by the first START press; every failure is swallowed (FR8.1). */
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
