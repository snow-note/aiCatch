# Code Generation Plan: early-heart-loss

## Summary

- Builds: an earlier, fairer first heart loss through the existing hazard rules: higher Stage 1 VIRUS share, an earlier first spawn per stage, a faster Stage 1 VIRUS fall, and aimed VIRUS spawns (1 in 3, all stages), tuned until a 200-seed beginner simulation gives a median first life lost 5-10 s after START
- Touches: `src/game/config.ts`, `src/game/spawner.ts`, `src/game/state.ts`; tests `tests/game/spawner.test.ts`, `tests/game/state.test.ts`, `tests/game/config.test.ts`, new `tests/game/first-heart.test.ts`
- Tests: about 10 new or updated Vitest tests, including the 200-seed simulation; the developer plays Stage 1 at least 3 times before release

Design input: `aidlc/spaces/default/intents/261115-early-heart-loss/inception/requirements-analysis/requirements.md` (FR1-FR6, NFR1-NFR6) and its questions file; code facts in `aidlc/spaces/default/codekb/aiCatch/` and `aidlc/spaces/default/intents/261115-early-heart-loss/inception/reverse-engineering/developer-scan.md`.

Brownfield: files are changed in place. No dependency, no asset. No change to rendering, sound, announcements, `src/main.ts`, `index.html`, or the number of lives. All tunables go in `src/game/config.ts`.

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

Layer mapping for this work: "Data model" = the tunables in `config.ts` (pinned by `config.test.ts`); "Business logic" = the spawner's aimed spawn and the state's first-spawn timing (unit tests), and the whole-run behaviour (the 200-seed simulation). There is no repository, API, or frontend change.

## Steps

### Step 1 — Project structure
- [x] Start a branch from the merged `main`: `git switch main`, `git pull`, `git switch -c feature/early-heart-loss` (uncommitted AI-DLC records move with it). Confirm no `package.json` change is needed.

### Step 2 — Test runner check
- [x] Run `npm test` on the unchanged tree and record the result (baseline: 16 files, 230 tests).

### Step 3 — Business logic, Red: simulation target (FR1.1-FR1.3, NFR1, NFR4)
- [x] Create `tests/game/first-heart.test.ts`: a seeded generator (mulberry32); the beginner model of FR1.2 (each update hold ArrowLeft or ArrowRight toward the horizontal centre of the collectible HUMAN can reach soonest, none when no collectible or already under it; never reacts to VIRUS; uses only `GameControls` and `GameView`); a runner that calls `pressStart()`, steps 1/60 s, and returns the game time of the first `life-lost` event or 60 s. Assert: over seeds 1-200 the median is ≥ 5.0 s and ≤ 10.0 s; a sanity test that a run with no VIRUS at all (stub `random` forcing collectibles) reports 60 s; the whole file runs in under 5 s. Run `npx vitest run tests/game/first-heart.test.ts` and record the failing output (today's median is expected to be well above 10 s). Also record today's median as the baseline.

### Step 4 — Business logic, Red: aimed spawn and first-spawn delay (FR2.2, FR3.1-FR3.3, FR4.1, FR5.1)
- [x] `tests/game/spawner.test.ts`: `spawnObject` with an aim x: when the kind is VIRUS and the aim draw is below the aimed share, x is within aimX ± spread (minus half the object width) and clamped to [0, PLAY_W - OBJECT_W] at both edges; with spread 0 it equals the clamped aim; a VIRUS whose aim draw fails, and every collectible, keep a uniformly random x; without an aim x (undefined) behaviour is as today.
- [x] `tests/game/state.test.ts`: in a new run the first object appears at `FIRST_SPAWN_DELAY` of play (not at one spawn interval) and the next one a spawn interval later; the same holds at the start of Stage 2; a VIRUS contact lowers lives by exactly 1 and a second VIRUS contact right after lowers it again (no invulnerability); a new run has `lives === START_LIVES === 3`.
- [x] Run the two files and record the failing output.

### Step 5 — Data model and business logic, Green (FR2.1-FR2.4, FR3, NFR6)
- [x] `src/game/config.ts`: add `FIRST_SPAWN_DELAY` (start 0.5), `VIRUS_AIM_SHARE` (start 1/3), `VIRUS_AIM_SPREAD` (start `HUMAN_W`); raise Stage 1 `virusShare` start and cap (start about 0.28 / 0.33); make Stage 1 VIRUS fall faster (Stage 1 VIRUS fall through `FALL_TIME.virus` or the Stage 1 multiplier, whichever keeps the stage ordering simplest); raise Stage 2-4 values only where needed to keep the ordering.
- [x] `src/game/spawner.ts`: `spawnObject` takes an optional aim x; for a VIRUS it draws the aim decision from `random` after the kind and, when aimed, sets x = clamp(aimX - OBJECT_W / 2 + (random() * 2 - 1) * VIRUS_AIM_SPREAD). Collectibles keep today's draw order.
- [x] `src/game/state.ts`: at each stage start set the spawn timer so the first spawn happens `FIRST_SPAWN_DELAY` into play; pass HUMAN's centre x (at the spawn moment) to `spawnObject`. No other rule changes.
- [x] Run Steps 3-4 tests green; then tune the starting values only (never the target, the seed set, or the beginner model) until the simulation median is inside [5.0, 10.0] s, preferring the middle (about 7 s). Record each tuning run's median.

### Step 6 — Data model: config pins and fairness (FR2.4, NFR2)
- [x] Update `tests/game/config.test.ts` to the final Stage 1 values (red first against the old pins, then green); keep the ordering tests unchanged and green; add the NFR2 test: at Stage 1 start values a VIRUS needs at least 1.5 s from spawn to first possible contact, and HUMAN at `HUMAN_SPEED` can leave the overlap zone (HUMAN_W + OBJECT_W + 2 × jitter amplitude) within that time. Fix any other existing test that pinned a changed value, keeping its intent.

### Step 7 — Refactor
- [x] Refactor while all tests stay green; keep requirement ids in comments.

### Step 8 — Build and full verification (NFR4, NFR5)
- [ ] Run `npm run typecheck && npm run coverage && npm run build && npm run size`; record test count, line coverage, simulation runtime, final median, and JS bundle size. Then the developer plays Stage 1 at least 3 times as a beginner (FR1.4) and reports when the first heart was lost.

### Step 9 — Documentation and traceability
- [ ] Then `code-summary.md`, `source-manifest.json`, `traceability.json` (stage Step 5).

## Requirement Traceability

| Requirement | Plan steps |
|---|---|
| FR1.1-FR1.3 | 3, 5, 8 |
| FR1.4 | 8 |
| FR2.1, FR2.3, FR2.4 | 5, 6 |
| FR2.2 | 4, 5 |
| FR3.1-FR3.3 | 4, 5 |
| FR4.1, FR5.1 | 4 |
| FR6.1 | 2, 8 (existing suite green) |
| NFR1 | 3, 5 |
| NFR2 | 6 |
| NFR3 | 3, 4 (tests first) |
| NFR4, NFR5 | 8 |
| NFR6 | 5, 6 |
