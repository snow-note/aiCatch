import { describe, expect, it } from 'vitest';
import { STAGES } from '../../src/game/config';
import {
  barFill,
  blinkOn,
  timerText,
  timerVisible,
  hudTexts,
  messagesShown,
  noiseLines,
  reachedLine,
  victoryBarFill,
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
    [3.49, 'messages'],
    [3.5, 'hold'],
    [10, 'hold'],
  ])('t=%s is %s', (t, step) => {
    expect(victoryStep(t)).toBe(step);
  });

  it('treats negative and non-finite time as the start', () => {
    expect(victoryStep(-1)).toBe('reboot');
    expect(victoryStep(Number.NaN)).toBe('reboot');
    expect(victoryStep(Number.NEGATIVE_INFINITY)).toBe('reboot');
  });
});

describe('messagesShown', () => {
  it('is 0 before 2.5 s', () => {
    expect(messagesShown(0)).toBe(0);
    expect(messagesShown(2.49)).toBe(0);
  });

  it('shows 1, 2, 3 messages in 0.33 s steps', () => {
    expect(messagesShown(2.5)).toBe(1);
    expect(messagesShown(2.82)).toBe(1);
    expect(messagesShown(2.83)).toBe(2);
    expect(messagesShown(3.15)).toBe(2);
    expect(messagesShown(3.16)).toBe(3);
  });

  it('never exceeds 3 and is 0 for bad time', () => {
    expect(messagesShown(100)).toBe(3);
    expect(messagesShown(Number.NaN)).toBe(0);
    expect(messagesShown(-5)).toBe(0);
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
