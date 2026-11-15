# Cross-Unit Traceability: early-heart-loss

Generated from `aidlc engine sensor-traceability --stage build-and-test` on 2026-11-15. This express workflow has no Units; all IDs trace to the stage-level `aidlc/spaces/default/intents/261115-early-heart-loss/construction/code-generation/traceability.json` (from `code-generation-plan.md` and `code-summary.md`).

## Verdict

**Pass**: 20 IDs traced, 0 uncovered. FR1.4 is marked N/A in Code Generation because it is the developer's play check; its result is in the Build and Test summary.

## Per-ID Coverage

| ID | Owning stage | Built in |
|---|---|---|
| FR1.1 | code-generation | `tests/game/first-heart.test.ts` |
| FR1.2 | code-generation | `tests/game/first-heart.test.ts` |
| FR1.3 | code-generation | `tests/game/first-heart.test.ts` |
| FR1.4 | build-and-test | N/A in code: developer play check |
| FR2.1 | code-generation | `src/game/config.ts` |
| FR2.2 | code-generation | `src/game/state.ts` |
| FR2.3 | code-generation | `src/game/config.ts` |
| FR2.4 | code-generation | `tests/game/config.test.ts` |
| FR3.1 | code-generation | `src/game/spawner.ts` |
| FR3.2 | code-generation | `tests/game/spawner.test.ts` |
| FR3.3 | code-generation | `tests/game/spawner.test.ts` |
| FR4.1 | code-generation | `tests/game/state.test.ts` |
| FR5.1 | code-generation | `tests/game/state.test.ts` |
| FR6.1 | code-generation | `tests/game/state.test.ts` |
| NFR1 | code-generation | `tests/game/first-heart.test.ts` |
| NFR2 | code-generation | `tests/game/config.test.ts` |
| NFR3 | code-generation | `tests/game/spawner.test.ts` |
| NFR4 | code-generation | `tests/game/first-heart.test.ts` |
| NFR5 | code-generation | `package.json` |
| NFR6 | code-generation | `src/game/config.ts` |

Uncovered: none.
