# Code Generation Plan: u4-accessibility

## Summary

- Builds: the pure `screenAnnouncement(view)` text-and-key builder for all six screens and the write-on-change wiring into the hidden `#announcer` live region
- Touches: new `src/game/announcer.ts`, the announcement section of `src/main.ts`, new `tests/game/announcer.test.ts`
- Tests: about 14 new Vitest unit tests in `tests/game/announcer.test.ts`; screen-reader output checked by playing with VoiceOver

Design inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u4-accessibility/functional-design/functional-spec.md`, `rules.md` (BR1.1-BR2.4), `entities.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u4-accessibility/nfr-design/security-design.md` (SD4-1 to SD4-6), `logical-components.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u4-accessibility/infrastructure-design/cicd-pipeline.md`; contracts C1 and C5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; U4 scope in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`; FR13.2 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`.

Brownfield: `src/main.ts` is changed in place. No dependency is added. `index.html` is not changed (U2 already added `#announcer`). Game rules, rendering, and sound are not changed.

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

Layer mapping for this unit: "Data model" = the `Announcement` shape (`{ key, text }`) and its type; "Business logic" = the pure `screenAnnouncement` text and key rules; "Frontend behavior" = the `main.ts` announcement section (lookup, guard, write on change), which team practice checks by playing. There is no database, repository, or API layer in this unit.

## Steps

### Step 1 — Project structure (US6.1)
- [x] Work on a feature branch `feature/u4-accessibility` created from the current branch with `git switch -c` (U1-U3 work is not yet committed; keep it). Confirm no `package.json` change is needed.

### Step 2 — Test runner check (US7.1)
- [x] Run `npx vitest run tests/game` on the unchanged tree and record that it passes (baseline).

### Step 3 — Business logic, Red: texts (US6.1; BR1.1-BR1.6)
- [x] Create `tests/game/announcer.test.ts`. Build literal `GameView` objects from `STAGES` in `src/game/config.ts` (a small helper in the test file). Tests:
  - title text with `best` 1200 and with `best` 0 (BR1.2);
  - stage-intro text for each of the four stages, including item names "mainframes", "magnetic tapes", "floppy disks", "LLM, GPU, and robot parts" (BR1.2, BR1.3);
  - playing text "Stage 1 FORTRAN, AI 0%, score 300, 3 of 10, 3 lives"; "1 life" singular; "0 lives" for a defensive view (BR1.2, BR1.4);
  - stage-clear text "FORTRAN recovered. AI 25%." (BR1.2);
  - game-over and victory texts, with " New high score." only when `newHighScore` is true, using entry-frame views where `best` equals `score` (BR1.2, BR1.5);
  - two calls with the same view give equal results (BR1.1).
  Run `npx vitest run tests/game/announcer.test.ts` and record the failing output.

### Step 4 — Business logic, Red: keys (BR2.1, BR1.6)
- [x] Add key tests: `title:1`, `stage-intro:4`, `playing:1:3`; equal keys for two playing views that differ only in `score` and `caught`; different keys when `lives` differ; equal keys when only `phaseTime` or `canReturnToTitle` differ (game-over and victory). Run the same command and record the failing output.

### Step 5 — Data model and business logic, Green and Refactor (BR1.1-BR2.1; SD4-1, SD4-3, SD4-5)
- [x] Create `src/game/announcer.ts`: `export interface Announcement { readonly key: string; readonly text: string }` and `export function screenAnnouncement(view: GameView): Announcement`. Type-only import of `GameView`; fixed item names by stage number; text built only from numbers, `stage.name`, and fixed string constants; no DOM, storage, network, or timer. Run green; refactor while green.

### Step 6 — Frontend behavior: `main.ts` announcement section (US6.1; BR2.2-BR2.4; SD4-2, SD4-4; C5; not unit-tested)
- [x] Add an announcement section to `src/main.ts`: `const announcer = document.getElementById('announcer')` (not the throwing `el()`), `let lastKey: string | null = null`, and `announce()` that, inside one `try/catch`, calls `screenAnnouncement(state.view)` and, when `announcer` exists and `a.key !== lastKey`, sets `announcer.textContent = a.text` and then `lastKey = a.key`. Call `announce()` in `frame` right after `renderer.draw(...)`. No `innerHTML`. No change outside this section and the one call line.

### Step 7 — Build and full verification (US7.1; SD4-6)
- [ ] Run `npm run typecheck && npm test && npm run build` and record the result and the JS bundle size (must stay within +1 kB of 25.26 kB from U3). Search `src/` for `innerHTML` and record that there is none. Then the developer plays in `npm run dev` with VoiceOver on desktop and phone: title, each stage intro, a lost life, stage clear, game over, and victory are announced; catches are not.

### Step 8 — Documentation and traceability (US6.1)
- [x] Requirement ids in comments where helpful. Then `code-summary.md`, `source-manifest.json`, `traceability.json` (stage Step 5).

### Step 9 — Loop-back 1 repair: bundle size (US7.1; NFR2.4, SD4-6)
Source: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/build-and-test/test-results.md`, Loop-back 1 (JS 26.32 kB against the ≤ 26.26 kB target; at least 60 bytes over). Steps 1-8 stay as built.
- [x] Refactor `src/game/announcer.ts` (and, only if needed, the announcement section of `src/main.ts`) so the minified bundle shrinks by at least 60 bytes without changing any announced sentence or key: for example item names as an array indexed by `stageNumber - 1`, one shared helper for the repeated "AI {ai}%." part, and no fallback branch that cannot happen with the four stages. Purity, `textContent`, and the single `try/catch` stay as they are.
- [ ] All 15 tests in `tests/game/announcer.test.ts` stay green with no test changed (they pin every sentence and key).
- [ ] Run `npm run typecheck && npm test && npm run build`; record the JS size, which must be ≤ 26.26 kB. If 60 bytes cannot be saved without changing wording, stop and record it as Not Met for the developer to decide; do not change sentences or the target.

## Story Traceability

| Story | Plan steps |
|---|---|
| US6.1 | 1, 3-6, 8 |
| US7.1 | 2, 7 |
