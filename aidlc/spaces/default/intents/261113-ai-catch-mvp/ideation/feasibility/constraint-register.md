# Constraint Register: AI CATCH (four-stage MVP)

Derived from `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/intent-capture/intent-statement.md`, `feasibility-questions.md` (Q1-Q6), the workspace steering files, and the Kiroween 2026 rules summary.

## Technical Constraints

| ID | Constraint | Source |
|---|---|---|
| TC1 | Runs in desktop and mobile browsers as an HTML5 game. | Intent statement; architecture steering |
| TC2 | Built with TypeScript (or JavaScript), HTML5 Canvas, and the Web Audio API. | Q3; architecture steering |
| TC3 | No backend, database, or external service, and no external AI API. | Intent statement; Q6; scope guardrails |
| TC4 | Controls are the left and right arrow keys on desktop and touch on mobile. | `product.md` §9 |
| TC5 | Only a local high score is stored, on the player's device. | Intent statement (Q8) |
| TC6 | Adding a dependency library needs the developer's prior approval. | Scope guardrails steering |
| TC7 | Build on the existing AI CATCH code where that saves effort. Start over only if the existing code causes problems. | Q1 |

## Organizational Constraints

| ID | Constraint | Source |
|---|---|---|
| OC1 | One developer decides and does all work, with Kiro. | Q5; intent stakeholder map |
| OC2 | Submission deadline: 2026-12-04 2:00 PM PT, no extensions. | Q4; Kiroween rules §1 |
| OC3 | No paid services; free tiers only. | Q4 |
| OC4 | Source code on a public GitHub repository; game hosted on Cloudflare Pages. | Q6 |

## Hackathon and Legal Constraints

| ID | Constraint | Source |
|---|---|---|
| HC1 | A working application URL, a text description, a demo video of 3 minutes or less on YouTube, and a public GitHub repository URL must be submitted. | Q2; Kiroween rules §6 |
| HC2 | The repository includes an open-source license file and the `/.kiro` directory at its root; `/.kiro` must not be git-ignored. | Q2; Kiroween rules §6 |
| HC3 | All submission materials are in English, or have English translations. | Q2; Kiroween rules §6 |
| HC4 | The project is created after the submission period began (2026-10-30), and any existing code brought in is disclosed. | Kiroween rules §5 |
| HC5 | Kiro must be used meaningfully; the submission describes how. | Kiroween rules §4, §6 |
| HC6 | All characters, pixel art, UI, casing, and sounds are original. No Game & Watch or Nintendo assets, branding, or distinctive designs. Any external asset has a clear license, and its source is recorded. | Q2; copyright policy steering; `product.md` §12 |

## Regulatory Constraints

None. No industry regulation applies, and no personal data is handled (Q2).

## Assumptions & Open Questions

None.
