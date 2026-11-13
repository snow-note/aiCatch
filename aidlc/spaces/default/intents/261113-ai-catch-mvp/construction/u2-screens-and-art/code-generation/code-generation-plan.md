# Code Generation Plan: u2-screens-and-art

## Summary

- Builds: the six final LCD screens (title, stage intro, playing HUD, stage clear, game over, victory sequence), new original sprites and AI face, extended font, shared AI bar, and the silver-grey console page with `h1`, `main`, and the empty live region
- Touches: `src/render/renderer.ts`, `src/render/sprites.ts`, new `src/render/screen-timing.ts`, `src/game/config.ts` (display sub-step constants), `index.html`, `src/style.css`, the drawing section of `src/main.ts`, new `ASSETS.md`, `tests/render/`
- Tests: about 25 Vitest unit tests (new `screen-timing.test.ts`; extended `sprites.test.ts`); screens checked by playing

Design inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/functional-design/functional-spec.md`, `rules.md`, `frontend-components.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/nfr-design/performance-design.md`, `security-design.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/infrastructure-design/infrastructure-specification.md`; contracts C1, C2, C3, C5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; U2 scope in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`; requirements in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; layouts in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/refined-mockups/mockups.md`.

Brownfield: files are changed in place. No dependency is added. U1's game rules (`src/game/state.ts` and friends) are not changed; only display constants are added to `config.ts`.

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

Layer mapping for this unit: "Data model" = sprite and glyph tables (shape tests); "Business logic" = the pure display helpers in `screen-timing.ts`; "Frontend behavior" = the Renderer screens, console page, and `main.ts` drawing section, which team practice checks by playing (not unit-tested). There is no database, repository, or API layer in this unit.

## Steps

### Step 1 — Project structure (US6.1)
- [x] Work on a feature branch `feature/u2-screens-and-art` created from the current branch (U1's work is not yet merged; keep it). Confirm no `package.json` change is needed.

### Step 2 — Test runner check (US7.1)
- [x] Run `npx vitest run tests/render` on the unchanged tree and record that it passes (baseline).

### Step 3 — Data model, Red: sprites and glyphs (US2.1, US4.1, US6.1; BR2.2, BR3.1)
- [x] Extend `tests/render/sprites.test.ts`: `OBJECT_SPRITES` has an entry for every `ObjectKind` (mainframe, tape, floppy, llm, gpu, robot, virus); each object sprite fits 16 × 16 and is different from every other object sprite; `AI_FACE_BROKEN` and `AI_FACE_RESTORED` are 24 × 24, monochrome (`#`/`.` only), and differ; the font has 3 × 5 glyphs for `%`, `.`, `:`, `/`, and `—`. Run `npx vitest run tests/render/sprites.test.ts` and record the failing output.

### Step 4 — Data model, Green and Refactor (BR2.2, BR3.1, BR4.2)
- [x] Draw the original bitmaps in `src/render/sprites.ts` (mainframe, magnetic tape, floppy disk per the outline ideas in `functional-spec.md`; AI face broken and restored), add them to `OBJECT_SPRITES` and `ALL_SPRITES`, and add the glyphs. Run green; refactor while green.

### Step 5 — Business logic, Red: display helpers (US2.1, US3.1, US4.1, US5.1; BR1.4, BR1.5, BR1.6, BR2.1, BR3.2)
- [x] Write `tests/render/screen-timing.test.ts`: `victoryStep(t)` at 0, 1.49, 1.5, 2.49, 2.5, 3.49, 3.5, 10 and for negative or non-finite t; `messagesShown(t)` 0 before 2.5, 1 / 2 / 3 at the 0.33 s steps, never above 3; `barFill(t, ai)` at 0, 0.5, 1.0, 2.5 for ai 25 and 100, never below 0 or above 100; `victoryBarFill(t)` 75 → 100 over the reboot step; `blinkOn(t)` true in the first half of each second; `hudTexts(view)` for a Stage 1 and a Stage 4 view (`'FORTRAN'`, `'AI 25%'`, `'3/10'`; Stage 4 one combined count); `reachedLine(view)` `'REACHED STAGE 3 BASIC'`; `noiseLines(t)` falls from 6 to 0 over the reboot step. Run `npx vitest run tests/render/screen-timing.test.ts` and record the failing output.

### Step 6 — Business logic, Green and Refactor
- [x] Create `src/render/screen-timing.ts` with those pure functions (inputs: numbers and `GameView` fields only). Add to `src/game/config.ts`: `VICTORY_REBOOT_END = 1.5`, `VICTORY_RESTORE_END = 2.5`, `VICTORY_MESSAGE_STEP = 0.33`, `CLEAR_BAR_FILL = 1.0`, `BLINK_HZ = 1`; the hold step starts at `VICTORY_DURATION`. Run green; refactor while green.

