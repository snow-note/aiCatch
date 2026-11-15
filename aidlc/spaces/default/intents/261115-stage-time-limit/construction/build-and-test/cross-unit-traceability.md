# Cross-Unit Traceability

Source: `aidlc engine sensor-traceability --stage build-and-test` (zero-Unit work; every ID is owned by stage `code-generation`).

**Verdict: PASS.** 26 of 26 IDs covered; none uncovered.

| ID | Covered | Owning Stage | Target File |
|---|---|---|---|
| FR1.1 | Yes | code-generation | `src/game/config.ts` |
| FR1.2 | Yes | code-generation | `tests/game/config.test.ts` |
| FR1.3 | Yes | code-generation | `tests/game/config.test.ts` |
| FR2.1 | Yes | code-generation | `src/game/spawner.ts` |
| FR2.2 | Yes | code-generation | `tests/game/spawner.test.ts` |
| FR3.1 | Yes | code-generation | `src/game/config.ts` |
| FR3.2 | Yes | code-generation | `src/game/state.ts` |
| FR3.3 | Yes | code-generation | `tests/game/state.test.ts` |
| FR3.4 | Yes | code-generation | `src/game/state.ts` |
| FR3.5 | Yes | code-generation | `tests/game/state.test.ts` |
| FR3.6 | Yes | code-generation | `src/game/types.ts` |
| FR4.1 | Yes | code-generation | `src/render/screen-timing.ts` |
| FR4.2 | Yes | code-generation | `src/render/renderer.ts` |
| FR4.3 | Yes | code-generation | `src/audio/sound.ts` |
| FR5.1 | Yes | code-generation | `src/game/types.ts` |
| FR5.2 | Yes | code-generation | `src/render/renderer.ts` |
| FR5.3 | Yes | code-generation | `src/game/announcer.ts` |
| FR6.1 | Yes | code-generation | `src/game/state.ts` |
| FR6.2 | Yes | code-generation | `src/game/config.ts` |
| NFR1 | Yes | code-generation | `src/game/config.ts` |
| NFR2 | Yes | code-generation | `tests/game/config.test.ts` |
| NFR3 | Yes | code-generation | `tests/game/config.test.ts` |
| NFR4 | Yes | code-generation | `tests/game/first-heart.test.ts` |
| NFR5 | Yes | code-generation | `tests/game/state.test.ts` |
| NFR6 | Yes | code-generation | `src/render/renderer.ts` |
| NFR7 | Yes | code-generation | `src/audio/sound.ts` |

Note: FR4.1-FR4.3 and FR5.2 (timer display, blink, beep, `TIME UP`) were checked in Node with a fake canvas and sound data, not in a real browser.
