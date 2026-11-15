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
## DOM and CSS structure (`index.html`, `src/style.css`; skimmed this run, detail from the prior store)
```
body > main#stage (position: fixed; inset: 0)
  div#console (320x240, absolute left/top 0, origin 0 0, transformed by main.ts)
    h1.brand
    div.bezel (260x180; padding 10)
      canvas#screen (CSS 240x160, attributes 240x160)
    div.controls: div.hint "MOVE", button#start-button (70x24)
  div#announcer.visually-hidden (screen-reader live region)
```
All casing children use fixed px positions; only `#console` is scaled (architecture.md "Responsive Layout and Orientation"). `main.ts` reads `#stage` padding as safe-area insets (`main.ts:62-70`).
## File Classification and Size (lines at `49efe17`)
| File | Class | Lines |
|---|---|---|
| `index.html` | Static/Asset | 40 (prior) |
| `src/style.css` | Static/Asset | 134 (prior) |
| `src/game/config.ts` | Configuration (all tunables) | 128 |
| `src/game/types.ts` | Model (contracts C1-C4) | 97 |
| `src/game/state.ts` | Service (phase machine, update loop) | 341 |
| `src/game/objects.ts` | Model + Utility | 88 |
| `src/game/collision.ts` | Utility | 43 |
| `src/game/spawner.ts` | Service | 48 |
| `src/game/difficulty.ts` | Utility | 23 |
| `src/game/run.ts` | Model (run progress) | 39 |
| `src/game/input.ts` | Utility (held-key tracker) | 38 |
| `src/game/announcer.ts` | Utility (screen-reader text) | 43 |
| `src/game/highscore.ts` | Repository (localStorage) | 56 |
| `src/main.ts` | Controller/bootstrap | 215 |
| `src/render/renderer.ts` | Utility (drawing, effects) | 493 |
| `src/render/sprites.ts` | Static/Asset (bitmaps, font) | 313 |
| `src/render/screen-timing.ts` | Utility | 101 |
| `src/render/layout.ts` | Utility | 96 |
| `src/audio/sound.ts` | Utility | not re-counted |
## Tests (line counts at `49efe17`)
| Test file | Lines | Pins |
|---|---|---|
| `tests/render/renderer.test.ts` | 231 | every screen draws without throwing against a fake 2D context (counts `fillRect`); victory at 0.5/2/3/4/4.6 s (`:126-135`); effects expire; null context tolerated |
| `tests/render/screen-timing.test.ts` | 169 | `victoryStep` (`:18-36`), `messagesShown` (`:39-57`), `victoryBarFill` (`:81-88`), `noiseLines` (`:157-168`), blink, bar fill, HUD and timer strings |
| `tests/render/sprites.test.ts` | 85 | every glyph 3x5 of `#`/`.` (`:41-46`), glyphs for `% . : / —` (`:74-79`), letters `AICTHGMEOVRSPNWKY+` (`:83`), sprite shapes, AI faces |
| `tests/render/layout.test.ts` | 136 | `fitArea`, `placeCasing`, `chooseFit`, `touchSide`, `orientationOf`, `SETTLE_DELAY_MS`, `fitCasing` |
| `tests/game/state.test.ts` | 598 | phase machine; victory flow and 3.5 s return (`:303-348`); game over |
| `tests/game/config.test.ts` | 175 | tunables; phase durations incl. `VICTORY_DURATION` 3.5 (`:166-174`) |
| `tests/game/announcer.test.ts` | 134 | exact announcer strings incl. victory (`:85-91`), key rules (`:118-124`) |
| `tests/game/{collision,difficulty,first-heart,highscore,input,objects,run,spawner}.test.ts` | 54-127 each | per-module rules (listed by name; matched by grep only) |
No test touches `main.ts`, the DOM, or pointer mapping; Vitest runs with `environment: 'node'`. No test asserts the exact victory strings, positions, or `VICTORY_MESSAGE_STEP`.
## Patterns
- Plain functions and small classes; `GameState` is the only stateful rules class and implements both `GameView` and `GameControls`.
- Requirement IDs (FR/BR/NFR, W1-W7) in comments trace code to the original spec.
- Tunables: every game-balance number is a named export in `config.ts`; display sub-step timings sit in a separate commented block (`config.ts:45-52`); per-stage data is the `STAGES` array. Layout constants live in `layout.ts`.
- Screens: one private `drawX` method per phase in `Renderer.draw`'s switch (`renderer.ts:165-184`), all taking `(ctx, state)` and using the shared `drawText`, `drawAiBar`, `drawScoreLine` helpers; text positions are literals.
- Dependency direction: `main` -> `game`, `render`, `audio`; `render` and `audio` -> `game` types/constants; `game` -> nothing outside itself.
- Events are queued in `GameState.events` and drained by the loop (observer-style, pull-based).
