# Build and Test Summary — AI CATCH

Inputs: [code-generation-plan.md](../code-generation/code-generation-plan.md), [unit-test-instructions.md](../code-generation/unit-test-instructions.md), [code-summary.md](../code-generation/code-summary.md). Results: [test-results.md](test-results.md). How to build: [build-instructions.md](build-instructions.md).

## Overall Build Status

**Build: passing. Tests: 89 of 89 passing. The production bundle is 19,906 bytes.**

Prerequisites: Node.js 20.19 or later, then `npm ci`. There are no environment variables, services or secrets.

## Test Type Inventory

| Test type | Generated | Where it runs | Notes |
|---|---|---|---|
| Unit | Yes: 9 files, 89 tests (Code Generation) | Node (Vitest) | Game rules, input, high score, layout, sprites, sound timing |
| Integration | No | — | Minimal strategy: no integration instruction file |
| Performance | No | — | Minimal strategy; the 60 fps target is listed in the matrix below |
| Security | No | — | Minimal strategy; no auth or server. A dependency audit ran as part of `npm ci` (0 vulnerabilities) |
| Real-browser smoke check | Yes, ad hoc in this stage | Chromium (headless Google Chrome) | Page load and layout read-back only; see test-results.md |

The test strategy is **Minimal** (poc scope), so no integration, performance or security instruction files are generated.

## Coverage Expectations

This is zero-Unit work, so the project is one build with no Units.

- The Testing Contract (test-after methodology, Minimal strategy, poc scope) sets **no line-coverage floor** and no CI obligation. No coverage threshold is configured.
- Its obligations are one verifiable test per requirement at the narrowest level, a happy-path test per component, and keeping the existing suite green. These are met; see TC-1 below.

## Target Verification Matrix

Sources searched:
- `nfr-requirements/` and `nfr-design/`: none exist, because poc skips those stages
- the `## Testing Contract` in code-generation-plan.md
- the measurable NFRs in requirements.md, which serve as the quality targets for this poc

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| TC-1 | code-generation-plan.md > Testing Contract > obligations | One test per testable requirement, a happy-path test per component, existing suite green | 89 tests in 9 files cover every component; 0 failed | `npx vitest run tests/` exit 0 (test-results.md) | build-and-test | Met |
| TC-2 | code-generation-plan.md > Testing Contract > scope_floor | No coverage floor and no CI obligation for poc | None configured | Testing Contract JSON; no coverage threshold in `vitest.config.ts` | build-and-test | N/A — the poc Testing Contract sets no coverage floor and the plan runs no CI Pipeline |
| NFR1-landscape | requirements.md > NFR1 | Whole play area and score/lives visible without scrolling at a 667 × 320 CSS px visible area | Casing at 310.7 × 233 px, centred, fully inside a 667 × about 233 px visible area (smaller than the target) | Headless Chrome DOM read-back at `--window-size=667,320` (Chromium); `tests/render/layout.test.ts` (Node) | build-and-test | Met |
| NFR1-portrait | requirements.md > NFR1 | The same at 375 × 520 CSS px | Fits in the Node layout test. Not reproduced in a real browser: headless Chrome would not go below 500 px wide | `tests/render/layout.test.ts` (Node only) | build-and-test | Unverified — no real browser engine ran this size |
| NFR1-rotation | requirements.md > NFR1, FR9.6 | Both orientations on a smartphone, rotating mid-game keeps play running | Re-fit handler in `src/main.ts`; not run on a device | Code only | build-and-test | Unverified — no real smartphone browser ran it |
| NFR2 | requirements.md > NFR2 | Runs in the latest Chrome, Firefox, Safari and Edge | Chrome: page loads and the script runs with no page errors. Firefox, Safari and Edge: not run | Headless Chrome `--dump-dom` (Chromium) | build-and-test | Unverified — only Chrome was run |
| NFR3 | requirements.md > NFR3 | 60 fps on a typical laptop and a mid-range smartphone from the last 3 years | Not measured | — | build-and-test | Unverified — no real browser frame-rate measurement ran |
| NFR4-size | requirements.md > NFR4 | Total download under 1 MB (1,048,576 bytes) | 19,906 bytes | `dist/` file list after `npm run build` | build-and-test | Met |
| NFR4-server | requirements.md > NFR4 | No server-side processing needed to play | Static build; no network calls in the game code | `vite build` output; search for `fetch(`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, URLs in `src/` and `index.html`: no matches | build-and-test | Met |
| NFR5 | requirements.md > NFR5 | All assets original or with recorded terms of use | No image, audio or font files; sprites are code bitmaps and sounds are synthesised in code | `dist/` holds only HTML, CSS and JS; `src/render/sprites.ts`, `src/audio/sound.ts`; recorded in code-summary.md | build-and-test | Met |
| NFR6-licence | requirements.md > NFR6, AC9.1.3 | MIT licence file at the repository root | `LICENSE` with MIT text | `LICENSE`; `git check-ignore` shows it is not ignored | build-and-test | Met |
| NFR6-kiro | requirements.md > NFR6, AC9.1.2 | `.kiro` at the root and not git-ignored | `.kiro/` present; not ignored | `git check-ignore -v .kiro .kiro/agents/aidlc.json` exit 1 (none ignored) | build-and-test | Met |
| NFR6-public | requirements.md > NFR6, AC9.1.1 | Public GitHub repository holding all source | Not pushed yet; the repository has no commits for these files (`git status` lists them untracked) | — | developer, after pushing | N/A — the approved plan and US9.1 leave pushing and checking the public repository to the developer ("githubにpushしてから私が判断する") |

## Readiness Assessment

- **Build-ready: yes.** A clean `npm ci`, the type check and the production build all succeed.
- **Test-ready: yes.** All 89 unit tests pass in Node. A headless Chrome check shows the built page loads and fits a landscape phone-sized area.
- **Deployment-ready: the static `dist/` is ready to upload.** Before submitting, play-test it on a real phone and desktop browsers. The Unverified rows above are what that play-test covers.

## Known Limitations and Outstanding Items

- **Real-browser and device checks not run here:**
  - the 375 px portrait fit
  - Firefox, Safari and Edge
  - 60 fps
  - gameplay on a phone: touch halves, sound after POWER, rotation mid-game

  These are browser targets: everything was checked in Node, or only page load and layout in headless Chrome.
- **Behaviour covered only by the type check and build** (from the Code Generation review, R-01): `src/main.ts` wiring, the renderer's screens and effects, and the sound player.
- **Accepted minor review points** from Code Generation:
  - R-04: two sprite assertions only check that an entry exists
  - R-05: a missed mouse release can leave the next click not restarting; any key or START still works
- **Cross-unit traceability fails** on AC8.1.3, AC8.1.4 and AC9.1.1 and the requirements they belong to, because Code Generation deferred them; see [cross-unit-traceability.md](cross-unit-traceability.md).
- **The repository has no commits yet** for the game files. Committing and pushing are left to the developer.
