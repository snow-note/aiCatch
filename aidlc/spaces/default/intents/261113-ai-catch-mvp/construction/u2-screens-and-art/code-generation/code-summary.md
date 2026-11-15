# Code Summary: u2-screens-and-art

Built from the approved `code-generation-plan.md` (TDD for pure helpers and sprite tables, Testing Contract `sha256:02e7e246…`) on branch `feature/u2-screens-and-art`, created on top of U1's uncommitted work. Behaviour follows `functional-design/functional-spec.md` (SC-1 to SC-6) and `rules.md`; layouts from `inception/refined-mockups/mockups.md`.

## Files

| Path | Change | Content |
|---|---|---|
| `src/render/screen-timing.ts` | new | Pure helpers: `victoryStep`, `messagesShown`, `barFill`, `victoryBarFill`, `blinkOn`, `hudTexts`, `reachedLine`, `noiseLines` |
| `src/render/sprites.ts` | modified | Original mainframe, magnetic tape, floppy disk (16 × 16), AI face broken and restored (24 × 24); glyphs `%`, `.`, `:`, `/`, `—`; added to `OBJECT_SPRITES` and `ALL_SPRITES` |
| `src/render/renderer.ts` | modified | Final screens SC-1 to SC-6 replacing U1 placeholders; shared AI bar; HUD row; per-kind sprites; victory reboot noise; existing effects kept |
| `src/game/config.ts` | modified (display constants only) | `VICTORY_REBOOT_END`, `VICTORY_RESTORE_END`, `VICTORY_MESSAGE_STEP`, `CLEAR_BAR_FILL`, `BLINK_HZ` |
| `index.html` | modified | `<main id="stage">`, `<h1 class="brand">`, POWER button removed, canvas `aria-hidden`, empty `#announcer` live region |
| `src/style.css` | modified | Silver-grey casing, label and hint colours, `h1` margin reset, START focus ring, `.visually-hidden`, unused POWER colours removed |
| `ASSETS.md` | new | Originality record: every sprite and glyph group is original; no third-party assets or fonts |
| `tests/render/sprites.test.ts` | extended | New sprites, AI face, glyphs |
| `tests/render/screen-timing.test.ts` | new | 22 tests for the helpers |

`src/main.ts` needed no change (it already passed `state.view` and had no POWER reference after U1). `package.json` unchanged.

## Key Decisions

- The em dash glyph has the same 3 × 5 shape as `-`; the font cannot draw a longer dash at this size.
- `victoryStep` treats negative or non-finite time as `reboot` (tested).
- Hearts start at x 202 as in the mockup.
- The LCD keeps the existing green-grey palette; only the casing became silver-grey.

## Test Results

- `npx vitest run tests/render`: 3 files, 52 tests passed (layout 6, sprites 24, screen-timing 22).
- `npm run typecheck && npm test && npm run build`: type check clean; 13 files, 168 tests passed; JS bundle 24.78 kB (8.17 kB gzip), +4.13 kB from U1; CSS 1.69 kB; HTML 1.21 kB.
- Red evidence: sprites 9 of 19 failing before Green; screen-timing suite failed to load (module missing) before Green.

## Tests Written but Not Executed

- No unit tests left unexecuted.
- The browser play check (desktop and phone, portrait and landscape; greyscale outline check; keyboard-only run) was not run here; it needs the developer in a browser.
- The 80% line-coverage floor is not measured (no coverage tool installed; team practice). Build and Test owns it.
- No CI runs these tests yet (decided in the CI Pipeline stage).

## Deviations from the Plan

None. A stale POWER mention remains in a comment in `src/audio/sound.ts` (U3's file, left for U3).

## Loop-back 1 Repair (Step 12, 2026-11-13)

Reason: Build and Test run 1 measured 47.1% full-suite line coverage against the 80% floor, with `src/render/renderer.ts` at 0/251 lines (`aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/build-and-test/test-results.md`, Loop-back 1).

| File | Change |
|---|---|
| `tests/render/renderer.test.ts` (new) | 20 tests with a hand-written fake canvas and 2D context: every phase screen (title; stage intro Stage 1 and 4; playing with every object kind, an unknown kind, 1 and 3 lives; stage clear at 0 s and 1 s; game over for all `newHighScore` × `canReturnToTitle` cases; victory at 0.5, 2.0, 3.0, 4.0 s; a view with non-finite numbers), every effect event (`catch`, `virus-hit`, `life-lost`, `stage-clear` with no effect, `run-start` clearing effects) and their expiry through `update`, and a canvas whose `getContext` returns `null` (NFR5.6). |

`src/render/renderer.ts` is unchanged; no defect was found.

Verification: `npx vitest run tests/render/renderer.test.ts` 20/20; `npm run typecheck && npm test && npm run build` pass (16 files, 220 tests; JS 26.32 kB, 8.72 kB gzip, unchanged); `npm run coverage`: `renderer.ts` 251/251 lines, full suite 576/690 lines (83.47%). These run in Node with a fake context; they show the drawing code runs without errors for every screen, not how it looks in a browser.
