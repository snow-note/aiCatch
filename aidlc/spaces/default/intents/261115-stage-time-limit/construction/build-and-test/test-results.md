# Test Results

Run on 2026-11-13 (local, macOS, Node), branch `feature/stage-time-limit`, uncommitted working tree.

## Build

| Command | Exit | Result |
|---|---|---|
| `npm run typecheck` | 0 | No errors |
| `npm run build` | 0 | `dist/assets/index-DXqRHI77.js` 27.45 kB (gzip 9.12 kB), CSS 1.69 kB, HTML 1.21 kB |
| `npm run size` | 0 | `dist total: 30628 bytes (29.9 KiB)`, limit 1,048,576 bytes, `OK: under the limit` |

## Unit Tests

Command from `construction/code-generation/unit-test-instructions.md` (run once):

```bash
npx vitest run tests/game/config.test.ts tests/game/spawner.test.ts tests/game/state.test.ts tests/game/announcer.test.ts tests/game/difficulty.test.ts tests/game/first-heart.test.ts tests/render/screen-timing.test.ts tests/render/renderer.test.ts tests/audio/sound.test.ts
```

- Exit 0. 9 files, 171 tests passed, 0 failed, 0 skipped.

## Full-Suite Coverage

Command: `npm run coverage` (Vitest with v8, threshold lines 80% in `vitest.config.ts`). Exit 0.

| Metric | Value |
|---|---|
| Test files | 17 passed |
| Tests | 264 passed, 0 failed |
| Lines | 87.1% (628/721) |
| Statements | 87.32% (703/805) |
| Branches | 85.54% (296/346) |
| Functions | 85.48% (106/124) |

`src/game` and `src/render` are at 100% lines. `src/main.ts` (0%) is DOM wiring and is checked by playing, as the team's testing posture says.

## Where Checks Ran

All automated tests ran in Node (Vitest `environment: node`). The renderer tests use a fake canvas context, and the sound tests check note data and event mapping only. No real browser engine ran in this stage.

## Failures

None.

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| T-COV-LINES | `vitest.config.ts` threshold; Testing Contract (team) | Lines >= 80% on the full suite | 87.1% | `npm run coverage` exit 0 | build-and-test | Met |
| T-SUITE-GREEN | Testing Contract `scope_floor` | Existing suite stays green | 264/264 passed | `npm run coverage` | build-and-test | Met |
| T-TYPECHECK | team Testing Posture | `tsc --noEmit` clean | 0 errors | `npm run typecheck` exit 0 | build-and-test | Met |
| T-SIZE | `npm run size` budget | `dist/` < 1,048,576 bytes | 30,628 bytes | `npm run size` exit 0 | build-and-test | Met |
| NFR2 | `requirements.md` NFR2 | Stage 1 VIRUS reaction >= 1.2 s | 1.705 s (test passes) | `tests/game/config.test.ts` | build-and-test | Met |
| NFR3 | `requirements.md` NFR3 | Minimum clear time per stage <= 60 s | Test passes for all 4 stages | `tests/game/config.test.ts` | build-and-test | Met |
| NFR4 | `requirements.md` NFR4 | Median first life lost 5-10 s | Test passes unchanged | `tests/game/first-heart.test.ts` | build-and-test | Met |
| NFR5 | `requirements.md` NFR5 | typecheck, coverage >= 80%, build, size pass | All exit 0 | Commands above | build-and-test | Met |
| T-CI | Testing Contract | CI before merge | No CI obligation in the express contract; the plan runs no CI Pipeline | `aidlc-state.md` (ci-pipeline SKIP) | N/A | N/A: the plan runs no CI Pipeline. The existing GitHub Actions check still runs on the pull request. |
| T-BROWSER-PLAY | team Testing Posture manual checklist; FR4.1-FR4.3, FR5.2 | Timer, blink, beep, `TIME UP` look and sound right on desktop and smartphone | Checked in Node only (fake canvas, sound data) | `tests/render/*.test.ts`, `tests/audio/sound.test.ts` | build-and-test (play on the preview before merge) | Unverified (only gap: no real browser ran here) |
