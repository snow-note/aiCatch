## Developer Code Scan Results
Focused scan for intent `261115-ending-message` (victory/ending flow). Code reading only; no tests, builds, or programs were run. Commit `49efe17a7388a4e4ff2197fa533aeaab4a880320`.

### Scan Coverage
- **Analyzed deeply**:
  - `src/render/` (`renderer.ts`, `screen-timing.ts`, `sprites.ts` font section, `layout.ts`)
  - `src/game/` (`config.ts`, `state.ts`, `types.ts`, `run.ts`, `input.ts`, `announcer.ts`; other files only through imports)
  - `src/main.ts`
  - `tests/render/` (victory/font/timing assertions read; `layout.test.ts` by test titles)
  - `tests/game/` (`state.test.ts` victory block, `announcer.test.ts`, `config.test.ts` durations read; other files by grep)
- **Skimmed only**: `src/audio/sound.ts` (victory cue table, `:72-82`, `:119`), `index.html`, `src/style.css`, `package.json`, `vitest.config.ts`.
- **Left out**: `dist/`, `coverage/`, `node_modules/` (not opened); AI-DLC install and `aidlc/` workspace (not scanned, except the intent's own `project-description.json` for the message text).

### Packages Found
- ai-catch — single npm package (private) — TypeScript — browser Canvas game; no workspaces.

### Build System
- **Type**: Vite 8.3.7 + `tsc --noEmit` (TypeScript 7.0.2); Vitest 5.1.0 in the node environment.
- **Config Files**: `package.json`, `tsconfig.json`, `vitest.config.ts`, `vite.config.ts`.
- **Build Dependencies**: devDependencies only; no runtime dependencies.

### APIs Discovered
- No network API. Internal contracts C1-C4 in `src/game/types.ts` (GameView, GameEvent, StageDefinition, GameControls).
- Victory-relevant: `GameView.phase/phaseTime/canReturnToTitle/score/best/newHighScore/aiRestoration` (`types.ts:41-70`); event `victory` (`types.ts:81`).

### Frameworks & Libraries
- None at runtime. Canvas 2D, Web Audio, Pointer Events, Visual Viewport API.

### Test Coverage
- **Test Directories**: `tests/game`, `tests/render`, `tests/audio`, `tests/tooling`, `tests/scripts` (Python).
- **Test Frameworks**: Vitest (node env, fake 2D context); Python unittest for usage scripts.
- **Coverage Config**: present (v8, 80% line threshold, `vitest.config.ts`).

### Code Quality Indicators
- **Linting**: none configured; strict `tsc`.
- **CI/CD**: `.github/workflows/ci.yml`.
- **Documentation**: README, ASSETS.md; requirement IDs (BR/FR) in code comments.

### Technical Debt Signals
- `renderer.ts` (493 lines) mixes screen layouts with effects; every screen hard-codes y positions (`renderer.ts:296-319` for victory).
- Font has no `,` `?` `'` glyph; a missing glyph silently draws as a blank cell (`renderer.ts:445`).
- Victory text is duplicated in two places that are pinned separately: canvas strings (`renderer.ts:309-311`) and announcer string (`announcer.ts:35`, `announcer.test.ts:86`).

## Handoff Summary
- **Intent-relevant finding**: the victory flow is `playing` -> catch reaches `requiredCount` on stage 4 -> `clearStage` (`state.ts:209-224`, `run.ts:25-33`) -> `stage-clear` 2.5 s -> `enterVictory` (`state.ts:236-242`, emits `victory`, submits the high score). The victory screen is drawn only by `Renderer.drawVictory` (`renderer.ts:296-319`) from `phaseTime`. Everything below is evidence for the ending screen.
  - **Timing constants** (`config.ts:42,46-48`): `VICTORY_DURATION = 3.5`, `VICTORY_REBOOT_END = 1.5`, `VICTORY_RESTORE_END = 2.5`, `VICTORY_MESSAGE_STEP = 0.33`. `victoryStep(t)` (`screen-timing.ts:33-39`): reboot <1.5, restore <2.5, messages <3.5, hold after. `messagesShown(t)` (`:42-46`): 0 before 2.5 s, then 1/2/3 at 2.5/2.83/3.16 s, capped at 3. `victoryBarFill` 75->100 over 1.5 s (`:55-58`). `noiseLines` 6->0 over 1.5 s (`:61-64`). `blinkOn` 1 Hz, on in the first half second (`:67-72`).
  - **Current lines** (`renderer.ts:300-317`, logical 240x160): AI face 24x24 at (108, 8); AI bar at y=58; line 1 `AI RESTORED — 100%` centred y=40 scale 2 (shown when `shown>=1`); line 2 `HUMANS SAVED AI.` y=76 scale 1; line 3 `SAVE THE AI. SAVE THE FUTURE.` y=90 scale 1; hold step adds `SCORE` row y=108, `HI-SCORE` row y=122, blinking `NEW!` at x=136,y=122 when `newHighScore`, and blinking `PRESS ANY KEY` y=144 when `canReturnToTitle`. During reboot the function returns after drawing face (broken), bar and noise (`:303-306`).
  - **Return to title**: `canReturnToTitle` is true in `victory` once `phaseTime >= 3.5` (`state.ts:114-118`). Then `pressStart()` (Enter/Space/START button, `:129-139`) or any NEW input down (`inputDown`, `:142-145`; key, touch, mouse via `main.ts:120-163`) calls `returnToTitle` (`:255-265`), which resets run, score, lives and sets `titleEnteredByPress` so the same press does not start a run. A key already held from before is not "new" (`input.ts:17-21`). A new text screen that outlasts 3.5 s must keep or extend this rule or it changes completion behaviour; it is pinned by `state.test.ts:333-348` and `config.test.ts:171`.
  - **Font** (`sprites.ts:249-296`, `FONT_W=3`, `FONT_H=5`): A-Z, 0-9, `+ ! - — % . : /` and space. No `,` `?` `'` `"` `(` `)` `;`. `drawText` upper-cases the string (`renderer.ts:444`), so lowercase text renders as capitals; a missing glyph draws blank but still takes a cell (`:445,454`). Advance is 4 px x scale; width = `4*n*scale - scale` (`:428-430`); centring uses `Math.round(x - width/2)` (`:442`). Capacity at scale 1: 60 chars in 240 px (4n-1 <= 240), 56 chars with 8 px margins. There is no wrapping helper.
  - **Message to show** (`project-description.json`): 19 lines including 6 blank lines, 13 text lines; longest is "the programming languages, and the human creativity" (51 chars, 203 px). It needs `,` `?` `'` glyphs (and `...` works with `.`). `!` and `:` exist.
  - **Line capacity**: 160 px height, 5 px glyph. Pitch 8 px (title/stage screens use 8) gives 20 lines, pitch 7 gives 22, so all 19 lines fit one screen at scale 1 only if the face, bar, score rows and prompt are dropped. With the face (y 8-32) and bar, about 12 lines remain at pitch 8. Paging or scrolling by `phaseTime` is therefore the practical way to show the text with the existing result rows. Glyphs are 3x5 px at scale 1, which is about 3.5 x 6 CSS px on a 375 px wide phone (casing scale about 1.17, `layout.ts:38-51`), so the 5 px text is small on mobile; scale 2 allows only 29 chars per line and about 10 lines.
  - **Input while text shows**: all input goes through `inputDown`/`pressStart`; there is no "press" handling in `drawVictory`. If text is paged by time only, no input change is needed. Page advance by input would need new `GameState` behaviour (a change to completion logic), so time-based paging is the lowest-risk approach. `main.ts` blocks `touchmove` and `contextmenu` (`:166-167`), so native scroll is unavailable; scrolling must be drawn on the canvas.
  - **Announcer** (`announcer.ts:35`, default branch of `text()`): `AI restored, 100%. Humans saved AI. Save the AI, save the future. Score ${score}.` plus ` New high score.` when `newHighScore`. Key `victory:4` (`phase:stageNumber`, `:42`); text changes do not re-announce unless the key changes. Pinned exactly by `announcer.test.ts:85-91`; key stability by `:118-124`.
  - **Sound**: `soundForEvent('victory')` -> cue `victory`, ten rising notes over about 2.5 s (`sound.ts:74-86`, `:119`); played once by `main.ts:170-176` when the event is drained. Not tied to message steps.
  - **Pinning tests**: `screen-timing.test.ts:18-36` (victoryStep boundaries 1.5/2.5/3.5), `:39-57` (messagesShown 2.5/2.83/3.16 and the cap 3), `:81-88` (victoryBarFill), `:157-168` (noiseLines); `renderer.test.ts:126-135` (victory draws without throwing at 0.5/2/3/4/4.6 s, fake context counts `fillRect` calls only, no text assertions); `sprites.test.ts:41-46` (every glyph 3x5 `#.`), `:74-79` (glyphs for `% . : / —`), `:81-84` (letters); `state.test.ts:303-348` (victory flow, 3.5 s return rule); `config.test.ts:166-174` (`VICTORY_DURATION` 3.5); `announcer.test.ts:85-91,118-124`. Nothing pins the exact canvas strings, positions, or `VICTORY_MESSAGE_STEP` (only `messagesShown` results, which depend on it).
- **Risks / follow-up**:
  - Keep `VICTORY_DURATION` (3.5), `canReturnToTitle` rules, `victory` event, high-score submit, and phase transitions unchanged; they are pinned and are completion logic. A longer ending needs its own display-timing constants (for example in `screen-timing.ts` or `config.ts` "display sub-steps" block, `config.ts:45-48`) that do not change `VICTORY_DURATION`, and `messagesShown`/`victoryStep` tests will need updating if those helpers change meaning.
  - Add `,` `?` `'` to `FONT` (tests: `sprites.test.ts:41-46` then covers them automatically; add them to the `it.each` list at `:74`).
  - The ending can be returned from at 3.5 s while text is still scrolling; decide whether pressing early skips the rest (current behaviour) or is accepted as is.
  - Update the announcer text only with its test (`announcer.test.ts:86`); `announcer.ts:35` is the screen-reader copy of the victory text.
  - Portrait and landscape share one 240x160 canvas scaled by `main.ts` `refit` (`:72-90`, `layout.ts`), so text layout needs no orientation branch; smallest effective glyph size occurs in portrait on a narrow phone.
  - `drawVictory` returns early during reboot, so the noise animation and face stay as is; new text should start at or after `VICTORY_RESTORE_END` (2.5 s) to keep the existing sequence.
