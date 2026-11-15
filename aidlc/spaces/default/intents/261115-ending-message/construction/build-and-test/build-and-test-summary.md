# Build and Test Summary

## Build Status

Build succeeded: typecheck clean, JS bundle 29.27 kB, `dist/` 32,570 bytes. Prerequisites: Node from `.node-version` and `npm ci`.

## Test Type Inventory

- Unit tests (Vitest, Node) for the ending text, view and timing helpers, glyphs, victory timing and return rule, and announcer, written in Code Generation. Minimal strategy: no integration, performance, or security instruction files.
- Play check on desktop and iPhone Safari (NFR2), on the branch preview.

## Coverage Expectations

- Project: lines >= 80% on the full suite. Actual 84.59%. Zero-Unit work: no per-Unit targets.

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| T-COV-LINES | `vitest.config.ts` | Lines >= 80% | 84.59% | `npm run coverage` | build-and-test | Met |
| T-SUITE-GREEN | Testing Contract | Suite green | 288/288 | `npm run coverage` | build-and-test | Met |
| T-TYPECHECK | team posture | No type errors | 0 | `npm run typecheck` | build-and-test | Met |
| T-SIZE | `npm run size` | < 1 MiB | 32,570 bytes | `npm run size` | build-and-test | Met |
| NFR1 | `requirements.md` | Lines fit; glyphs exist | Tests pass | ending test | build-and-test | Met |
| NFR3 | `requirements.md` | Gameplay unchanged | No diff in state, main, audio | git diff | build-and-test | Met |
| NFR4 | `requirements.md` | Tunables in config | Pinned | config test | build-and-test | Met |
| NFR5 | `requirements.md` | Pure helpers tested | Tests pass | screen-timing test | build-and-test | Met |
| NFR6 | `requirements.md` | Quality commands pass | All exit 0 | `test-results.md` | build-and-test | Met |
| NFR7 | `requirements.md` | No dependency; original glyphs | Unchanged `package.json` | git diff | build-and-test | Met |
| T-CI | Testing Contract | CI before merge | Not in the contract | `aidlc-state.md` | N/A | N/A: the plan runs no CI Pipeline |
| NFR2 | `requirements.md` | Readable on desktop and iPhone, both orientations | Node only | — | build-and-test (preview) | Unverified (only gap: no real browser ran here) |

## Play Checklist (NFR2, on the preview)

1. Clear all four stages. The reboot and restore animation plays as before (about 2.5 s).
2. The message types in line by line, in capitals, with commas, question marks, and the apostrophe in "DON'T" drawn correctly.
3. When the text area fills, the text scrolls up; no line is cut at the left or right edge.
4. Pressing a key or tapping during the message does nothing; after about 22 s SCORE, HI-SCORE, and blinking PRESS ANY KEY appear, and a press returns to the title.
5. Repeat 2-4 on iPhone Safari in portrait and in landscape: all text is readable.

## Readiness

- Build-ready and test-ready: yes.
- Deployment-ready: for the preview, yes. Run the play checklist before merging.

## Known Limitations

- Canvas text appearance ran in no browser here.
- In portrait on a narrow phone the 3 x 5 glyphs are small (about 3.5 x 6 CSS px), as chosen in Q5.
