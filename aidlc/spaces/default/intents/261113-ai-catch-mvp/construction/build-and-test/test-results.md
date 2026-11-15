# Test Results: AI CATCH

Run 1, 2026-11-13, Node 26.12.0, macOS, branch `feature/u5-publishing` (U1-U5 work uncommitted). Instructions: `build-instructions.md`, `integration-test-instructions.md`, and the per-unit `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/*/code-generation/unit-test-instructions.md`. Target matrix: `build-and-test-summary.md`.

## Build

| Command | Exit | Result |
|---|---|---|
| `npm run typecheck` | 0 | No errors |
| `npm run build` | 0 | `dist/index.html` 1.21 kB, `index-*.css` 1.69 kB, `index-*.js` 26.32 kB (8.72 kB gzip); `dist/_headers` copied |
| `npm run size` | 0 | `dist total: 29497 bytes (28.8 KiB)`, limit 1,048,576 bytes, `OK: under the limit` |

## Tests

Distinct commands from the five unit instruction files, deduplicated. `npm test` covers every unit-scoped command, so the scoped commands were not run a second time for counting.

| Command | Exit | Files | Tests | Passed | Failed | Skipped |
|---|---|---|---|---|---|---|
| `npm test` (full suite; includes `tests/game`, `tests/render`, `tests/audio`, `tests/game/announcer.test.ts`, `tests/tooling`) | 0 | 15 | 200 | 200 | 0 | 0 |
| `npx vitest run tests/tooling` (U5, re-run after the `.d.mts` fix) | 0 | 1 | 7 | 7 | 0 | 0 |

No failures, so no failure details.

## Coverage

Command: `npm run coverage` (`vitest run --coverage`, provider v8, `include: src/**/*.ts`), run once on the full project. Exit 0 (no threshold is configured; the floor is judged here).

| Metric | Covered | Total | % |
|---|---|---|---|
| Lines | 325 | 690 | 47.1 |
| Statements | 363 | 771 | 47.08 |
| Branches | 159 | 319 | 49.84 |
| Functions | 75 | 120 | 62.5 |

| File | Lines covered |
|---|---|
| `src/main.ts` | 0 / 93 |
| `src/render/renderer.ts` | 0 / 251 |
| `src/audio/sound.ts` | 18 / 39 (`SoundPlayer.unlock` resume path and `play` scheduling) |
| every other `src/` file | 100% |

Verdict: 80% floor **Not Met**.

## Other Checks

| Check | Result |
|---|---|
| grep `fetch(`, `XMLHttpRequest`, `WebSocket`, `http(s)://` in `src/` | none |
| grep DOM/audio/storage globals in `src/game/` | none |
| grep `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` in `src/` | none |
| `src/game/` imports | only local game modules |
| `@font-face` / `url(` in `src/style.css` | none |
| secret-like files tracked or untracked | none |
| JS growth since U3 | 25.26 → 26.32 kB (+1.06 kB) against the U4 note of ≤ +1 kB: **Not Met** |
| Live headers, network, load time, repository and Pages setup | not run: no preview URL yet (Q2 A, developer step pending) |
| Browser play checks | not run: no real browser engine here |

## Failure Handling

- Rung 1 (in-stage fix): not applicable. The only in-stage lever for coverage would be shrinking the measured set, which lowers the target and is forbidden. Nothing in this stage's scaffolding causes the size overshoot.
- Rung 2 (classify): root cause is in the generated test code (no tests for `Renderer` and `SoundPlayer` scheduling) and in U4's generated source (bundle growth). An identifiable fix with an estimated impact exists, below.
- Rung 3: `Construction Autonomy Mode: autonomous`, 0 earlier loop-backs → autonomous bounded loop-back 1.

## Run 2 (after loop-back 1), 2026-11-13T15:12:42Z

Same machine and branch. Artifact Re-use decision for this stage: Modify (audited `ARTIFACT_REUSED`).

| Command | Exit | Result |
|---|---|---|
| `npm run typecheck` | 0 | No errors |
| `npm test` | 0 | 16 files, 230 tests, 230 passed, 0 failed, 0 skipped |
| `npm run build` | 0 | HTML 1.21 kB, CSS 1.69 kB, JS 26.25 kB (8.71 kB gzip); `dist/_headers` copied |
| `wc -c dist/assets/index-*.js` | 0 | 26,259 bytes (U4 target ≤ 26,260: Met) |
| `npm run size` | 0 | `dist total: 29428 bytes (28.7 KiB)`, `OK: under the limit` |
| `npm run coverage` | 0 | Lines 596/689 (86.5%), statements 668/770 (86.75%), branches 267/317 (84.22%), functions 102/120 (85%). Only `src/main.ts` (0/93) is below 100% lines. 80% floor: **Met** |
| grep `fetch(`, `http(s)://`, `innerHTML` in `src/` | — | none |
| `aidlc engine sensor-traceability --stage build-and-test` | 0 | pass, 0 uncovered, 110 IDs |

