# Code Summary: Responsive Gameplay Fixes

Intent: `261115-responsive-orientation` (bugfix, zero-Unit). Branch `feature/responsive-orientation` (from `origin/main` `882cfe1`). Not committed yet.

## Files Modified

| File | Change |
|---|---|
| `src/render/layout.ts` | New `SETTLE_DELAY_MS` (300), types `ViewportRect` and `Insets`, pure `fitArea`, `placeCasing`, `isValidFit`, `chooseFit`, `touchSide`, `orientationOf`. `fitCasing` unchanged. |
| `src/main.ts` | `refit` reads `visualViewport` offset and size (fallback `innerWidth/innerHeight`), reads safe-area insets from `#stage` computed padding, keeps the last valid fit, releases held input only on a portrait/landscape flip; `scheduleRefit` re-fits now, next frame, and after 300 ms on `resize`, `orientationchange`, and `visualViewport` `resize`/`scroll`; touch split uses `touchSide` at the casing area centre. |
| `src/style.css` | `#stage` padding from `env(safe-area-inset-*, 0px)`. |
| `tests/render/layout.test.ts` | 10 new tests for the helpers; existing `fitCasing` tests unchanged. |

No files created or deleted. No dependency added. Nothing under `src/game/` or `src/audio/` changed (NFR1). `index.html`, `README.md`, `ASSETS.md`, and `.kiro/settings/mcp.json` untouched.

## Key Implementation Decisions

- With no insets and no offset, `placeCasing` equals `fitCasing`, so desktop and inset-free browsers look as before (NFR2).
- `chooseFit` keeps the previous valid fit; with none yet, `refit` applies nothing and waits for the next re-fit (review finding R-03).
- The touch split uses the area of the last valid fit, which is the casing centre (R-02).
- Held input is released only when the orientation flips; a resize without a flip (address bar) does not release it (R-01).
- After the developer's build, the conductor added one guard in `refit`: the orientation check is skipped when the read viewport size is 0, so a transient empty size during rotation does not count as a flip.
- Insets are read from computed padding, the one mechanism named in the plan (R-04).

## Test Coverage Summary

- Red: `npx vitest run tests/render/layout.test.ts` failed 10 of 16 (`fitArea is not a function` and similar) before implementation.
- `npm run typecheck`: clean. `npx vitest run`: 17 files, 274 tests passed (was 264).
- `npm run build`: JS 28.52 kB (gzip 9.53 kB). `npm run size`: `dist/` 31,824 bytes, under the 1 MiB budget.

## Tests Written but Not Executed Here

- None. `npm run coverage` (80% floor) runs in Build and Test.
- The DOM wiring in `src/main.ts` and `src/style.css` is not unit-tested (Node environment, no DOM). The iPhone Safari manual check (NFR5) belongs to Build and Test and the preview.

## Deviations from the Plan

- One test expectation was corrected during Green: `clientX` 422 on an 844-wide area is the centre and counts as right.
- The zero-size orientation guard above was added after the build; it stays inside FR5.1 and the plan's design.
