# Requirements Analysis Questions

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/intent-capture/intent-statement.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/scope-definition/scope-document.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/rough-mockups/wireframes.md` and `user-flow.md`, `aidlc/spaces/default/codekb/aiCatch/` (existing game), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md`, and `.kiro/steering/product.md`.

Already decided in earlier stages (not asked again): four stages FORTRAN, COBOL, BASIC, LLM; +25% AI per stage; Stage 4 counts LLM, GPU, ROBOT together; lives carry over between stages; game over and the ending return to the title and a new run starts at Stage 1; no power-on step; no pause; high score updated and shown on game over and victory; desktop keyboard and smartphone touch; TDD for game logic.

Values marked "starting value" are tuned later by playtesting; they only need to be good enough to build against.

## Q1. How many collectibles must be caught to clear each stage?

A. Starting values: Stage 1: 10, Stage 2: 12, Stage 3: 14, Stage 4: 16 (LLM + GPU + ROBOT combined). Tuned by playtesting.
B. The same number in every stage (please specify, for example 10).
C. Not yet defined; any reasonable starting value.
X. Other (please specify)

[Answer]: A

## Q2. How many lives does a run start with?

A. 3 lives for the whole run (the existing game uses 3), with no extra lives gained.
B. 3 lives, and clearing a stage gives back 1 life (up to 3).
C. 5 lives for the whole run, with no extra lives gained.
X. Other (please specify)

[Answer]: A

## Q3. How many points is each collectible worth?

A. Keep the existing values for Stage 4 (LLM 100, GPU 150, ROBOT 200). Stages 1-3 collectibles: mainframe 100, magnetic tape 100, floppy disk 100. Plus a stage-clear bonus of 500 points.
B. Points rise by stage: Stage 1: 100, Stage 2: 150, Stage 3: 200, Stage 4: LLM 250, GPU 300, ROBOT 350. No clear bonus.
C. Not yet defined; any reasonable starting value.
X. Other (please specify)

[Answer]: A

## Q4. How does difficulty rise from stage to stage?

A. Each stage sets its own starting values: Stage 1 is gentle (slow falls, few VIRUS); each next stage falls faster, spawns more often, has more VIRUS, and can have more objects on screen at once. Values tuned by playtesting. Within a stage difficulty stays fixed.
B. Option A, plus difficulty also rises a little over time inside each stage (as the existing game does).
C. Not yet defined.
X. Other (please specify)

[Answer]: B

## Q5. What happens when a collectible is missed (reaches the bottom)?

A. Nothing: it disappears with no penalty (existing behaviour). The stage target does not go down.
B. The player loses 1 life.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q6. What happens to the objects still falling when the stage target is reached?

A. They all disappear at once, the stage-clear screen appears, and the next stage starts with an empty screen.
B. They keep falling until the screen is clear, then the stage-clear screen appears.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q7. Timing of the auto-advancing screens, and tab focus loss

A. Stage intro about 2 s and stage clear about 2.5 s (starting values). If the browser tab loses focus during play, the game stops updating and resumes when the tab comes back (not a pause feature; it only prevents unfair VIRUS hits while hidden).
B. Same timings as A; when the tab loses focus, the game keeps running.
C. Not yet defined.
X. Other (please specify)

[Answer]: B

## Q8. What performance and compatibility targets apply?

A. Runs smoothly (target 60 frames per second) on a recent desktop browser and a recent smartphone; the built game stays small (under 1 MB); first screen appears within about 2 s on a normal connection. Exact browsers are chosen by the developer during testing.
B. No numeric targets; the developer judges by playing.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q9. Accessibility details carried from the mockups

A. The canvas's text label changes with each screen (for example "Stage 1 FORTRAN, AI 0%, score 300, 3 lives"), announced through a hidden text element so screen readers can read it; the casing title "AI CATCH" is the page's only top-level heading; the whole game can be played with the keyboard alone.
B. Only a single fixed text label on the canvas; no per-screen announcements.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q10. Text that the existing pixel font cannot draw

The existing 3x5 font has no `%`, `.`, `:` or dash characters, which the HUD and the ending messages need ("AI 25%", "AI RESTORED — 100%", "HUMANS SAVED AI.").

A. Extend the original pixel font with the missing characters (still original art).
B. Avoid those characters (for example "AI 25 PCT").
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
