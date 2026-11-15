import { describe, expect, it } from 'vitest';
import { PLAY_W } from '../../src/game/config';
import { ENDING_LINES } from '../../src/render/ending';
import { endingDuration } from '../../src/render/screen-timing';
import { FONT } from '../../src/render/sprites';

describe('ending message', () => {
  it('has the 19 requested lines (FR1.1, FR1.2)', () => {
    expect(ENDING_LINES).toEqual([
      'AI RESTORED!',
      '',
      'You brought me back to life.',
      '',
      'But tell me...',
      'Do you know the generations of computing,',
      'the programming languages, and the human creativity',
      'that made the AI you use today possible?',
      '',
      'Are you simply using AI,',
      'or are you creating something with it?',
      '',
      'Remember the spirit of the early computing days:',
      'Experiment. Imagine. Build.',
      '',
      "Don't just use AI.",
      'Create with it.',
      '',
      'The future is yours to code.',
    ]);
  });

  it('has a font glyph for every character (FR4.1)', () => {
    for (const line of ENDING_LINES) {
      for (const ch of line.toUpperCase()) expect(FONT[ch], ch).toBeDefined();
    }
  });

  it('fits every line inside the canvas width at scale 1 (FR2.2, NFR1)', () => {
    for (const line of ENDING_LINES) expect(4 * line.length - 1).toBeLessThanOrEqual(PLAY_W);
  });

  it('takes 19.8 seconds to appear (FR2.3)', () => {
    expect(endingDuration(ENDING_LINES)).toBeCloseTo(19.8, 9);
  });
});
