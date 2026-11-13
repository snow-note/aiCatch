# Unit Test Instructions — AI CATCH

## Test Framework Setup

- **Runner**: Vitest 5.1.0 (pinned devDependency), configured in `vitest.config.ts`
- **Environment**: `node`. The game rules, input, high score, layout, sprites and sound note lists are pure TypeScript with no DOM access, so no browser or DOM emulation is needed
- **Test files**: `tests/**/*.test.ts`
- **Prerequisites**: Node.js 20.19 or later (22.12 or later recommended), then `npm install` in the project root

## How to Run This Build's Tests

This is zero-Unit work: the whole game is one build, and its tests are every file under `tests/`.

Runner check before the first test file exists (Step 2):

```bash
npx vitest run tests/ --passWithNoTests
```

Full test command for this build:

```bash
npx vitest run tests/
```

By layer, as the plan runs them:

```bash
npx vitest run tests/game/
npx vitest run tests/render/ tests/audio/
```

## Test Files and What They Cover

| File | Covers |
|---|---|
| `tests/game/difficulty.test.ts` | FR3.5, FR3.6, FR3.7 (AC3.1.4–AC3.1.7) |
| `tests/game/spawner.test.ts` | FR3.6, FR3.7, FR3.8 (AC3.1.2, AC3.1.3) |
| `tests/game/collision.test.ts` | FR4.7, FR4.9 (AC4.1.1, AC4.1.2, AC4.1.4, AC4.1.5) |
| `tests/game/input.test.ts` | FR2.4, FR1.5 (AC2.1.4, AC2.1.5, AC6.1.4) |
| `tests/game/state.test.ts` | FR1, FR2.3, FR3.1–FR3.4, FR4.1–FR4.6, FR4.8, FR5, FR7.7 (US1.1, US2.1, US3.1, US4.1, US5.1, US6.1), including a mouse click as a restart press after GAME OVER (plan Step 11, gate feedback R-02) |
| `tests/game/highscore.test.ts` | FR6.3, FR6.5, FR6.6 (AC6.2.2–AC6.2.5) |
| `tests/render/layout.test.ts` | FR9.5, NFR1 (AC8.1.1, AC8.1.2) |
| `tests/render/sprites.test.ts` | FR9.2 (AC7.1.2) |
| `tests/audio/sound.test.ts` | FR8.3, FR8.5 (AC5.1.5) |

About 40 tests in total: one or more per testable requirement, with at least one happy-path test per component (Minimal strategy).

## Expected Coverage Targets

- The poc scope and Minimal strategy set no line-coverage floor, and the project's configuration sets none. No coverage threshold is configured.
- The target is the Minimal strategy's: every testable requirement above has at least one test, and every component has a happy-path test.

## Mocking and Stubbing Guidance

- **Randomness**: the spawner and object movement take an injectable random function. Tests pass a fixed sequence so results are repeatable.
- **Time**: the game state advances by an explicit time step passed to `update(dt)`. Tests advance time directly (for example 1.9 s, then 0.1 s); no real timers or fake-timer libraries are used.
- **Storage**: the high-score store takes any object with `getItem` and `setItem`. Tests pass an in-memory stub, and a stub whose methods throw to simulate private browsing.
- **DOM, canvas and Web Audio** are not tested here; `src/main.ts`, `src/render/renderer.ts` and the audio player are checked by playing the game.

## Test Data Management

- Test data is built inline in each test file; there are no fixtures or files on disk.
- The play area is the logical 240 × 160 used by the game, so pixel positions in tests match the game.
