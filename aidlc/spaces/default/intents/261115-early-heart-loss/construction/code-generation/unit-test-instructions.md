# Unit Test Instructions: early-heart-loss

## Framework and Configuration

- Vitest 5.1.0 with the existing `vitest.config.ts` (`environment: node`, `include: tests/**/*.test.ts`, v8 coverage with an 80% line threshold). No configuration change and no new dependency.
- All new logic is in `src/game/` and uses the injected `Random`, so every test is deterministic and needs no DOM.

## How to Run This Work's Tests

Run from the project root.

```bash
npx vitest run tests/game/spawner.test.ts tests/game/state.test.ts tests/game/config.test.ts tests/game/first-heart.test.ts
```

Single files for the Red/Green steps:

```bash
npx vitest run tests/game/spawner.test.ts
npx vitest run tests/game/state.test.ts
npx vitest run tests/game/config.test.ts
npx vitest run tests/game/first-heart.test.ts
```

Baseline before the first Red step (plan Step 2):

```bash
npm test
```

Full gate (same as CI):

```bash
npm run typecheck && npm run coverage && npm run build && npm run size
```

## Test Scope (Minimal strategy: one verifiable test per requirement)

| File | Requirement | Test |
|---|---|---|
| `tests/game/spawner.test.ts` (extended) | FR3.1, FR3.2, FR3.3 | Aimed VIRUS lands within ±spread of the aim x and is clamped at both edges; non-aimed and collectible spawns keep the random x; aim decision comes from the injected random |
| `tests/game/state.test.ts` (extended) | FR2.2, FR4.1, FR5.1 | First object appears at the first-spawn delay of play, then every spawn interval; a VIRUS contact costs exactly one life and no invulnerability; runs start with 3 lives |
| `tests/game/config.test.ts` (updated) | FR2.1, FR2.3, FR2.4, NFR2, NFR6 | New Stage 1 values; stage ordering still non-decreasing and strictly harder on one value; VIRUS reaches HUMAN no sooner than 1.5 s at Stage 1 start and HUMAN can step out of the overlap in that time; new tunables exist |
| `tests/game/first-heart.test.ts` (new) | FR1.1, FR1.2, FR1.3, NFR1, NFR4 | Beginner model over 200 seeds: median START-to-first-life-lost in [5.0, 10.0] s; stops only on a `life-lost` event; whole test under 5 s |

Each file covers the happy path and at least two edge cases (edges of the play area, zero spread, a run with no life lost before the time limit).

## Expected Coverage Targets

The project gate keeps the 80% line floor (`npm run coverage`). Every new branch in `spawner.ts` and `state.ts` is exercised by the tests above.

## Mocking and Stubbing

- No mocks. Tests use the `random` option of `GameState` and a small seeded generator written in the test (for example mulberry32) for the 200 seeds.
- The beginner model drives only `GameControls` (`pressStart`, `inputDown`, `inputUp`, `update`, `drainEvents`) and reads only `GameView`.

## Test Data

- Seeds 1-200; fixed step 1/60 s; time limit 60 s of game time per run; time measured from `pressStart()`.