The Renderer and SoundPlayer tests use hand-written fakes in Node; they are integration evidence, not browser evidence.

Still open after run 2: the live-site targets (U5-NFR3.2, 5.14, 5.15, 7.1, 7.2, 7.3, 8.24, 8.27) need the Cloudflare Pages preview URL from the developer (Q2 A). They are Unverified until then; no code change can close them, so no further loop-back is planned.

## Live-Site Checks, 2026-11-15

The developer made `snow-note/aiCatch` public and created the Cloudflare Pages project `ai-catch` (a first attempt created a Workers project, which failed at `npx wrangler deploy`; it was replaced by a Pages project). Empty commits `a729c8f` and `3132d50` on `feature/u5-publishing` triggered the preview build.

| Check | Result |
|---|---|
| `curl -sI https://feature-u5-publishing.ai-catch.pages.dev/` | HTTP/2 200; `content-security-policy` exactly as NFR5.15; `x-content-type-options: nosniff`; `referrer-policy: no-referrer` |
| `curl -sI https://ai-catch.pages.dev/` (production, still the PoC on `main`) | HTTP/2 200; no CSP yet, as expected until the merge |
| Preview HTML asset references | only `./assets/index-bFTqt61n.js` and `./assets/index-CFEErAG5.css` |
| Preview JS | HTTP 200, 26,259 bytes (identical to the local build), contains "Humans saved AI", no `http(s)://` URL |
| Download time from this machine, no throttling | HTML 0.09 s, JS 0.08 s (not the NFR3.2 throttled browser check) |
| GitHub API `repos/snow-note/aiCatch` | `visibility: public`, licence MIT, default branch `main`; `.kiro` present on `main` |

Still pending from the developer: the Node version line of the Pages build log (NFR7.2, NFR8.24), the browser network panel and Fast 4G load time (NFR5.14, NFR3.2), the production URL in the README (NFR7.3), and the desktop and phone play checks (browser targets).

## Developer Checks, 2026-11-15

- Pages build log for `3132d50`: "Detected the following tools from environment: nodejs@24.22.1, npm@10.9.9" — `.node-version` is honoured.
- Browser network panel, console, and Fast 4G load on the preview URL: no issue (developer report).
- Desktop and phone play (smoothness, sound after START, VoiceOver, portrait and landscape): OK (developer report).
- Public URL chosen for the README: `https://aicatch.snow-note.com` (custom domain on the Pages project; `curl -sI` HTTP/2 200).

These are real-browser checks done by the developer by hand; no automated browser test exists in this project.

Final result: every applicable target in `build-and-test-summary.md` is Met; TC-CI is N/A (owned by CI Pipeline).

## Loop-Back Log

### Loop-back 1 — 2026-11-13T14:51:36Z

- **Diagnosis**: (a) Full-suite line coverage is 47.1% (325/690) against the 80% mvp floor. `src/render/renderer.ts` (0/251) and `src/audio/sound.ts` `SoundPlayer` (21 uncovered lines) have no tests; `src/main.ts` (0/93) is DOM wiring. 552 covered lines are needed. (b) U4's bundle growth is +1.06 kB against its ≤ +1 kB target (26.32 kB vs 26.26 kB); at least 60 bytes must go.
- **Root-cause stage**: code-generation, units `u2-screens-and-art` (Renderer tests), `u3-sound` (SoundPlayer tests), `u4-accessibility` (announcer size).
- **Planned fix**:
  - u2: add `tests/render/renderer.test.ts` that drives `Renderer` with a hand-written fake canvas and 2D context (records `fillRect` and state calls) through every phase screen (title, stage intro, playing HUD with objects, stage clear, game over with and without NEW!, victory steps) and every effect (`onEvent` for catch, VIRUS hit, life lost; `update` until effects expire), plus a missing 2D context. Target ≥ 220 of 251 renderer lines. No source change unless a test exposes a real defect.
  - u3: add `SoundPlayer` tests with a fake `AudioContext` on `globalThis` (oscillator, gain, `currentTime`, `state`, `resume`): unlock creates once, resumes when suspended, `play` schedules one oscillator per note with peak gain 0.12, a throwing `createOscillator` stays silent. Target ≥ 37 of 39 lines.
  - u4: shrink the generated code of `src/game/announcer.ts` and the `main.ts` announcement section by ≥ 60 minified bytes without changing any announced sentence or key (for example an array for item names and shared sentence parts), keeping all U4 tests green; re-measure with `npm run build`.
  - Expected result: about 325 + 230 + 20 = 575 of 690 lines (≈ 83%) with `main.ts` still untested; JS ≤ 26.26 kB.
- **Estimated impact**: effort about 2-3 hours of agent work plus three Plan Approvals by the developer; cost none (no dependency, no service); risk low (tests only for u2 and u3; a behaviour-preserving size refactor for u4 guarded by its 15 tests). If the u4 trim cannot reach 60 bytes without changing wording, the next run reports it `Not Met` and asks the developer.
