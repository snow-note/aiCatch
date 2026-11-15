# Code Generation Plan: u1-game-rules

## Summary

- Builds: the four-stage game rules (stage catalogue, run progress, stage-based difficulty and spawning, new object kinds, new phase machine with title/intro/clear/victory/game-over)
- Touches: `src/game/` (new `types.ts`, `run.ts`; rewritten `config.ts`, `difficulty.ts`, `spawner.ts`, `objects.ts`, `state.ts`), `tests/game/`, plus minimal compile-keeping edits in `src/main.ts` and `src/render/renderer.ts`
- Tests: about 60 Vitest unit tests across 8 game-logic test files (new `config`, `run`, `objects`; rewritten `difficulty`, `spawner`, `state`; extended `input`, `highscore`)

Design inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/functional-spec.md`, `rules.md`, `entities.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/nfr-design/security-design.md`; contracts C1-C5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; unit scope in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`; requirements in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`.

Brownfield: files are changed in place. No dependency is added. `index.html` and `style.css` are not changed (the POWER button markup is removed by U2; after this unit it is simply no longer wired).

## Testing Contract
```json
{
  "version": 1,
  "methodology": "tdd",
  "source": "team",
  "ordering": "Write a failing Vitest test for each game-logic behaviour, implement until it passes, then check rendering, sound, and input wiring by playing the game.",
  "scope": "mvp",
  "test_strategy": "standard",
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
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Meet an 80% line-coverage floor.",
      "Run the selected tests in CI before merge."
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
  "input_sha256": "sha256:1121fa0710da87e0ae3e845c90c8cbd1117233d864da88f97eff8857e8a72455",
  "contract_sha256": "sha256:02e7e246a2b608612b674a814efe6285e1d7bf6e14057cce5b00bb7e5962bdad"
}
```

Layer mapping for this unit: "Data model" = shared types and the stage catalogue; "Repository / data access" = HighScoreStore (unchanged storage boundary, extra tests only); "Business logic" = RunProgress, Difficulty, Spawner, FallingObjects, InputTracker; "API / endpoint" = the `GameView` / `GameControls` surface of GameState (C1, C4); "Frontend behavior" = not unit-tested by team practice (`main.ts`, Renderer), checked by playing. There is no database.

## Steps

### Step 1 — Project structure (US7.1)
- [x] Create a feature branch `feature/u1-game-rules` from `main` if not already on one. Confirm no `package.json` change is needed.

### Step 2 — Test runner check (US7.1, AC7.1.7)
- [x] Run `npx vitest run tests/game` on the unchanged tree and record that it passes (baseline). This is the unit-scoped command for every Red/Green step below.

### Step 3 — Data model, Red: types and stage catalogue (US2.1, US3.1; BR2.1, BR5.3, BR5.4, BR3.1, BR6.3)
- [x] Write `tests/game/config.test.ts`: exactly four stages in order with names FORTRAN/COBOL/BASIC/LLM; collectibles per stage and never `virus`; required counts 10/12/14/16; clear bonus 500; each later stage equal or harder on every `difficultyStart` and `difficultyCap` value and strictly harder on at least one; each cap equal or harder than its start; Stage 1 start values as specified; `POINTS` and `FALL_TIME` cover every collectible kind (and `FALL_TIME` VIRUS); C1 duration constants 2.0/2.5/3.5/2.0. Run `npx vitest run tests/game/config.test.ts` and record the failing output.

### Step 4 — Data model, Green and Refactor (BR2.1, BR5.3, BR1.10)
- [x] Create `src/game/types.ts` (type-only: `ObjectKind`, `CollectibleKind`, `Phase`, `DifficultyValues`, `StageDefinition`, `GameView`, `GameEvent`, `GameControls`, per C1-C4). Extend `src/game/config.ts`: `STAGES` catalogue (functional-spec table), `POINTS` and `FALL_TIME` for seven kinds, `STAGE_INTRO_DURATION`, `STAGE_CLEAR_DURATION`, `VICTORY_DURATION`, `GAME_OVER_DURATION`, `AI_RESTORATION_STEP = 25`, `DIFFICULTY_STEP_SECONDS = 8`, `DIFFICULTY_STEPS_TO_CAP = 4`, `EPS = 1e-9`, `MAX_SPAWNS_PER_UPDATE = 100`. Remove `STARTUP_DURATION` and the old global difficulty constants once Step 8 no longer uses them. Run the config test green, then tidy while green.

### Step 5 — Repository / data access, Red and Green: HighScoreStore (US5.1; BR8.1, BR8.2; NFR8.2, NFR8.3)
- [x] Extend `tests/game/highscore.test.ts` with any missing cases: `"1e3"`, `"-5"`, very large digit strings, whitespace, `null`; throwing `getItem` and `setItem`. Run `npx vitest run tests/game/highscore.test.ts`; record any failing output (the existing implementation is expected to pass; if every new case passes on first run, record that the behaviour already existed). No production change unless a case fails.

### Step 6 — Business logic, Red: RunProgress (US2.1, US3.1, US4.1; BR2.2, BR2.3, BR2.4)
- [x] Write `tests/game/run.test.ts`: new run at stage 0 / caught 0 / AI 0; a current-stage collectible adds 1; a kind outside the stage adds nothing; Stage 4 counts LLM, GPU, ROBOT together; reaching the required count reports cleared and raises AI by 25; advance moves to the next stage with caught 0; Stage 4 clear sets complete with AI 100; AI never exceeds 100. Run `npx vitest run tests/game/run.test.ts` and record the failing output.

### Step 7 — Business logic, Green: RunProgress
- [x] Create `src/game/run.ts` (small class or functions over a `Run` record, reading `STAGES` and `AI_RESTORATION_STEP`). Run green, refactor while green.

### Step 8 — Business logic, Red and Green: Difficulty (US2.1; BR5.1, BR5.2, BR1.10)
- [x] Rewrite `tests/game/difficulty.test.ts` for `difficultyAt(stage, stageTime)`: start values at 0 s; one step at 8 s (and exactly at 8 s with EPS); Stage 1 example at 17 s (1.1, 1.1 s, 0.125, 3); cap reached at 32 s and held at 100 s; `maxObjects` rounded down; negative or non-finite time gives start values. Record the failing output, then rewrite `src/game/difficulty.ts` and run green.

### Step 9 — Business logic, Red and Green: Spawner and FallingObjects (US2.1; BR6.2, BR6.3)
- [x] Rewrite `tests/game/spawner.test.ts`: `pickKind(collectibles, virusShare, random)` returns VIRUS when random < share (including at time 0, no grace period), otherwise equal shares among the given collectibles with index clamped; `spawnObject` places x inside the play area and applies the fall-speed multiplier. Add `tests/game/objects.test.ts`: mainframe, tape, floppy fall straight at `PLAY_H / FALL_TIME[kind] × multiplier`; ROBOT sway and VIRUS jitter still stay inside the play area; `isBelowPlayArea`. Record the failing output, then update `src/game/spawner.ts` and `src/game/objects.ts` (import `ObjectKind` from `types.ts`) and run green.

### Step 10 — Business logic, Red and Green: InputTracker focus loss (BR7.2, BR7.4)
- [x] Extend `tests/game/input.test.ts`: after `clear()`, no direction remains and a press of a previously held id is new again. Record the run (expected to pass on existing `clear()`; record if so). No production change unless a case fails.

### Step 11 — API surface, Red: GameState view and controls (US1.1, US2.1, US3.1, US4.1, US5.1; BR1.1-BR1.10, BR2.3-BR2.7, BR3.x, BR4.x, BR6.1, BR7.1, BR7.3, BR9.2)
- [x] Rewrite `tests/game/state.test.ts` with a scripted `random` and fake store:
  - starts on title; arrow `inputDown` on title does not start; `pressStart` → stage-intro with `run-start` then `stage-start {0}`; run values reset.
  - stage-intro → playing after exactly 2.0 s (120 steps of 1/60); nothing spawns in the intro; input ignored; a direction held across the intro moves HUMAN on the first playing update.
  - catch scoring per kind and progress; VIRUS −1 life with `virus-hit` then `life-lost`, score unchanged; VIRUS wins over a collectible touched in the same update; missed objects vanish with no change.
  - spawn skip at `maxObjects`; bounded spawns with a huge `dt`.
  - reaching the target: objects cleared, +500, AI +25, `catch` then `stage-clear`, phase stage-clear with C1 per-phase values; after 2.5 s next stage-intro with `stage-start {1}`, caught 0, score and lives carried, stageTime reset.
  - Stage 4 clear → stage-clear → victory with `victory {score, newHighScore}`, high score submitted, AI 100.
  - last life → game-over with `game-over`, high score submitted, run values kept.
  - `canReturnToTitle` only after 2.0 s (game over) / 3.5 s (victory); a held key is not a new press; Enter as `inputDown` then `pressStart` on game over reaches the title only (BR1.9); a later separate press starts a run.
  - `releaseAll` clears held inputs; invalid `dt` ignored; unknown `inputUp` ignored; `view` returns the same object typed as `GameView`; values stay in range over a long simulated run.
  Run `npx vitest run tests/game/state.test.ts` and record the failing output.

### Step 12 — API surface, Green and Refactor: GameState
- [x] Rewrite `src/game/state.ts`: implements `GameView` and `GameControls`, `view` getter, phases and workflows W1-W7 of the functional spec, `titleEnteredByPress` flag, EPS comparisons, `releaseAll`. Remove `pressPower`, `startupTime`, `canRestart`, `elapsed`. Run the state test green, then the whole unit command `npx vitest run tests/game`, and refactor while green.

### Step 13 — Frontend wiring (not unit-tested; C5 U1 section and placeholder drawing)
- [x] `src/main.ts` (U1 section only): drop the POWER button lookup and handler; Enter/Space call `inputDown` then `pressStart`; START button calls `sound.unlock()` and `pressStart`; window `blur` calls `state.releaseAll()`; pass `state.view` to the Renderer; minimal edit to the existing event-to-sound map so it compiles (`run-start` plays the existing game-start sound; new catch kinds fall back to the existing LLM catch tone; no new sounds — U3 owns those).
- [x] `src/render/renderer.ts`: take `GameView`; remove the power-off and startup drawing and the `STARTUP_DURATION` import; draw the new phases with placeholder text (stage name and count on stage-intro, "<NAME> RECOVERED" and AI % on stage-clear, "AI RESTORED 100" on victory); draw the three new kinds with an existing sprite as a placeholder until U2 adds their bitmaps; `canRestart` → `canReturnToTitle`.

### Step 14 — Build configuration and full verification (US7.1)
- [x] Run `npm run typecheck && npm test && npm run build` and record the result. Then play in `npm run dev` (run by the developer): title → START → Stage 1 intro → play → clear or game over → title.

### Step 15 — Documentation and traceability
- [x] Requirement ids in comments where helpful (team practice). Write `code-summary.md`, `source-manifest.json`, and `traceability.json` (Step 5 of the stage).

## Story Traceability

| Story | Plan steps |
|---|---|
| US1.1 | 11, 12, 13 |
| US2.1 | 3, 4, 6-9, 11, 12 |
| US3.1 | 3, 4, 6, 7, 11, 12 |
| US4.1 | 6, 7, 11, 12, 13 |
| US5.1 | 5, 11, 12 |
| US7.1 | 1, 2, 14 |
