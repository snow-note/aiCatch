# Component Inventory

Each component lists responsibility, key current values, and dependencies. Cross-references: architecture.md holds the full numeric tables.

### Config
- `src/game/config.ts` (110 lines). All tunables: play area 240x160; OBJECT 16x16; HUMAN 20x20, speed 130 px/s (`:5-14`); FALL_TIME virus 3.0, gpu 2.5, robot 3.5, others 4.0 (`:17-25`); POINTS 100/150/200 (`:28-35`); START_LIVES 3 (`:37`); phase durations (`:40-43`); DIFFICULTY_STEP_SECONDS 8, steps to cap 4 (`:58-59`); `STAGES` start/cap values (`:68-105`); ROBOT sway 22 px/1.6 s, VIRUS jitter 16 px (`:108-110`). Depends on `types.ts`.

### Types
- `src/game/types.ts` (88 lines). Contracts C1-C4 (GameView, GameEvent, StageDefinition/DifficultyValues, GameControls). No runtime code.

### GameState
- `src/game/state.ts` (296 lines). Phase machine: title, stage-intro (2.0 s), playing, stage-clear (2.5 s), victory, game-over. `updatePlaying` (`:247-273`) runs movement, spawn loop (`:255-263`), collisions (`:267-269`), bottom cleanup (`:272`). `handle` (`:276-295`): catch scores and counts; VIRUS removes one life, no invulnerability (`:287-294`). Lives reset only at `startRun` and `returnToTitle` (`:172,238`). Depends on Collision, Config, Difficulty, Input Tracker, Objects, Run, Spawner.

### Objects
- `src/game/objects.ts` (88 lines). `FallingObject`, `createObject` (y=0, vy = 160/FALL_TIME x multiplier, `:58`), `stepObject` (robot sway, VIRUS jitter, `:64-83`), `isBelowPlayArea` (`y >= 160`, `:86`).

### Collision
- `src/game/collision.ts` (43 lines). Strict AABB `overlaps` (`:9`); `resolveCollisions` returns every touched object and one handled object (VIRUS first, else lowest `order`) (`:26-43`).

### Spawner
- `src/game/spawner.ts` (34 lines). `pickKind` (VIRUS if `random() < virusShare`), `spawnObject` (x uniform [0, 224], phase uniform [0, 2pi)).

### Difficulty
- `src/game/difficulty.ts` (23 lines). `difficultyAt`: step count `floor((t+EPS)/8)` capped at 4; lerp of speed, interval, share, max objects (floored).

### Run
- `src/game/run.ts` (39 lines). Stage index, caught count, AI percentage (+25 per stage), completion flag; `advanceStage` resets `caught`.

### Input Tracker
- `src/game/input.ts` (38 lines). Held-input list; direction is the latest held left/right source; returns whether a press is new.

### Announcer
- `src/game/announcer.ts` (43 lines). Screen-reader text and change key; lives are part of the key during play so a lost life is spoken.

### High Score Store
- `src/game/highscore.ts` (56 lines). localStorage-backed best score with in-memory fallback; `submit` saves only a higher score.

### Bootstrap
- `src/main.ts` (158 lines). Finds DOM elements, fits the casing, wires keyboard (arrows, Enter, Space) and pointer (left/right half) input, runs a 1/60 s fixed-step loop with 0.25 s frame cap, flushes events to renderer and sound, writes announcements. Depends on all modules.

### Renderer
- `src/render/renderer.ts` (486 lines). Draws title, intro, play field, HUD, stage-clear, victory, game-over. Hearts: one slot per `START_LIVES` (`:354`), 3 px gap, 7 px wide; last heart blinks 1.0 s after a loss (`:351-360`). Effects: catch flash 0.16 s, spark 0.28 s, popup 0.8 s, glitch 0.45 s (`:92-97`). Sprites are centered in the 16x16 object box and 20x20 HUMAN box (`:232,401-404`).

### Sprites
- `src/render/sprites.ts` (313 lines). Text-row bitmaps: HUMAN 20x20, VIRUS 16x12, collectibles 16x9 to 16x16, LIFE 7x6, AI faces, 3x5 font, seven-segment table. `OBJECT_SPRITES` maps kind to bitmap.

### Screen Timing
- `src/render/screen-timing.ts` (89 lines). Pure helpers: victory steps, message count, bar fills, blink, HUD strings.

### Layout
- `src/render/layout.ts` (34 lines). Casing 320x240; `fitCasing` computes scale and offset.

### Sound
- `src/audio/sound.ts` (172 lines). Note tables per cue, `soundForEvent`, `SoundPlayer` (Web Audio, unlocked on first START; errors swallowed).

### Usage Tracking Scripts
- `scripts/aidlc_usage.py` (480 lines), `scripts/aidlc_stage_usage_hook.py` (109), `scripts/aidlc_hook_event.py` (31), tests in `tests/scripts/test_aidlc_usage.py` (560). Record AI-DLC stage time and credits to `.usage/aidlc-usage.csv` and `.md`. Not part of the game build.

### Build Size Gate
- `scripts/check-size.mjs` (38 lines) with `tests/tooling/check-size.test.ts`. Fails when `dist/` totals 1 MiB or more.

### CI Pipeline
- `.github/workflows/ci.yml` (33 lines). On PR/push to main: `npm ci`, typecheck, coverage (80% line floor), build, size.
