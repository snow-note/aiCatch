## Developer Code Scan Results

Intent: 261115-stage-time-limit (express scope, Minimal depth). Repo: `aiCatch` (single repo, head `c41d9198e9a7eafde81f47f19748936e97bc42df`). Code reading only; no tests, builds, or programs were run. Line numbers are from the files as read in this run.

### Scan Coverage

- Breadth: focused scan of `src/game`, `src/render`, `tests/game`, `tests/render`, merged into the STALE store `aidlc/spaces/default/codekb/aiCatch/`.
- Read in full: `src/game/{config,state,types,difficulty,objects,run,spawner,announcer}.ts`, `src/render/{renderer,screen-timing,layout}.ts`.
- Read in part (targeted): `src/render/sprites.ts` (LIFE, FONT constants), tests `config`, `state`, `difficulty`, `first-heart`, `spawner`, `objects`, `announcer`, `renderer`, `screen-timing` (spot reads and greps).
- Not read in detail: `collision.ts`, `input.ts`, `highscore.ts`, `tests/game/{collision,highscore,input,run}.test.ts`, `tests/render/{layout,sprites}.test.ts`.
- Outside the snapshot paths (not re-scanned; prior store content kept): `src/main.ts`, `src/audio/`, scripts, CI.
- Stale facts found in the prior store and corrected: VIRUS FALL_TIME is 2.2 (store said 3.0); VIRUS shares are 0.40-0.60 (store said 0.10-0.35); `config.ts` is 117 lines, `state.ts` 305 lines; `FIRST_SPAWN_DELAY = 0.5` and `VIRUS_AIM_*` exist (store described the first spawn at one full interval).

### Current Difficulty Values (`src/game/config.ts`)

Fall speed `vy = (PLAY_H / FALL_TIME[kind]) * fallSpeedMultiplier` (`objects.ts:58`), PLAY_H = 160 (`config.ts:6`).

| Kind | FALL_TIME s (`config.ts:17-25`) | Base vy px/s |
|---|---|---|
| mainframe, tape, floppy, llm | 4.0 | 40.0 |
| robot | 3.5 | 45.7 |
| gpu | 2.5 | 64.0 |
| virus | 2.2 | 72.7 |

| Stage (`config.ts`) | Required | Speed x start / cap | Spawn interval s | VIRUS share | Max objects | Bonus |
|---|---|---|---|---|---|---|
| 1 FORTRAN (`:69-77`) | 10 | 1.0 / 1.2 | 1.2 / 1.0 | 0.40 / 0.45 | 3 / 4 | 500 |
| 2 COBOL (`:78-86`) | 12 | 1.1 / 1.35 | 1.1 / 0.9 | 0.45 / 0.50 | 4 / 5 | 500 |
| 3 BASIC (`:87-95`) | 14 | 1.2 / 1.5 | 1.0 / 0.8 | 0.50 / 0.55 | 4 / 5 | 500 |
| 4 LLM (`:96-104`) | 16 | 1.3 / 1.7 | 0.9 / 0.7 | 0.55 / 0.60 | 5 / 6 | 500 |

- Steps: `DIFFICULTY_STEP_SECONDS = 8`, `DIFFICULTY_STEPS_TO_CAP = 4` (`config.ts:58-59`). Values lerp start to cap by `min(floor(stageTime/8),4)/4` (`difficulty.ts:12-23`). Cap is reached at 32 s of play in a stage.
- `FIRST_SPAWN_DELAY = 0.5` (`config.ts:108`); `spawnTimer` is initialised to `spawnInterval - 0.5` at stage intro (`state.ts:186`), so the first object appears 0.5 s into play.
- `VIRUS_AIM_SHARE = 1/3`, `VIRUS_AIM_SPREAD = HUMAN_W = 20` (`config.ts:110,112`); consumed at `spawner.ts:36-41`, aim point is HUMAN centre at spawn time (`state.ts:266`).
- Spawn skipped (timer still consumed) while `objects.length >= maxObjects` (`state.ts:258-260`).
- Collectible supply rate is about equal in every stage: `(1 - virusShare) / spawnInterval` = 0.50/s at every start (S1 0.6/1.2, S2 0.55/1.1, S3 0.5/1.0, S4 0.45/0.9) and 0.55-0.57/s at every cap. Minimum clear time with perfect catching is therefore about `required / 0.5` + 0.5 s: S1 about 20 s, S2 24 s, S3 28 s, S4 32 s (before maxObjects skips). Stage 2 differs from Stage 4 in speed (1.1 vs 1.3 start), interval, VIRUS share (0.45 vs 0.55), max objects (4 vs 5) and 12 vs 16 required catches.

### Points and Why a Clear Scores About 8000

