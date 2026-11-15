# Build and Test Summary

## Build Status

Build succeeded: typecheck clean, `vite build` produced a 27.45 kB JS bundle, and `dist/` is 30,628 bytes (under the 1 MiB budget). Prerequisites: Node from `.node-version` and `npm ci`. No environment variables or services.

## Test Type Inventory

- Unit tests (Vitest, Node): config, spawner, state, announcer, difficulty, first-heart simulation, screen-timing, renderer (fake canvas), sound. Written in Code Generation.
- Minimal test strategy: no integration, performance, or security instruction files are generated.
- Manual play check: team checklist (desktop keyboard, smartphone touch) on the preview deployment.

## Coverage Expectations

- Project: lines >= 80% on the full suite (`vitest.config.ts`). Actual 87.1%.
- Zero-Unit work: no per-Unit coverage targets.

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| T-COV-LINES | `vitest.config.ts`; Testing Contract | Lines >= 80% | 87.1% | `npm run coverage` exit 0 (`test-results.md`) | build-and-test | Met |
| T-SUITE-GREEN | Testing Contract `scope_floor` | Existing suite green | 264/264 | `npm run coverage` | build-and-test | Met |
| T-TYPECHECK | team Testing Posture | No type errors | 0 | `npm run typecheck` | build-and-test | Met |
| T-SIZE | `npm run size` | < 1,048,576 bytes | 30,628 bytes | `npm run size` | build-and-test | Met |
| NFR2 | `requirements.md` | >= 1.2 s | 1.705 s | `tests/game/config.test.ts` | build-and-test | Met |
| NFR3 | `requirements.md` | <= 60 s per stage | Passes | `tests/game/config.test.ts` | build-and-test | Met |
| NFR4 | `requirements.md` | Median 5-10 s | Passes | `tests/game/first-heart.test.ts` | build-and-test | Met |
| NFR5 | `requirements.md` | All quality commands pass | All exit 0 | `test-results.md` | build-and-test | Met |
| T-CI | Testing Contract | CI before merge | Not in the express contract | `aidlc-state.md` | N/A | N/A: the plan runs no CI Pipeline |
| T-BROWSER-PLAY | team manual checklist; FR4.1-FR4.3, FR5.2 | Correct look and sound in a browser | Node only | `tests/render/*`, `tests/audio/sound.test.ts` | build-and-test (preview play) | Unverified (only gap: no real browser ran here) |

## Readiness

- Build-ready: yes.
- Test-ready: yes; all automated checks pass.
- Deployment-ready: yes for a preview deployment. Play the preview (desktop and smartphone) before merging to confirm the timer position, blink, beep, `TIME UP`, and difficulty feel.

## Known Limitations

- Rendering and sound were checked in Node with a fake canvas and note data, not in a real browser.
- FR4.3's "respects the sound on/off setting" has no setting to attach to; the beep uses the same sound path as all other cues.
- Stage 3 and Stage 4 values are first guesses within the ordering rule; tune after playing if needed.
