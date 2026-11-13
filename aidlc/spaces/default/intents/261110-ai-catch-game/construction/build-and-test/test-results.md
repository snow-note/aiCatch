# Test Results — AI CATCH

Run on 2026-11-10 on macOS, Node 26.0.0, npm 11.12.1, from the project root, against the code from [code-summary.md](../code-generation/code-summary.md).

## Build Status

| Command | Exit | Result |
|---|---|---|
| `npm ci` | 0 | Added 38 packages from `package-lock.json`; `found 0 vulnerabilities` |
| `npm run typecheck` | 0 | `tsc --noEmit`, no errors |
| `npm run build` | 0 | `vite v8.3.7`, 17 modules; `dist/index.html` 1.17 kB, `dist/assets/index-CAaiMnHP.css` 1.53 kB, `dist/assets/index-CMQdFHEh.js` 17.20 kB (6.08 kB gzip) |

`dist/` file sizes from `find dist -type f -exec ls -l {} +`: 1,170 + 1,533 + 17,203 = **19,906 bytes**.

## Unit Tests

The commands below are taken from [unit-test-instructions.md](../code-generation/unit-test-instructions.md). This is zero-Unit work with one stage-level instructions file; identical commands were run once. The commands overlap, so the totals below are per command, not added together.

| Command | Exit | Files | Tests | Passed | Failed | Skipped |
|---|---|---|---|---|---|---|
| `npx vitest run tests/ --passWithNoTests` | 0 | 9 | 89 | 89 | 0 | 0 |
| `npx vitest run tests/` | 0 | 9 | 89 | 89 | 0 | 0 |
| `npx vitest run tests/game/` | 0 | 6 | 68 | 68 | 0 | 0 |
| `npx vitest run tests/render/ tests/audio/` | 0 | 3 | 21 | 21 | 0 | 0 |

The distinct test total is **89 tests in 9 files, all passing**. By file: difficulty 11, spawner 6, collision 6, input 9, state 22, highscore 14, layout 6, sprites 10, sound 5. All of these run in **Node** (Vitest `environment: 'node'`), not in a browser.

### Failure Details

None.

### Coverage Report

Not measured. The Testing Contract (poc scope, Minimal strategy) sets no coverage floor and the project configures no threshold, so there is no coverage command to run.

## Real-Browser Checks

Run with the installed Google Chrome in headless mode (`--headless=new`), against `npx vite preview --port 4173` serving the built `dist/`. This is a real browser engine (Chromium). The checks are page loads and layout read-back, not gameplay.

| Check | Result |
|---|---|
| Load `http://localhost:4173/` and dump the DOM after 3 s of virtual time | Page loaded. `src/main.ts` ran: it set the casing's `transform` and the canvas is 240 × 160. No page console errors were logged. Chrome printed only its own GPU and display messages from headless mode. |
| Landscape: `--window-size=667,320` | The visible area inside headless Chrome was 667 × about 233 CSS px, which is smaller than the 667 × 320 target. The casing was scaled to 0.9708 and offset 178.17 px horizontally: 310.7 × 233 px, centred, with nothing outside the visible area. |
| Portrait: `--window-size=375,520` | Not reproducible. Headless Chrome kept the window at least 500 px wide, so the layout read back (scale 1.5625, 500 × 375 px) is for a 500 px width, not 375 px. The 375 × 520 fit is shown only by the Node test `tests/render/layout.test.ts`. |

Screenshots were taken but could not be opened here, because the project's `.kiroignore` blocks reading `scratch/`. The temporary Chrome profiles and screenshots were deleted afterwards.

Not run here: Firefox, Safari and Edge; gameplay in any browser (input, sound, effects, rotation); frame rate; any smartphone.

## Other Checks

| Check | Command or method | Result |
|---|---|---|
| `.kiro` and `LICENSE` are not git-ignored | `git check-ignore -v .kiro .kiro/agents/aidlc.json LICENSE` | Exit 1, no output: none of them is ignored |
| No network calls in the game | Search `src/**` and `index.html` for `fetch(`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`, `http://`, `https://` | No matches |
| No image, audio or font files shipped | `dist/` file list | Only `index.html`, one `.css` and one `.js` file |
| Dependency vulnerabilities | `npm ci` audit | `found 0 vulnerabilities` |

## Target Verification Results

The final verdicts are in the Target Verification Matrix in [build-and-test-summary.md](build-and-test-summary.md#target-verification-matrix).

## Loop-Back Log

No loop-back was needed: every command passed.
