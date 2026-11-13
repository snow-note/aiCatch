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
    },
  },
});
