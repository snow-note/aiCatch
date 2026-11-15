# Code Summary: Ending Message

Intent: `261115-ending-message` (express, zero-Unit). Branch `feature/ending-message` (from `origin/main` `6203e85`). Not committed yet.

## Files Created and Modified

| File | Change |
|---|---|
| `src/render/ending.ts` (new) | `ENDING_LINES`: the 19 message lines, blank lines as `''` |
| `src/render/screen-timing.ts` | New `endingDuration(lines)` and `endingView(t, lines, window)`; `messagesShown` removed |
| `src/render/renderer.ts` | `drawVictory`: reboot/restore steps unchanged (face, bar, noise); from 2.5 s a 12-line text area (y 6, 8 px pitch, scale 1, centred) types the message in and scrolls; the hold step adds SCORE, HI-SCORE, NEW!, PRESS ANY KEY as before |
| `src/render/sprites.ts` | Original `,` `?` `'` glyphs (3 x 5) |
| `src/game/config.ts` | `VICTORY_DURATION` 3.5 -> 22.3; new `ENDING_LINE_STEP` 1.2, `ENDING_BLANK_STEP` 0.7, `ENDING_TYPE_SHARE` 0.6; unused `VICTORY_MESSAGE_STEP` removed |
| `src/game/announcer.ts` | Victory text: "AI restored. You brought me back to life. The future is yours to code. Score N." plus the high-score suffix |
| `.kiro/steering/product.md` | Section 7: the three old lines replaced by the new message (block quote); tagline and section 13 unchanged |
| `tests/render/ending.test.ts` (new); `tests/render/{screen-timing,sprites,renderer}.test.ts`; `tests/game/{config,state,announcer}.test.ts` | New tests and updated pins |

No dependency added. `README.md`, `ASSETS.md`, and `.kiro/settings/mcp.json` untouched.

## Key Implementation Decisions

- The only completion-logic change is the value of `VICTORY_DURATION`; `canReturnToTitle`, the `victory` event, and the high-score submit keep their code. A test ties `VICTORY_DURATION` to `VICTORY_RESTORE_END + endingDuration(ENDING_LINES)`.
- `endingView` takes seconds since the message start (2.5 s into the phase); nothing shows at 0 or before.
- `src/game/` does not import from `src/render/`; only tests import both.
- The message is drawn in capitals by the existing `drawText`.

## Test Coverage Summary

- Red runs recorded: missing `src/render/ending` module, old announcer text, return to title at 3.5-22 s (`expected true to be false`), missing glyphs.
- `npm run typecheck`: clean. `npx vitest run`: 18 files, 288 tests passed (was 274).
- `npm run build`: JS 29.27 kB (gzip 9.89 kB). `npm run size`: `dist/` 32,570 bytes, under the 1 MiB budget.

## Tests Written but Not Executed Here

- None. `npm run coverage` (80% floor) runs in Build and Test.
- Canvas appearance on desktop and iPhone Safari (NFR2) is checked by play in Build and Test and on the preview.

## Deviations from the Plan

- The developer edited some test files with small python3/node scripts instead of the file tools; the result was reviewed in the diff and the full suite passes.
- `VICTORY_MESSAGE_STEP` was removed because nothing uses it after `messagesShown` was removed.
