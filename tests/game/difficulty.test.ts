import { describe, expect, it } from 'vitest';
import { DIFFICULTY_STEP_SECONDS, DIFFICULTY_STEPS_TO_CAP, STAGES } from '../../src/game/config';
import { difficultyAt } from '../../src/game/difficulty';

const stage1 = STAGES[0]!;
const capTime = DIFFICULTY_STEP_SECONDS * DIFFICULTY_STEPS_TO_CAP;

describe('difficultyAt (BR5.1)', () => {
  it('returns the stage start values at 0 s', () => {
    expect(difficultyAt(stage1, 0)).toEqual(stage1.difficultyStart);
  });

  it('stays on the start values just before the first step', () => {
    expect(difficultyAt(stage1, DIFFICULTY_STEP_SECONDS - 0.01)).toEqual(stage1.difficultyStart);
  });

  it('takes the first step at exactly 8 s, also with floating-point error (BR1.10)', () => {
    const exact = difficultyAt(stage1, DIFFICULTY_STEP_SECONDS);
    expect(exact.fallSpeedMultiplier).toBeCloseTo(1.05, 10);
    // 480 frames of 1/60 s accumulate to a value that may fall just short of 8.
    let t = 0;
    for (let i = 0; i < 480; i++) t += 1 / 60;
    expect(difficultyAt(stage1, t).fallSpeedMultiplier).toBeCloseTo(1.05, 10);
  });

  it('gives the Stage 1 example at 17 s (two steps)', () => {
    const d = difficultyAt(stage1, 17);
    expect(d.fallSpeedMultiplier).toBeCloseTo(1.1, 10);
    expect(d.spawnInterval).toBeCloseTo(1.1, 10);
    expect(d.virusShare).toBeCloseTo(0.125, 10);
    expect(d.maxObjects).toBe(3);
  });

  it('reaches the cap at 32 s and holds it at 100 s', () => {
    expect(difficultyAt(stage1, capTime)).toEqual(stage1.difficultyCap);
    expect(difficultyAt(stage1, 100)).toEqual(stage1.difficultyCap);
  });

  it('rounds maxObjects down', () => {
    // Stage 1 at 3 steps: 3 + 1 * 0.75 = 3.75 -> 3
    expect(difficultyAt(stage1, DIFFICULTY_STEP_SECONDS * 3).maxObjects).toBe(3);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'uses the start values for invalid time %s',
    (t) => {
      expect(difficultyAt(stage1, t)).toEqual(stage1.difficultyStart);
    },
  );

  it('uses the values of the given stage', () => {
    expect(difficultyAt(STAGES[3]!, 0)).toEqual(STAGES[3]!.difficultyStart);
  });
});
