# Code Quality Assessment
## Ratings
| Aspect | Rating | Evidence |
|---|---|---|
| Naming clarity | good | descriptive names, requirement IDs in comments |
| Function size | good | rules functions are short; `renderer.ts` (493 lines) is the largest file |
| Error handling | good | game methods never throw (`types.ts:84`); drawing tolerates bad numbers (`drawAiBar` `:325`, `drawNumber` `:460`, `safeTime`); storage and audio errors swallowed |
| Test presence | good for rules and timing, weak for drawn content | one test file per module; renderer tests only check no throw and `fillRect` count; `main.ts` untested; tests not run in this scan |
| Duplication | fair | victory text is in two places (canvas `renderer.ts:309-311`, announcer `announcer.ts:35`); screen y positions are literals per screen |
| Dead code | good | `noUnusedLocals/Parameters` enforced (`tsconfig.json`) |
## Tooling and Process
- Linting/formatting: none configured; strict `tsc` only.
- CI: typecheck, coverage, build, size on PR and push to main (`.github/workflows/ci.yml`).
- Documentation: README (play, run, release checklist), `ASSETS.md`, `original_spec.md` (Japanese spec).
- TODO/FIXME: none seen in files read.
## Technical Debt
- Magic numbers in `renderer.ts` (effect lives `:96-100`, HUD x `:72-78`, screen y literals). Low impact.
- Layout constants are plain CSS pixels in two places and must match `CASING_W/H` by hand.
- No text wrapping or line-measuring helper; callers pre-split lines (title screen `renderer.ts:194-196`).
## Intent Findings: ending message (derived from code reading, not run)
Intent `261115-ending-message`: replace the victory text with a long narrative, readable on desktop and mobile in both orientations, gameplay and completion logic unchanged. Flow, constants and layout are recorded once in architecture.md "Victory Ending Flow".
1. **Font gaps.** The message needs `,` (in "computing," and "languages,"), `?` ("...today possible?" and "...creating something with it?") and `'` ("Don't"). `FONT` has none of them (`sprites.ts:249-296`), so they would draw as blank cells (`renderer.ts:445`). Lowercase is fine: `drawText` upper-cases (`:444`). `!`, `.`, `:`, `-`, `—` exist. `sprites.test.ts:41-46` checks every glyph shape automatically; `:74` lists specific glyphs.
2. **Line width.** The longest message line is 51 chars (203 px at scale 1), which fits 240 px (max 60 chars; 56 with margins). At scale 2 only 30 chars fit, so most lines would need wrapping.
3. **Height.** The message is 19 lines (13 text, 6 blank). At the 8 px pitch used elsewhere that is 152 px of 160; at 7 px, 133 px. Showing it next to the face (y 8-32), AI bar (y 58), score rows (y 108-122) and prompt (y 144) is impossible at once, so progressive display (paging or vertical scroll drawn on the canvas) is needed, or the existing result rows must move to a later step.
4. **Legibility on phones.** Scale 1 glyphs are 3x5 logical px; with the casing scale of about 1.17 on a 375 px wide portrait phone (`layout.ts:38-51`) they are about 3.5 x 6 CSS px. Orientation changes only the CSS scale (the canvas content is identical), so a layout correct in one orientation is correct in the other; the smallest size is portrait on a narrow screen. Not verified in a browser.
5. **Timing.** The existing victory sequence is 3.5 s long and `canReturnToTitle` turns true at 3.5 s (`state.ts:116`). A long message cannot be read in the remaining 1 s after `messages`. Any new reading time must come from new display-only timing, because `VICTORY_DURATION`, the return rule and the event are pinned (`state.test.ts:333-348`, `config.test.ts:171`) and are completion logic. The press-to-return behaviour at 3.5 s would let the player skip the text, which is the current behaviour for the three old lines.
6. **Input.** There is no scroll or page input: `touchmove` is prevented (`main.ts:166`) and any new press after 3.5 s returns to the title. Time-based paging needs no input change. Input-driven paging would change `GameState` (completion logic) and its tests.
7. **Pinned by tests.** `screen-timing.test.ts` pins `victoryStep`, `messagesShown` (including `VICTORY_MESSAGE_STEP` through the 2.83 and 3.16 s boundaries), `victoryBarFill`, `noiseLines`; `renderer.test.ts:126-135` only checks that victory draws at 0.5, 2, 3, 4, 4.6 s; `announcer.test.ts:85-91` pins the announcer string exactly. No test pins the canvas strings or positions.
8. **Screen-reader copy.** The announcer says the old three sentences; if the visible text changes, the announcer text (and its test) is a separate decision. The key `victory:4` is stable, so a longer text is spoken once.
9. **Reboot sequence.** `drawVictory` returns early during `reboot` (`renderer.ts:303-306`); the face and bar are drawn before. Text steps start at 2.5 s (`VICTORY_RESTORE_END`).
## Prior orientation findings (intent `261115-responsive-orientation`) status
Re-read `src/main.ts` and `src/render/layout.ts` at `49efe17` ("Harden layout for orientation changes and safe areas"): the viewport offset, deferred re-fit (next frame and 300 ms), `visualViewport` scroll listener, safe-area insets from `#stage` padding, keep-last-valid-fit rule, centre-of-area touch split and release of held input on orientation flip are now present (`main.ts:54-106,153`, `layout.ts:5-96`). The prior items on touch viewport mismatch, ignored offsets, rotation timing and zero scale are therefore addressed in code. Not re-checked: fractional scale blur and portrait size (items 5 and 7 of the prior store; `layout.ts` still uses an unrounded scale `:41`), CSS `env(safe-area-inset-*)` use in `style.css` (not read this run), and any real-device behaviour.
