# Code Summary: u1-game-rules

Built from the approved `code-generation-plan.md` (TDD, Testing Contract `sha256:02e7e246…`) on branch `feature/u1-game-rules`. Behaviour follows `functional-design/functional-spec.md` and `rules.md`; contracts C1-C5 in `inception/contract-design/contract-summary.md`.

## Files

| Path | Change | Content |
|---|---|---|
| `src/game/types.ts` | new | Type-only contracts: `ObjectKind`, `CollectibleKind`, `Phase`, `DifficultyValues`, `StageDefinition`, `GameView`, `GameEvent`, `GameControls` |
| `src/game/run.ts` | new | RunProgress: `newRun`, `currentStage`, `recordCatch`, `advanceStage` |
| `src/game/config.ts` | modified | `STAGES` catalogue, `POINTS`/`FALL_TIME` for seven kinds, C1 durations, `AI_RESTORATION_STEP`, `DIFFICULTY_STEP_SECONDS = 8`, `DIFFICULTY_STEPS_TO_CAP = 4`, `EPS`, `MAX_SPAWNS_PER_UPDATE`; `STARTUP_DURATION` and old global difficulty constants removed |
| `src/game/difficulty.ts` | rewritten | `difficultyAt(stage, stageTime)` in equal steps to the cap |
| `src/game/spawner.ts` | rewritten | `pickKind(collectibles, virusShare, random)`, `spawnObject(collectibles, values, order, random)` |
| `src/game/objects.ts` | modified | Three new straight-falling kinds; `isCollectible` replaces `isRescue` |
| `src/game/state.ts` | rewritten | Phase machine title / stage-intro / playing / stage-clear / victory / game-over; implements `GameView` and `GameControls`; `view`, `releaseAll`, `titleEnteredByPress` (BR1.9), EPS timers; `pressPower`, startup, `canRestart`, `elapsed` removed |
| `src/main.ts` | modified (U1 section) | POWER wiring removed; Enter/Space → `inputDown` then `pressStart` (also unlocks sound); blur → `releaseAll`; Renderer gets `state.view`; event-to-sound map compiles (`run-start` → existing game-start sound; new kinds fall back to the LLM catch tone) |
| `src/render/renderer.ts` | modified | Takes `GameView`; startup and power-off drawing removed; placeholder text for stage-intro, stage-clear, victory; new kinds drawn with the LLM sprite until U2 |
| `tests/game/config.test.ts`, `run.test.ts`, `objects.test.ts` | new | Catalogue, run progress, object kinds |
| `tests/game/difficulty.test.ts`, `spawner.test.ts`, `state.test.ts` | rewritten | Stage-based difficulty and spawning; full phase machine |
| `tests/game/highscore.test.ts`, `input.test.ts` | extended | Invalid stored values, throwing storage; `clear()` behaviour |

No dependency added; `package.json`, `index.html`, and `style.css` unchanged.

## Key Decisions

- RunProgress is plain functions over a `Run` record, keeping GameState the only stateful class.
- After the spawn loop the spawn timer is capped at one interval, so a huge `dt` never leaves a backlog that bursts out later (SD-7).
- The catch that reaches the target is handled before the clear, so events are `catch` then `stage-clear`.

## Test Results

- `npx vitest run tests/game`: 9 files, 111 tests passed.
- `npm run typecheck && npm test && npm run build`: type check clean; 12 files, 132 tests passed (render and audio suites unchanged and green); build OK, JS bundle 20.65 kB (6.87 kB gzip).
- Red evidence per step is in the developer's report: config 9/9 failing, run module missing, difficulty 11/11 failing, spawner/objects 11/21 failing, state 24/26 failing before Green. Highscore and input extra cases passed on first run (behaviour already existed, as the plan expected).

## Tests Written but Not Executed

- None among unit tests.
- The manual play check of Step 14 (`npm run dev`, title → Stage 1 → clear or game over → title) was not run here; it needs the developer in a browser.
- The 80% line-coverage floor is not measured: no coverage tool is installed (team practice; adding one needs approval). Build and Test owns it.
- No CI runs these tests yet; CI is decided in the CI Pipeline stage.

## Deviations from the Plan

1. Old global difficulty constants and `STARTUP_DURATION` were removed in Step 4 rather than after Step 8.
2. `isRescue` / `RescueKind` renamed to `isCollectible` / `CollectibleKind` (from `types.ts`).
3. Enter/Space keydown also calls `sound.unlock()`, since the removed POWER button used to unlock audio.
4. The POWER button markup stays in `index.html` unwired; U2 removes it.
