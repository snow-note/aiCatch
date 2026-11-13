# Domain Design Questions

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`, `aidlc/spaces/default/codekb/aiCatch/architecture.md`, `aidlc/spaces/default/codekb/aiCatch/component-inventory.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md`, and the refined mockups.

Existing components (from the component inventory): Console Shell, Bootstrap (`main.ts`), GameState (`state.ts`: phases, score, lives, objects, events), Config, FallingObjects, Spawner, Difficulty (by elapsed time), Collision, InputTracker, HighScoreStore, Renderer, Sprites, Layout, SoundPlayer. Team rules: game rules stay free of DOM and drawing code; all tunable numbers in `config.ts`; tests first for game logic; avoid unnecessary abstractions.

## Q1. Where do the four stages and the run's progress live?

A. Add two small game-logic pieces next to GameState: **StageCatalog** (the fixed data for the four stages: name, collectibles, required count, difficulty starting values and caps, kept in `config.ts`) and **RunProgress** (the current run: stage index, progress count, AI restoration %, and the rules "catch adds progress", "target reached clears the stage", "+25% per stage", "Stage 4 clear ends in victory"). GameState keeps the screen phases and calls RunProgress. Each piece is testable on its own.
B. Put all stage and run logic directly into GameState (one bigger class, no new modules).
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q2. How do Difficulty and Spawner learn about stages?

A. Keep them as small functions and pass the current stage's parameters in: Difficulty computes spawn interval, speed, VIRUS share, and maximum objects from "this stage's starting values + time in stage, up to this stage's cap"; Spawner picks from "this stage's collectibles + VIRUS". No knowledge of stage numbers inside them.
B. Give Difficulty and Spawner the stage number and let each look up its own values.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q3. Where do the new screens' timing and sequences live (stage intro, stage clear, victory sequence)?

A. In GameState as new phases (`stage-intro`, `stage-clear`, `victory`) with their timers, alongside the existing `title`, `playing`, `game-over`; the old `power-off` and `startup` phases are removed. The Renderer only reads the phase and its elapsed time to draw (for example the victory "reboot" steps).
B. Let the Renderer own the sequence timing and tell GameState when a screen is finished.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q4. Where is the screen-reader announcement text built?

A. A small pure function **ScreenAnnouncer** in the game layer that turns the game state into a short text (for example "Stage 1 FORTRAN, AI 0%, score 300, 3 of 10, 3 lives"); Bootstrap (`main.ts`) writes it into the hidden live text element when it changes. The text builder is unit-tested without a browser.
B. Build the text inside `main.ts` directly (no separate piece).
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q5. Who owns the AI face and the new sprites and sounds?

A. The existing owners: Sprites owns the new bitmaps (mainframe, magnetic tape, floppy disk, AI face in two looks, new font glyphs); SoundPlayer owns the new tones (three catch sounds, stage clear, victory); Renderer draws the new screens and the shared AI restoration bar. No new rendering or audio components.
B. Create a separate new component for the victory ending (its own drawing and sound).
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
