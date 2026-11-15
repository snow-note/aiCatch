# Code Generation Plan: Stage Time Limit and Difficulty Rebalance

## Summary

- Builds: harder Stage 2-4 values, faster collectibles (1.2x-1.5x by stage), a 90 s per-stage timer with HUD, last-10 s blink and beep, TIME UP game over, and a remaining-seconds x 10 time bonus
- Touches: `src/game/{config,types,state,spawner,announcer}.ts`, `src/render/{screen-timing,renderer}.ts`, `src/audio/sound.ts`, and their tests under `tests/`
- Tests: about 14 new or changed Vitest unit tests (config, spawner, state, announcer, screen-timing, sound), plus updated value pins

Intent: `261115-stage-time-limit` (express, zero-Unit, Minimal test strategy). Requirements: `inception/requirements-analysis/requirements.md`. Code facts: `inception/reverse-engineering/developer-scan.md`.

## Design Decisions

- **Stage values (FR1).** Stage 1 is unchanged. Stage 2 takes the current Stage 4 values. Stages 3 and 4 rise in small steps above Stage 2 so the ordering test holds, while keeping Stage 4 close to its current feel (the user called it well balanced):

  | Stage | Start {speed, interval, VIRUS, max} | Cap {speed, interval, VIRUS, max} |
  |---|---|---|
  | 1 FORTRAN | 1.0, 1.2, 0.40, 3 (unchanged) | 1.2, 1.0, 0.45, 4 (unchanged) |
  | 2 COBOL | 1.3, 0.9, 0.55, 5 | 1.7, 0.7, 0.60, 6 |
  | 3 BASIC | 1.35, 0.88, 0.56, 5 | 1.75, 0.69, 0.61, 6 |
  | 4 LLM | 1.4, 0.85, 0.58, 5 | 1.8, 0.68, 0.62, 6 |

  Required counts (10/12/14/16) and clear bonus (500) stay.
- **Collectible speed (FR2).** New `StageDefinition.collectibleSpeedFactor` in `config.ts`: 1.2 / 1.3 / 1.4 / 1.5. `spawnObject` multiplies the fall speed by it for collectibles only; VIRUS keeps `FALL_TIME.virus x fallSpeedMultiplier`.
- **Timer (FR3).** New constants in `config.ts`: `STAGE_TIME_LIMIT = 90`, `TIME_WARNING_SECONDS = 10`, `TIME_BONUS_PER_SECOND = 10`. Remaining time is `max(0, STAGE_TIME_LIMIT - stageTime)`. `stageTime` only grows in `updatePlaying` and resets in `enterStageIntro`, so the timer stops outside play. The time-out check runs at the end of `updatePlaying`, after collisions; a clearing catch returns earlier, so the clear wins a tie (FR3.5). A VIRUS hit that ends the run also returns earlier, so the reason stays "lives".
- **View and events (FR3.6, FR5.1, FR4.3).** `GameView` gains `timeLeft: number` (seconds, during play; 90 elsewhere until play starts) and `gameOverReason: 'lives' | 'time' | null`. The `game-over` event gains `reason: 'lives' | 'time'`. A new event `{ type: 'time-warning'; secondsLeft: number }` is pushed once each time `ceil(timeLeft)` drops to a value from 10 down to 1. `stage-clear` gains `timeBonus: number`.
- **Time bonus (FR6).** At clear, `timeBonus = floor(timeLeft) x TIME_BONUS_PER_SECOND` is added to the score along with `clearBonus`.
- **HUD (FR4.1, FR4.2).** A pure helper in `screen-timing.ts`, `timerText(timeLeft)`, returns `T nn` with `nn = ceil(timeLeft)`. Another pure helper, `timerVisible(timeLeft, phaseTime)`, returns false during the off half of each blink in the last 10 s. The renderer draws the text at x = 132, y = 4 with the existing 3x5 font.
- **Game over (FR5.2, FR5.3).** `drawGameOver` draws `TIME UP` (scale 1, centered, y = 42) when `gameOverReason === 'time'`. The announcer prefixes the game over text with `Time up. ` for that reason.
- **Beep (FR4.3).** New sound `time-tick` (one short 1047 Hz square note, 0.06 s, original). `soundForEvent` maps `time-warning` to it. The game has no sound on/off setting today, so the beep plays through the existing `SoundPlayer` path like every other cue; the "respects the existing sound on/off setting" part of FR4.3 has nothing to attach to (noted as a deviation in the code summary).
- **NFR2.** The Stage 1 VIRUS reaction floor in `config.test.ts` drops from 1.5 s to 1.2 s; Stage 1 VIRUS speed is unchanged (1.705 s).
- **NFR3.** A config test checks for every stage: `requiredCount / ((1 - start.virusShare) / start.spawnInterval) + FIRST_SPAWN_DELAY <= 60`.
- No new dependency. Files the person owns (`README.md`, `ASSETS.md`, and others) are not changed.

