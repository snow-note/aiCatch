## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-11-15T14:27:16Z
**Iteration:** 1
**Verdict Dictated:** no

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Minor | src/main.ts > pointerdown handler (`touchSide(e.clientX, lastArea ?? readViewport())`) and src/render/layout.ts > `touchSide` | Requirement FR4.1 defines the touch split as the visual viewport centre (`offsetLeft + width / 2`). The code splits at the centre of the inset-adjusted casing area. In landscape with a 47 px left inset the split moves about 23 px from the spec value. The summary records this as a deliberate choice (R-02), but the requirement text still says viewport centre. | Confirm at the gate that the casing-centre split is accepted, or change `touchSide` to use the viewport rect. Update FR4.1 or the summary so the two agree. | New |
| R-02 | Minor | src/main.ts > `readViewport` / `readInsets` / `refit` | Safe-area insets are measured against the layout viewport (the `position: fixed; inset: 0` `#stage` padding), but they are subtracted from the visual viewport rect, which can be shifted or smaller than the layout viewport. With the keyboard, pinch zoom or a shifted visual viewport, insets are applied at edges that are not the screen edge. Zoom is disabled in `index.html`, so the effect is small. The placement maths itself is consistent: `#console` is `absolute; left: 0; top: 0` and absolute offsets are measured from the padding box, so the translate offsets from the viewport origin land correctly. | Cover this case in the NFR5 iPhone check (address bar showing and hiding, rotation both ways). No code change is needed unless the device check shows an offset. | New |
| R-03 | Minor | src/main.ts > `refit` orientation check | `orientationchange` often fires before iOS reports the new size, so the immediate `refit` can read the old size. The flip is then detected on the rAF or 300 ms re-fit, and held input is released up to about 300 ms after the rotation. The window is short and the release still happens. | Note it for the device check. Optionally release on the `orientationchange` event itself. | New |
| R-04 | Minor | tests/render/layout.test.ts > `describe('SETTLE_DELAY_MS')` | The test only asserts that the constant equals 300. It cannot catch a regression and adds no behaviour coverage. The rAF/timeout scheduling (FR1.1, FR1.2) and the orientation-flip `releaseAll` call (FR5.1) are in `main.ts` only and have no automated test. The Node-only test setup was an accepted constraint (NFR3). | Drop or replace the constant test. Rely on the NFR5 device check for the wiring, and say so in `unit-test-instructions.md`. | New |
| R-05 | Minor | aidlc/spaces/default/intents/261115-responsive-orientation/construction/code-generation/traceability.json > NFR1, NFR4 | NFR1 ("gameplay unchanged") is mapped to `src/main.ts`, though it is satisfied by `src/game` and `src/audio` having no diff. NFR4 is marked OK against the test file, but the 80% `npm run coverage` run is deferred to Build and Test. | Point NFR1 at the unchanged-paths evidence. Mark NFR4 as pending until coverage has run. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| `npx vitest run tests/render/layout.test.ts` | PASS: 16 of 16 tests | The existing `fitCasing` tests are intact and the new helper tests pass. |
| `npm run typecheck` | PASS (`tsc --noEmit`, no output) | `main.ts` imports and `state.releaseAll` resolve. |
| `git diff --stat -- src/game src/audio` | Empty | NFR1 holds: gameplay and audio are untouched. |

### Summary

The wiring is sound. `#console` placement, the viewport offset, the padded `#stage` inset read, and the scheduling are correct. The scheduling cancels earlier rAF and timer handles, so re-fits do not stack. The last valid fit is kept, `releaseAll` runs only on an orientation flip, and `src/game` and `src/audio` are untouched. The remaining items are minor: the touch-split deviation from FR4.1, an inset-versus-visual-viewport edge case, and a slightly late release on rotation. All of them belong in the iPhone Safari check (NFR5), which has not been run yet.
