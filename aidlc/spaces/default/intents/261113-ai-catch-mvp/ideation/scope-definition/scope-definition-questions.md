# Scope Definition Questions

Inputs:
- Intent statement: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/intent-capture/intent-statement.md`
- Feasibility assessment: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/feasibility/feasibility-assessment.md`
- Constraint register: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/feasibility/constraint-register.md`
- Authoritative product definition: `.kiro/steering/product.md` (§10 MVP Scope)

## Q1. What is the minimum viable scope that delivers value?

A. Exactly the required feature list in `product.md` §10: start screen, four-stage progression (FORTRAN, COBOL, BASIC, LLM), HUMAN movement and catching, stage-specific collectibles, VIRUS in all stages, score, lives and game over, progressive difficulty, AI restoration 0% to 100%, stage completion feedback, victory ending, restart, original retro visuals and sound effects, keyboard and touch controls, local high score.
B. A smaller first cut: all four stages playable with the victory ending, but stage completion feedback and visual effects kept minimal.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q2. Which capabilities are must-have, and which are nice-to-have?

A. Every item in Q1 option A is must-have. Nice-to-have, only if time remains: extra polish such as LCD flicker, glitch and corruption effects beyond the basics, richer stage transition and victory animations, and per-object falling movement differences.
B. Every item in Q1 option A is must-have, and there is no nice-to-have list.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q3. What are the dependencies between capabilities?

A. The stage progression and AI restoration progress come first, because stage collectibles, stage completion feedback, difficulty per stage, and the victory ending all depend on it. Visual and sound polish depend on the screens existing.
B. No significant dependencies; the capabilities can be built in any order.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q4. What is the sequencing preference?

A. Value-first: get the full four-stage game playable end to end (start to victory ending) as early as possible, then add polish.
B. Risk-first: build the hardest or least certain parts first (for example, balancing and mobile behaviour), then the rest.
C. Dependency-first: build in strict dependency order.
D. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q5. Are there hard deadlines tied to specific capabilities?

A. Only the overall submission deadline (2026-12-04 2:00 PM PT). The game must be deployed and playable at a public URL before the demo video is recorded and the submission is made.
B. Option A, plus an internal date by which the game must be feature-complete (please specify the date).
C. None.
D. Not yet defined.
X. Other (please specify)

[Answer]: B. Internal feature-complete date: 2026-11-30 (user's words: "b 11/30").

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