## Steps

- [x] Step 1: Project structure check. Confirm no new files or dependencies are needed beyond the source and test files listed in the Summary.
- [x] Step 2: Verify the test runner. Run `npx vitest run tests/game/config.test.ts` and record that it passes before changes; record the unit-scoped command from `unit-test-instructions.md`.
- [x] Step 3: Business logic (config) - Red. In `tests/game/config.test.ts`: pin the new Stage 2-4 start and cap values and `collectibleSpeedFactor` 1.2/1.3/1.4/1.5 (FR1.1, FR1.2, FR2.1); keep the ordering test (FR1.2) and Stage 1 pins (FR1.3); pin `STAGE_TIME_LIMIT 90`, `TIME_WARNING_SECONDS 10`, `TIME_BONUS_PER_SECOND 10` (FR3.1, FR6.2, NFR1); lower the VIRUS reaction floor to 1.2 s (NFR2); add the 60 s minimum-clear-time check (NFR3). Run and record the failing output.
- [x] Step 4: Business logic (config) - Green. Update `src/game/config.ts` and `StageDefinition` in `src/game/types.ts` until Step 3 passes.
- [x] Step 5: Business logic (spawner) - Red. In `tests/game/spawner.test.ts`: a collectible's `vy` equals `PLAY_H / FALL_TIME[kind] x fallSpeedMultiplier x factor`, and a VIRUS `vy` has no factor (FR2.1, FR2.2). Update the existing `slow.vy = PLAY_H / 4.0` pin to include the factor. Run and record the failing output.
- [x] Step 6: Business logic (spawner) - Green. Pass the stage factor into `spawnObject` (`src/game/spawner.ts`, call site in `state.ts`) until Step 5 passes.
- [x] Step 7: Business logic (state) - Red. In `tests/game/state.test.ts`: `timeLeft` is 90 at play start and falls with play time only, not during stage intro or stage clear (FR3.2, FR3.3, FR3.6); reaching 90 s of play ends in `game-over` with `reason: 'time'`, lives above 0, and `gameOverReason === 'time'` (FR3.4); a clearing catch in the same update as time-out gives `stage-clear` (FR3.5); a lives game over has `reason: 'lives'` (FR5.1); `time-warning` events come once each for 10..1 (FR4.3); a clear adds `floor(timeLeft) x 10` and the event carries `timeBonus` (FR6.1). Update the existing clear-score expectation (`POINTS.mainframe x required + clearBonus`) to include the time bonus. Run and record the failing output.
- [x] Step 8: Business logic (state) - Green. Implement in `src/game/state.ts` and `src/game/types.ts` until Step 7 passes.
- [x] Step 9: Business logic (announcer) - Red. In `tests/game/announcer.test.ts`: a time-out game over announcement starts with `Time up. ` and a lives game over is unchanged (FR5.3). Run and record the failing output.
- [x] Step 10: Business logic (announcer) - Green. Update `src/game/announcer.ts`.
- [x] Step 11: Business logic - Refactor while all game tests stay green (`npx vitest run tests/game`).
- [x] Step 12: Frontend behavior - Red. In `tests/render/screen-timing.test.ts`: `timerText(90)` is `T 90`, `timerText(9.2)` is `T 10`, `timerText(0.4)` is `T 1`, `timerText(0)` is `T 0` (FR4.1); `timerVisible` is always true above 10 s and alternates within the last 10 s (FR4.2). In `tests/audio/sound.test.ts`: `soundForEvent({type:'time-warning'})` is `time-tick` and `time-tick` notes are valid (FR4.3). In `tests/render/renderer.test.ts`: the fake view gets `timeLeft` and `gameOverReason`; playing and game over (reason `time`) screens draw without throwing (FR4.1, FR5.2). Run and record the failing output.
- [x] Step 13: Frontend behavior - Green. Add the helpers to `src/render/screen-timing.ts`, the HUD timer and `TIME UP` line to `src/render/renderer.ts`, and the `time-tick` sound to `src/audio/sound.ts`.
- [x] Step 14: Frontend behavior - Refactor while tests stay green.
- [x] Step 15: Environment and build. Run `npm run typecheck`, `npm test`, `npm run build`, `npm run size`; fix any failure without changing thresholds.
- [x] Step 16: Documentation and traceability. Requirement IDs in comments where code implements them; the orchestrator writes `code-summary.md` and `traceability.json`.

