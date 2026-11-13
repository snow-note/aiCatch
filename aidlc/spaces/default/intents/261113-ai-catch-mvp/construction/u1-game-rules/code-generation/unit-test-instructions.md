# Unit Test Instructions: u1-game-rules

## Framework and Configuration

- Vitest 5.1.0, existing `vitest.config.ts` (`environment: node`, `include: tests/**/*.test.ts`). No configuration change and no new dependency.
- TypeScript strict type check with `npm run typecheck` is the contract test for C1-C4.

## How to Run This Unit's Tests

Run from the project root. All commands are scoped to this unit's test files.

```bash
npx vitest run tests/game
```

Per file, for the Red/Green steps of the plan:

```bash
npx vitest run tests/game/config.test.ts
npx vitest run tests/game/run.test.ts
npx vitest run tests/game/difficulty.test.ts
npx vitest run tests/game/spawner.test.ts
npx vitest run tests/game/objects.test.ts
npx vitest run tests/game/input.test.ts
npx vitest run tests/game/highscore.test.ts
npx vitest run tests/game/collision.test.ts
npx vitest run tests/game/state.test.ts
```

Type check for this unit's contracts (whole-project, as `tsc` has no per-file mode with this config):

```bash
npm run typecheck
```

`npx vitest run tests/game` is runnable on the unchanged tree before the first Red step (plan Step 2).

## Test Scope (Standard strategy)

| File | Component | Tests (approx.) |
|---|---|---|
| `tests/game/config.test.ts` (new) | StageCatalog and Config | 6-8 |
| `tests/game/run.test.ts` (new) | RunProgress | 6-8 |
| `tests/game/difficulty.test.ts` (rewritten) | Difficulty | 5-7 |
| `tests/game/spawner.test.ts` (rewritten) | Spawner | 5-6 |
| `tests/game/objects.test.ts` (new) | FallingObjects | 5-6 |
| `tests/game/input.test.ts` (extended) | InputTracker | existing + 2 |
| `tests/game/highscore.test.ts` (extended) | HighScoreStore | existing + 3-5 |
| `tests/game/collision.test.ts` (unchanged) | Collision | existing |
| `tests/game/state.test.ts` (rewritten) | GameState (`GameView` / `GameControls`) | 20-25, including the integration of RunProgress, Difficulty, Spawner, Collision, and HighScoreStore through GameState |

Each file covers the happy path and at least two edge or error cases (construction rules).

## Expected Coverage Targets

The `mvp` scope floor is 80% line coverage, measured by Build and Test on the full suite of the assembled project. The team practice installs no coverage tool, and adding one (for example a Vitest coverage provider) is a new dependency that needs the developer's approval, so this unit does not measure it. Every new game-logic behaviour in `rules.md` gets at least one test; `traceability.json` maps each rule to its test file.

## Mocking and Stubbing

- Randomness: pass a scripted `random` function (a closure over an array of numbers) to `GameState` and `spawnObject`. Never rely on `Math.random` in tests.
- High score: a fake `HighScoreLike` (`best`, `submit`) for GameState tests; a `StorageLike` stub (optionally throwing) for HighScoreStore tests.
- Time: call `update(1/60)` in loops to mirror `main.ts`; use exact-boundary loops (120 steps = 2.0 s) to check EPS handling.
- Positions: set `human.x` and push objects at chosen coordinates through the public spawn path, or use a scripted random that places objects over HUMAN.

## Test Data

- Stage values come from `STAGES` in `src/game/config.ts`; tests read the constants instead of repeating numbers, except where a rule fixes a value (counts 10/12/14/16, bonus 500, durations).
- No files, network, or browser APIs are used.
