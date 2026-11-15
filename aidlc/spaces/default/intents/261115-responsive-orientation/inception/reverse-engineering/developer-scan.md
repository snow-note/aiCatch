## Developer Code Scan Results

Intent `261115-responsive-orientation` (bugfix, Minimal). Commit `a48cb1608f0b013df2c76e31ecf7fd9043e4782e`. Code reading only; no tests, builds, or programs were run.

### Scan Coverage
- **Analyzed deeply**:
  - `index.html`
  - `src/main.ts`
  - `src/style.css`
  - `src/render/` (`layout.ts`, `renderer.ts`, `screen-timing.ts`, `sprites.ts`; renderer read for canvas/context handling and size-dependent code, sprites and screen-timing for layout relevance only)
  - `tests/render/` (`layout.test.ts` read in full; `renderer.test.ts` test titles and fake-canvas approach)
- **Skimmed only**:
  - `src/game/config.ts` (`PLAY_W`, `PLAY_H`, sizes)
  - `src/game/input.ts` (`InputTracker`)
  - `vite.config.ts`, `vitest.config.ts`
  - `src/game/`, `tests/game/` (rest, unchanged from the prior store)
  - `src/audio/`, `public/_headers`, `scripts/`, `.usage/`
- **Left out**: `dist/`, `coverage/`, `node_modules/` (not opened); AI-DLC install and workspace (`.kiro/`, `aidlc/`, etc.) not scanned.

### Packages Found
- aiCatch (root) — single npm package — TypeScript — browser Canvas game, no workspaces.

### Build System
- **Type**: Vite 8 (`base: './'`, `outDir: dist`), `tsc --noEmit` typecheck.
- **Config Files**: `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `package.json`.
- **Build Dependencies**: none between packages.

### APIs Discovered
- None external. Browser APIs used by the in-scope files: `window.visualViewport`, `resize`, `orientationchange`, Pointer Events, `touchmove`, Canvas 2D, `requestAnimationFrame`.

### Frameworks & Libraries
- Vite, TypeScript, Vitest (devDependencies only). No runtime libraries.

### Test Coverage
- **Test Directories**: `tests/render/` (layout, renderer, screen-timing, sprites).
- **Test Frameworks**: Vitest, `environment: 'node'` (no DOM).
- **Coverage Config**: present (v8, 80% line floor; includes `src/**/*.ts`, so `main.ts` counts toward it but has no test file).

### Code Quality Indicators
- **Linting**: none; strict `tsc` only.
- **CI/CD**: `.github/workflows/ci.yml` (typecheck, coverage, build, size).
- **Documentation**: README; comments carry requirement IDs (FR9.5, FR9.6, FR2.2).

### Technical Debt Signals
- `src/style.css:24` comment and `:29-30` say 320 x 240; the same constants live in `layout.ts:2-3` and are written again in `main.ts:42-43` on every refit (duplication, harmless).
- Orientation handling has no automated test: `main.ts` is untested and `layout.test.ts` covers only the pure `fitCasing`.

## Likely orientation and scaling defects (code reading, unverified at runtime)
1. **Touch split uses a different viewport than the layout.** `main.ts:96` uses `e.clientX < window.innerWidth / 2`; `refit` uses `visualViewport.width/height` (`main.ts:38-40`). The two differ under zoom or browser UI changes. The split is also not tied to the casing, so it ignores where the casing sits.
2. **Visual viewport offsets ignored.** `main.ts:44` positions with `offsetX/offsetY` from size alone; `visualViewport.offsetLeft/offsetTop` and `pageLeft/pageTop` are never read. `#stage` is `position: fixed; inset: 0` (`style.css:18-19`), which is the layout viewport, so the casing can sit off-centre when the two differ (mobile Safari toolbars, zoom).
3. **Rotation timing.** `orientationchange` (`main.ts:48`) and `resize` (`:47`) call `refit` synchronously. On iOS Safari `orientationchange` can fire before `innerWidth/innerHeight` update. No `requestAnimationFrame` or timeout re-fit and no `visualViewport.scroll` listener exists, so a stale size stays until some later `resize`.
4. **Zero scale is accepted.** `fitCasing` returns scale 0 for a 0 or invalid viewport (`layout.ts:22-24`, pinned by `layout.test.ts:43-49`); `refit` applies it as `scale(0)` (`main.ts:44`), so the casing disappears until the next event if a transient 0 size is read mid-rotation.
5. **Fractional scale on a pixel canvas.** `layout.ts:24` returns an unrounded scale (portrait 375 px wide gives about 1.17). The 240 x 160 canvas (`index.html:20-21`, `style.css:66-67`) is resized by a CSS `transform` (`main.ts:44`) with `image-rendering: pixelated`, so pixels are uneven. Offsets are fractional too (`layout.ts:29-30`), which blurs DOM text and the START button. `devicePixelRatio` is never read (no match in `src/`).
6. **No safe-area or dynamic-viewport handling.** `index.html:7` sets `viewport-fit=cover`, but no `env(safe-area-inset-*)`, `dvh`, `svh`, or `100vh` appears in `src/` or `index.html`. In landscape on a notched phone the fit uses the full width, and the casing can reach under the cutout.
7. **Portrait wastes the screen.** The casing is 4:3 (320 x 240), so a 375 x 667 portrait viewport is width-limited and the casing fills about 42% of the height; there is no portrait-specific layout (`layout.ts:2-3`, `style.css:25-37`). START and the hint are 70 x 24 and 9 px text at the casing scale (`style.css:85-97,117-121`).
8. **Held touch is not re-evaluated.** Direction is fixed at `pointerdown` (`main.ts:96-97`); after rotation the held finger keeps the old side until `pointerup`/`pointercancel` (`:105-106`). `blur` releases all (`:78-81`), but a rotation does not.
9. **Test gap.** `tests/render/layout.test.ts` covers 375 x 520, 667 x 320, 1920 x 1080 and invalid sizes only; it does not model `visualViewport`, orientation changes, `innerWidth` mapping, or rounding. Vitest runs in the node environment, so `main.ts` has no test.

## Handoff Summary
- **Intent-relevant finding**: Layout is one pure function (`src/render/layout.ts:21-34`) driven by `refit` (`src/main.ts:37-49`) with a CSS transform on a fixed 320 x 240 `#console`. The touch split uses `window.innerWidth` (`main.ts:96`) while the layout uses `visualViewport` (`main.ts:38-40`), and `visualViewport.offsetLeft/Top` is never applied (`main.ts:44`). Rotation timing (`main.ts:47-49`), zero-scale acceptance (`layout.ts:22-24`), and unrounded scale (`layout.ts:24`) are the other candidate causes.
- **Risks / follow-up**: Game logic and play area (240 x 160, `src/game/config.ts:5-6`) must not change; the canvas bitmap size stays 240 x 160 and only presentation changes. `layout.test.ts` pins `fitCasing` aspect ratio, centring, scale 4.5 at 1920 x 1080, and scale 0 for invalid input (`:38-49`), so changes there must update those tests deliberately. Fixes cannot be verified in the node test environment for `main.ts`; real-browser portrait and landscape checks are needed. None of the defects above has been reproduced.
