# Feasibility Questions

Context for these questions:
- Intent statement: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/intent-capture/intent-statement.md`
- The workspace already contains a working single-screen AI CATCH game from the earlier intent `261110-ai-catch-game` (`src/`, `tests/`, `index.html`, built to a static site). It follows `original_spec.md` (one screen, LLM MODEL / GPU / ROBOT / VIRUS, time-based difficulty, game over), not the four-stage progression in `.kiro/steering/product.md`.
- Hackathon rules: `aidlc/spaces/default/intents/261110-ai-catch-game/ideation/intent-capture/kiroween-rules-ja.md`

## Q1. What existing systems or code must this work integrate with?

A. Extend the existing AI CATCH game in this workspace (`src/`, `tests/`) and evolve it into the four-stage version defined in `product.md`.
B. Start a new implementation and replace the existing game code.
C. No integration: keep the existing code untouched and build the new version separately.
D. Not yet defined.
X. Other (please specify)

[Answer]: X: A if it reduces effort; B if extending the existing code causes problems (user's words: "工数が削減できるならAで　問題があればBで"). The feasibility assessment decides between A and B on effort and risk.

## Q2. Are there regulatory or compliance requirements?

A. No industry regulation (no PCI, HIPAA, SOC2, or personal data). The constraints are the Kiroween 2026 rules (working app, public GitHub repository with an open-source license, `/.kiro` committed, English submission, demo video of 3 minutes or less) and the originality / copyright policy (no reuse of existing game assets or Game & Watch / Nintendo designs).
B. Option A, plus additional requirements (please specify).
C. None.
D. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q3. What is the current tech stack and skill profile?

A. The stack already in the workspace and in the architecture steering: TypeScript, HTML5 Canvas, Web Audio API, Vite, Vitest; one developer working with Kiro.
B. Option A, but the developer prefers plain JavaScript over TypeScript.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q4. What are the budget and timeline constraints?

A. Timeline: the submission deadline is 2026-12-04 2:00 PM PT (no extensions). Budget: no paid services; free tiers only.
B. Option A, with an earlier internal target date for a feature-complete build (please specify the date).
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q5. Are there organizational blockers (change freeze, competing priorities)?

A. None; the developer decides and works alone.
B. Limited available time due to other commitments (please specify how much time per week).
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q6. Which AWS services and accounts are in use? Which hosting is used?

A. No AWS services. Source code is on GitHub and the game is hosted on Cloudflare as a static site (exact Cloudflare product decided later).
B. No AWS services. GitHub and Cloudflare Pages specifically.
C. AWS is used (please specify services and accounts).
D. Not yet defined.
X. Other (please specify)

[Answer]: B

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
