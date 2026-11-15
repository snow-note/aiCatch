# Component Inventory
Each component lists responsibility, key current values, and dependencies. Cross-references: architecture.md holds the victory flow, layout flows and numeric tables. All components listed under `src/game/`, `src/render/` and `src/main.ts` were read this run.
### Config
- `src/game/config.ts` (128 lines). All tunables: play area 240x160 (`:5-6`); OBJECT 16x16; HUMAN 20x20, speed 130 px/s; FALL_TIME; POINTS; START_LIVES 3; phase durations (`:40-43`, `VICTORY_DURATION` 3.5); display sub-steps `VICTORY_REBOOT_END` 1.5, `VICTORY_RESTORE_END` 2.5, `VICTORY_MESSAGE_STEP` 0.33, `CLEAR_BAR_FILL` 1.0, `BLINK_HZ` 1 (`:45-52`); `STAGES` start/cap values (`:68-109`); `STAGE_TIME_LIMIT` 90, `TIME_WARNING_SECONDS` 10, `TIME_BONUS_PER_SECOND` 10 (`:111-116`). Depends on `types.ts`.
### Types
- `src/game/types.ts` (97 lines). Contracts C1-C4 (GameView, GameEvent, StageDefinition/DifficultyValues, GameControls). No runtime code.
### GameState
- `src/game/state.ts` (341 lines). Phase machine: title, stage-intro, playing, stage-clear, victory, game-over; `update(dt)`, `inputDown/inputUp/releaseAll`, `pressStart`, `drainEvents`, getter `canReturnToTitle` (`:114-118`), private `enterVictory` (`:236-242`) and `returnToTitle` (`:255-265`). In `victory` it only advances `phaseTime`. Depends on Collision, Config, Difficulty, Input Tracker, Objects, Run, Spawner.
### Objects
- `src/game/objects.ts`. `FallingObject`, `createObject`, `stepObject`, `isBelowPlayArea` (`y >= 160`).
### Collision
- `src/game/collision.ts`. Strict AABB `overlaps`; `resolveCollisions`.
### Spawner
- `src/game/spawner.ts`. `pickKind`, `spawnObject` (x uniform [0, 224]).
### Difficulty
- `src/game/difficulty.ts`. `difficultyAt`: 8 s steps capped at 4, linear start to cap.
### Run
- `src/game/run.ts` (39 lines). Stage index, caught count, AI percentage (+25 per stage), `complete` flag set on the last stage (`:25-33`).
### Input Tracker
- `src/game/input.ts` (38 lines). Held-input list; direction is the latest held left/right source; `press(id, dir)` returns whether new (`:17-21`); `release`, `clear`. No notion of screen size.
### Announcer
- `src/game/announcer.ts` (43 lines). Screen-reader text per phase and change key `phase:stageNumber`; victory text at `:35`. Pure, reads `GameView` only.
### High Score Store
- `src/game/highscore.ts`. localStorage-backed best score with in-memory fallback.
### Page Shell
- `index.html` and `src/style.css` (skimmed). Page with `main#stage`, `div#console` 320x240 casing, `.bezel` holding `canvas#screen` (240x160, `image-rendering: pixelated`), `.controls` with the START button and MOVE hint, and a visually hidden announcer. Depends on Bootstrap.
### Bootstrap
- `src/main.ts` (215 lines). Finds DOM elements, builds `Renderer`, `GameState`, `SoundPlayer`; `refit` (`:72-90`) places the casing from the visual viewport and safe-area insets; wires START click, keyboard (arrows, Enter/Space), window `blur`, pointer input (`:144-163`), `touchmove`/`contextmenu` blocking (`:166-167`); runs a 1/60 s fixed-step loop with a 0.25 s frame cap (`:195-212`); flushes events to renderer and sound (`:170-176`); writes announcements when the key changes (`:182-192`). Depends on all modules.
### Renderer
- `src/render/renderer.ts` (493 lines). Draws title, intro, play field, HUD, stage-clear, victory (`drawVictory` `:296-319`), game-over, all in logical 240x160 coordinates. Shared parts: `drawAiBar` (`:324-335`), `drawScoreLine` (`:338-341`), `drawNoise` (`:344-354`), `drawBitmap`, `drawText` and `textWidth` (`:428-456`), `drawNumber` seven-segment (`:459-467`). Effects: catch flash, spark, popup, glitch, warning frame. Depends on Sprites, Screen Timing, `game/config`, `game/types`.
### Sprites
- `src/render/sprites.ts` (313 lines). Text-row bitmaps (HUMAN 20x20, VIRUS, collectibles, LIFE, AI faces 24x24 `:201-232`), 3x5 `FONT` table (`:249-296`, `FONT_W`/`FONT_H` `:297-298`), seven-segment table. Pure data.
### Screen Timing
- `src/render/screen-timing.ts` (101 lines). Pure helpers: `victoryStep`, `messagesShown`, `victoryBarFill`, `noiseLines`, `barFill`, `blinkOn`, `hudTexts`, `reachedLine`, `timerText`, `timerVisible`. Depends on `game/config` and `game/types`.
### Layout
- `src/render/layout.ts` (96 lines). `CASING_W/H` 320x240, `SETTLE_DELAY_MS` 300, `fitCasing`, `fitArea`, `placeCasing`, `isValidFit`, `chooseFit`, `touchSide`, `orientationOf`. Leaf module; covered by `tests/render/layout.test.ts`.
### Sound
- `src/audio/sound.ts` (skimmed). Note tables per cue (victory cue `:75-86`), `soundForEvent`, `SoundPlayer` (Web Audio, unlocked on first press).
### Usage Tracking Scripts
- `scripts/aidlc_usage.py`, `scripts/aidlc_stage_usage_hook.py`, `scripts/aidlc_hook_event.py`, tests in `tests/scripts/`. Record AI-DLC stage time and credits to `.usage/`. Not part of the game build.
### Build Size Gate
- `scripts/check-size.mjs` with `tests/tooling/check-size.test.ts`. Fails when `dist/` totals 1 MiB or more.
### CI Pipeline
- `.github/workflows/ci.yml`. On PR/push to main: `npm ci`, typecheck, coverage (80% line floor), build, size.