## Requirement to Step Map

| Requirement | Steps |
|---|---|
| FR1.1, FR1.2, FR1.3 | 3, 4 |
| FR2.1, FR2.2 | 3, 4, 5, 6 |
| FR3.1 | 3, 4 |
| FR3.2, FR3.3, FR3.4, FR3.5, FR3.6 | 7, 8 |
| FR4.1, FR4.2 | 12, 13 |
| FR4.3 | 7, 8, 12, 13 |
| FR5.1 | 7, 8 |
| FR5.2 | 12, 13 |
| FR5.3 | 9, 10 |
| FR6.1 | 7, 8 |
| FR6.2 | 3, 4 |
| NFR1 | 3, 4 |
| NFR2, NFR3 | 3, 4 |
| NFR4 | 11, 15 (`tests/game/first-heart.test.ts` stays green) |
| NFR5 | 15 |
| NFR6 | 13 |
| NFR7 | 1, 13 |

## Testing Contract
```json
{
  "version": 1,
  "methodology": "tdd",
  "source": "team",
  "ordering": "Write a failing Vitest test for each game-logic behaviour, implement until it passes, then check rendering, sound, and input wiring by playing the game.",
  "scope": "express",
  "test_strategy": "minimal",
  "project_type": "brownfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "- **Methodology**: tdd\n- **Methodology evidence**: The developer chose tests first for game logic. The repository already holds Vitest tests that mirror `src/game`, so the pattern fits the existing layout.\n- **Ordering**: Write a failing Vitest test for each game-logic behaviour, implement until it passes, then check rendering, sound, and input wiring by playing the game.\n- **Framework**: Vitest 5.1.0, `environment: node`, `tests/**/*.test.ts`, run with `npm test`.\n- **Type check**: `npm run typecheck` (`tsc --noEmit`, strict, `noUnusedLocals`, `noUnusedParameters`).\n- **Coverage**: No coverage floor and no coverage tool. The existing suite stays green and new game logic gets tests.\n- **Manual checklist**: Before each release, run a short manual checklist on desktop (keyboard) and smartphone (touch, portrait and landscape).\n- **Not unit-tested**: Rendering, sound, and input wiring (`src/main.ts`, `src/render/renderer.ts`) are checked by playing."
    }
  ],
  "obligations": {
    "strategy": "minimal",
    "strategy_volume": [
      "One verifiable test per requirement at the narrowest effective level.",
      "At least one happy-path unit test per component.",
      "Unit tests are the default; a bugfix/security scope floor may require an integration or E2E regression when that is the narrowest level that reproduces the defect."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "tdd",
    "runner_step": "Verify the existing test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Verify the existing test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - Red: write the failing tests and record the failing command output.",
      "Data model / database behavior - Green: implement only enough behavior to pass.",
      "Data model / database behavior - Refactor: improve the implementation while tests stay green.",
      "Repository / data access - Red: write the failing tests and record the failing command output.",
      "Repository / data access - Green: implement only enough behavior to pass.",
      "Repository / data access - Refactor: improve the implementation while tests stay green.",
      "Business logic - Red: write the failing tests and record the failing command output.",
      "Business logic - Green: implement only enough behavior to pass.",
      "Business logic - Refactor: improve the implementation while tests stay green.",
      "API / endpoint - Red: write the failing tests and record the failing command output.",
      "API / endpoint - Green: implement only enough behavior to pass.",
      "API / endpoint - Refactor: improve the implementation while tests stay green.",
      "Frontend behavior - Red: write the failing tests and record the failing command output.",
      "Frontend behavior - Green: implement only enough behavior to pass.",
      "Frontend behavior - Refactor: improve the implementation while tests stay green.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:c994d39ddc84917f2fd1c8e798ed55966e6be637e54839773cbf88ddbe130fe8",
  "contract_sha256": "sha256:3233a4587a8aac3c9ee00fcce2d90745213358d120306718367a9e8c50a19a52"
}
```

Layers not applicable to this change: data model / database, repository / data access, and API / endpoint (the game has no database, storage change, or API in this work). Business logic and frontend behavior (pure render, announcer, and sound helpers) follow Red, Green, Refactor.
