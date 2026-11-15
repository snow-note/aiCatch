# Build and Test Summary

## Build Status

Build succeeded: typecheck clean, JS bundle 28.52 kB, `dist/` 31,824 bytes. Prerequisites: Node from `.node-version` and `npm ci`.

## Test Type Inventory

- Unit tests (Vitest, Node) for the pure layout helpers in `tests/render/layout.test.ts`, written in Code Generation. Minimal strategy: no integration, performance, or security instruction files.
- Device check on iPhone Safari (NFR5), on the branch preview.

## Coverage Expectations

- Project: lines >= 80% on the full suite. Actual 84.23%. Zero-Unit work: no per-Unit targets.

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| T-COV-LINES | `vitest.config.ts` | Lines >= 80% | 84.23% | `npm run coverage` | build-and-test | Met |
| T-SUITE-GREEN | Testing Contract | Suite green | 274/274 | `npm run coverage` | build-and-test | Met |
| T-REGRESSION | Testing Contract (bugfix) | Targeted regression | `chooseFit` scale-0 test passes | `tests/render/layout.test.ts` | build-and-test | Met |
| T-TYPECHECK | team posture | No type errors | 0 | `npm run typecheck` | build-and-test | Met |
| T-SIZE | `npm run size` | < 1 MiB | 31,824 bytes | `npm run size` | build-and-test | Met |
| NFR1 | `requirements.md` | Gameplay files unchanged | No diff | git diff | build-and-test | Met |
| NFR2 | `requirements.md` | Same fit with no insets/offset | Test passes | layout test | build-and-test | Met |
| NFR3 | `requirements.md` | Pure helpers tested, no new dependency | 10 tests | layout test | build-and-test | Met |
| NFR4 | `requirements.md` | Quality commands pass | All exit 0 | `test-results.md` | build-and-test | Met |
| T-CI | Testing Contract | CI before merge | Not in the contract | `aidlc-state.md` | N/A | N/A: the plan runs no CI Pipeline |
| NFR5 | `requirements.md` | iPhone Safari device check passes | Node only | — | build-and-test (preview) | Unverified (only gap: no real browser ran here) |

## Device Checklist (NFR5, iPhone Safari, on the preview)

1. Portrait: the whole casing is visible and centred; nothing sits under the notch / Dynamic Island or home indicator.
2. Landscape (both ways): same as 1; the casing stays clear of the notch side.
3. Rotate during play both ways: the casing re-centres within about half a second and never stays blank.
4. Hold a side while rotating: HUMAN stops after the rotation; a new touch on the left half of the casing moves left, right half moves right.
5. Scroll or show/hide the address bar: the casing stays centred and play continues.
6. Desktop window resize: the casing still fits and centres as before.

## Readiness

- Build-ready and test-ready: yes.
- Deployment-ready: for the preview, yes. Run the device checklist on the preview before merging.

## Known Limitations

- The DOM wiring (re-fit timing, inset read, orientation release) has no automated test and ran in no browser here.
- The original problem could not be reproduced, so there is no before/after comparison.