### Step 7 — Frontend behavior: console page (US1.1, US6.1; BR4.1; not unit-tested)
- [x] `index.html`: replace `#stage` `div` with `<main id="stage">`; label becomes `<h1 class="brand">AI CATCH</h1>`; remove the POWER button; canvas gets `aria-hidden="true"` (drop its `aria-label`); add `<div id="announcer" class="visually-hidden" role="status" aria-live="polite" data-testid="announcer"></div>` inside `main`.
- [x] `src/style.css`: casing `#c4c7cc` with edge `#9fa3aa`, label `#2f3540` with `margin: 0`, hint `#4a4f58`; `#start-button:focus-visible` outline; `.visually-hidden` rule (clip, 1 px, overflow hidden, absolute). Remove the now-unused POWER `.btn` colours only where no longer referenced.

### Step 8 — Frontend behavior: screens (US1.1-US6.1; BR1.1-BR1.6, BR2.1, BR2.3, BR3.1; not unit-tested)
- [x] `src/render/renderer.ts`: replace U1's placeholder screens with SC-1 to SC-6 from `functional-spec.md` using the helpers; `spriteFor` maps every kind to its own sprite (default branch: the LLM chip); shared `drawAiBar(percent, y)` (outline 160 × 6 at x 40, fill `round(158 × p / 100)`, "AI" label at x 26, percent text at x 204); HUD positions per `mockups.md` (name x 2, AI x 34, score x 66, progress x 108, hearts from x 202); victory noise uses `noiseLines(t)` lines whose positions change 10 times per second. Keep existing effects and their timings.

### Step 9 — Frontend behavior: `main.ts` drawing section (C5)
- [x] Keep `renderer.draw(state.view, now)`; remove any remaining reference to the POWER button. No change outside the drawing and layout section.

### Step 10 — Build and full verification (US7.1)
- [x] Run `npm run typecheck && npm test && npm run build` and record the result and the JS bundle size (compare with 20.65 kB / 6.87 kB gzip from U1). Then the developer plays in `npm run dev` on desktop and phone.

### Step 11 — Documentation and traceability (BR4.2)
- [x] Create `ASSETS.md` at the repository root: every sprite and glyph group listed as original work made for AI CATCH, no third-party assets, no fonts beyond the system monospace stack. Requirement ids in comments where helpful. Then `code-summary.md`, `source-manifest.json`, `traceability.json` (stage Step 5).

### Step 12 — Loop-back 1 repair: Renderer tests (US7.1; NFR5.6; Testing Contract 80% line floor)
Source: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/build-and-test/test-results.md`, Loop-back 1 (full-suite line coverage 47.1%; `src/render/renderer.ts` 0/251 lines). Steps 1-11 stay as built.
- [x] Add `tests/render/renderer.test.ts` with a hand-written fake canvas (`getContext('2d')` returns a fake 2D context whose methods `fillRect`, `clearRect`, `save`, `restore`, `translate`, `drawImage`, `getImageData`, `putImageData` and properties `fillStyle`, `globalAlpha`, `imageSmoothingEnabled` are recorded or no-ops, cast to the DOM types). Literal `GameView` objects built from `STAGES`. Tests: one `draw` per phase (title; stage intro for Stage 1 and Stage 4; playing with every object kind on screen and 1 and 3 lives; stage clear at 0 s and 1 s; game over with and without `newHighScore`, before and after `canReturnToTitle`; victory at 0.5, 2.0, 3.0, 4.0 s) each asserting that drawing happened (`fillRect` calls > 0) and nothing threw; `onEvent` for `catch`, `virus-hit`, `life-lost`, `stage-clear` (no effect), and `run-start` (clears effects), then `draw` while the effects are active and `update` past their lifetime; a canvas whose `getContext` returns `null` makes `draw` a no-op without throwing (NFR5.6). Run `npx vitest run tests/render/renderer.test.ts`.
- [x] No change to `src/render/renderer.ts` unless a test exposes a real defect; any such fix is recorded in `code-summary.md`.
- [x] Run `npm run typecheck && npm test && npm run build` and `npm run coverage`; record `renderer.ts` line coverage (target ≥ 220 of 251) and the full-suite total.

## Story Traceability

| Story | Plan steps |
|---|---|
| US1.1 | 7, 8 |
| US2.1 | 3-6, 8 |
| US3.1 | 5, 6, 8 |
| US4.1 | 3-6, 8 |
| US5.1 | 5, 6, 8 |
| US6.1 | 3, 4, 7, 8, 11 |
| US7.1 | 2, 10 |
