# Code Generation Plan: Ending Message

## Summary

- Builds: the new 19-line ending message with a typewriter reveal and line-by-line scroll (about 20 s), return-to-title only after the message, `,` `?` `'` glyphs, the short screen-reader text, and the updated product definition
- Touches: `src/render/ending.ts` (new), `src/render/screen-timing.ts`, `src/render/renderer.ts`, `src/render/sprites.ts`, `src/game/config.ts`, `src/game/announcer.ts`, `.kiro/steering/product.md`, and tests under `tests/render/` and `tests/game/`
- Tests: about 12 new or changed Vitest unit tests (ending text and timing, font glyphs, victory timing, return rule, announcer), plus updated value pins

Intent: `261115-ending-message` (express, zero-Unit, Minimal test strategy). Requirements: `inception/requirements-analysis/requirements.md`. Code facts: `inception/reverse-engineering/developer-scan.md`.

## Design Decisions

- **Message data (FR1.1, FR1.2).** New module `src/render/ending.ts` exports `ENDING_LINES: readonly string[]`, the 19 lines exactly as in `requirements.md` (blank lines as `''`). The renderer upper-cases them when drawing, as `drawText` already does.
- **Timing (FR2.3, NFR4).** New tunables in `src/game/config.ts`: `ENDING_LINE_STEP = 1.2` (seconds per text line) and `ENDING_BLANK_STEP = 0.7` (seconds per blank line), and `ENDING_TYPE_SHARE = 0.6` (share of a line's step used to type its characters). With 13 text and 6 blank lines the message takes 13 x 1.2 + 6 x 0.7 = 19.8 s. It starts at `VICTORY_RESTORE_END` (2.5 s), so it is complete at 22.3 s.
- **Return to title (FR3.1-FR3.3).** `VICTORY_DURATION` changes from 3.5 to 22.3, the end of the message. `canReturnToTitle`, `victoryStep` ('hold' from `VICTORY_DURATION`), the `victory` event, and the high-score submit keep their code; only the constant moves. A test checks `VICTORY_DURATION === VICTORY_RESTORE_END + endingDuration(ENDING_LINES)` so the two cannot drift. The victory screen keeps returning only on a new press after that time (existing rule).
- **Pure view helper (FR2.1, FR2.2, FR2.4, NFR5).** In `src/render/screen-timing.ts`: `endingDuration(lines)` returns the total seconds; `endingView(t, lines, window)` returns `{ first: number, visible: string[] }`, the lines shown `t` seconds into the message (the current line partly typed: `ceil(len x progress / ENDING_TYPE_SHARE)` characters, capped at the full line), scrolled so at most `window` lines show and the newest is last. `messagesShown` is removed with its tests, since the three old messages are gone.
- **Layout (FR2.2, NFR1).** Text area: `ENDING_WINDOW = 12` lines at an 8 px pitch from y = 6 (y 6-101), centred, scale 1. During the reboot and restore steps the screen is drawn exactly as today (face, bar, noise). From 2.5 s the face and bar are no longer drawn and the text area is used. In the hold step the last 12 lines stay on screen, then SCORE (y 108), HI-SCORE (y 122) with the blinking NEW!, and the blinking PRESS ANY KEY (y 144), as today.
- **Glyphs (FR4.1, NFR7).** Original 3 x 5 glyphs added to `FONT` in `src/render/sprites.ts`: `,` (`...`, `...`, `...`, `.#.`, `#..`), `?` (`##.`, `..#`, `.#.`, `...`, `.#.`), `'` (`.#.`, `.#.`, `...`, `...`, `...`).
- **Announcer (FR5.1).** The victory text in `src/game/announcer.ts` becomes `AI restored. You brought me back to life. The future is yours to code. Score ${score}.` plus the existing ` New high score.` suffix. The key `victory:4` is unchanged.
- **Product definition (FR6.1).** In `.kiro/steering/product.md` section 7, the three bold old lines are replaced with the new message as a quoted block. The tagline and section 13 are not changed.
- No new dependency. Files the person owns (`README.md`, `ASSETS.md`, and others) are not changed.

## Steps

- [x] Step 1: Project structure check. Confirm the change stays within the files in the Summary; `src/render/ending.ts` is the only new file.
- [x] Step 2: Verify the test runner. Run `npx vitest run tests/render/screen-timing.test.ts` on the unchanged tree and record that it passes.
- [x] Step 3: Business logic (config, return rule, announcer) - Red. In `tests/game/config.test.ts`: `VICTORY_DURATION` is 22.3 and equals `VICTORY_RESTORE_END + endingDuration(ENDING_LINES)`; pin `ENDING_LINE_STEP` 1.2, `ENDING_BLANK_STEP` 0.7, `ENDING_TYPE_SHARE` 0.6 (FR2.3, FR3.3, NFR4). In `tests/game/state.test.ts`: in victory, a press before `VICTORY_DURATION` (for example at 3.5 s and at 22 s) does not return to the title, and a new press after it does (FR3.1, FR3.2); update the existing 3.5 s expectations. In `tests/game/announcer.test.ts`: the new victory text with and without the high-score suffix (FR5.1). Run and record the failing output.
- [x] Step 4: Business logic - Green. Update `src/game/config.ts` and `src/game/announcer.ts` until Step 3 passes.
- [x] Step 5: Frontend behavior (ending text, view helper, glyphs) - Red. New `tests/render/ending.test.ts`: `ENDING_LINES` equals the 19 lines from `requirements.md` (FR1.1); every character of every line (upper-cased) has a glyph in `FONT` (FR4.1); every line fits the canvas width at scale 1, `4 x len - 1 <= PLAY_W` (FR2.2, NFR1); `endingDuration(ENDING_LINES)` is 19.8 (FR2.3). In `tests/render/screen-timing.test.ts`: `endingView` shows nothing before the first line, shows the first line partly typed early in its step and fully after `ENDING_TYPE_SHARE`, counts blank lines, never returns more than `window` lines, scrolls so the newest line is last, and returns the last `window` lines in full after `endingDuration` (FR2.1, FR2.2, FR2.4); `victoryStep` gives 'hold' from 22.3 s; remove the `messagesShown` tests. In `tests/render/sprites.test.ts`: add `,` `?` `'` to the glyph list. In `tests/render/renderer.test.ts`: the victory screen draws without throwing at 0.5, 2, 3, 10, 22, and 25 s. Run and record the failing output.
- [x] Step 6: Frontend behavior - Green. Add `src/render/ending.ts`, `endingDuration` and `endingView` in `src/render/screen-timing.ts` (remove `messagesShown`), the glyphs in `src/render/sprites.ts`, and the new `drawVictory` layout in `src/render/renderer.ts` until Step 5 passes.
- [x] Step 7: Refactor while `npx vitest run tests/render tests/game` stays green.
- [x] Step 8: Product definition. Update `.kiro/steering/product.md` section 7 as described (FR6.1).
- [x] Step 9: Environment and build. Run `npm run typecheck`, `npm test`, `npm run build`, `npm run size`; fix any failure without changing thresholds (NFR6).
- [x] Step 10: Documentation and traceability. Requirement IDs in comments where code implements them; the orchestrator writes `code-summary.md` and `traceability.json`. The desktop and iPhone Safari play check (NFR2) is listed for Build and Test and the preview.

## Requirement to Step Map

| Requirement | Steps |
|---|---|
| FR1.1, FR1.2 | 5, 6 |
| FR1.3 | 6 |
| FR2.1, FR2.2, FR2.4 | 5, 6 |
| FR2.3 | 3, 4, 5, 6 |
| FR3.1, FR3.2, FR3.3 | 3, 4 |
| FR4.1 | 5, 6 |
| FR5.1 | 3, 4 |
| FR6.1 | 8 |
| NFR1 | 5, 6 |
| NFR2 | 10 (play check in Build and Test) |
| NFR3 | 1, 9 |
| NFR4 | 3, 4 |
| NFR5 | 5, 6 |
| NFR6 | 9 |
| NFR7 | 1, 6 |

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

Layers not applicable to this change: data model / database, repository / data access, and API / endpoint. Business logic (victory timing constant, return rule, announcer) and frontend behavior (pure ending text and view helpers, font glyphs) follow Red, Green, Refactor. Canvas drawing in `src/render/renderer.ts` is checked by playing, as the team's testing posture says.
