# Test Results: early-heart-loss

Run 1, 2026-11-15, macOS, local Node 26.12.0, branch `feature/early-heart-loss` (changes not committed). Instructions: `build-instructions.md` and `aidlc/spaces/default/intents/261115-early-heart-loss/construction/code-generation/unit-test-instructions.md`.

## Build

| Command | Exit | Result |
|---|---|---|
| `npm run typecheck` | 0 | No errors |
| `npm run build` | 0 | `index.html` 1.21 kB, CSS 1.69 kB, JS `index-dNGOlSx_.js` 26.41 kB (8.76 kB gzip) |
| `npm run size` | 0 | `dist total: 29584 bytes (28.9 KiB)`, `OK: under the limit` |

## Tests

| Command | Exit | Files | Tests | Passed | Failed | Skipped |
|---|---|---|---|---|---|---|
| `npm run coverage` (full suite) | 0 | 17 | 244 | 244 | 0 | 0 |
| `npx vitest run tests/game/first-heart.test.ts tests/game/spawner.test.ts tests/game/state.test.ts tests/game/config.test.ts` (unit-scoped command) | 0 | 4 | 58 | 58 | 0 | 0 |

`tests/game/first-heart.test.ts`: 2 tests, 35-72 ms. Simulation result reported by Code Generation: median 9.00 s START-to-first-life-lost (P25 5.53 s, P75 15.92 s) over seeds 1-200; baseline before the change 35.47 s.

## Coverage

`npm run coverage` (v8, `src/**/*.ts`, threshold lines 80%): exit 0. All files: lines 86.58%, statements 86.82%, branches 84.47%, functions 85%. Only `src/main.ts` (DOM wiring, play-checked) is below 100% lines. `src/game/spawner.ts` and `src/game/state.ts` are at 100% lines.

## Other Checks

| Check | Result |
|---|---|
| `aidlc engine sensor-traceability --stage build-and-test` | pass, 0 uncovered, 20 IDs |
| No life is removed outside VIRUS contact (NFR1) | Code review of `src/game/state.ts` diff: lives change only in `handle()` on a VIRUS overlap, unchanged |
| Developer play check of Stage 1 (FR1.4) | Not run: needs a real browser and a person; asked at the gate |

No failures; no loop-back.
