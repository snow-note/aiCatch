# User Stories Questions (Story Plan)

Input: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md` (FR1-FR13, NFR1-NFR9).

Plan: stories follow INVEST, each written "As a [persona], I want [goal], so that [benefit]", with Given/When/Then acceptance criteria and a MoSCoW priority (the MVP boundary itself is settled in Delivery Planning).

## Q1. Which personas should the stories be written for?

A. Two personas: (1) a casual player who opens the URL with no knowledge of computing history and wants to understand and enjoy the game at once, on desktop or smartphone; (2) a hackathon judge who plays the whole game end to end in a short time to assess impact, design, and story.
B. One persona: the casual player only.
C. Three personas: casual player, hackathon judge, and a keyboard-only / screen-reader user for the accessibility requirements.
X. Other (please specify)

[Answer]: A

## Q2. How should the stories be grouped?

A. By player journey: start and title; playing a stage; stage clear and progression; Stage 4 and victory; game over and restart; look, sound, and accessibility; platform and publishing.
B. By feature area, mirroring the requirement groups FR1-FR13.
C. By stage: Stage 1, Stage 2, Stage 3, Stage 4, plus shared stories.
X. Other (please specify)

[Answer]: A

## Q3. How large should each story be?

A. Small: one player-visible behaviour per story (about 20-30 stories), so each can be tested first and built in a short session.
B. Medium: one screen or feature per story (about 10-15 stories).
C. Large: one epic per journey step (about 5-8 stories).
X. Other (please specify)

[Answer]: C

## Q4. Which stories should be Should Have or Could Have rather than Must Have?

A. Everything in `requirements.md` is Must Have, except the victory animation details (FR9.3 form) and the screen-reader announcements (FR13.2), which are Should Have. The nice-to-have polish listed as out of scope stays Won't Have for this release.
B. Everything in `requirements.md` is Must Have.
C. Not yet defined; prioritise from the requirements.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
