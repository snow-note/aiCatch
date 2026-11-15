# Code Quality Assessment
## Ratings
| Aspect | Rating | Evidence |
|---|---|---|
| Naming clarity | good | descriptive names, requirement IDs in comments |
| Function size | good | rules functions are short; `renderer.ts` (493 lines) is the largest file |
| Error handling | good | game methods never throw (`types.ts:75`); storage and audio errors swallowed; `fitCasing` guards non-finite input (`layout.ts:22-23`) |
| Test presence | fair for layout | one test file per source module; layout math is tested, `main.ts` (refit, touch) has no test; 80% line threshold (`vitest.config.ts`); tests not run in this scan |
| Duplication | fair | casing size repeated in `layout.ts:2-3`, `main.ts:42-43`, `style.css:29-30`; canvas size repeated in `index.html:20-21`, `style.css:66-67`, `config.ts:5-6`; reset blocks in `state.ts` (prior store) |
| Dead code | good | `noUnusedLocals/Parameters` enforced (`tsconfig.json`) |
## Tooling and Process
- Linting/formatting: none configured; strict `tsc` only.
- CI: typecheck, coverage, build, size on PR and push to main (`.github/workflows/ci.yml`).
- Documentation: README (play, run, release checklist), `ASSETS.md` (asset origins), `original_spec.md` (Japanese spec).
- TODO/FIXME: none seen in files read.
## Technical Debt
- Magic numbers in `renderer.ts` (effect lives `:93-97`, HUD x `:71-75`). Low impact.
- Layout constants are plain CSS pixels in two places (`style.css:25-121`) and must match `CASING_W/H` by hand (`style.css:24` comment).
- Tests pin tunables: see the `src/game` tests list in code-structure.md.
## Intent Findings: orientation and scaling (derived from code reading, not run in a browser)
Intent `261115-responsive-orientation`: fix layout and scaling during orientation changes, keep game coordinates and UI positions consistent, verify portrait and landscape, keep gameplay unchanged, no new features or refactors. Each finding is recorded here once; flows are in architecture.md "Responsive Layout and Orientation".
1. **Touch split and layout use different viewports.** Touch uses `window.innerWidth / 2` (`main.ts:96`); the layout uses `visualViewport.width/height` with a fallback (`main.ts:38-40`). They differ under zoom or when browser UI changes the visual viewport. The split is relative to the whole window, not to the casing, so it also ignores letterbox bars.
2. **Visual viewport offsets ignored.** `refit` applies only centring offsets from size (`main.ts:44`, `layout.ts:29-30`); `visualViewport.offsetLeft/offsetTop` are never read. `#stage` is `position: fixed; inset: 0` (`style.css:17-22`), the layout viewport, so the casing can be off-centre when the visual viewport is offset (zoom, mobile Safari toolbars, on-screen keyboard). Not verified in a browser.
3. **Rotation timing.** `orientationchange` and `resize` call `refit` synchronously (`main.ts:47-48`). On iOS Safari, `orientationchange` often fires before the new `innerWidth/innerHeight` are available, and `visualViewport` may lag. No deferred re-fit (`requestAnimationFrame`, timeout) and no `visualViewport.scroll` listener exist. Whether a later `resize` always repairs it is unverified.
4. **Zero scale applied.** For a 0, negative, or non-finite size `fitCasing` returns scale 0 (`layout.ts:22-24`, pinned by `layout.test.ts:43-49`); `refit` writes `scale(0)` (`main.ts:44`), hiding the casing until the next event.
5. **Fractional scale on a pixel canvas.** `scale` is unrounded (`layout.ts:24`; for example 375 px wide gives about 1.17) and offsets are fractional (`layout.ts:29-30`). The 240x160 canvas (`index.html:20-21`) is stretched by the CSS transform with `image-rendering: pixelated` (`style.css:68-69`), giving uneven pixel sizes; DOM text and the START button are blurred by subpixel translation. `devicePixelRatio` is never used (no match in `src/`, `index.html`).
6. **No safe-area or dynamic viewport units.** `viewport-fit=cover` is set (`index.html:7`) but no `env(safe-area-inset-*)`, `dvh`, `svh`, or `100vh` exists in scope. With a notch in landscape, the full-width fit can place the casing edge under the cutout. Not verified on a device.
7. **Portrait uses little of the screen.** The casing is 4:3 and scaled as a whole, so in portrait it is width-limited and fills about 42% of a 375x667 viewport's height (`layout.ts:2-3,24`). START (70x24) and the 9 px MOVE hint scale with the casing and become small on narrow phones (`style.css:85-97,117-121`). There is no portrait-specific arrangement.
8. **Held touch not re-evaluated.** The direction is fixed at `pointerdown` (`main.ts:96-97`) and cleared only on `pointerup/pointercancel` (`:105-106`) or `blur` (`:78-81`). Rotation does not clear held touches.
9. **Test gap.** `tests/render/layout.test.ts` covers 375x520, 667x320, 1920x1080, 160x120 and invalid sizes (`:5-49`); it does not cover `visualViewport`, orientation sequences, rounding, or touch mapping. No jsdom, happy-dom, or Playwright is in `package.json`, so `main.ts` behaviour needs either extraction into pure functions or a real-browser check; adding a test dependency needs prior approval (scope guardrails).
Mechanisms that already work: the game loop keeps running through rotation (`main.ts:137`); game coordinates (240x160) and all canvas-drawn HUD positions are independent of the viewport (`renderer.ts:71-75`), so a viewport change cannot move game objects; `touch-action: none` and `touchmove` blocking prevent page scroll (`style.css:9`, `main.ts:109`).
## Prior findings (carried over, `src/game` not re-analyzed)
The stage time limit intent (90 s, game over at 0, harder Stages 2-4) was implemented in commit `a48cb16` after the prior store's analysis. The earlier findings about "no time limit", the hook point at `state.ts:250`, HUD room for a timer, and the score-8000 analysis described the code before that commit and are superseded; read `src/game/config.ts:111-117`, `state.ts`, `screen-timing.ts` (`timerText`, `timerVisible`) and `renderer.ts` (HUD timer at x=132, TIME UP line) for the current behaviour. They do not affect this intent.
