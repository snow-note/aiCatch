# Cross-Unit Traceability — AI CATCH

Source: `aidlc engine sensor-traceability --stage build-and-test`, run 2026-11-10. This is zero-Unit work, so every element is owned by the single stage-level Code Generation build. Inputs: [code-generation-plan.md](../code-generation/code-generation-plan.md), [unit-test-instructions.md](../code-generation/unit-test-instructions.md), [code-summary.md](../code-generation/code-summary.md).

## Verdict

**FAIL: 9 IDs uncovered.** Code Generation deliberately deferred three acceptance criteria (AC8.1.3, AC8.1.4, AC9.1.1), and the six requirements that trace through them are counted as uncovered too. Every other requirement and acceptance criterion is built.

## Uncovered Elements

| ID | Why uncovered | What closes it | Owner |
|---|---|---|---|
| AC8.1.3 | Deferred at Code Generation: needs the latest Chrome, Firefox, Safari and Edge. Build and Test loaded the game in Chrome only (headless) | Open the built game in Firefox, Safari and Edge | Developer play-test |
| AC8.1.4 | Deferred at Code Generation: 60 fps needs a real device measurement | Measure the frame rate on a laptop and a recent mid-range phone | Developer play-test |
| AC9.1.1 | Deferred at Code Generation in the developer's words: "githubにpushしてから私が判断する" | Push to a public GitHub repository and check it | Developer |
| FR9.5 | Traces through AC8.1.1–AC8.1.5, where AC8.1.3 and AC8.1.4 are deferred | As above | Developer play-test |
| NFR1 | As FR9.5 | As above | Developer play-test |
| NFR2 | As FR9.5 | As above | Developer play-test |
| NFR3 | As FR9.5 | As above | Developer play-test |
| NFR4 | As FR9.5. The size and no-server targets themselves are Met (see the matrix in build-and-test-summary.md) | As above | Developer play-test |
| NFR6 | Traces through AC9.1.1–AC9.1.3, where AC9.1.1 is deferred. The licence and `.kiro` parts are Met | Push and check the public repository | Developer |

## Coverage by Requirement

All built in the stage-level Code Generation build.

| Requirement | Covered | Through |
|---|---|---|
| FR1.1, FR1.2, FR7.1, FR8.1, FR8.2 | Yes | AC1.1.1–AC1.1.5 |
| FR1.3, FR3.1–FR3.8, FR7.2 | Yes | AC3.1.1–AC3.1.7 |
| FR1.4, FR4.4, FR4.8, FR5.1–FR5.3, FR7.7, FR8.4, FR8.5 | Yes | AC5.1.1–AC5.1.6 |
| FR1.5 | Yes | AC6.1.1–AC6.1.4, AC6.2.1–AC6.2.6 |
| FR2.1–FR2.4 | Yes | AC2.1.1–AC2.1.5 |
| FR4.1–FR4.3, FR4.5, FR4.7, FR4.9, FR6.1, FR7.3, FR8.3 | Yes | AC4.1.1–AC4.1.6 |
| FR4.6 | Yes | AC4.1.1–AC4.1.6, AC5.1.1–AC5.1.6 |
| FR6.2, FR7.4–FR7.6 | Yes | AC7.2.1–AC7.2.4 |
| FR6.3–FR6.6 | Yes | AC6.2.1–AC6.2.6 |
| FR9.1–FR9.4, NFR5 | Yes | AC7.1.1–AC7.1.4 |
| FR9.6 | Yes | AC8.2.1–AC8.2.3 |
| FR9.5, NFR1, NFR2, NFR3, NFR4 | **No** | AC8.1.1–AC8.1.5; not built: AC8.1.3, AC8.1.4 |
| NFR6 | **No** | AC9.1.1–AC9.1.3; not built: AC9.1.1 |

## Coverage by Acceptance Criterion

| AC | Covered | Target file |
|---|---|---|
| AC1.1.1, AC1.1.2, AC1.1.4, AC1.1.5 | Yes | `tests/game/state.test.ts` |
| AC1.1.3 | Yes | `src/audio/sound.ts` |
| AC2.1.1, AC2.1.3 | Yes | `tests/game/state.test.ts` |
| AC2.1.2 | Yes | `src/main.ts` |
| AC2.1.4, AC2.1.5 | Yes | `tests/game/input.test.ts` |
| AC3.1.1 | Yes | `tests/game/state.test.ts` |
| AC3.1.2, AC3.1.3 | Yes | `tests/game/spawner.test.ts` |
| AC3.1.4–AC3.1.7 | Yes | `tests/game/difficulty.test.ts` |
| AC4.1.1, AC4.1.3 | Yes | `tests/game/state.test.ts` |
| AC4.1.2, AC4.1.4, AC4.1.5 | Yes | `tests/game/collision.test.ts` |
| AC4.1.6 | Yes | `src/render/renderer.ts` |
| AC5.1.1–AC5.1.4, AC5.1.6 | Yes | `tests/game/state.test.ts` |
| AC5.1.5 | Yes | `tests/audio/sound.test.ts` |
| AC6.1.1, AC6.1.3, AC6.1.4 | Yes | `tests/game/state.test.ts` |
| AC6.1.2, AC6.2.1 | Yes | `src/render/renderer.ts` |
| AC6.2.2–AC6.2.5 | Yes | `tests/game/highscore.test.ts` |
| AC6.2.6 | Yes | `tests/game/state.test.ts` |
| AC7.1.1, AC7.2.1–AC7.2.3 | Yes | `src/render/renderer.ts` |
| AC7.1.2 | Yes | `tests/render/sprites.test.ts` |
| AC7.1.3 | Yes | `src/audio/sound.ts` |
| AC7.1.4 | Yes | `src/render/sprites.ts` |
| AC7.2.4, AC8.2.3 | Yes | `src/game/state.ts` |
| AC8.1.1, AC8.1.2 | Yes | `tests/render/layout.test.ts` |
| AC8.1.3 | **No** | Deferred: browser check |
| AC8.1.4 | **No** | Deferred: device frame-rate check |
| AC8.1.5 | Yes | `vite.config.ts` |
| AC8.2.1, AC8.2.2 | Yes | `src/main.ts` |
| AC9.1.1 | **No** | Deferred to the developer |
| AC9.1.2 | Yes | `.gitignore` |
| AC9.1.3 | Yes | `LICENSE` |

Where a target is a source file rather than a test (for example `src/main.ts`, `src/render/renderer.ts`), the behaviour is implemented but checked only by the type check and build, not by an automated test (Code Generation review finding R-01).
