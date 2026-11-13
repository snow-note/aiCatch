import { describe, expect, it } from 'vitest';
import { spawnInterval, speedMultiplier, virusShare } from '../../src/game/difficulty';

describe('spawnInterval', () => {
  it('starts at 1.2 s', () => {
    expect(spawnInterval(0)).toBeCloseTo(1.2, 10);
    expect(spawnInterval(14.9)).toBeCloseTo(1.2, 10);
  });

  it('compounds x0.9 every 15 s', () => {
    expect(spawnInterval(15)).toBeCloseTo(1.08, 10);
    expect(spawnInterval(30)).toBeCloseTo(0.972, 10);
  });

  it('stops at 0.6 s from 120 s on', () => {
    expect(spawnInterval(120)).toBe(0.6);
    expect(spawnInterval(600)).toBe(0.6);
  });

  it('treats invalid or negative time as the start', () => {
    expect(spawnInterval(-5)).toBeCloseTo(1.2, 10);
    expect(spawnInterval(Number.NaN)).toBeCloseTo(1.2, 10);
  });
});

describe('speedMultiplier', () => {
  it('is 1.0 at the start and 1.1 at 15 s', () => {
    expect(speedMultiplier(0)).toBe(1);
    expect(speedMultiplier(15)).toBeCloseTo(1.1, 10);
  });

  it('is about 1.21 at 30 s', () => {
    expect(speedMultiplier(30)).toBeCloseTo(1.21, 10);
  });

  it('is capped at 2.0 from 120 s on', () => {
    expect(speedMultiplier(120)).toBe(2);
    expect(speedMultiplier(1000)).toBe(2);
  });

  it('LLM MODEL fall time at 15 s is about 3.64 s', () => {
    expect(4.0 / speedMultiplier(15)).toBeCloseTo(3.636, 2);
  });
});

describe('virusShare', () => {
  it('is 0 before 10 s', () => {
    expect(virusShare(0)).toBe(0);
    expect(virusShare(9.99)).toBe(0);
  });

  it('is 20% from 10 s and rises 5 points every 15 s', () => {
    expect(virusShare(10)).toBeCloseTo(0.2, 10);
    expect(virusShare(25)).toBeCloseTo(0.25, 10);
    expect(virusShare(40)).toBeCloseTo(0.3, 10);
    expect(virusShare(55)).toBeCloseTo(0.35, 10);
  });

  it('is capped at 40% from 70 s', () => {
    expect(virusShare(70)).toBeCloseTo(0.4, 10);
    expect(virusShare(500)).toBeCloseTo(0.4, 10);
  });
});
