# Build and Test Summary: AI CATCH

Run 2, 2026-11-13 (after loop-back 1; run 1 results are in `test-results.md`). Sources: every `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/*/code-generation/code-generation-plan.md` (Testing Contract `sha256:02e7e246…bdad`, identical in U1-U5), `unit-test-instructions.md`, `code-summary.md`; every `construction/*/nfr-requirements/` and `construction/*/nfr-design/` artifact; `build-and-test-questions.md` (Q1 A, Q2 A). Results: `test-results.md`.

## Overall Status

- Build: **success** (typecheck, build, size).
- Tests: **230 / 230 passed** (16 files).
- Stage result: **not yet passing** — coverage (86.5%) and the U4 size target (26,259 bytes) are now Met after loop-back 1; the live-site targets still wait for the developer's publishing steps (Q2 A) and stay Unverified until the preview URL is checked.

## Test Type Inventory

| Type | File | Generated |
|---|---|---|
| Build | `build-instructions.md` | yes |
| Unit | per-unit `unit-test-instructions.md` (U1-U5) | yes (Code Generation) |
| Integration | `integration-test-instructions.md` | yes (Standard) |
| Performance, security | — | not generated: Standard strategy; their measurable targets are in the matrix and the README release checklist |

## Coverage Expectations

| Scope | Expectation |
|---|---|
| Project | ≥ 80% line coverage of `src/**/*.ts`, full suite, `npm run coverage` (mvp scope floor) |
| U1 game rules | All behaviour tested first; `src/game/*` measured at 100% lines |
| U2 screens | Pure helpers, sprites, and Renderer (251/251 lines, fake context in Node) tested |
| U3 sound | Tables, mapping, and `SoundPlayer` (39/39 lines, fake `AudioContext` in Node) tested |
| U4 announcements | Builder 100% lines |
| U5 publishing | `checkTotal` fully tested; no `src/` change |

## Target Verification Matrix

