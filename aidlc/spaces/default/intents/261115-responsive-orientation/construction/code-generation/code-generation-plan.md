# Code Generation Plan: Responsive Gameplay Fixes (Orientation and Scaling)

## Summary

- Builds: settle-time re-fits after rotation, keep-last-valid-fit (no scale 0), fit inside the visible viewport offset and safe-area insets, touch split at the casing centre, release held input when portrait/landscape flips
- Touches: `src/render/layout.ts`, `src/main.ts`, `src/style.css`, `tests/render/layout.test.ts`
- Tests: about 10 new Vitest unit tests for pure layout helpers in `tests/render/layout.test.ts` (existing `fitCasing` tests unchanged), plus manual play on iPhone Safari

Intent: `261115-responsive-orientation` (bugfix, zero-Unit, Minimal test strategy). Requirements: `inception/requirements-analysis/requirements.md`. Code facts: `inception/reverse-engineering/developer-scan.md`.

## Design Decisions

All new logic is pure and lives in `src/render/layout.ts`; `src/main.ts` only reads the browser values and wires events. Nothing under `src/game/` or `src/audio/` changes (NFR1).

- **Viewport and insets (FR3.1, FR3.2).** New types `ViewportRect { x, y, width, height }` and `Insets { top, right, bottom, left }`. New pure `fitArea(viewport, insets): ViewportRect` subtracts the insets from the visible viewport (position from `visualViewport.offsetLeft/offsetTop`). Non-finite or negative insets count as 0. Width or height can come out 0 or negative; that is an invalid area.
- **Placing the casing (FR3.3, NFR2).** New pure `placeCasing(area): Fit` returns `fitCasing(area.width, area.height)` with `area.x` and `area.y` added to the offsets. `fitCasing` itself does not change, so its tests and today's look stay the same (with no insets and no offset the result equals `fitCasing`).
- **Keep the last valid fit (FR2.1, FR2.2).** New pure `isValidFit(fit)` (scale finite and > 0) and `chooseFit(next, previous): Fit | null` returning `next` when valid, else `previous` (which may be `null`). When the result is `null` (no valid fit yet, for example an invalid size at first load or insets larger than the screen), `refit` applies nothing and leaves the casing as the stylesheet places it; the next re-fit tries again. This settles review finding R-03.
- **Reading the browser (FR3.1, FR3.2).** In `refit`, the visible viewport is `visualViewport` (`offsetLeft`, `offsetTop`, `width`, `height`); when it is missing or its size is invalid, `window.innerWidth/innerHeight` with offset 0 is used. Safe-area insets are read with one mechanism: `#stage` gets `padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px)` in `src/style.css`, and `refit` reads `getComputedStyle(stage).paddingTop` and the other three with `parseFloat` (NaN reads as 0). Padding does not move the absolutely positioned `#console`, which is placed only by its transform. This settles R-04; the DOM read is checked by manual play, the arithmetic by unit tests.
- **Touch split (FR4.1).** New pure `touchSide(clientX, area): -1 | 1`, left when `clientX < area.x + area.width / 2`. `area` is the fit area last used for a valid fit, so the split is the centre of the casing, the same measure the layout uses (Q5 A). Before any valid fit, the area is the visible viewport. This settles R-02.
- **Release held input on rotation (FR5.1).** New pure `orientationOf(width, height): 'portrait' | 'landscape'` (portrait when height > width). `refit` compares it with the last applied orientation and calls `state.releaseAll()` only when it flips. A resize without a flip (address bar showing or hiding) does not release input. This settles R-01.
- **Settle-time re-fits (FR1.1, FR1.2, NFR6).** New constant `SETTLE_DELAY_MS = 300` in `layout.ts`. A `scheduleRefit` in `main.ts` runs `refit` at once, then cancels any pending frame and timer and schedules one `requestAnimationFrame(refit)` and one `setTimeout(refit, SETTLE_DELAY_MS)`. It listens to `window` `resize` and `orientationchange`, and `visualViewport` `resize` and `scroll` (the offset changes on scroll).
- No new dependency, no DOM test environment (Q8 A). `index.html` is not changed. Files the person owns (`README.md`, `ASSETS.md`, and others) are not changed.

## Steps

