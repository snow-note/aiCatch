import { afterEach, describe, expect, it } from 'vitest';
import { SOUNDS, SoundPlayer, soundDuration, soundForEvent, type Note } from '../../src/audio/sound';
import type { GameEvent } from '../../src/game/types';

const key = (n: readonly Note[]) => JSON.stringify(n);

describe('sound note lists', () => {
  it('the game-over sound ends within the 2.0 s GAME OVER sequence', () => {
    expect(soundDuration(SOUNDS['game-over'])).toBeLessThanOrEqual(2.0);
    expect(soundDuration(SOUNDS['game-over'])).toBeGreaterThan(0.5);
  });

  it('keeps the six existing cues unchanged (BR1.2)', () => {
    expect(SOUNDS['game-start']).toEqual([
      { freq: 440, start: 0.0, dur: 0.08 },
      { freq: 660, start: 0.1, dur: 0.08 },
      { freq: 880, start: 0.2, dur: 0.16 },
    ]);
    expect(SOUNDS['catch-llm']).toEqual([
      { freq: 660, start: 0.0, dur: 0.06 },
      { freq: 880, start: 0.07, dur: 0.1 },
    ]);
    expect(SOUNDS['catch-gpu']).toEqual([
      { freq: 880, start: 0.0, dur: 0.05 },
      { freq: 1109, start: 0.06, dur: 0.05 },
      { freq: 1319, start: 0.12, dur: 0.1 },
    ]);
    expect(SOUNDS['catch-robot']).toEqual([
      { freq: 784, start: 0.0, dur: 0.05 },
      { freq: 988, start: 0.06, dur: 0.05 },
      { freq: 1319, start: 0.12, dur: 0.05 },
      { freq: 1760, start: 0.18, dur: 0.14 },
    ]);
    expect(SOUNDS['virus-hit']).toEqual([
      { freq: 220, start: 0.0, dur: 0.1, slideTo: 90 },
      { freq: 140, start: 0.1, dur: 0.1, slideTo: 60 },
      { freq: 110, start: 0.2, dur: 0.15, slideTo: 40 },
    ]);
    expect(SOUNDS['game-over']).toEqual([
      { freq: 523, start: 0.0, dur: 0.22 },
      { freq: 392, start: 0.28, dur: 0.22 },
      { freq: 330, start: 0.56, dur: 0.22 },
      { freq: 262, start: 0.84, dur: 0.22 },
      { freq: 196, start: 1.12, dur: 0.5, slideTo: 98 },
    ]);
  });

  it('has three new catch cues, each at most 0.4 s (BR1.3)', () => {
    for (const name of ['catch-mainframe', 'catch-tape', 'catch-floppy'] as const) {
      const notes = SOUNDS[name];
      expect(notes, name).toBeDefined();
      expect(soundDuration(notes), name).toBeGreaterThan(0);
      expect(soundDuration(notes), name).toBeLessThanOrEqual(0.4);
    }
  });

  it('all six catch cues are pairwise different (BR1.3)', () => {
    const names = [
      'catch-mainframe',
      'catch-tape',
      'catch-floppy',
      'catch-llm',
      'catch-gpu',
      'catch-robot',
    ] as const;
    const keys = names.map((n) => key(SOUNDS[n] ?? []));
    expect(new Set(keys).size).toBe(6);
    expect(SOUNDS['catch-mainframe']).toBeDefined();
  });

  it('stage-clear is at most 1.0 s with strictly rising notes (BR1.4)', () => {
    const notes = SOUNDS['stage-clear'];
    expect(notes).toBeDefined();
    expect(soundDuration(notes)).toBeLessThanOrEqual(1.0);
    for (let i = 1; i < notes.length; i++) {
      expect(notes[i].freq).toBeGreaterThan(notes[i - 1].freq);
    }
  });

  it('victory lasts between 2.0 s and 3.0 s (BR1.5)', () => {
    const notes = SOUNDS['victory'];
    expect(notes).toBeDefined();
    expect(soundDuration(notes)).toBeGreaterThanOrEqual(2.0);
    expect(soundDuration(notes)).toBeLessThanOrEqual(3.0);
  });

  it('has no startup cue (BR1.6)', () => {
    expect(Object.keys(SOUNDS)).not.toContain('startup');
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

describe('soundForEvent', () => {
  const catchEvent = (kind: Extract<GameEvent, { type: 'catch' }>['kind']): GameEvent => ({
    type: 'catch',
    kind,
    points: 10,
    x: 0,
    y: 0,
  });

  it('maps run-start to game-start', () => {
    expect(soundForEvent({ type: 'run-start' })).toBe('game-start');
  });

  it('maps each collectible kind to its own catch cue', () => {
    expect(soundForEvent(catchEvent('mainframe'))).toBe('catch-mainframe');
    expect(soundForEvent(catchEvent('tape'))).toBe('catch-tape');
    expect(soundForEvent(catchEvent('floppy'))).toBe('catch-floppy');
    expect(soundForEvent(catchEvent('llm'))).toBe('catch-llm');
    expect(soundForEvent(catchEvent('gpu'))).toBe('catch-gpu');
    expect(soundForEvent(catchEvent('robot'))).toBe('catch-robot');
  });

  it('maps virus-hit, stage-clear, victory and game-over to their cues', () => {
    expect(soundForEvent({ type: 'virus-hit', x: 0, y: 0 })).toBe('virus-hit');
    expect(soundForEvent({ type: 'stage-clear', stageIndex: 0, bonus: 100, aiRestoration: 25 })).toBe('stage-clear');
    expect(soundForEvent({ type: 'victory', score: 500, newHighScore: false })).toBe('victory');
    expect(soundForEvent({ type: 'game-over', score: 50, newHighScore: false })).toBe('game-over');
  });

  it('returns null for stage-start and life-lost', () => {
    expect(soundForEvent({ type: 'stage-start', stageIndex: 1 })).toBeNull();
    expect(soundForEvent({ type: 'life-lost', lives: 2 })).toBeNull();
  });

  it('only returns names that exist in SOUNDS', () => {
    const kinds = ['mainframe', 'tape', 'floppy', 'llm', 'gpu', 'robot'] as const;
    for (const k of kinds) {
      const name = soundForEvent(catchEvent(k));
      expect(name).not.toBeNull();
      expect(Object.keys(SOUNDS)).toContain(name);
    }
  });
});

describe('SoundPlayer', () => {
  it('does not throw when no Web Audio is available', () => {
    const p = new SoundPlayer();
    expect(() => p.play('game-start')).not.toThrow(); // not unlocked yet
    expect(() => p.unlock()).not.toThrow(); // Node has no AudioContext
    expect(() => p.play('game-over')).not.toThrow();
  });
});

// --- Fake Web Audio ---------------------------------------------------------

interface ParamCall {
  op: 'set' | 'ramp';
  value: number;
  time: number;
}

class FakeParam {
  calls: ParamCall[] = [];
  setValueAtTime(value: number, time: number): void {
    this.calls.push({ op: 'set', value, time });
  }
  linearRampToValueAtTime(value: number, time: number): void {
    this.calls.push({ op: 'ramp', value, time });
  }
}

class FakeNode {
  connected: unknown[] = [];
  connect(target: unknown): void {
    this.connected.push(target);
  }
}

class FakeOscillator extends FakeNode {
  type = '';
  frequency = new FakeParam();
  starts: number[] = [];
  stops: number[] = [];
  start(t: number): void {
    this.starts.push(t);
  }
  stop(t: number): void {
    this.stops.push(t);
  }
}

class FakeGain extends FakeNode {
  gain = new FakeParam();
}

interface FakeContextOptions {
  state?: string;
  throwOnOscillator?: boolean;
}

let created: FakeContext[] = [];
let nextOptions: FakeContextOptions = {};

class FakeContext {
  currentTime = 1;
  state: string;
  destination = { name: 'destination' };
  resumeCalls = 0;
  oscillators: FakeOscillator[] = [];
  gains: FakeGain[] = [];
  private throwOnOscillator: boolean;
  constructor() {
    this.state = nextOptions.state ?? 'running';
    this.throwOnOscillator = nextOptions.throwOnOscillator ?? false;
    created.push(this);
  }
  resume(): Promise<void> {
    this.resumeCalls++;
    return Promise.reject(new Error('resume blocked'));
  }
  createOscillator(): FakeOscillator {
    if (this.throwOnOscillator) throw new Error('no oscillator');
    const o = new FakeOscillator();
    this.oscillators.push(o);
    return o;
  }
  createGain(): FakeGain {
    const g = new FakeGain();
    this.gains.push(g);
    return g;
  }
}

type AudioGlobals = { AudioContext?: unknown; webkitAudioContext?: unknown };
const g = globalThis as unknown as AudioGlobals;

function install(name: 'AudioContext' | 'webkitAudioContext', options: FakeContextOptions = {}): void {
  nextOptions = options;
  g[name] = FakeContext;
}

describe('SoundPlayer with a fake AudioContext', () => {
  afterEach(() => {
    delete g.AudioContext;
    delete g.webkitAudioContext;
    created = [];
    nextOptions = {};
  });

  it('unlock creates the context once across two calls', () => {
    install('AudioContext');
    const p = new SoundPlayer();
    p.unlock();
    p.unlock();
    expect(created).toHaveLength(1);
  });

  it('unlock calls resume when the context is suspended and swallows a rejection', () => {
    install('AudioContext', { state: 'suspended' });
    const p = new SoundPlayer();
    expect(() => p.unlock()).not.toThrow();
    expect(created[0].resumeCalls).toBe(1);
  });

  it('unlock does not call resume when the context is running', () => {
    install('AudioContext', { state: 'running' });
    new SoundPlayer().unlock();
    expect(created[0].resumeCalls).toBe(0);
  });

  it('play before unlock does nothing', () => {
    install('AudioContext');
    const p = new SoundPlayer();
    p.play('virus-hit');
    expect(created).toHaveLength(0);
  });

  it('play creates one square oscillator per note and connects it through a gain to the destination', () => {
    install('AudioContext');
    const p = new SoundPlayer();
    p.unlock();
    p.play('virus-hit');
    const ctx = created[0];
    const notes = SOUNDS['virus-hit'];
    expect(ctx.oscillators).toHaveLength(notes.length);
    expect(ctx.gains).toHaveLength(notes.length);
    notes.forEach((n, i) => {
      const osc = ctx.oscillators[i];
      const gain = ctx.gains[i];
      expect(osc.type).toBe('square');
      expect(osc.connected).toEqual([gain]);
      expect(gain.connected).toEqual([ctx.destination]);
      const s = ctx.currentTime + 0.01 + n.start;
      const e = s + n.dur;
      expect(osc.starts).toEqual([s]);
      expect(osc.stops[0]).toBeCloseTo(e + 0.02, 10);
      expect(osc.frequency.calls[0]).toEqual({ op: 'set', value: n.freq, time: s });
    });
  });

  it('slide notes ramp the frequency to slideTo and plain notes do not', () => {
    install('AudioContext');
    const p = new SoundPlayer();
    p.unlock();
    p.play('virus-hit');
    const slideOsc = created[0].oscillators[0];
    expect(slideOsc.frequency.calls).toHaveLength(2);
    expect(slideOsc.frequency.calls[1].op).toBe('ramp');
    expect(slideOsc.frequency.calls[1].value).toBe(90);

    created[0].oscillators.length = 0;
    p.play('game-start');
    for (const osc of created[0].oscillators) {
      expect(osc.frequency.calls).toHaveLength(1);
    }
  });

  it('the gain peak is 0.12 and never higher (NFR5.10)', () => {
    install('AudioContext');
    const p = new SoundPlayer();
    p.unlock();
    p.play('victory');
    for (const gain of created[0].gains) {
      const values = gain.gain.calls.map((c) => c.value);
      expect(Math.max(...values)).toBe(0.12);
      expect(gain.gain.calls[0].value).toBe(0.0001);
      expect(gain.gain.calls[gain.gain.calls.length - 1].value).toBe(0.0001);
    }
  });

  it('a throwing createOscillator leaves play silent and not throwing (NFR5.8)', () => {
    install('AudioContext', { throwOnOscillator: true });
    const p = new SoundPlayer();
    p.unlock();
    expect(() => p.play('game-over')).not.toThrow();
    expect(created[0].oscillators).toHaveLength(0);
  });

  it('uses webkitAudioContext when AudioContext is missing', () => {
    install('webkitAudioContext');
    const p = new SoundPlayer();
    p.unlock();
    expect(created).toHaveLength(1);
    p.play('catch-tape');
    expect(created[0].oscillators).toHaveLength(1);
  });

  it('a throwing constructor leaves the player silent', () => {
    g.AudioContext = class {
      constructor() {
        throw new Error('blocked');
      }
    };
    const p = new SoundPlayer();
    expect(() => p.unlock()).not.toThrow();
    expect(() => p.play('game-start')).not.toThrow();
  });
});
