# RAID Log: AI CATCH (four-stage MVP)

Based on `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/intent-capture/intent-statement.md`, `feasibility-questions.md` (Q1-Q6), and `feasibility-assessment.md`.

## Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | The game or the submission materials are not finished by the 2026-12-04 deadline. About three weeks remain, with no extensions. | Medium | High | Keep the MVP to `product.md` §10. Extend the existing game rather than rebuild it. Leave time at the end for the demo video, the English description, and the Kiro write-up. |
| R2 | Extending the existing single-screen game turns out harder than expected once stage progression is designed. | Low | Medium | Check the fit during the design stages. Fall back to starting over (Q1 option B) if needed. |
| R3 | The existing code is judged to be prior work that needed disclosure. | Low | High | Keep the earlier workflow record (dated 2026-11-10) in the repository as evidence. Mention the earlier workflow in the submission if needed. |
| R4 | New sprites or the casing look too much like an existing game. | Low | High | Keep all art original and check it against the copyright policy before release. |
| R5 | The game behaves differently on some mobile browsers (touch, sound start, screen rotation). | Medium | Medium | Test on real devices during verification. The developer decides which browsers to support. |
| R6 | The four-stage balance (falling speed, VIRUS frequency, required counts) is not fun or is too hard. | Medium | Medium | Tune by playtesting. The developer judges the final result. |

## Assumptions

| ID | Assumption |
|---|---|
| A1 | Cloudflare Pages' free plan can host this static game. Its limits have not been checked. |
| A2 | The existing code was created on or after 2026-11-10, after the submission period began. The git history has one commit (2026-11-13, "initial commit (PoC result)"), and the earlier workflow record is dated 2026-11-10. Both are after 2026-10-30. No earlier history exists to show the exact creation date. |
| A3 | The developer judges the success metrics and the supported browsers by playing and testing, as agreed at intent capture. |

## Issues

None open.

## Dependencies

| ID | Dependency |
|---|---|
| D1 | A GitHub account and a public repository. |
| D2 | A Cloudflare account with Pages. |
| D3 | A YouTube account for the demo video. |
| D4 | Kiro (IDE / CLI) for development and for the Kiro-usage write-up. |

## Assumptions & Open Questions

- [assumption] A1 above is unverified. A2 rests on the earlier workflow record date and the single git commit.