- `POINTS`: mainframe/tape/floppy/llm 100, gpu 150, robot 200 (`config.ts:28-35`). `clearBonus` 500 per stage (`config.ts:76,85,94,103`). A catch always scores (`state.ts:287-289`); a VIRUS hit never reduces score (`state.ts:296-298`); stage time and lives do not enter the score.
- Stages 1-3 are fixed: (10 + 12 + 14) x 100 = 3600. Stage 4: 16 catches, kinds drawn uniformly from `[llm, gpu, robot]` (`spawner.ts:17-20`), mean 150 per catch = 2400 (sd about 163; range 1600-3200). Bonuses 4 x 500 = 2000.
- Total on a full clear: 3600 + 2000 + Stage 4 (mean 2400) = 8000 mean, range 7200-8800, typical 8000 +/- 160. The score only depends on required counts, not on skill, so every full clear ends near 8000.
- Score is submitted on both victory and game over (`state.ts:221,230`).

### Stage Time and Run End (`src/game/state.ts`)

- `phaseTime` (public, `state.ts:50`) is seconds since the current phase began; `update` adds dt to it first (`:144`). It resets to 0 when `stage-intro` ends and `playing` starts (`:148-150`), so during `playing` it equals the in-stage play time.
- `stageTime` (private, `state.ts:62`) is added in `updatePlaying` (`:250`) and reset in `enterStageIntro` (`:184`); it drives only `difficultyAt` (`:256`). It is NOT in `GameView` (`types.ts:37-62`); `phaseTime` is, and during `playing` it carries the same value.
- `updatePlaying` order (`:249-282`): stageTime, HUMAN move, difficulty, spawns, step objects, collisions and `handle`, bottom cleanup. `handle` returns true when it ended the phase (`:285-304`).
- Phase flow: title -> stage-intro (2.0 s) -> playing -> stage-clear (2.5 s) -> next intro, or victory after Stage 4; game-over from playing only (`:145-160`, `:207-232`). `game-over` and `victory` hold 2.0 s / 3.5 s before a press returns to title (`:100-104`).
- Only one game-over path exists today: lives reach 0 in `handle` (`:299-302`). `enterGameOver` (`:226-232`) sets phase, clears objects, submits the score, pushes event `game-over {score, newHighScore}`. It carries no reason field (`types.ts:73`). `lives` is left unchanged by `enterGameOver`, so a future time-out would end the run with lives above 0.
- Events emitted (`types.ts:65-73`): `run-start`, `stage-start{stageIndex}`, `catch`, `virus-hit`, `life-lost`, `stage-clear`, `victory`, `game-over`. A clear catch pushes `catch` before `stage-clear` (`:289`, `:199`).
- `update(dt)` ignores non-finite or non-positive dt (`:142`). A huge dt (the test uses `1e6`) runs one `updatePlaying` with `stageTime += 1e6`; spawns are capped by `MAX_SPAWNS_PER_UPDATE = 100` (`config.ts:65`, `state.ts:258`).
- A time-out hook point is the top or bottom of `updatePlaying`, after `stageTime += dt` (`:250`), calling `enterGameOver()` and returning. The stage-clear catch path (`:290-292`) must win a tie within the same update.

### HUD Rendering (`src/render/renderer.ts`)

- `drawPlaying` (`:220-262`) draws the HUD on row y = 4 (digits y = 3, height 9 so y 3-11): stage name at x=2 (`HUD_NAME_X`, `:71`), `AI nn%` at x=34, 6-digit seven-segment score at x=66, `caught/required` at x=108, three heart slots from x=202 (`:75`, `:349-361`; LIFE is 7 px wide, gap 3, so hearts occupy x 202-228). A 1 px rule is drawn at y=14 and y=159 (`:228-229`).
- Text uses the 3x5 font at scale 1: width `4 * chars - 1` px (`:421-423`; `FONT_W=3`, `FONT_H=5`, `sprites.ts:297-298`). Widest names/values: `FORTRAN`/`AI 100%` 27 px, `16/16` 19 px. The ends are x = 29, 61, 101 (score 6 x 6 - 1 = 35 px), 127. Free horizontal space on the HUD row: about x = 130 to 200 (about 70 px, enough for `T 90` or a 2-digit seven-segment number). The font includes digits, `:` and `/` (`sprites.ts:292-293`).
- HUD strings come from `hudTexts(view)` (`screen-timing.ts:74-84`), typed `Pick<GameView,'stage'|'caught'|'aiRestoration'>`; tested at `tests/render/screen-timing.test.ts:105-120`.
- Game-over screen `drawGameOver` (`:276-286`): `GAME OVER` (scale 3, y=20), AI bar y=56, `REACHED STAGE n NAME` y=68 (`reachedLine`, `screen-timing.ts:87-89`), `SCORE` y=88, `HI-SCORE` y=104, blinking `NEW!`, `PRESS ANY KEY` at y=136 once `canReturnToTitle`. No cause line ("TIME UP") exists. Glitch is applied only if `glitch > 0` (set by `virus-hit`, `:126-128`).
- Renderer effects react to `catch`, `virus-hit`, `life-lost`, `run-start` only (`:119-142`); `game-over` is ignored by `onEvent`.
- Screen-timing helpers (`screen-timing.ts`): `victoryStep`, `messagesShown`, `barFill`, `victoryBarFill`, `noiseLines`, `blinkOn` (1 Hz, on in the first half, `:66-71`), `hudTexts`, `reachedLine`. All pure; `safeTime` maps bad time to 0 (`:25-27`).

