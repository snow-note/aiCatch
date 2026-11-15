# Unit Test Instructions: u4-accessibility

## Framework and Configuration

- Vitest 5.1.0 with the existing `vitest.config.ts` (`environment: node`, `include: tests/**/*.test.ts`). No configuration change and no new dependency.
- The builder is pure and reads only `GameView`, so tests run under node with no DOM.

## How to Run This Unit's Tests

Run from the project root. Commands are scoped to this unit's test files.

```bash
npx vitest run tests/game/announcer.test.ts
```

Baseline before the first Red step (plan Step 2):

```bash
npx vitest run tests/game
```

Type check (whole project; it also proves the builder takes `GameView` only):

```bash
npm run typecheck
```

## Test Scope (Standard strategy)

| File | Component | Tests (approx.) |
|---|---|---|
| `tests/game/announcer.test.ts` (new) | `screenAnnouncement` text | 8-9 |
| `tests/game/announcer.test.ts` (new) | `screenAnnouncement` key | 5-6 |

Each component covers the happy path and at least two edge cases (one life, zero lives, no high score, `newHighScore` false and true, views that differ only in score, caught, `phaseTime`, or `canReturnToTitle`). The live-region write in `main.ts` is checked by code review and by playing with VoiceOver (team practice).

## Expected Coverage Targets

The `mvp` scope floor is 80% line coverage, measured by Build and Test on the full suite. No coverage tool is installed (team practice; adding one needs the developer's approval), so this unit does not measure it. Every branch of `screenAnnouncement` (six phases, four stages, singular and plural lives, high-score suffix) has a test.

## Mocking and Stubbing

- No mocks. Views are plain object literals of type `GameView`, with `stage` taken from `STAGES` in `src/game/config.ts`.

## Test Data

- Expected sentences are copied from `rules.md` BR1.2-BR1.5 and the functional-spec example run (for example "Stage 1 FORTRAN, AI 0%, score 300, 3 of 10, 3 lives").
- AI values follow the C1 per-phase table (stage-intro and playing before the stage; stage-clear already raised).
