import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Line coverage for the mvp 80% floor; run with `npm run coverage` (Build and Test, Q1).
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'json-summary'],
      reportsDirectory: 'coverage',
      // mvp floor: the run fails below 80% line coverage (CI Pipeline, Q2).
      thresholds: { lines: 80 },
    },
  },
});
