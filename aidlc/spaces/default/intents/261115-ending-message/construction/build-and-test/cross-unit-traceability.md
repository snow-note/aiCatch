# Cross-Unit Traceability

Source: `aidlc engine sensor-traceability --stage build-and-test` (zero-Unit work; every ID owned by stage `code-generation`).

**Verdict: PASS.** 20 of 20 IDs covered; none uncovered.

| ID | Covered | Owning Stage | Target |
|---|---|---|---|
| FR1.1 | Yes | code-generation | `src/render/ending.ts` |
| FR1.2 | Yes | code-generation | `tests/render/ending.test.ts` |
| FR1.3 | Yes | code-generation | `src/render/renderer.ts` |
| FR2.1 | Yes | code-generation | `src/render/screen-timing.ts` |
| FR2.2 | Yes | code-generation | `tests/render/screen-timing.test.ts` |
| FR2.3 | Yes | code-generation | `src/game/config.ts` |
| FR2.4 | Yes | code-generation | `src/render/renderer.ts` |
| FR3.1 | Yes | code-generation | `tests/game/state.test.ts` |
| FR3.2 | Yes | code-generation | `tests/game/state.test.ts` |
| FR3.3 | Yes | code-generation | `src/game/config.ts` |
| FR4.1 | Yes | code-generation | `src/render/sprites.ts` |
| FR5.1 | Yes | code-generation | `src/game/announcer.ts` |
| FR6.1 | Yes | code-generation | `.kiro/steering/product.md` |
| NFR1 | Yes | code-generation | `tests/render/ending.test.ts` |
| NFR2 | N/A in Code Generation | code-generation | Play check on the preview |
| NFR3 | Yes | code-generation | `src/game/config.ts` |
| NFR4 | Yes | code-generation | `tests/game/config.test.ts` |
| NFR5 | Yes | code-generation | `tests/render/screen-timing.test.ts` |
| NFR6 | Yes | code-generation | `tests/render/ending.test.ts` |
| NFR7 | Yes | code-generation | `src/render/sprites.ts` |

Note: FR1.3, FR2.4 and the on-screen look of FR2.1-FR2.2 are drawn by `src/render/renderer.ts`, which ran only against a fake canvas in Node here.
