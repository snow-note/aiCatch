# Code Structure
## Layout
```
index.html, src/style.css          Static/Asset: single page, canvas 240x160 in a 320x240 casing (#console)
src/main.ts                        Configuration/bootstrap: casing refit, input wiring, fixed-step loop
src/game/                          Service/Model: pure rules (no DOM)
  config.ts   types.ts   state.ts   objects.ts   collision.ts
  spawner.ts  difficulty.ts  run.ts  input.ts  announcer.ts  highscore.ts
src/render/                        Utility: canvas drawing and display helpers
  renderer.ts  sprites.ts  screen-timing.ts  layout.ts
src/audio/sound.ts                 Utility: note tables and Web Audio player
tests/{game,render,audio,tooling}  Test: Vitest (node environment), one test file per module
tests/scripts/                     Test: Python unittest for usage tracking
scripts/                           Utility: check-size.mjs (build gate), aidlc_*.py (usage tracking)
public/_headers                    Configuration: CSP and security headers
.github/workflows/ci.yml           Configuration: CI
.usage/                            Static: usage CSV and generated report
```
## DOM and CSS structure (`index.html:12-37`, `src/style.css`)
```
body > main#stage (position: fixed; inset: 0)            style.css:17-22
  div#console (320x240, absolute left/top 0, origin 0 0, transformed by main.ts)   style.css:25-37
    h1.brand (absolute, top 4)
    div.bezel (absolute 30,20; 260x180; padding 10)     style.css:52-62
      canvas#screen (CSS 240x160, attributes 240x160)   index.html:17-23, style.css:64-72
    div.controls (absolute 30,206; right 30; height 28)
      div.hint "MOVE", button#start-button (70x24)       style.css:74-121
  div#announcer.visually-hidden (screen-reader live region)
```
All casing children use fixed px positions; only `#console` is scaled (see architecture.md "Responsive Layout and Orientation"). `html, body` use `height: 100%` with `overflow: hidden`, `touch-action: none`, no `vh/dvh/svh` and no `env(safe-area-inset-*)` (`style.css:1-15`).
## File Classification and Size
| File | Class | Lines |
|---|---|---|
| `index.html` | Static/Asset | 40 |
| `src/style.css` | Static/Asset | 134 |
| `src/game/config.ts` | Configuration (all tunables) | grown after `a48cb16` (117 at `c41d919`) |
| `src/game/types.ts` | Model (contracts C1-C4) | 88 at `c41d919` |
| `src/game/state.ts` | Service (phase machine, update loop) | 305 at `c41d919` |
| `src/game/objects.ts` | Model + Utility (falling object, motion) | 88 |
| `src/game/collision.ts` | Utility (AABB, handling order) | 43 |
| `src/game/spawner.ts` | Service (kind and position choice) | 45 at `c41d919` |
| `src/game/difficulty.ts` | Utility (stepwise interpolation) | 23 |
| `src/game/run.ts` | Model (run progress) | 39 |
| `src/game/input.ts` | Utility (held-key tracker) | 38 |
| `src/game/announcer.ts` | Utility (screen-reader text) | 43 at `c41d919` |
| `src/game/highscore.ts` | Repository (localStorage) | 56 |
| `src/main.ts` | Controller/bootstrap | 158 |
| `src/render/renderer.ts` | Utility (drawing, effects) | 493 |
| `src/render/sprites.ts` | Static/Asset (bitmaps, font) | 313 |
| `src/render/screen-timing.ts` | Utility | 101 |
| `src/render/layout.ts` | Utility | 34 |
| `src/audio/sound.ts` | Utility | 172 at `c41d919` |
## Tests
| Test file | Lines | Pins |
|---|---|---|
| `tests/render/layout.test.ts` | 50 | `fitCasing`: fit inside 375x520 and 667x320, aspect ratio, centring, scale 4.5 at 1920x1080 and 0.5 at 160x120, zero scale for invalid size |
| `tests/render/renderer.test.ts` | 231 | every screen draws without throwing; effects expire; null 2D context tolerated (fake canvas context) |
| `tests/render/screen-timing.test.ts` | 169 | victory steps, bar fill, blink, `hudTexts`, `reachedLine`, timer text |
| `tests/render/sprites.test.ts` | 85 | bitmap shapes |
| `tests/game/*` (not re-read) | | config, state, difficulty, first-heart, spawner, objects, announcer, collision, highscore, input, run (prior store lists 492-line `state.test.ts`, 140-line `config.test.ts`) |
No test touches `main.ts`, the DOM, `visualViewport`, or pointer mapping; Vitest runs with `environment: 'node'` (`vitest.config.ts`).
## Patterns
- Plain functions and small classes; `GameState` is the only stateful rules class and implements both `GameView` and `GameControls`.
- Requirement IDs (FR/BR/NFR, W1-W7) in comments trace code to the original spec (layout: FR9.5, FR9.6, NFR1; touch: FR2.2).
- Tunables: every game-balance number is a named export in `config.ts`; per-stage data is the `STAGES` array. Layout constants (`CASING_W/H`) live in `layout.ts:2-3`, separate from `config.ts`.
- Dependency direction: `main` -> `game`, `render`, `audio`; `render` and `audio` -> `game` types/constants; `game` -> nothing outside itself.
- Events are queued in `GameState.events` and drained by the loop (observer-style, pull-based).
