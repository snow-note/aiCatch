# Component Inventory
Each component lists responsibility, key current values, and dependencies. Cross-references: architecture.md holds the layout flows and numeric tables. Game-rules components (Config through High Score Store) are carried over from the prior store (`c41d919`) and were not re-analyzed in this run.
### Config
- `src/game/config.ts`. All tunables: play area 240x160 (`:5-6`); OBJECT 16x16; HUMAN 20x20, speed 130 px/s; FALL_TIME; POINTS; START_LIVES 3; phase durations; `STAGES` start/cap values; since `a48cb16` also `STAGE_TIME_LIMIT` 90, `TIME_WARNING_SECONDS` 10, `TIME_BONUS_PER_SECOND` 10 (`:111-117`). Depends on `types.ts`.
### Types
- `src/game/types.ts`. Contracts C1-C4 (GameView, GameEvent, StageDefinition/DifficultyValues, GameControls). No runtime code.
### GameState
- `src/game/state.ts`. Phase machine: title, stage-intro, playing, stage-clear, victory, game-over; `update(dt)`, `inputDown/inputUp/releaseAll`, `pressStart`, `drainEvents`. Depends on Collision, Config, Difficulty, Input Tracker, Objects, Run, Spawner.
### Objects
- `src/game/objects.ts`. `FallingObject`, `createObject`, `stepObject`, `isBelowPlayArea` (`y >= 160`).
### Collision
- `src/game/collision.ts`. Strict AABB `overlaps`; `resolveCollisions`.
### Spawner
- `src/game/spawner.ts`. `pickKind`, `spawnObject` (x uniform [0, 224]).
### Difficulty
- `src/game/difficulty.ts`. `difficultyAt`: 8 s steps capped at 4, linear start to cap.
### Run
- `src/game/run.ts`. Stage index, caught count, AI percentage (+25 per stage), completion flag.
### Input Tracker
- `src/game/input.ts` (38 lines). Held-input list; direction is the latest held left/right source (`direction()`); `press(id, dir)` returns whether new; `release`, `clear`. Holds a direction chosen at press time; it has no notion of screen size.
### Announcer
- `src/game/announcer.ts`. Screen-reader text and change key.
### High Score Store
- `src/game/highscore.ts`. localStorage-backed best score with in-memory fallback.
### Page Shell
- `index.html` (40 lines) and `src/style.css` (134 lines). Page with `main#stage` (fixed, `inset: 0`), `div#console` 320x240 casing with `transform-origin: 0 0`, `.bezel` 260x180 holding `canvas#screen` (attributes and CSS 240x160, `image-rendering: pixelated`), `.controls` with the START button (70x24) and MOVE hint, and a visually hidden announcer. Viewport meta has `viewport-fit=cover` and no zoom. Fixed px layout; no media queries, no `vh/dvh/svh`, no safe-area insets (`style.css:1-134`). Comment at `style.css:24` names the 320x240 size and points to `layout.ts`. Depends on Bootstrap (script sets the transform).
### Bootstrap
- `src/main.ts` (158 lines). Finds DOM elements (`:21-25`), builds `Renderer`, `GameState`, `SoundPlayer`; `refit` (`:37-45`) fits the casing from `visualViewport` else `innerWidth/innerHeight` and writes width, height and transform on `#console`, called once at start and on `resize`, `orientationchange`, and `visualViewport` `resize` (`:46-49`); wires START click, keyboard, window `blur`, pointer touch (left/right half by `window.innerWidth / 2`, `:87-100`), `touchmove` and `contextmenu` blocking (`:109-110`); runs a 1/60 s fixed-step loop with 0.25 s frame cap that keeps running during resize or rotation (`:137-155`); flushes events to renderer and sound; writes announcements (`:121-135`). Depends on all modules.
### Renderer
- `src/render/renderer.ts` (493 lines). Draws title, intro, play field, HUD, stage-clear, victory, game-over, all in logical 240x160 coordinates. Gets the 2D context once and disables smoothing (`:116-118`); no resize handling, no `devicePixelRatio`, no `setTransform`. HUD row positions are fixed logical x values (`:71-75`, timer at `HUD_TIMER_X = 132`); hearts from x=202 (`:349-361`). Effects: catch flash, spark, popup, glitch, warning frame (`:93-97`); glitch copies strips of the canvas onto itself (`:386-389`). Depends on Sprites, Screen Timing, `game/config`, `game/types`.
### Sprites
- `src/render/sprites.ts` (313 lines). Text-row bitmaps (HUMAN 20x20, VIRUS, collectibles, LIFE 7x6, AI faces), 3x5 font (`FONT_W`, `FONT_H`, `:297-298`), seven-segment table. Pure data; no size dependence. `OBJECT_SPRITES` maps kind to bitmap.
### Screen Timing
- `src/render/screen-timing.ts` (101 lines). Pure helpers: victory steps, message count, bar fills, blink (1 Hz), `hudTexts`, `reachedLine`, `timerText`, `timerVisible`. No viewport dependence.
### Layout
- `src/render/layout.ts` (34 lines). `CASING_W = 320`, `CASING_H = 240`, `Fit {scale, offsetX, offsetY, width, height}`, `fitCasing(viewportW, viewportH)`: `scale = min(w/320, h/240)`, centred, zero scale for non-finite or non-positive input, no rounding, no minimum. Covered by `tests/render/layout.test.ts`.
### Sound
- `src/audio/sound.ts`. Note tables per cue, `soundForEvent`, `SoundPlayer` (Web Audio, unlocked on first START). Not re-read.
### Usage Tracking Scripts
- `scripts/aidlc_usage.py`, `scripts/aidlc_stage_usage_hook.py`, `scripts/aidlc_hook_event.py`, tests in `tests/scripts/`. Record AI-DLC stage time and credits to `.usage/`. Not part of the game build.
### Build Size Gate
- `scripts/check-size.mjs` with `tests/tooling/check-size.test.ts`. Fails when `dist/` totals 1 MiB or more.
### CI Pipeline
- `.github/workflows/ci.yml`. On PR/push to main: `npm ci`, typecheck, coverage (80% line floor), build, size.
