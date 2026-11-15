# Code Structure

## Layout
```
index.html, src/style.css          Static/Asset: single page, canvas 240x160 in a 320x240 casing
src/main.ts                        Configuration/bootstrap: input wiring, fixed-step loop
src/game/                          Service/Model: pure rules (no DOM)
  config.ts   types.ts   state.ts   objects.ts   collision.ts
  spawner.ts  difficulty.ts  run.ts  input.ts  announcer.ts  highscore.ts
src/render/                        Utility: canvas drawing and display helpers
  renderer.ts  sprites.ts  screen-timing.ts  layout.ts
src/audio/sound.ts                 Utility: note tables and Web Audio player
tests/{game,render,audio,tooling}  Test: Vitest, one test file per module
tests/scripts/                     Test: Python unittest for usage tracking
scripts/                           Utility: check-size.mjs (build gate), aidlc_*.py (usage tracking)
public/_headers                    Configuration: CSP and security headers
.github/workflows/ci.yml           Configuration: CI
.usage/                            Static: usage CSV and generated report
```

## File Classification and Size
| File | Class | Lines |
|---|---|---|
| `src/game/config.ts` | Configuration (all tunables) | 110 |
| `src/game/types.ts` | Model (contracts C1-C4) | 88 |
| `src/game/state.ts` | Service (phase machine, update loop) | 296 |
| `src/game/objects.ts` | Model + Utility (falling object, motion) | 88 |
| `src/game/collision.ts` | Utility (AABB, handling order) | 43 |
| `src/game/spawner.ts` | Service (kind and position choice) | 34 |
| `src/game/difficulty.ts` | Utility (stepwise interpolation) | 23 |
| `src/game/run.ts` | Model (run progress) | 39 |
| `src/game/input.ts` | Utility (held-key tracker) | 38 |
| `src/game/announcer.ts` | Utility (screen-reader text) | 43 |
| `src/game/highscore.ts` | Repository (localStorage) | 56 |
| `src/main.ts` | Controller/bootstrap | 158 |
| `src/render/renderer.ts` | Utility (drawing, effects) | 486 |
| `src/render/sprites.ts` | Static/Asset (bitmaps, font) | 313 |
| `src/render/screen-timing.ts` | Utility | 89 |
| `src/render/layout.ts` | Utility | 34 |
| `src/audio/sound.ts` | Utility | 172 |

## Patterns
- Plain functions and small classes; `GameState` is the only stateful rules class and implements both `GameView` and `GameControls`.
- Requirement IDs (FR/BR/NFR, W1-W7) in comments trace code to the original spec.
- Tunables: every game-balance number is a named export in `config.ts`; per-stage data is the `STAGES` array.
- Dependency direction: `main` -> `game`, `render`, `audio`; `render` and `audio` -> `game` types/constants; `game` -> nothing outside itself.
- Events are queued in `GameState.events` and drained by the loop (observer-style, pull-based).
