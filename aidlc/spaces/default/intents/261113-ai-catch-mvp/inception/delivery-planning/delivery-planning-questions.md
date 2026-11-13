# Delivery Planning Questions

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md` and `unit-of-work-dependency.md` (U1 game rules; U2 screens and art, U3 sound, U4 accessibility, each depending on U1; U5 publishing depending on all), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/scope-definition/scope-document.md` (value-first; feature-complete by 2026-11-30), and `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md` (no separate walking skeleton; one developer; TDD; branches and pull requests).

A Bolt is one build pass over a piece of the work that ends in something that runs and is checked. This stage chooses the order of Bolts; the units and their dependencies are already fixed.

## Q1. What should be built first?

A. Value first, following the dependency graph: U1 game rules first (the whole four-stage game becomes playable with placeholder drawing), then U2 screens and art (the game looks finished), then U3 sound and U4 accessibility, and U5 publishing last.
B. Risk first: start with the parts most likely to go wrong (for example the new art and the small-screen font in U2) as soon as U1 allows.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q2. Should the order be scored with a formal model (for example WSJF, which ranks work by value and urgency against size)?

A. No: with five units and one clear dependency chain, the order follows from Q1; the reasons are written down instead.
B. Yes, score every unit with WSJF.
X. Other (please specify)

[Answer]: A

## Q3. How big is one Bolt, and can Bolts run at the same time?

A. One unit per Bolt (five Bolts). Bolts run one after another (serial): each unit's design and code are finished and checked before the next starts. This keeps `src/main.ts` merges simple for a solo developer.
B. One unit per Bolt, but U2, U3, and U4 may run at the same time after U1.
C. Bundle U3 and U4 into one Bolt (four Bolts), serial.
X. Other (please specify)

[Answer]: A

## Q4. Is anything outside this work going to hold us up?

A. Only the developer's own account steps for U5: a public GitHub repository and a Cloudflare Pages project connected to it (free tier). Nothing blocks U1-U4. If Cloudflare setup slips, the game can still be shown from a local build until it is fixed.
B. Other dependencies (please specify).
X. Other (please specify)

[Answer]: A

## Q5. What worries you most, so it is tackled early?

A. The schedule (feature-complete by 2026-11-30) and whether the four stages feel well balanced. So U1 makes the whole run playable early, leaving time for playtesting and tuning the starting values.
B. The look and readability of the new art and text on small phones.
C. Nothing in particular.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
