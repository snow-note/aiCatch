# Cross-Unit Traceability

Source: `aidlc engine sensor-traceability --stage build-and-test` (zero-Unit work; every ID owned by stage `code-generation`).

**Verdict: PASS.** 15 of 15 IDs covered; none uncovered.

| ID | Covered | Owning Stage | Target |
|---|---|---|---|
| FR1.1 | Yes | code-generation | `src/main.ts` |
| FR1.2 | Yes | code-generation | `src/main.ts` |
| FR2.1 | Yes | code-generation | `src/render/layout.ts` |
| FR2.2 | Yes | code-generation | `tests/render/layout.test.ts` |
| FR3.1 | Yes | code-generation | `src/main.ts` |
| FR3.2 | Yes | code-generation | `src/style.css` |
| FR3.3 | Yes | code-generation | `src/render/layout.ts` |
| FR4.1 | Yes | code-generation | `src/render/layout.ts` |
| FR5.1 | Yes | code-generation | `src/main.ts` |
| NFR1 | Yes | code-generation | `src/main.ts` (evidence: no diff under `src/game/`, `src/audio/`) |
| NFR2 | Yes | code-generation | `tests/render/layout.test.ts` |
| NFR3 | Yes | code-generation | `tests/render/layout.test.ts` |
| NFR4 | Yes | code-generation | `tests/render/layout.test.ts` (coverage run here: 84.23%) |
| NFR5 | N/A in Code Generation | code-generation | Manual iPhone Safari check on the preview |
| NFR6 | Yes | code-generation | `src/render/layout.ts` |

Note: FR1, FR3.1, FR3.2, FR5.1 and the touch wiring of FR4.1 live in `src/main.ts` and `src/style.css`, which ran in no browser here; NFR5's device check covers them.
