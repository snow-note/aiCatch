# Code Summary — AI CATCH

## What Was Built

AI CATCH, a single-screen retro LCD-style browser game, built from [code-generation-plan.md](code-generation-plan.md). It is client-side only, with no runtime dependencies: TypeScript on HTML5 Canvas, with sound synthesised through Web Audio. The production build is 19,906 bytes in total.

## How to Run It

Prerequisites: Node.js 20.19 or later (22.12 or later recommended).

```bash
npm install          # install the pinned dev tools
npm run dev          # play locally with the Vite dev server
npm run build        # production build into dist/ (a static site, deployable to any static host such as Cloudflare Pages)
npm run preview      # serve the built dist/ locally
npm run typecheck    # TypeScript check
npx vitest run tests/  # unit tests
```

Deploying to Cloudflare is not part of this work (requirements Q19); `dist/` is a plain static site with relative paths (`base: './'`), ready to upload.

## Files Created

| Path | Purpose |
|---|---|
| `package.json`, `package-lock.json` | Project manifest; pinned devDependencies `vite` 8.3.7, `vitest` 5.1.0, `typescript` 7.0.2; scripts `dev`, `build`, `preview`, `typecheck`, `test` |
| `tsconfig.json`, `vite.config.ts`, `vitest.config.ts` | TypeScript, build and test configuration |
| `LICENSE` | MIT licence, copyright "2026 AI CATCH authors" (NFR6, US9.1) |
| `index.html`, `src/style.css` | Console casing markup and styling; `data-testid` on `console`, `game-canvas`, `power-button`, `start-button` |
| `src/vite-env.d.ts` | Vite type declarations so `tsc` accepts the CSS import |
| `src/main.ts` | Wiring: buttons, keyboard, touch halves, fixed-step loop, localStorage, re-fit on resize and rotation |
| `src/game/config.ts` | Every requirement number in one place |
| `src/game/difficulty.ts` | Spawn interval, speed multiplier and VIRUS share by elapsed time (compounding 15 s steps with caps) |
| `src/game/spawner.ts` | Next object kind and position from an injectable random source |
| `src/game/objects.ts` | Falling-object model and per-kind movement |
| `src/game/collision.ts` | Bounding-box overlap and the one-object-per-update rule |
| `src/game/input.ts` | Held-input tracker: last pressed direction wins; new-press detection |
| `src/game/state.ts` | Game state machine: power-off, startup, title, playing, game over; scoring, lives, events |
| `src/game/highscore.ts` | High-score store with validation and in-memory fallback |
| `src/render/layout.ts` | Fit-to-viewport scale and offset with a fixed aspect ratio |
| `src/render/sprites.ts` | Original pixel-art bitmaps, a 3×5 font and seven-segment digits |
| `src/render/renderer.ts` | LCD renderer for every screen and effect |
| `src/audio/sound.ts` | Sound note lists and the Web Audio square-wave player |
| `tests/game/*.test.ts`, `tests/render/*.test.ts`, `tests/audio/sound.test.ts` | 9 test files, 89 tests |

No existing file was modified. The person's files (`.gitignore`, `.kiroignore`, `AGENTS.md`, `original_spec.md`, `.vscode/settings.json`, `scripts/`) are unchanged. `.gitignore` already ignores `node_modules/` and `dist/` and does not list `.kiro`.

## Key Implementation Decisions

