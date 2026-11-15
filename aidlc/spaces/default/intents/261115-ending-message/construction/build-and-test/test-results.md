# Test Results

Run on 2026-11-15 (local, macOS, Node), branch `feature/ending-message`, uncommitted working tree.

## Build

| Command | Exit | Result |
|---|---|---|
| `npm run typecheck` | 0 | No errors |
| `npm run build` | 0 | `dist/assets/index-D-nhIpvU.js` 29.27 kB (gzip 9.89 kB) |
| `npm run size` | 0 | `dist/` 32,570 bytes, limit 1,048,576 bytes, `OK: under the limit` |

## Unit Tests

Command from `construction/code-generation/unit-test-instructions.md` (run once):

```bash
npx vitest run tests/render/ending.test.ts tests/render/screen-timing.test.ts tests/render/sprites.test.ts tests/render/renderer.test.ts tests/game/config.test.ts tests/game/state.test.ts tests/game/announcer.test.ts
```

- Exit 0. 7 files, 154 tests passed, 0 failed.

## Full-Suite Coverage

Command: `npm run coverage` (Vitest v8, lines threshold 80%). Exit 0.

| Metric | Value |
|---|---|
| Test files | 18 passed |
| Tests | 288 passed, 0 failed |
| Lines | 84.59% (659/779) |
| Statements | 84.81% |
| Branches | 83.37% |
| Functions | 84.78% |

## Where Checks Ran

All automated tests ran in Node (Vitest `environment: node`). The renderer test uses a fake 2D context and checks only that the victory screen draws without throwing. No real browser engine ran in this stage.

## Failures

None.

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| T-COV-LINES | `vitest.config.ts`; team posture | Lines >= 80% full suite | 84.59% | `npm run coverage` exit 0 | build-and-test | Met |
| T-SUITE-GREEN | Testing Contract `scope_floor` | Existing suite green | 288/288 | `npm run coverage` | build-and-test | Met |
| T-TYPECHECK | team posture | No type errors | 0 | `npm run typecheck` | build-and-test | Met |
| T-SIZE | `npm run size` | < 1,048,576 bytes | 32,570 | `npm run size` | build-and-test | Met |
| NFR1 | `requirements.md` | Every line fits 240 px; every character has a glyph | Tests pass | `tests/render/ending.test.ts` | build-and-test | Met |
| NFR3 | `requirements.md` | Gameplay unchanged; `src/game/` only timing constant and announcer | `src/game/state.ts`, `src/main.ts`, `src/audio/` have no diff | git diff | build-and-test | Met |
| NFR4 | `requirements.md` | Ending timing tunables in `config.ts` | Pinned | `tests/game/config.test.ts` | build-and-test | Met |
| NFR5 | `requirements.md` | Pure view and timing helpers tested | Tests pass | `tests/render/screen-timing.test.ts` | build-and-test | Met |
| NFR6 | `requirements.md` | Quality commands pass | All exit 0 | commands above | build-and-test | Met |
| NFR7 | `requirements.md` | No new dependency; original glyphs | `package.json` unchanged | git diff | build-and-test | Met |
| T-CI | Testing Contract | CI before merge | Not in the express contract; the plan runs no CI Pipeline | `aidlc-state.md` | N/A | N/A: the plan runs no CI Pipeline. The existing GitHub Actions check still runs on the pull request. |
| NFR2 | `requirements.md` | Readable on desktop and iPhone Safari, portrait and landscape | Node only | — | build-and-test (play on the preview) | Unverified (only gap: no real browser ran here) |
