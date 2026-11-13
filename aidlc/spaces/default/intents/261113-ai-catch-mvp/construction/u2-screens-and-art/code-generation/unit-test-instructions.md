# Unit Test Instructions: u2-screens-and-art

## Framework and Configuration

- Vitest 5.1.0 with the existing `vitest.config.ts` (`environment: node`, `include: tests/**/*.test.ts`). No configuration change and no new dependency.
- The pure helpers and sprite tables run under node with no canvas or DOM.

## How to Run This Unit's Tests

Run from the project root. Commands are scoped to this unit's test files.

```bash
npx vitest run tests/render
```

Per file, for the Red/Green steps:

```bash
npx vitest run tests/render/sprites.test.ts
npx vitest run tests/render/screen-timing.test.ts
npx vitest run tests/render/layout.test.ts
```

Type check (whole project; it also proves the Renderer only takes `GameView`):

```bash
npm run typecheck
```

`npx vitest run tests/render` runs on the unchanged tree before the first Red step (plan Step 2).

## Test Scope (Standard strategy)

| File | Component | Tests (approx.) |
|---|---|---|
| `tests/render/screen-timing.test.ts` (new) | screen-timing helpers | 14-18 |
| `tests/render/sprites.test.ts` (extended) | Sprites and font | existing 4 + 5-7 |
| `tests/render/layout.test.ts` (unchanged) | Layout | existing |

Each file covers the happy path and at least two edge cases (boundaries, negative or non-finite time, clamping). Screens, the console page, and `main.ts` are checked by playing (team practice).

## Expected Coverage Targets

The `mvp` scope floor is 80% line coverage, measured by Build and Test on the full suite. No coverage tool is installed (team practice; adding one needs the developer's approval), so this unit does not measure it. Every helper in `screen-timing.ts` has tests; drawing code is play-checked.

## Mocking and Stubbing

- Helpers take plain numbers and a small object with the `GameView` fields they read; tests build that object literally (stage from `STAGES` in `src/game/config.ts`).
- No canvas mock: drawing is not unit-tested.

## Test Data

- Stage names, counts, and AI values come from `STAGES` and the C1 constants; tests use the fixed design values only where a rule fixes them (1.5 s, 2.5 s, 3.5 s, 0.33 s, 1.0 s, 25%).
