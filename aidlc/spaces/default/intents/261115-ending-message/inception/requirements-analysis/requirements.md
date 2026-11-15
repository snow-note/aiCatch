# Requirements: Completion Experience Enhancement (Ending Message)

Intent: `261115-ending-message` (express scope, Minimal depth).

## Intent Analysis

The person wants the victory ending to carry a meaningful message after the AI is restored: a short reflection that asks the player whether they only use AI or create with it, and ends with "The future is yours to code." The message replaces the current three ending lines, is shown in the game's retro pixel style, is presented progressively so all of it can be read, and works on desktop and mobile in portrait and landscape. Gameplay must not change.

Upstream inputs:

- Code scan: `inception/reverse-engineering/developer-scan.md`.
- Code knowledge base: `aidlc/spaces/default/codekb/aiCatch/business-overview.md` (ending narrative), `aidlc/spaces/default/codekb/aiCatch/architecture.md` (victory phase, `Renderer.drawVictory`, screen-timing helpers), `aidlc/spaces/default/codekb/aiCatch/code-structure.md` (`src/render/renderer.ts`, `src/render/screen-timing.ts`, `src/render/sprites.ts`, `src/game/state.ts`, `src/game/announcer.ts`, `src/game/config.ts`).
- Answers: `requirements-analysis-questions.md` (Q1 C, Q2 B, Q3 A, Q4 B, Q5 A, Q6 A, Q7 B, Q8 A).

### Ending message (verbatim from the request)

```
AI RESTORED!

You brought me back to life.

But tell me...
Do you know the generations of computing,
the programming languages, and the human creativity
that made the AI you use today possible?

Are you simply using AI,
or are you creating something with it?

Remember the spirit of the early computing days:
Experiment. Imagine. Build.

Don't just use AI.
Create with it.

The future is yours to code.
```

19 lines: 13 text lines and 6 blank lines. On screen it is drawn in capitals (Q6 A); the wording and the line breaks stay as given (Q5 A).

## Functional Requirements

### FR1 Replace the ending message (Q3 A)

- **FR1.1** The victory screen no longer shows "AI RESTORED — 100%", "HUMANS SAVED AI." or "SAVE THE AI. SAVE THE FUTURE.". It shows the message above instead, line for line, in the given order, including the blank lines.
- **FR1.2** The message lines are defined once, as data in the render layer, so the screen and its tests use the same text.
- **FR1.3** The existing reboot and restore animation (broken face, AI bar 75 -> 100%, noise; first 2.5 s) stays as it is. The message starts after it.

### FR2 Typewriter presentation with scroll (Q1 C, Q5 A, Q8 A)

- **FR2.1** Message lines appear one at a time, top to bottom, at scale 1 with the existing pixel font. A blank line takes a short pause.
- **FR2.2** When the visible text area is full, the text scrolls up so the newest line is always visible. No line is ever cut off at the left or right edge (every line fits within the 240 px canvas width).
- **FR2.3** The whole message finishes appearing about 20 seconds after it starts (Q8 A). The timing values are tunables.
- **FR2.4** After the last line ("THE FUTURE IS YOURS TO CODE.") has appeared, the screen shows the final view: the last lines of the message, then SCORE, HI-SCORE (with the blinking NEW! when it applies), and the blinking PRESS ANY KEY.

### FR3 Return to title after the message (Q2 B)

- **FR3.1** While the message is still appearing, key presses and taps do not return to the title.
- **FR3.2** Once the whole message has appeared, the existing return rule applies: any new key, tap, click, or START press returns to the title, without starting a new run with that same press.
- **FR3.3** The victory phase start, the `victory` event, the high-score submission, and every other phase and gameplay rule are unchanged. Only the moment from which a return to the title is accepted moves from 3.5 s to the end of the message.

### FR4 Missing font glyphs (Q6 A)

- **FR4.1** The pixel font gains original 3 x 5 glyphs for comma `,`, question mark `?` and apostrophe `'`, so every character of the message is drawn. No other glyphs are added.

### FR5 Screen reader announcement (Q7 B)

- **FR5.1** The victory announcement becomes: "AI restored. You brought me back to life. The future is yours to code. Score {score}." followed by " New high score." when a new high score was set.

### FR6 Product definition (Q4 B)

- **FR6.1** `.kiro/steering/product.md` section 7 ("Victory and Ending") lists the new ending message in place of the three old ending lines. The product tagline "SAVE THE AI. SAVE THE FUTURE." elsewhere in the file (tagline, promotional sections) is not changed.

## Non-Functional Requirements

- **NFR1 Readability:** Every line is fully inside the 240 x 160 canvas, drawn in the existing dark ink on the LCD background with at least one pixel of line spacing, and no two lines overlap.
- **NFR2 Desktop and mobile:** The ending uses the same canvas and scaling as the rest of the game, so it is readable on desktop and on iPhone Safari in portrait and landscape. Checked by play on the preview.
- **NFR3 Gameplay unchanged:** No change to stages, scoring, lives, timing, difficulty, sounds, or input mapping. Files under `src/game/` change only for the return-to-title timing and the announcer text.
- **NFR4 Tunables:** Timing values (line interval, blank-line pause, scroll) live with the existing victory timing constants in `src/game/config.ts`.
- **NFR5 Testability:** The text layout and timing (which lines are visible at a time, scroll offset, when the message is complete) are pure functions with Vitest tests in Node. Tests also check that every message character has a glyph and that every line fits the canvas width.
- **NFR6 Quality gates:** `npm run typecheck`, `npm run coverage` (lines at least 80%), `npm run build`, and `npm run size` pass; tests that pin changed values are updated.
- **NFR7 Originality and dependencies:** New glyphs are original. No new dependency or external asset.

## Constraints

- HTML5 Canvas and TypeScript only; no backend, external AI, or new library.
- Game logic stays separate from rendering.

## Assumptions

- "About 20 seconds" means the full message has appeared between 17 and 23 seconds after the restore animation ends.
- The final view after the message keeps the last few message lines visible above the score rows; the full text has already been readable while it appeared.
- Drawing the message in capitals is acceptable because the existing font has no lower case (Q6 A).
- The victory sound plays once as today; no new sound is added.

## Out of Scope

- Lower-case font, a larger font size, or new line breaks.
- Skipping the message (Q2 B rules out skip).
- New sounds, music, or visual effects beyond the text presentation.
- Changes to the title screen, game over screen, or stage screens.

## Open Questions

- None.