- [x] Step 1: Project structure check. Confirm the change stays within `src/render/layout.ts`, `src/main.ts`, `src/style.css`, and `tests/render/layout.test.ts`, with no new files or dependencies.
- [x] Step 2: Verify the test runner. Run `npx vitest run tests/render/layout.test.ts` on the unchanged tree and record that it passes.
- [x] Step 3: Frontend behavior (layout helpers) - Red. In `tests/render/layout.test.ts`, add tests: `fitArea` subtracts insets and keeps the offset; negative and NaN insets read as 0; insets larger than the viewport give a non-positive size (FR3.1, FR3.2). `placeCasing` with zero insets and offset equals `fitCasing` (NFR2) and with an offset and asymmetric insets the casing is centred in the area and fully inside it (FR3.2, FR3.3). `isValidFit` and `chooseFit`: a valid next fit wins; an invalid next fit keeps the previous one; invalid with no previous gives `null` (FR2.1, FR2.2; targeted regression for the scale-0 risk). `touchSide` uses the area centre, including an asymmetric-inset area (FR4.1). `orientationOf` for portrait, landscape, and square (FR5.1). `SETTLE_DELAY_MS` is 300 (FR1.1, NFR6). Keep every existing `fitCasing` test unchanged. Run and record the failing output.
- [x] Step 4: Frontend behavior (layout helpers) - Green. Implement the types, `fitArea`, `placeCasing`, `isValidFit`, `chooseFit`, `touchSide`, `orientationOf`, and `SETTLE_DELAY_MS` in `src/render/layout.ts` until Step 3 passes.
- [x] Step 5: Frontend behavior (wiring). In `src/style.css`, add the safe-area padding to `#stage`. In `src/main.ts`, replace `refit` with the version above (viewport read with fallback, inset read, `fitArea`, `placeCasing`, `chooseFit`, orientation flip check with `state.releaseAll()`), add `scheduleRefit` and the four listeners (FR1.1, FR1.2, FR2.1, FR3.1, FR3.2, FR5.1), and use `touchSide` in `pointerdown` (FR4.1). Keep keyboard, START, sound, announcer, and the main loop unchanged (NFR1).
- [x] Step 6: Frontend behavior - Refactor while `npx vitest run tests/render/layout.test.ts` stays green.
- [x] Step 7: Environment and build. Run `npm run typecheck`, `npm test`, `npm run build`, `npm run size`; fix any failure without changing thresholds (NFR4).
- [x] Step 8: Documentation and traceability. Requirement IDs in comments where code implements them; the orchestrator writes `code-summary.md` and `traceability.json`. Manual iPhone Safari check (NFR5) is listed for Build and Test and the preview.

## Requirement to Step Map

| Requirement | Steps |
|---|---|
| FR1.1, FR1.2 | 3, 4, 5 |
| FR2.1, FR2.2 | 3, 4, 5 |
| FR3.1, FR3.2, FR3.3 | 3, 4, 5 |
| FR4.1 | 3, 4, 5 |
| FR5.1 | 3, 4, 5 |
| NFR1 | 1, 5 |
| NFR2 | 3, 4 |
| NFR3 | 3, 4 |
| NFR4 | 7 |
| NFR5 | 8 (manual, Build and Test and preview) |
| NFR6 | 3, 4 |

## Testing Contract
```json
{
  "version": 1,
  "methodology": "tdd",
  "source": "team",
  "ordering": "Write a failing Vitest test for each game-logic behaviour, implement until it passes, then check rendering, sound, and input wiring by playing the game.",
  "scope": "bugfix",
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
      "Include a targeted regression for the bug or vulnerability.",
      "Keep the existing test suite green."
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
  "input_sha256": "sha256:4f785400765e7a3b83c4a096e2c6e020b7813a90f7b89f4ec974b1ee8541d1ae",
  "contract_sha256": "sha256:8ed085cfaf8c7d85790377aad6b66b3311da4063ac94d89238e0f196790653a9"
}
```

Layers not applicable to this change: data model / database, repository / data access, business logic (game rules), and API / endpoint. The only testable layer is frontend behavior (pure layout helpers), which follows Red, Green, Refactor. The DOM wiring in `src/main.ts` and `src/style.css` is checked by playing, as the team's testing posture says.