### Announcer (`src/game/announcer.ts`)

- Game over text: `Game over. AI {n}%. Score {score}. High score {best}.[ New high score.]` (`:32-33`, `high` at `:22`). Playing text: `Stage n NAME, AI x%, score s, caught of req, L lives` (`:28-29`). Key is `phase:stageNumber`, plus `:lives` only while playing (`:42`), so a time-out needs no key change but cannot be told apart from a lives game over by text.

### Tests That Pin These Values

- `tests/game/config.test.ts`: required counts 10/12/14/16 and bonus 500 (`:62-65`); each later stage and cap is not easier and strictly harder on at least one value (`:78-87`); Stage 1 start and cap equal `{1.0,1.2,0.4,3}` and `{1.2,1.0,0.45,4}` (`:89-102`); `FIRST_SPAWN_DELAY 0.5`, `VIRUS_AIM_SHARE 1/3`, `VIRUS_AIM_SPREAD 20`, `FALL_TIME.virus 2.2` (`:104-109`); VIRUS contact time at Stage 1 start >= 1.5 s: (160-20-16)/(160/2.2 x 1.0) = 1.705 s (`:111-120`), which would drop to 1.42 s if Stage 1 start speed were scaled by 1.2 and fail; POINTS gpu 150, robot 200 (`:131-132`); phase durations 2.0/2.5/3.5/2.0 (`:133-139`).
- `tests/game/difficulty.test.ts`: Stage 1 `fallSpeedMultiplier` 1.05 at 8 s and 1.1 at 17 s, spawnInterval 1.1, virusShare 0.425, maxObjects 3, cap at 32 s (`:17-37`).
- `tests/game/spawner.test.ts:61-65`: speed ratio 1.5 and `slow.vy = PLAY_H / 4.0` for mainframe (so `FALL_TIME.mainframe` must stay 4.0 unless this test changes). `tests/game/objects.test.ts:8-20`: `vy = PLAY_H / FALL_TIME[kind]` (symbolic).
- `tests/game/first-heart.test.ts`: a beginner model loses the first heart at median 5-10 s over 200 seeds (`:57-71`); it runs up to `TIME_LIMIT = 60` s of play per seed (`:6`), which is under a 90 s limit.
- `tests/game/state.test.ts`: first spawn at `FIRST_SPAWN_DELAY` and `maxObjects` of Stage 1 (`:199-233`); `update(1e6)` expects phase in `['playing','game-over']` (`:235-240`); clear score `POINTS.mainframe * required + clearBonus` (`:269`); full 4-stage clear ends in victory with a single `victory` event (`:300-325`); game over event order `virus-hit, life-lost, ... game-over` and 2.0 s hold (`:349-377`).
- `tests/game/announcer.test.ts:67-75` pins the game-over text; `tests/render/renderer.test.ts` only checks that each screen draws without throwing (`:74-130`), so a HUD timer cannot break it unless the fake view lacks a new required field.

## Handoff Summary

- The 9 candidate artifacts are written to `.aidlc-engine/codekb-stage-aiCatch/` with `kind: partial`; the prior `./` scope moves to `shallow.paths`.
- Time-limit work touches: `config.ts` (new constant, per-stage or global), `state.ts` `updatePlaying` (time-out -> `enterGameOver`), `types.ts` (a GameView field for remaining time, optional event reason), `renderer.ts` HUD (free area x about 130-200, y 4), `announcer.ts`/`renderer.ts` game-over text if a TIME UP cue is wanted.
- Fall speed 1.2-1.5x can be applied at `FALL_TIME` (`config.ts:17-25`, global), `STAGES` multipliers (`config.ts:74-103`), or `objects.ts:58`; tests above pin Stage 1 values, `FALL_TIME.virus`, `FALL_TIME.mainframe` (via `spawner.test.ts:65`) and the 1.5 s Stage 1 VIRUS reaction check.
- Stage 2 to match Stage 4 conflicts with the strict stage ordering test (`config.test.ts:78-87`) because Stage 3 sits between; a test or value change is required.
- Open point for design: the "8000 almost always" cause is that score depends only on fixed required counts; a time limit alone will not vary it unless catches become partial on time-out (game over scores what was caught so far).