- **Pure game rules.** All rules live in `src/game/` with no DOM access and advance by an explicit time step, so they run in Node tests. `main.ts`, the renderer and the audio player only read the state and forward input.
- **Input.** One input tracker holds every held key and touch by id; the direction is the most recently pressed source still held (FR2.4, assumption A5). Pressing an id that is already held is not a new press, so a key held from play never restarts the game (FR1.5). Touch uses pointer events on the left or right half of the window; mouse pointers and taps on the casing buttons are not treated as movement.
- **START and POWER.** Enter and Space act as START, and as POWER while the console is off; arrow keys and other taps do not start a game from the title (story assumption, gate feedback R-06). After the 2.0 s GAME OVER sequence, any new key press or tap restarts, and the START button counts as such a press.
- **Mouse-click restart (plan Step 11, gate feedback R-02).** At the approval gate the developer asked for a mouse click to restart too ("R-02 クリックでも再スタート"). A mouse press that is not on a casing button is passed to the game as a direction-less press: after the 2.0 s GAME OVER sequence it restarts like any key or tap, and at every other moment it does nothing (it does not move HUMAN and does not start a game from the title). This extends FR1.5, which names only "key press or tap".
- **Speed.** Fall speed is "seconds for the full play-area height" at the logical 240 × 160 resolution. The difficulty multiplier is fixed on each object when it spawns. The first object appears one spawn interval (1.2 s) after the game starts.
- **Values the requirements left to design**, chosen in this build:
  - ROBOT sways ±22 px with a 1.6 s period; VIRUS jitters ±16 px from two summed sine waves; both stay inside the play area
  - HUMAN walks at 130 px/s; object sprites are 16 × 16, HUMAN is 20 × 20
  - The startup sequence lasts 2.0 s
  - The game-over sound lasts 1.62 s, inside the 2.0 s sequence (FR8.5)
  - One casing layout (320 × 240 logical) is used in both orientations
- **Rendering.** The canvas has a fixed 240 × 160 backing store and is scaled by CSS with `image-rendering: pixelated`, so edges stay sharp (FR9.5). At non-integer scales individual LCD pixels can differ slightly in size.
- **Failures degrade quietly.** Storage errors fall back to an in-memory high score (FR6.6); audio errors are swallowed so the game keeps running without sound.

## Test Coverage Summary

All run in this stage and passing:

- `npx vitest run tests/`: 9 files, 89 tests, 0 failures
- `npm run typecheck`: clean
- `npm run build`: succeeded; `dist/` is 19,906 bytes (HTML 1,170, JS 17,203, CSS 1,533), well under the 1 MB budget (NFR4)

| File | Tests | Covers |
|---|---|---|
| `tests/game/difficulty.test.ts` | 11 | Interval and speed at 0, 15, 30 and 120 s; VIRUS share ramp |
| `tests/game/spawner.test.ts` | 6 | No VIRUS before 10 s; equal rescue split; x inside the play area |
| `tests/game/collision.test.ts` | 6 | One-pixel overlap; VIRUS priority; earliest-spawned wins |
| `tests/game/input.test.ts` | 9 | Last pressed wins; release returns to the held direction; new-press detection |
| `tests/game/state.test.ts` | 22 | Power and title, START inputs, fall times, scoring, lives, missed objects, edges, no time limit, game over and restart timing, held key, high-score flag, mouse-click restart (Step 11) |
| `tests/game/highscore.test.ts` | 14 | Save only when higher; invalid stored values as 0; throwing storage |
| `tests/render/layout.test.ts` | 6 | Fit at 375 × 520 and 667 × 320; aspect ratio; centring; scaling up |
| `tests/render/sprites.test.ts` | 10 | Rectangular two-character bitmaps; five distinct object sprites |
| `tests/audio/sound.test.ts` | 5 | Game-over sound within 2.0 s; distinct catch sounds |

No coverage threshold applies (poc scope, Minimal strategy).

## Tests Written but Not Executed, and Checks Not Run

No automated test was skipped. These checks need the game to be played and were not run in this stage:

- The look of the LCD screen, casing and pixel art, the extra effects and the sounds being heard (AC7.1.1, AC7.1.3, US7.2, AC1.1.2, AC1.1.3): no browser was used here; `renderer.ts`, `sound.ts` playback and `main.ts` are checked only by the type check and build
- 60 fps on the reference devices (AC8.1.4) and the latest Chrome, Firefox, Safari and Edge (AC8.1.3): deferred to Build and Test
- Real touch input and rotation on a smartphone (AC2.1.2, AC2.1.5, US8.2)
- The repository being public on GitHub (AC9.1.1): the developer checks this after pushing it

## Deviations from the Plan

- The plan's summary says "8 files"; the build has 9 test files, as listed in `unit-test-instructions.md`. The plan's "about 40 tests" became 89, because most files test each edge case separately.
- Step 11 (mouse-click restart) was added to the plan at the approval gate at the developer's request and built in a second pass; Steps 1–10 were not rebuilt.
- `src/vite-env.d.ts` was added (not named in the plan) so `tsc` accepts the CSS import in `src/main.ts`.
