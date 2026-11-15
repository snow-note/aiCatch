# Code Generation Plan: u3-sound

## Summary

- Builds: three new original catch tones (mainframe, tape, floppy), a stage-clear arpeggio (~0.8 s) and a victory fanfare (~2.5 s), and the pure event-to-cue function `soundForEvent`; the startup cue is removed
- Touches: `src/audio/sound.ts`, the sound section of `src/main.ts`, `tests/audio/sound.test.ts`, `ASSETS.md` (Sounds line)
- Tests: about 12 new Vitest unit tests in `tests/audio/sound.test.ts`; audible behaviour checked by playing

Design inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u3-sound/functional-design/functional-spec.md`, `rules.md`, `entities.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u3-sound/nfr-design/security-design.md`, `logical-components.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u3-sound/infrastructure-design/cicd-pipeline.md`; contracts C2 and C5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; U3 scope in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`; FR12 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`.

Brownfield: files are changed in place. No dependency is added. Game rules (`src/game/`) and the Renderer (`src/render/`) are not changed.

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

Layer mapping for this unit: "Data model" = the `SOUNDS` note lists and `SoundName` (shape and length tests); "Business logic" = the pure `soundForEvent` mapping; "Frontend behavior" = `SoundPlayer` scheduling and the `main.ts` sound section, which team practice checks by playing (only the silent-failure path is unit-tested). There is no database, repository, or API layer in this unit.

## Steps

### Step 1 — Project structure (US6.1)
- [x] Work on a feature branch `feature/u3-sound` created from the current branch with `git switch -c` (U1 and U2 work is not yet committed; keep it). Confirm no `package.json` change is needed.

### Step 2 — Test runner check (US7.1)
- [x] Run `npx vitest run tests/audio` on the unchanged tree and record that it passes (baseline).

### Step 3 — Data model, Red: cue tables (US6.1; BR1.2, BR1.3, BR1.4, BR1.5, BR1.6, BR2.2)
- [x] Extend `tests/audio/sound.test.ts`: the six existing cues (`game-start`, `catch-llm`, `catch-gpu`, `catch-robot`, `virus-hit`, `game-over`) equal their current note lists, copied into the test as literals (BR1.2); `catch-mainframe`, `catch-tape`, `catch-floppy` exist, each lasts at most 0.4 s, and all six catch cues are pairwise different (BR1.3); `stage-clear` lasts at most 1.0 s and each note is higher than the one before (BR1.4); `victory` lasts between 2.0 s and 3.0 s (BR1.5); `SOUNDS` has no `startup` key (BR1.6); every note in every cue has positive frequency and length and non-negative start (kept). Change the `SoundPlayer` no-Web-Audio test to play `game-start` instead of `startup` (BR2.2). Run `npx vitest run tests/audio/sound.test.ts` and record the failing output.

### Step 4 — Data model, Green and Refactor (BR1.2-BR1.6)
- [x] In `src/audio/sound.ts`: remove `startup` from `SoundName` and `SOUNDS`; add `catch-mainframe` (two low relay blips 330 Hz, 392 Hz, ~0.2 s), `catch-tape` (glide 440 → 660 Hz, ~0.2 s), `catch-floppy` (three seek clicks 587, 523, 784 Hz, ~0.25 s), `stage-clear` (C5-E5-G5-C6, ~0.8 s), `victory` (three rising phrases ending on a held high note, ~2.5 s). All values are original, written for this game. Update the doc comments: audio is unlocked by the first START press, not POWER. Run green; refactor while green.

### Step 5 — Business logic, Red: event mapping (US6.1; BR1.1)
- [x] Add `soundForEvent` tests: `run-start` → `game-start`; `catch` of each of the six collectible kinds → its own catch cue; `virus-hit` → `virus-hit`; `stage-clear` → `stage-clear`; `victory` → `victory`; `game-over` → `game-over`; `stage-start` and `life-lost` → `null`. Event objects are built literally in the C2 `GameEvent` shape from `src/game/types.ts`. Run `npx vitest run tests/audio/sound.test.ts` and record the failing output.

### Step 6 — Business logic, Green and Refactor (BR1.1)
- [x] Add the pure `soundForEvent(e: GameEvent): SoundName | null` to `src/audio/sound.ts` (type-only import of `GameEvent`; no DOM). Run green; refactor while green.

### Step 7 — Frontend behavior: `main.ts` sound section (US1.1, US6.1; BR1.1, BR2.1; C5; not unit-tested)
- [x] Replace the inline `soundFor` in the events section with `soundForEvent` and drop the now-unused `SoundName` import. Keep `sound.unlock()` before `pressStart()` in the START button and Enter/Space handlers (already in place). No change outside the sound section.

### Step 8 — Build and full verification (US7.1)
- [ ] Run `npm run typecheck && npm test && npm run build` and record the result and the JS bundle size (compare with 24.78 kB / 8.17 kB gzip from U2). Then the developer plays in `npm run dev` on desktop and phone: each catch sounds different, stage clear and victory cues play, silence on a phone before START, nothing breaks when muted.

### Step 9 — Documentation and traceability (US6.1)
- [x] Add a "Sounds" line to `ASSETS.md`: every cue is an original square-wave note list generated at run time with the Web Audio API; no audio files and no third-party sounds (SD3-5). Then `code-summary.md`, `source-manifest.json`, `traceability.json` (stage Step 5).

### Step 10 — Loop-back 1 repair: SoundPlayer tests (US7.1; NFR5.8, NFR5.10; Testing Contract 80% line floor)
Source: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/build-and-test/test-results.md`, Loop-back 1 (`src/audio/sound.ts` 18/39 lines; `SoundPlayer` scheduling untested). Steps 1-9 stay as built.
- [x] Extend `tests/audio/sound.test.ts` with a hand-written fake `AudioContext` installed on `globalThis` for the test and removed afterwards (fields `currentTime`, `state`, `destination`; methods `resume`, `createOscillator`, `createGain` returning fakes with `frequency`/`gain` params that record `setValueAtTime` and `linearRampToValueAtTime`, plus `connect`, `start`, `stop`; `type` recorded). Tests: `unlock` creates the context once across two calls; `unlock` calls `resume` when `state` is `'suspended'`; `play('virus-hit')` creates one oscillator per note, square type, slide notes ramp frequency, and the gain peak is 0.12 (NFR5.10); `play` before `unlock` does nothing; a `createOscillator` that throws leaves `play` silent and not throwing (NFR5.8); `webkitAudioContext` is used when `AudioContext` is missing. Run `npx vitest run tests/audio`.
- [x] No change to `src/audio/sound.ts` unless a test exposes a real defect; any such fix is recorded in `code-summary.md`.
- [x] Run `npm run typecheck && npm test && npm run build` and `npm run coverage`; record `sound.ts` line coverage (target ≥ 37 of 39) and the full-suite total.

## Story Traceability

| Story | Plan steps |
|---|---|
| US1.1 | 7, 8 |
| US6.1 | 1, 3-7, 9 |
| US7.1 | 2, 8 |