Target IDs are prefixed with the unit because U1 and U2 both define an `NFR2.1`. "Browser" in Evidence means the check needs a real browser engine; none ran here (Node only).

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| TC-COV80 | Testing Contract `scope_floor` | ≥ 80% lines, full suite | 86.5% (596/689); only `src/main.ts` 0/93 below 100% | `npm run coverage` run 2, exit 0; `coverage/coverage-summary.json` | build-and-test | Met |
| TC-CI | Testing Contract `scope_floor` | Selected tests run in CI before merge | — | CI Pipeline, later in this plan, sets up CI to run these tests before merge | ci-pipeline | N/A |
| TC-VOL | Testing Contract `strategy_volume` | 5-8 tests per component; unit plus key-boundary integration tests | 230 tests over 16 files; boundaries per `integration-test-instructions.md` | `npm test` | build-and-test | Met |
| TC-TDD | Testing Contract `methodology` | Failing test before implementation for game logic | Red outputs recorded in every unit's `code-summary.md` | U1-U5 code summaries | build-and-test | Met |
| U1-NFR5.1 | u1 security-requirements | `src/game/` makes no network call; imports only `src/game/` | Imports only `./…` game modules; no `fetch`, URL, socket | grep of `src/game/` | build-and-test | Met |
| U1-NFR8.1 | u1 security-requirements | No DOM, window, canvas, audio, storage globals in rules | None found | grep `window.`, `document.`, `localStorage`, `AudioContext`, `getContext` in `src/game/` | build-and-test | Met |
| U1-NFR8.2 | u1 security-requirements | Untrusted stored high score → 0 | Tests pass | `tests/game/highscore.test.ts` | build-and-test | Met |
| U1-NFR8.3 | u1 security-requirements | Storage failures caught | Tests pass | `tests/game/highscore.test.ts` | build-and-test | Met |
| U1-NFR8.4 | u1 security-requirements | No control or view call throws; bad input ignored | Tests pass | `tests/game/state.test.ts`, `input.test.ts` | build-and-test | Met |
| U1-NFR8.5 | u1 security-requirements | View values finite and in range | Tests pass | `tests/game/state.test.ts` | build-and-test | Met |
| U1-NFR8.6 | u1 security-requirements | Bounded work per update | Tests pass | `tests/game/state.test.ts` (large `dt`) | build-and-test | Met |
| U1-NFR6.1 | u1 security-requirements | No assets or third-party code | None | `package.json` (dev dependencies only) | build-and-test | Met |
| U1-NFR8.7 | u1 tech-stack | TypeScript 7.0.2 strict, named exports | Typecheck passes | `npm run typecheck` | build-and-test | Met |
| U1-NFR8.8 | u1 tech-stack | Vitest 5.1.0, node, tests first | As configured | `vitest.config.ts`; U1 code summary | build-and-test | Met |
| U1-NFR8.9 | u1 tech-stack | Shared types in `src/game/types.ts` | Present, type-only | `src/game/types.ts` (0 executable lines) | build-and-test | Met |
| U1-NFR8.10 | u1 tech-stack | Tunables in `config.ts` | Present | `src/game/config.ts`; `tests/game/config.test.ts` | build-and-test | Met |
| U1-NFR8.11 | u1 tech-stack | Injected randomness | Present | `tests/game/spawner.test.ts` | build-and-test | Met |
| U1-NFR5.2 | u1 tech-stack | No runtime services | None | grep (see U1-NFR5.1) | build-and-test | Met |
| U1-NFR2.1 | u1 tech-stack | No runtime dependency or assets | None | `package.json` | build-and-test | Met |
| U2-NFR1.1 | u2 performance | Draw + update fit a 60 fps frame | Not measured | Browser (play check on a phone) | build-and-test | Unverified (browser) |
| U2-NFR1.2 | u2 performance | No allocation-heavy per-frame work | `fillRect` runs from constant tables | Code review of `src/render/renderer.ts` | build-and-test | Met |
| U2-NFR1.3 | u2 performance | Bounded effects (≤ 6 slices, ≤ 3 noise lines) | Bounded in code | Code review; `tests/render/screen-timing.test.ts` (`noiseLines`) | build-and-test | Met |
| U2-NFR2.1 | u2 performance | U2 bundle growth < 10 kB gzip | +1.30 kB gzip (6.87 → 8.17) | U1 and U2 code summaries | build-and-test | Met |
| U2-NFR3.1 | u2 performance | Title drawn on the first frame, no async load | No async load in code | Code review; first-frame look is browser | build-and-test | Unverified (browser) |
| U2-NFR4.1 | u2 performance | Console fits 4:3, centred, no scroll | `fitCasing` tests pass | `tests/render/layout.test.ts`; on-screen fit is browser | build-and-test | Unverified (browser) |
| U2-NFR9.1 | u2 performance | LCD text legible at 375×520 and 667×320 | Not measured | Browser (play check) | build-and-test | Unverified (browser) |
| U2-NFR5.3 | u2 security | No network or external resource | None | grep of `src/`, `style.css` | build-and-test | Met |
| U2-NFR5.4 | u2 security | No HTML from strings | None | grep `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` | build-and-test | Met |
| U2-NFR5.5 | u2 security | Renderer reads `GameView` only | Typecheck passes | `npm run typecheck` | build-and-test | Met |
| U2-NFR5.6 | u2 security | Drawing never throws | Guards in code; helpers tested | `tests/render/renderer.test.ts` (null context, unknown kind, non-finite view) | build-and-test | Met |
| U2-NFR6.2 | u2 security | Original bitmaps recorded | Recorded | `ASSETS.md` | build-and-test | Met |
| U2-NFR6.3 | u2 security | System monospace font only | No `@font-face` or `url(` | grep `src/style.css` | build-and-test | Met |
| U2-NFR8.12 | u2 tech-stack | Canvas 2D `fillRect`, no smoothing | As coded | Code review | build-and-test | Met |
| U2-NFR8.13 | u2 tech-stack | `#`/`.` bitmap strings | As coded | `tests/render/sprites.test.ts` | build-and-test | Met |
| U2-NFR8.14 | u2 tech-stack | Pure helpers tested | 100% lines | `tests/render/screen-timing.test.ts` | build-and-test | Met |
| U2-NFR8.15 | u2 tech-stack | Static page, no framework | As built | `index.html`, `package.json` | build-and-test | Met |
| U2-NFR2.2 | u2 tech-stack | No runtime dependency or assets | None | `package.json` | build-and-test | Met |
| U3-NFR5.7 | u3 security | No audio file, URL, request | None | grep of `src/` | build-and-test | Met |
| U3-NFR5.8 | u3 security | `unlock`/`play` never throw | No-context, throwing constructor, throwing `createOscillator`, rejected `resume` tests pass | `tests/audio/sound.test.ts` | build-and-test | Met |
| U3-NFR5.9 | u3 security | Audio only after first START | `unlock()` only in START handlers | Code review of `src/main.ts`; phone check is browser | build-and-test | Unverified (browser) |
| U3-NFR5.10 | u3 security | Peak gain 0.12 | 0.12 asserted | `tests/audio/sound.test.ts` (fake `AudioContext`) | build-and-test | Met |
| U3-NFR6.4 | u3 security | Original cues, recorded | Recorded | `ASSETS.md` Sounds section | build-and-test | Met |
| U3-NFR8.16 | u3 security | Pure tested `soundForEvent` | Tests pass | `tests/audio/sound.test.ts` | build-and-test | Met |
| U3-NFR8.17 | u3 tech-stack | Square-wave oscillators | As coded | Code review | build-and-test | Met |
| U3-NFR8.18 | u3 tech-stack | `Note[]` tables | Tests pass | `tests/audio/sound.test.ts` | build-and-test | Met |
| U3-NFR8.19 | u3 tech-stack | Pure mapping | Tests pass | `tests/audio/sound.test.ts` | build-and-test | Met |
| U3-NFR2.3 | u3 tech-stack | No audio assets | None | `dist/` has no audio file | build-and-test | Met |
| U4-NFR5.11 | u4 security | `textContent` only | No markup insertion in `src/` | grep; code review of `src/main.ts` | build-and-test | Met |
| U4-NFR5.12 | u4 security | Writer never throws | One `try/catch` around build and write; null-safe lookup | Code review; screen-reader check is browser | build-and-test | Met |
| U4-NFR5.13 | u4 security | No network or storage | None | grep | build-and-test | Met |
| U4-NFR1.4 | u4 security | DOM write only on key change | Key ignores score and caught | `tests/game/announcer.test.ts`; code review | build-and-test | Met |
| U4-NFR2.4 | u4 security | JS growth ≤ 1 kB over 25.26 kB (≤ 26,260 bytes) | 26,259 bytes (26.25 kB); 1-byte margin | `npm run build`; `wc -c dist/assets/index-*.js` | build-and-test | Met |
| U4-NFR8.20 | u4 security | Pure builder, tests first | Tests pass; Red recorded | `tests/game/announcer.test.ts`; U4 code summary | build-and-test | Met |
| U4-NFR8.21 | u4 tech-stack | Polite live region | Present | `index.html` | build-and-test | Met |
| U4-NFR8.22 | u4 tech-stack | `screenAnnouncement` returns `{ key, text }` | As coded | `src/game/announcer.ts` | build-and-test | Met |
| U4-NFR8.23 | u4 tech-stack | Vitest with literal views | As coded | `tests/game/announcer.test.ts` | build-and-test | Met |
| U5-NFR2.5 | u5 security | `npm run size` < 1 MB | 29,428 bytes, exit 0 | `npm run size` | build-and-test | Met |
| U5-NFR3.2 | u5 security | Load event ≤ 2 s (Fast 4G, no cache) on preview | Not measured | Needs the Pages preview URL | build-and-test | Unverified |
| U5-NFR5.14 | u5 security | Only same-origin requests on the deployed page | Static: no external URL in `src/` or `dist/` | Needs the preview URL network panel | build-and-test | Unverified |
| U5-NFR5.15 | u5 security | Three headers on every path | `dist/_headers` correct locally | Needs `curl -sI` on the preview URL | build-and-test | Unverified |
| U5-NFR5.16 | u5 security | No secret committed or untracked; no Pages variables | None found | `git ls-files` and `git ls-files -o --exclude-standard` | build-and-test | Met |
| U5-NFR6.5 | u5 security | README originality section | Present | `README.md` | build-and-test | Met |
| U5-NFR7.1 | u5 security | Public repo, MIT, `.kiro/` committed | MIT and `.kiro/` tracked; visibility not checked | Developer step 8 | build-and-test | Unverified |
| U5-NFR7.2 | u5 security | Pages connected, settings, Node 24 | Not created yet | Developer step 8; build log | build-and-test | Unverified |
| U5-NFR7.3 | u5 security | README complete incl. public URL | Complete except the URL placeholder | `README.md` | build-and-test | Unverified |
| U5-NFR1.5 | u5 security | ~60 fps on desktop and phone | Not measured | Browser (play check) | build-and-test | Unverified (browser) |
| U5-NFR8.24 | u5 tech-stack | `.node-version` 24 read by Pages | File present | Needs the Pages build log | build-and-test | Unverified |
| U5-NFR8.25 | u5 tech-stack | Dependency-free size script | Built-ins only; tests pass | `tests/tooling/check-size.test.ts` | build-and-test | Met |
| U5-NFR8.26 | u5 tech-stack | `_headers` copied to `dist/` | Present | `dist/_headers` | build-and-test | Met |
| U5-NFR8.27 | u5 tech-stack | Pages Git integration | Not created yet | Developer step 8 | build-and-test | Unverified |

## Readiness Assessment

| Readiness | Status |
|---|---|
| Build-ready | Yes: clean typecheck, build, and size check |
| Test-ready | Yes: 230/230 tests, 86.5% lines |
| Deployment-ready | Build output ready; the live-site targets are not yet checked |

## Known Limitations and Outstanding Items

- Loop-back 1 (see `test-results.md`) repaired `u2-screens-and-art`, `u3-sound`, and `u4-accessibility`; each got fresh Plan Approval, review READY, and checkpoint approval.
- The U4 size target holds with a 1-byte margin; any later bundle growth will miss it again.
- `src/main.ts` (DOM wiring) has no unit tests; it is checked by playing.
- Live-site targets (U5-NFR3.2, 5.14, 5.15, 7.1, 7.2, 7.3, 8.24, 8.27) wait for the developer's publishing steps (Q2 A).
- Browser targets (U2-NFR1.1, 3.1, 4.1, 9.1, U3-NFR5.9, U5-NFR1.5) ran in Node only; no real browser engine ran here.
