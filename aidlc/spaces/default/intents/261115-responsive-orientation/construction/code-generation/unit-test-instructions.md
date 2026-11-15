# Unit Test Instructions: Responsive Gameplay Fixes

## Framework and Configuration

- Vitest (existing), `environment: node`, config in `vitest.config.ts`. No configuration change and no new dependency.
- Type check: `npm run typecheck`.

## Commands for This Work

Run the one test file this work touches (exact path); it is runnable before the first Red step:

```bash
npx vitest run tests/render/layout.test.ts
```

## Tests to Write (Minimal strategy plus bugfix regression, about 10)

All in `tests/render/layout.test.ts`. Existing `fitCasing` tests stay unchanged.

| Test | Requirement |
|---|---|
| `fitArea` subtracts insets and keeps the viewport offset | FR3.1, FR3.2 |
| `fitArea` treats negative and NaN insets as 0 | FR3.2 |
| `fitArea` with insets larger than the viewport gives a non-positive size | FR2.1, FR3.2 |
| `placeCasing` with no insets and no offset equals `fitCasing` | NFR2, FR3.3 |
| `placeCasing` with an offset and asymmetric insets centres the casing inside the area | FR3.1, FR3.2, FR3.3 |
| `chooseFit` keeps the previous fit when the next one has scale 0 (regression for the blank-casing risk) | FR2.1, FR2.2 |
| `chooseFit` returns the next fit when valid, and `null` with no previous and an invalid next | FR2.1 |
| `touchSide` splits at the area centre, including an asymmetric-inset area | FR4.1 |
| `orientationOf` returns portrait, landscape, and landscape for a square | FR5.1 |
| `SETTLE_DELAY_MS` is 300 | FR1.1, NFR6 |

## Expected Coverage

The project floor is 80% line coverage (`vitest.config.ts`), checked by Build and Test with `npm run coverage` on the full suite, not by the command above. `src/main.ts` stays untested (DOM wiring), as today. Never lower the threshold.

## Mocking and Test Data

- Pure functions only: pass plain objects for viewport rectangles and insets.
- Use iPhone-like sizes, for example portrait 390 x 664 with insets top 47 and bottom 34, and landscape 844 x 390 with insets left 47 and right 47 (or asymmetric left 47, right 0).
- No DOM, timers, or network.
