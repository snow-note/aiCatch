# Test Results

Run on 2026-11-15 (local, macOS, Node), branch `feature/responsive-orientation`, uncommitted working tree.

## Build

| Command | Exit | Result |
|---|---|---|
| `npm run typecheck` | 0 | No errors |
| `npm run build` | 0 | `dist/assets/index-CTciFs-7.js` 28.52 kB (gzip 9.53 kB), CSS 1.82 kB |
| `npm run size` | 0 | `dist/` 31,824 bytes, limit 1,048,576 bytes, `OK: under the limit` |

## Unit Tests

Command from `construction/code-generation/unit-test-instructions.md` (run once):

```bash
npx vitest run tests/render/layout.test.ts
```

- Exit 0. 16 tests passed (6 existing `fitCasing` tests unchanged, 10 new), 0 failed.

## Full-Suite Coverage

Command: `npm run coverage` (Vitest v8, lines threshold 80% in `vitest.config.ts`). Exit 0.

| Metric | Value |
|---|---|
| Test files | 17 passed |
| Tests | 274 passed, 0 failed |
| Lines | 84.23% (641/761) |
| Statements | 84.45% |
| Branches | 83.01% |
| Functions | 84.32% |

Lines went from 87.1% to 84.23% because `src/main.ts` (DOM wiring, 0% by design, checked by playing) grew. `src/render/layout.ts` is fully covered.

## Where Checks Ran

All automated tests ran in Node (Vitest `environment: node`) against pure functions. No real browser engine ran in this stage. The DOM wiring (`src/main.ts`, `src/style.css`) is checked only by the iPhone Safari device check.

## Failures

None.

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| T-COV-LINES | `vitest.config.ts`; team posture | Lines >= 80% full suite | 84.23% | `npm run coverage` exit 0 | build-and-test | Met |
| T-SUITE-GREEN | Testing Contract `scope_floor` | Existing suite green | 274/274 | `npm run coverage` | build-and-test | Met |
| T-REGRESSION | Testing Contract `scope_floor` (bugfix) | Targeted regression for the risk | `chooseFit` keeps the previous fit when scale is 0 (passes) | `tests/render/layout.test.ts` | build-and-test | Met |
| T-TYPECHECK | team posture | No type errors | 0 | `npm run typecheck` | build-and-test | Met |
| T-SIZE | `npm run size` | < 1,048,576 bytes | 31,824 | `npm run size` | build-and-test | Met |
| NFR1 | `requirements.md` | No change in `src/game/`, `src/audio/` | `git diff --stat -- src/game src/audio` empty | git diff | build-and-test | Met |
| NFR2 | `requirements.md` | No insets/offset gives today's fit | `placeCasing` equals `fitCasing` test passes | `tests/render/layout.test.ts` | build-and-test | Met |
| NFR3 | `requirements.md` | Pure helpers tested in Node, no new dependency | 10 tests; `package.json` unchanged | tests, git diff | build-and-test | Met |
| NFR4 | `requirements.md` | typecheck, coverage, build, size pass | All exit 0 | commands above | build-and-test | Met |
| T-CI | Testing Contract | CI before merge | Not in the bugfix contract; the plan runs no CI Pipeline | `aidlc-state.md` (ci-pipeline SKIP) | N/A | N/A: the plan runs no CI Pipeline. The existing GitHub Actions check still runs on the pull request. |
| NFR5 | `requirements.md` | iPhone Safari portrait/landscape and rotation: casing fully visible, centred, inside safe area, never blank, touch sides correct | Node only | — | build-and-test (device check on the preview) | Unverified (only gap: no real browser ran here) |
