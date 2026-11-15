# Code Summary: u4-accessibility

Built from the approved `code-generation-plan.md` (8 steps). Branch `feature/u4-accessibility` (created with `git switch -c`, not committed).

## Files Changed

| File | Change |
|---|---|
| `src/game/announcer.ts` (new) | `Announcement { key, text }` and pure `screenAnnouncement(view: GameView)`. Type-only import of `GameView`; fixed item names by stage number; six text shapes per BR1.2-BR1.5; key `phase:stageNumber` plus `:lives` only while playing (BR2.1). No DOM, storage, network, or timer. |
| `src/main.ts` | Import line, a new `screen announcements (FR13.2)` section (`getElementById('announcer')`, `lastKey`, `announce()` with one `try/catch` around both the build and the `textContent` write), and one `announce()` call right after `renderer.draw(...)`. Nothing else changed. |
| `tests/game/announcer.test.ts` (new) | 15 tests: 10 for texts (all phases, four stage item names, singular/plural/zero lives, high score 0, "New high score." on and off for game over and victory, purity) and 5 for keys (format, score/caught ignored, lives change, `phaseTime` and `canReturnToTitle` ignored). |

`index.html` is unchanged (U2's `#announcer` is used as is).

## TDD Evidence

- Step 2 baseline: `npx vitest run tests/game` — 111 passed.
- Red (Steps 3 and 4 run together): `npx vitest run tests/game/announcer.test.ts` — exit 1, `Cannot find module '../../src/game/announcer'`, suite failed, 0 tests run.
- Green: 15 passed.

## Verification

- `npm run typecheck && npm test && npm run build`: pass; 14 test files, 193 tests.
- `src/` contains no `innerHTML`.
- JS bundle 26.32 kB (8.72 kB gzip).
- Not verified: the VoiceOver play check on desktop and phone. Plan Step 7 stays unticked until the developer does it.

## Deviations

1. **Size note missed by 0.06 kB.** The bundle grew by 1.06 kB raw (0.46 kB gzip) over U3, above the "+1 kB" note in NFR2.4 / SD4-6. The extra bytes are the six fixed English sentences; the code is already minimal. The real budget NFR2 (whole game under 1 MB) is met by a wide margin. Left as is and reported to the developer; no requirement was edited to hide it.
2. The Step 3 and Step 4 Red runs were done as one run, because both failed on the same missing module.
3. No separate refactor change was needed after Green.

## Review Follow-up (iteration 1, READY)

- The Stage 2-4 intro tests now compare the full sentences (`toBe`) instead of parts (`toContain`); 15 tests still pass.
- NFR2.4 stays marked OK in `traceability.json` because the code is in place; the 0.06 kB overshoot of its "+1 kB" note is recorded here as Deviation 1 and must be repeated when Plan Step 7 is ticked after the play check.

## Loop-back 1 Repair (Step 9, 2026-11-13)

Reason: Build and Test run 1 measured the JS bundle at 26,328 bytes (26.32 kB) against the NFR2.4 target of ≤ 26.26 kB (`aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/build-and-test/test-results.md`, Loop-back 1).

| File | Change |
|---|---|
| `src/game/announcer.ts` | Behaviour-preserving size refactor: item names as an array indexed by `stageNumber - 1` (the unreachable `?? ''` fallback removed); shared `AI {ai}%` and `High score {best}.` parts; the last phase case (`victory`) as `default`; the key built by string concatenation. Every sentence and key is unchanged. |

`src/main.ts` and `tests/game/announcer.test.ts` are unchanged. The developer agent made its first rewrite with a temporary Python script instead of the file tool; the script was deleted and later edits used the file tool.

Verification: `wc -c dist/assets/index-*.js` 26,328 → 26,259 bytes (Vite: 26.32 → 26.25 kB, 8.71 kB gzip), within the 26,260-byte target with a margin of 1 byte. `npm run typecheck && npm test && npm run build` pass (16 files, 230 tests); `tests/game/announcer.test.ts` 15/15 unchanged; `npm run coverage` 596/689 lines (86.5%).

Note: the 1-byte margin means any later growth of the bundle will miss this unit-level note again; the project budget (NFR2, under 1 MB) is far away.
