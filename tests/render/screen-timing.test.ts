import { describe, expect, it } from 'vitest';
import { ENDING_TYPE_SHARE, STAGES, VICTORY_DURATION, VICTORY_RESTORE_END } from '../../src/game/config';
import { ENDING_LINES } from '../../src/render/ending';
import {
  barFill,
  blinkOn,
  timerText,
  timerVisible,
  hudTexts,
  endingView,
  noiseLines,
  reachedLine,
  victoryBarFill,
  endingDuration,
  victoryStep,
} from '../../src/render/screen-timing';

const stage = (i: number) => STAGES[i] ?? STAGES[0]!;

describe('victoryStep', () => {
  it.each([
    [0, 'reboot'],
    [1.49, 'reboot'],
    [1.5, 'restore'],
    [2.49, 'restore'],
    [2.5, 'messages'],
    [3.5, 'messages'],
    [22.29, 'messages'],
    [22.3, 'hold'],
    [30, 'hold'],
  ])('t=%s is %s', (t, step) => {
    expect(victoryStep(t)).toBe(step);
  });

  it('treats negative and non-finite time as the start', () => {
    expect(victoryStep(-1)).toBe('reboot');
    expect(victoryStep(Number.NaN)).toBe('reboot');
    expect(victoryStep(Number.NEGATIVE_INFINITY)).toBe('reboot');
  });
});

describe('endingView', () => {
  const W = 12;
  const at = (t: number) => endingView(t, ENDING_LINES, W);
  it('shows nothing before the message starts', () => {
    expect(endingView(0, ENDING_LINES, W).visible).toEqual([]);
    expect(endingView(Number.NaN, ENDING_LINES, W).visible).toEqual([]);
  });
  it('types the first line partly, then in full, then reveals the next one', () => {
    const early = at(0.01).visible;
    expect(early).toHaveLength(1);
    expect(early[0]!.length).toBeGreaterThan(0);
    expect(early[0]!.length).toBeLessThan(ENDING_LINES[0]!.length);
    expect(at(1.2 * ENDING_TYPE_SHARE + 0.01).visible).toEqual([ENDING_LINES[0]]);
    expect(at(1.2 + 0.01).visible).toHaveLength(2);
  });
  it('counts blank lines as lines', () => {
    expect(at(1.2 + 0.7 - 0.01).visible).toEqual([ENDING_LINES[0], '']);
    expect(at(1.2 + 0.7 + 0.01).visible).toHaveLength(3);
  });
  it('never shows more than the window and keeps the newest line last', () => {
    for (let t = 0; t <= 21; t += 0.25) {
      const v = at(t);
      expect(v.visible.length).toBeLessThanOrEqual(W);
      if (v.visible.length > 0) {
        const last = ENDING_LINES[v.first + v.visible.length - 1]!;
        expect(last.startsWith(v.visible[v.visible.length - 1]!)).toBe(true);
      }
    }
  });
  it('ends with the last window of lines in full', () => {
    const v = at(endingDuration(ENDING_LINES));
    expect(v.visible).toEqual(ENDING_LINES.slice(-W));
    expect(endingView(1000, ENDING_LINES, W).visible).toEqual(ENDING_LINES.slice(-W));
    expect(VICTORY_DURATION).toBeGreaterThan(VICTORY_RESTORE_END);
  });
});
describe('barFill', () => {
  it('fills 25 points over 1.0 s ending at the restoration', () => {
    expect(barFill(0, 25)).toBe(0);
    expect(barFill(0.5, 25)).toBeCloseTo(12.5);
    expect(barFill(1.0, 25)).toBe(25);
    expect(barFill(2.5, 25)).toBe(25);
    expect(barFill(0, 100)).toBe(75);
    expect(barFill(0.5, 100)).toBeCloseTo(87.5);
    expect(barFill(1.0, 100)).toBe(100);
    expect(barFill(2.5, 100)).toBe(100);
  });

  it('stays within 0..100', () => {
    expect(barFill(0, 0)).toBe(0);
    expect(barFill(1, 0)).toBe(0);
    expect(barFill(1, 130)).toBe(100);
    expect(barFill(-3, 25)).toBe(0);
    expect(barFill(Number.NaN, 50)).toBe(25);
  });
});

describe('victoryBarFill', () => {
  it('fills 75 to 100 over the reboot step and holds', () => {
    expect(victoryBarFill(0)).toBe(75);
    expect(victoryBarFill(0.75)).toBeCloseTo(87.5);
    expect(victoryBarFill(1.5)).toBe(100);
    expect(victoryBarFill(9)).toBe(100);
    expect(victoryBarFill(-1)).toBe(75);
  });
});

describe('blinkOn', () => {
  it('is on in the first half of each second', () => {
    expect(blinkOn(0)).toBe(true);
    expect(blinkOn(0.49)).toBe(true);
    expect(blinkOn(0.5)).toBe(false);
    expect(blinkOn(0.99)).toBe(false);
    expect(blinkOn(1.0)).toBe(true);
    expect(blinkOn(7.6)).toBe(false);
  });

  it('handles negative and non-finite time without throwing', () => {
    expect(blinkOn(-0.25)).toBe(false);
    expect(blinkOn(Number.NaN)).toBe(true);
  });
});

describe('timerText (FR4.1)', () => {
  it('rounds the remaining seconds up', () => {
    expect(timerText(90)).toBe('T 90');
    expect(timerText(9.2)).toBe('T 10');
    expect(timerText(0.4)).toBe('T 1');
    expect(timerText(0)).toBe('T 0');
  });

  it('treats a bad value as 0', () => {
    expect(timerText(Number.NaN)).toBe('T 0');
    expect(timerText(-3)).toBe('T 0');
  });
});

describe('timerVisible (FR4.2)', () => {
  it('is always visible above 10 s left', () => {
    expect(timerVisible(30, 0.2)).toBe(true);
    expect(timerVisible(30, 0.7)).toBe(true);
  });

  it('alternates in the last 10 s', () => {
    expect(timerVisible(10, 0.2)).toBe(true);
    expect(timerVisible(8, 0.2)).toBe(true);
    expect(timerVisible(8, 0.7)).toBe(false);
    expect(timerVisible(1, 1.2)).toBe(true);
  });
});

describe('hudTexts', () => {
  it('formats Stage 1', () => {
    const t = hudTexts({ stage: stage(0), caught: 3, aiRestoration: 25 });
    expect(t.name).toBe('FORTRAN');
    expect(t.ai).toBe('AI 25%');
    expect(t.progress).toBe('3/10');
  });

  it('shows one combined count in Stage 4', () => {
    const t = hudTexts({ stage: stage(3), caught: 7, aiRestoration: 75 });
    expect(t.name).toBe('LLM');
    expect(t.ai).toBe('AI 75%');
    expect(t.progress).toBe('7/16');
  });
});

describe('reachedLine', () => {
  it('names the stage reached', () => {
    expect(reachedLine({ stage: stage(2) })).toBe('REACHED STAGE 3 BASIC');
  });
});

describe('noiseLines', () => {
  it('falls from 6 to 0 over the reboot step', () => {
    expect(noiseLines(0)).toBe(6);
    expect(noiseLines(0.75)).toBe(3);
    expect(noiseLines(1.5)).toBe(0);
    expect(noiseLines(5)).toBe(0);
  });

  it('is never negative and starts full for bad time', () => {
    expect(noiseLines(-1)).toBe(6);
    expect(noiseLines(Number.NaN)).toBe(6);
  });
});
