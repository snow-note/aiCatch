import { describe, expect, it } from 'vitest';
import { STAGES } from '../../src/game/config';
import { advanceStage, currentStage, newRun, recordCatch } from '../../src/game/run';

/** Catches `n` of `kind` and returns the last result. */
function catchMany(run: ReturnType<typeof newRun>, kind: Parameters<typeof recordCatch>[1], n: number) {
  let cleared = false;
  for (let i = 0; i < n; i++) cleared = recordCatch(run, kind);
  return cleared;
}

describe('RunProgress (BR2.2-BR2.4)', () => {
  it('starts at stage 0 with nothing caught and 0% AI', () => {
    const run = newRun();
    expect(run).toEqual({ stageIndex: 0, caught: 0, aiRestoration: 0, complete: false });
    expect(currentStage(run)).toBe(STAGES[0]);
  });

  it('adds 1 for a collectible of the current stage', () => {
    const run = newRun();
    expect(recordCatch(run, 'mainframe')).toBe(false);
    expect(run.caught).toBe(1);
  });

  it('adds nothing for a kind outside the stage', () => {
    const run = newRun();
    expect(recordCatch(run, 'tape')).toBe(false);
    expect(run.caught).toBe(0);
  });

  it('reports cleared at the required count and raises AI by 25', () => {
    const run = newRun();
    expect(catchMany(run, 'mainframe', STAGES[0]!.requiredCount - 1)).toBe(false);
    expect(run.aiRestoration).toBe(0);
    expect(recordCatch(run, 'mainframe')).toBe(true);
    expect(run.aiRestoration).toBe(25);
    expect(run.complete).toBe(false);
  });

  it('advances to the next stage with caught reset', () => {
    const run = newRun();
    catchMany(run, 'mainframe', STAGES[0]!.requiredCount);
    advanceStage(run);
    expect(run.stageIndex).toBe(1);
    expect(run.caught).toBe(0);
    expect(run.aiRestoration).toBe(25);
    expect(currentStage(run).name).toBe('COBOL');
  });

  it('counts llm, gpu and robot together in Stage 4', () => {
    const run = { stageIndex: 3, caught: 0, aiRestoration: 75, complete: false };
    recordCatch(run, 'llm');
    recordCatch(run, 'gpu');
    recordCatch(run, 'robot');
    expect(run.caught).toBe(3);
    expect(recordCatch(run, 'mainframe')).toBe(false);
    expect(run.caught).toBe(3);
  });

  it('completes the run with AI 100 when Stage 4 clears', () => {
    const run = { stageIndex: 3, caught: 0, aiRestoration: 75, complete: false };
    expect(catchMany(run, 'llm', STAGES[3]!.requiredCount)).toBe(true);
    expect(run.complete).toBe(true);
    expect(run.aiRestoration).toBe(100);
  });

  it('never lets AI exceed 100 and does not advance past Stage 4', () => {
    const run = { stageIndex: 3, caught: 0, aiRestoration: 100, complete: true };
    catchMany(run, 'llm', STAGES[3]!.requiredCount);
    expect(run.aiRestoration).toBe(100);
    advanceStage(run);
    expect(run.stageIndex).toBe(3);
  });
});
