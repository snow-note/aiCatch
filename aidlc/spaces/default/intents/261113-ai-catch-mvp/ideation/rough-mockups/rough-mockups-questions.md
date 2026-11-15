# Rough Mockups Questions

Inputs:
- Intent statement: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/intent-capture/intent-statement.md`
- Scope document: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/scope-definition/scope-document.md`
- Intent backlog: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/scope-definition/intent-backlog.md`
- Authoritative product definition: `.kiro/steering/product.md`
- Existing game screens (for reference): a console casing with an "AI CATCH" label, a 240 x 160 LCD screen, and POWER / START buttons; the screen shows power-off, startup, title, playing, and game-over states.

## Q1. What are the primary entry points and key screens?

A. One entry point (the public URL opens the console). Key screens: power-off, startup, title / start screen (with the 2045 story line and high score), stage intro, playing (HUD with stage, AI restoration %, score, lives), stage clear, game over, victory ending.
B. Option A without the power-off and startup screens: the URL opens directly on the title screen.
C. Not yet defined.
X. Other (please specify)

[Answer]: B

## Q2. What is the core user flow (happy path)?

A. Open URL -> (power on) -> title -> START -> Stage 1 intro -> play -> Stage 1 clear (AI 25%) -> Stage 2 intro -> ... -> Stage 4 clear (AI 100%) -> victory ending -> any input -> title. Losing all lives in any stage -> game over -> any input -> title (the run starts again from Stage 1).
B. Option A, but after game over the player can retry from the stage where they lost.
C. Not yet defined.
X. Other (please specify)

[Answer]: A, but the flow starts as in Q1 option B, with no power on/off step: Open URL -> title -> START -> ... (user's words: "a(ただし最初はQ1の通り　電源オンオフなし）").

## Q3. What does the information hierarchy look like on the playing screen?

A. Most prominent: HUMAN and the falling objects. Always visible in a thin top bar: the current stage name (FORTRAN / COBOL / BASIC / LLM), the AI restoration %, the score (seven-segment digits), and lives. Also shown: progress toward the stage target (for example, 3/10 collected).
B. Option A without the stage progress counter (only the AI restoration % is shown).
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q4. Which existing design guidelines or UI patterns should be followed?

A. The existing game's look: monochrome grey-green LCD with dark pixels, silver-grey console casing, seven-segment score, original pixel art, all as described in `product.md` §8; original designs only, nothing modelled on Game & Watch or Nintendo (copyright policy).
B. A new visual direction (please describe).
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q5. Which devices and form factors must be supported?

A. Desktop browsers (keyboard) and smartphone browsers in portrait and landscape (touch on the left / right half of the screen). Exact browsers are decided by the developer during testing.
B. Option A, but smartphones in portrait only.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q6. Are there known accessibility requirements?

A. No formal WCAG level. Practical basics: the whole game is playable with the keyboard alone; collectibles and VIRUS are told apart by shape, not by colour (`product.md` §8); text on the LCD stays readable at the smallest supported screen size; the canvas has a text label for screen readers.
B. Target WCAG 2.1 AA formally.
C. None.
D. Not yet defined.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
