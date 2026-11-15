# Refined Mockups Questions

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/rough-mockups/wireframes.md` and `user-flow.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md`, and the existing game's look (`src/render/renderer.ts`, `src/style.css`, `index.html`).

Facts from the existing game used below: the LCD is 240 x 160 logical pixels; the console casing is 320 x 240 and is currently a warm beige (`#c9c3b0`) with a dark red "AI CATCH" label; the controls row has a POWER button, a "◀ ▶ MOVE" hint text, and a START button (no on-screen arrow buttons); text uses an original 3 x 5 pixel font; the score uses seven-segment digits.

Already decided (not asked again): screens and flow, HUD content, Stage 4 combined count, lives carry over, no pause, high score on game over and victory, heading rules, keyboard-only play, starting values for counts, points, timings.

## Q1. Casing colour and controls row

`product.md` §8 asks for a silver-grey casing; the current casing is warm beige. The POWER button is removed (no power-on step).

A. Change the casing to silver-grey, keep the "AI CATCH" label, and make the controls row: "◀ ▶ MOVE" hint text on the left and the START button on the right (no POWER button, no on-screen arrow buttons). The `[ < ]` `[ > ]` marks in the rough wireframe become this hint text.
B. Keep the current beige casing; only remove the POWER button.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q2. Victory animation

A. A short "reboot" sequence before the messages: the AI restoration bar fills from 75% to 100% while VIRUS-style glitch noise fades out; then a simple AI face icon changes from a broken (glitched) look to a calm restored look; then the three messages appear one after another. About 3-4 s in total, then "PRESS ANY KEY".
B. No animation: the messages appear at once on a static screen.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q3. Title story line and stage-clear wording

A. Title: "2045. A VIRUS BROKE THE AI." / "RECOVER COMPUTING HISTORY." / "SAVE IT." Stage clear: "<NAME> RECOVERED" (for example "FORTRAN RECOVERED"), with the AI bar.
B. Title: "2045. THE AI IS CORRUPTED. SAVE IT." only. Stage clear as in option A.
C. Not yet defined; draft wording is fine for now.
X. Other (please specify)

[Answer]: A

## Q4. Extras from the rough mockups (decided later at the mockup gate)

A. Keep all three: "NEW!" next to the high score when beaten (on game over and victory), a "REACHED STAGE n NAME" line on game over, and the AI bar on the stage intro.
B. Keep only "NEW!" and the intro AI bar; drop the "REACHED STAGE" line.
C. Drop all three.
X. Other (please specify)

[Answer]: A

## Q5. Input during the automatic screens

A. On the stage intro and stage-clear screens, input is ignored and nothing falls or moves; HUMAN reappears at the centre bottom when play starts. A key still held when play starts moves HUMAN at once (no release needed).
B. Same as A, but HUMAN can already move during the stage intro.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q6. Smallest supported screen (for "text stays readable")

A. Use the existing fit targets: about 375 x 520 CSS pixels in portrait and 667 x 320 in landscape (roughly an iPhone SE with browser bars showing). At these sizes the LCD is scaled about 1.2x to 1.3x, and the 3 x 5 font at scale 1 must still be legible.
B. Portrait 360 x 640 CSS pixels only.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q7. Accessibility level

A. Keep the earlier choice: no formal WCAG level; practical basics as in the requirements (keyboard-only play, shape-based recognition, readable text, a hidden live text element with the screen name and key values; the casing's two-tone LCD and dark text keep strong contrast).
B. Aim for WCAG 2.1 AA formally.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
