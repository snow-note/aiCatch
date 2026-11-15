# Code Quality Assessment
## Ratings
| Aspect | Rating | Evidence |
|---|---|---|
| Naming clarity | good | descriptive names, requirement IDs in comments |
| Function size | good | rules functions are short; `renderer.ts` (486 lines) is the largest file |
| Error handling | good | game methods never throw (`types.ts:75`); storage and audio errors swallowed (`highscore.ts:32-38`) |
| Test presence | good | one test file per source module under `tests/`; 80% line threshold (`vitest.config.ts`); not run in this scan |
| Duplication | fair | `startRun` and `returnToTitle` repeat the reset block (`state.ts:170-178,235-244`); `enterGameOver` and `enterVictory` repeat the score submit (`state.ts:221,230`) |
| Dead code | good | `noUnusedLocals/Parameters` enforced (`tsconfig.json`) |
## Tooling and Process
- Linting/formatting: none configured; strict `tsc` only.
- CI: typecheck, coverage, build, size on PR and push to main (`.github/workflows/ci.yml`).
- Documentation: README (play, run, release checklist), `ASSETS.md` (asset origins), `original_spec.md` (Japanese spec).
- TODO/FIXME: none seen in files read.
## Technical Debt
- Magic numbers in `renderer.ts` (effect lives `:93-97`, HUD x `:71-75`) and in `objects.ts:76` (jitter frequencies 5.1, 11.7). Low impact.
- Tests pin tunables: see "Tests that pin the values" below.
## Intent Findings: stage time limit, Stage 2 difficulty, fall speed 1.2-1.5x (derived from code reading, not measured)
Intent: 90 s per stage, game over at 0 s; Stage 2 about as hard as Stage 4; item fall speed x1.2-1.5; clears almost always score 8000. (The prior store's findings on first heart loss are superseded: its VIRUS FALL_TIME 3.0 and VIRUS shares 0.10-0.35 no longer match `config.ts`.)
1. **No time limit exists.** A stage ends only by catching `requiredCount` (`run.ts:25-33`); the only game-over trigger is lives = 0 (`state.ts:299-302`). `stageTime` (private, `state.ts:62`, advanced `:250`) and `phaseTime` (public, equal to play time during `playing`, `state.ts:148-150`) already count play seconds; both reset per stage.
2. **Hook point.** After `this.stageTime += dt` (`state.ts:250`) inside `updatePlaying`, compare against a limit and call `enterGameOver()` (`:226-232`). `enterGameOver` clears objects and submits the score; the stage-clear catch path returns early (`:278`), so a limit check must not preempt a clearing catch in the same update. A `1e6` dt (`state.test.ts:235-240`) would then end in `game-over`, which that test already allows.
3. **HUD room.** The playing HUD has about 70 px free between the progress text (ends x 127) and the hearts (start x 202) on row y 4 (`renderer.ts:71-75,221-226`). The 3x5 font has digits and `:` (`sprites.ts:292`). The remaining time must be added to `GameView` (`types.ts:37-62`); `hudTexts` is typed on a `Pick` of three fields (`screen-timing.ts:74`), so an extra optional field keeps its tests valid (`screen-timing.test.ts:105-120`).
4. **Game-over messaging has no cause.** `game-over` event, game-over screen and announcer text are the same for every cause (`types.ts:73`, `renderer.ts:276-286`, `announcer.ts:32-33`). A TIME UP cue needs new view data or an event field; `reachedLine` and the announcer key are unaffected (`announcer.ts:42`).
5. **Why a clear scores about 8000.** Score = fixed 3600 (Stages 1-3 catches) + 2000 (bonuses) + Stage 4 catches (16 x mean 150 = 2400), range 7200-8800, sd about 163 (`config.ts:28-35,76-103`, `spawner.ts:17-20`). Neither time nor lives affect it (`state.ts:296-298`). A time limit adds a new failure mode but does not change the score of a clear.
6. **Time budget is generous.** Collectible supply is about 0.5/s at every stage start (0.55-0.57/s at the cap), so a perfect catcher clears in about 20, 24, 28, 32 s (Stages 1-4). A 90 s limit needs 12 of about 45 (Stage 2) or 16 of about 45 (Stage 4) supplied items, so it constrains slow or dodging-only play.
7. **Stage 2 to Stage 4 values.** Stage 2 start/cap: speed 1.1/1.35, interval 1.1/0.9, VIRUS share 0.45/0.50, max objects 4/5, required 12. Stage 4: 1.3/1.7, 0.9/0.7, 0.55/0.60, 5/6, required 16 (`config.ts:78-86,96-104`). `config.test.ts:78-87` requires every later stage to be not easier and strictly harder on at least one value in both start and cap, so making Stage 2 equal to Stage 4 contradicts that test unless Stage 3 is placed between or the test changes.
8. **Fall speed levers (x1.2-1.5).** Three places: `FALL_TIME` (`config.ts:17-25`, all stages, all kinds), per-stage `fallSpeedMultiplier` (`config.ts:74-103`), or the `createObject` formula (`objects.ts:58`). Speed x1.2 at Stage 1 start lowers the VIRUS band-reach time from 1.71 s to 1.42 s, below the 1.5 s floor in `config.test.ts:111-120`. Stage 4 cap at x1.7 already gives 1.00 s; a further x1.2-1.5 gives 0.67-0.83 s, and HUMAN needs 36 px / 130 px/s = 0.28 s for the overlap window alone.
## Tests that pin the values
- `tests/game/config.test.ts`: required counts and bonus (`:62-65`), later-stage ordering (`:78-87`), Stage 1 start and cap (`:89-102`), `FIRST_SPAWN_DELAY`, `VIRUS_AIM_*`, `FALL_TIME.virus` 2.2 (`:104-109`), 1.5 s VIRUS reaction (`:111-120`), `POINTS` gpu/robot (`:131-132`), phase durations (`:133-139`).
- `tests/game/difficulty.test.ts`: Stage 1 multiplier 1.05 at 8 s, 1.1 / interval 1.1 / share 0.425 at 17 s, cap at 32 s (`:17-37`).
- `tests/game/spawner.test.ts:61-65`: ratio 1.5 and `PLAY_H / 4.0` for mainframe; `tests/game/objects.test.ts:8-20`: `vy = PLAY_H / FALL_TIME[kind]`.
- `tests/game/first-heart.test.ts:57-71`: median first heart loss 5-10 s from START over 200 seeds (beginner model, 60 s horizon).
- `tests/game/state.test.ts`: first spawn timing (`:210-218`), huge dt (`:235-240`), clear score `POINTS x required + clearBonus` (`:269`), full clear to victory (`:300-325`), game-over event order and 2.0 s hold (`:349-377`).
- `tests/game/announcer.test.ts:67-75`: game-over text. `tests/render/renderer.test.ts`: draw-without-throw checks with a fake canvas; no HUD pixel assertions.
