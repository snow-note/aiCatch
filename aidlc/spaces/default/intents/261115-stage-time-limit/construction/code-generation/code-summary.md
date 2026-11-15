# Code Summary: Stage Time Limit and Difficulty Rebalance

Intent: `261115-stage-time-limit` (express, zero-Unit). Branch `feature/stage-time-limit` (from `origin/main` `a1bc3d7`). Not committed yet.

## Files Modified

| File | Change |
|---|---|
| `src/game/config.ts` | Stage 2-4 difficulty values; `collectibleSpeedFactor` 1.2/1.3/1.4/1.5 per stage; `STAGE_TIME_LIMIT` 90, `TIME_WARNING_SECONDS` 10, `TIME_BONUS_PER_SECOND` 10 |
| `src/game/types.ts` | `GameOverReason`; `StageDefinition.collectibleSpeedFactor`; `GameView.timeLeft` and `gameOverReason`; `game-over.reason`, `stage-clear.timeBonus`, new `time-warning` event |
| `src/game/state.ts` | `timeLeft` getter; time-out check at the end of `updatePlaying`; `time-warning` once per second for 10..1; time bonus at clear; `enterGameOver(reason)` |
| `src/game/spawner.ts` | `spawnObject` takes the stage factor (default 1) and applies it to collectibles only |
| `src/game/announcer.ts` | `Time up. ` prefix for a time-out game over |
| `src/render/screen-timing.ts` | Pure helpers `timerText`, `timerVisible` |
| `src/render/renderer.ts` | HUD timer at x 132, y 4 (hidden on the off half of each blink in the last 10 s); `TIME UP` line at y 42 on the game over screen |
| `src/audio/sound.ts` | Original `time-tick` cue (1047 Hz, 0.06 s square note); `time-warning` maps to it |
| `tests/game/{config,spawner,state,announcer}.test.ts`, `tests/render/{screen-timing,renderer}.test.ts`, `tests/audio/sound.test.ts` | New tests and updated pins |

No files were created or deleted. No dependency was added. Files the person owns (`README.md`, `ASSETS.md`, and others) and `.kiro/settings/mcp.json` were not touched.

## Key Implementation Decisions

- The time-out check runs last in `updatePlaying`. A clearing catch or a fatal VIRUS hit in the same update returns earlier, so the clear (FR3.5) or the lives reason wins.
- `timeLeft` and the time-out check share the same small tolerance (`EPS`), so the timer reads 0 exactly when the run ends.
- `time-warning` fires when `ceil(timeLeft)` drops to a new value in 1..10; `lastTimerSecond` resets at each stage intro.
- Stage values follow the plan table: Stage 2 equals the old Stage 4; Stages 3 and 4 rise slightly above it.

## Test Coverage Summary

- Red runs recorded by the developer: config 3 failures, spawner 2, state 8, announcer 1, render/audio 7, each before its Green step.
- `npm run typecheck`: no errors.
- `npx vitest run`: 17 files, 264 tests passed (was 244).
- `npm run build`: JS 27.45 kB (gzip 9.12 kB). `npm run size`: `dist/` 30,628 bytes, under the 1,048,576-byte budget.
- `tests/game/first-heart.test.ts` (NFR4) passes unchanged.

## Tests Written but Not Executed Here

- None. The 80% line-coverage floor (`npm run coverage`) was not run in this stage; Build and Test checks it on the full suite.
- Manual play checks (HUD position, blink, beep, `TIME UP`) are not done yet; they belong to Build and Test and the preview deployment.

## Deviations from the Plan

- FR4.3 says the beep respects the existing sound on/off setting. The game has no such setting, so the beep plays through the same `SoundPlayer` path as every other sound.
- `spawnObject` gets the factor as a new last parameter with a default of 1.
- In `state.test.ts`, the "max objects" test now advances 15 updates of 0.4 s instead of 1.2 s steps, because Stage 1 collectibles fall 1.2x faster and leave the play area sooner.
- Refactor steps 11 and 14 needed no code change.
