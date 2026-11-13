# User Stories — AI CATCH

Stories follow the player's journey [Q2], one larger story per journey step [Q3]. The three steps that mix Must Have and Should Have work are split in two [Q5]. A ninth step, submission, was added at the approval gate so the Kiroween repository rules (NFR6) are checked like any other story [gate feedback R-01]. That gives 12 stories: 9 Must Have and 3 Should Have. Priorities follow [Q4]. Requirement IDs refer to [requirements.md](../requirements-analysis/requirements.md); personas are in [personas.md](personas.md).

## Story Map

| Journey step | Must Have | Should Have |
|---|---|---|
| 1. Power-on and title | US1.1 | |
| 2. Controls | US2.1 | |
| 3. Falling objects and difficulty | US3.1 | |
| 4. Catching and scoring | US4.1 | |
| 5. Lives and game over | US5.1 | |
| 6. Restart and high score | US6.1 | US6.2 |
| 7. Look and sound | US7.1 | US7.2 |
| 8. Devices and screens | US8.1 | US8.2 |
| 9. Submission | US9.1 | |

## Dependencies

| Story | Depends on | Why |
|---|---|---|
| US4.1 | US5.1 | AC4.1.5 checks that a VIRUS takes priority over a rescue object, which needs VIRUS handling |
| US6.1 | US5.1 | Restart starts from the game-over state that US5.1 produces |
| US6.2 | US5.1, US6.1 | NEW HIGH SCORE is shown on the game-over screen and must survive the restart rules |
| US7.2 | US4.1, US5.1 | The effects are triggered by catches, VIRUS contact and lost lives |
| US8.2 | US8.1 | Rotation re-uses the screen fitting from US8.1 |

Every other story has no dependency. If time runs short, a Should Have story can be dropped without breaking a Must Have one; no Must Have story depends on a Should Have one.

---

## 1. Power-on and title

### US1.1 — Power on the console and start a game

**As** Jordan, the hackathon judge, **I want** to switch the console on and start a game with one press each, **so that** I am playing within seconds of opening the link, with the startup feel of a real handheld game.

- **Priority**: Must Have
- **Requirements**: FR1.1, FR1.2, FR7.1, FR8.1, FR8.2
- **Dependencies**: none

**Acceptance criteria**

- **AC1.1.1** — Given the page has just loaded, When nothing has been pressed, Then the console is shown powered off with a visible POWER button, nothing animates and no sound plays.
- **AC1.1.2** — Given the console is powered off, When I press POWER by click, key or tap, Then the startup sequence plays together with the startup sound.
- **AC1.1.3** — Given I am on a smartphone and have not touched the page yet, When I tap POWER, Then the startup sound is heard, and sounds later in the game also play.
- **AC1.1.4** — Given the startup sequence has finished, When the title screen is shown and I press START, Then the game-start sound plays and play begins.
- **AC1.1.5** — Given the title screen is shown, When I press START by clicking or tapping the START button on the console casing, or by pressing Enter or Space on PC, Then the game starts; an arrow key or a tap elsewhere on the screen does not start it.

**Story assumption (gate feedback R-06)**: requirements.md says only "the START button starts the game" (FR1.2). This story reads START as a START button on the casing, pressed by click or tap, plus Enter or Space on PC. Arrow keys and taps elsewhere are left out so that a player trying the controls does not start the game by accident. Correct this if a different input is wanted.

**INVEST notes**: Independent of play rules; testable on its own with an empty play area. Small: two screens and two sounds.

---

## 2. Controls

### US2.1 — Move HUMAN left and right

**As** Sam, the casual web player, **I want** to move HUMAN left and right with the arrow keys on PC or by touching either half of the screen on my phone, **so that** I can play with no instructions on any device.

- **Priority**: Must Have
- **Requirements**: FR2.1, FR2.2, FR2.3, FR2.4
- **Dependencies**: none (needs only a play area with HUMAN in it)

**Acceptance criteria**

- **AC2.1.1** — Given a game is in play on PC, When I hold the Left or Right arrow key, Then HUMAN moves in that direction for as long as the key is held, and stops when it is released.
- **AC2.1.2** — Given a game is in play on a smartphone, When I touch and hold the left or right half of the screen, Then HUMAN moves in that direction while the touch lasts; there are no on-screen arrow buttons.
- **AC2.1.3** — Given HUMAN is at the left or right edge of the play area, When I keep holding that direction, Then HUMAN stays fully visible at the edge.
- **AC2.1.4** — Given I am holding Left, When I also press Right, Then HUMAN moves right; and When I then release Right while still holding Left, Then HUMAN moves left.
- **AC2.1.5** — Given I am touching the left half of the screen, When I also touch the right half, Then HUMAN moves right, the most recent touch winning in the same way as the keys.

**INVEST notes**: Independent of scoring and falling objects. Testable with HUMAN alone in the play area.

---

## 3. Falling objects and difficulty

### US3.1 — Objects fall, each with its own movement, and the game gets harder

**As** Jordan, the hackathon judge, **I want** LLM MODEL, GPU, ROBOT and VIRUS to fall in clearly different ways and the game to get harder over time, **so that** the game feels like more than different pictures and keeps me interested for a full session.

- **Priority**: Must Have
- **Requirements**: FR1.3, FR3.1, FR3.2, FR3.3, FR3.4, FR3.5, FR3.6, FR3.7, FR3.8, FR7.2
- **Dependencies**: none (objects can fall without HUMAN catching anything)

**Acceptance criteria**

- **AC3.1.1** — Given play has just started, When objects fall, Then LLM MODEL takes 4.0 s, ROBOT 3.5 s, VIRUS 3.0 s and GPU 2.5 s to fall the full height of the play area; LLM MODEL and GPU fall straight, ROBOT sways left and right, and VIRUS moves sideways irregularly.
- **AC3.1.2** — Given play has just started, When objects appear, Then one object appears every 1.2 s at a random horizontal position inside the play area, and the non-VIRUS objects are split equally between LLM MODEL, GPU and ROBOT.
- **AC3.1.3** — Given less than 10 s of play has passed, When objects appear, Then none of them is a VIRUS.
- **AC3.1.4** — Given play has reached 10 s, When objects appear, Then 20% of them are VIRUS, rising by 5 percentage points every 15 s (25% at 25 s, 30% at 40 s, 35% at 55 s) to 40% from 70 s.
- **AC3.1.5** — Given play has reached 15 s, When the next object appears, Then the spawn interval is 1.08 s and fall speed is 1.1× (LLM MODEL takes about 3.64 s).
- **AC3.1.6** — Given play has reached 30 s, When the next object appears, Then the spawn interval is about 0.97 s (1.2 × 0.9 × 0.9) and fall speed is 1.21× (LLM MODEL takes about 3.31 s), confirming that each 15 s step compounds on the previous one rather than adding a fixed amount.
- **AC3.1.7** — Given play has reached 120 s or more, When objects appear and fall, Then the spawn interval is 0.6 s and fall speed is 2.0× the starting speed, and neither changes any further.

**INVEST notes**: The numbers come from requirements.md, so every criterion has a pass/fail value. Could be split by object kind if it proves too large to build in one go.

---

## 4. Catching and scoring

### US4.1 — Catch AI parts to score points

**As** Sam, the casual web player, **I want** each rescued AI part to give its own points with a clear reaction, **so that** I know what I caught and can aim for the higher-value parts.

- **Priority**: Must Have
- **Requirements**: FR4.1, FR4.2, FR4.3, FR4.5, FR4.6, FR4.7, FR4.9, FR6.1, FR7.3, FR8.3
- **Dependencies**: US5.1 for AC4.1.5 only; the other criteria can be tested by placing objects next to HUMAN

**Acceptance criteria**

- **AC4.1.1** — Given an LLM MODEL, a GPU or a ROBOT is falling, When its bounding box overlaps HUMAN's by at least one pixel, Then 100, 150 or 200 points are added respectively, the object disappears, a catch reaction shows, and that object's own catch sound plays.
- **AC4.1.2** — Given a rescue object's bounding box does not overlap HUMAN's, When it passes beside HUMAN, Then it is not caught and the score does not change.
- **AC4.1.3** — Given a rescue object is not caught, When it reaches the bottom of the play area, Then it disappears and neither the score nor the lives change.
- **AC4.1.4** — Given HUMAN touches two rescue objects and no VIRUS in the same update, When the touches are handled, Then only the earlier-spawned object scores and the other disappears with no effect.
- **AC4.1.5** — Given HUMAN touches a VIRUS and a rescue object in the same update, When the touches are handled, Then only the VIRUS is handled (as in US5.1) and the rescue object disappears without scoring.
- **AC4.1.6** — Given a game is in play, When the score changes, Then the new score is shown in seven-segment style.

**INVEST notes**: Testable without lives or game over. AC4.1.5 refers to US5.1 for what a VIRUS does, but only checks that the rescue object does not score.

---

## 5. Lives and game over

### US5.1 — Lose lives to VIRUS until the game is over

**As** Jordan, the hackathon judge, **I want** each VIRUS to cost a life and the game to end clearly when the lives run out, **so that** there is real risk in every session and a clear end to it.

- **Priority**: Must Have
- **Requirements**: FR4.4, FR4.6, FR4.8, FR5.1, FR5.2, FR5.3, FR1.4, FR7.7, FR8.4, FR8.5
- **Dependencies**: none (lives can be tested by placing a VIRUS next to HUMAN)

**Acceptance criteria**

- **AC5.1.1** — Given a new game has started, When the play screen shows, Then 3 lives are displayed.
- **AC5.1.2** — Given I have lives left, When HUMAN touches a VIRUS, Then one life is removed, the VIRUS contact sound plays, the VIRUS disappears and the score is unchanged.
- **AC5.1.3** — Given HUMAN has just lost a life to a VIRUS, When another VIRUS touches HUMAN straight away, Then another life is removed; there is no invulnerability time.
- **AC5.1.4** — Given 1 life is left, When HUMAN touches a VIRUS, Then lives become 0, and the GAME OVER sequence and game-over sound start at once.
- **AC5.1.5** — Given the GAME OVER sequence has started, When 2.0 s have passed, Then the sequence has ended and the game-over sound has finished.
- **AC5.1.6** — Given any amount of time has passed in play, When lives are still above 0, Then the game keeps going; there is no time limit.

**INVEST notes**: Independent of scoring. Ends at the end of the GAME OVER sequence; what happens next is US6.1.

---

## 6. Restart and high score

### US6.1 — Play again straight after game over

**As** Sam, the casual web player, **I want** to start a new game with one key press or tap once the GAME OVER sequence ends, **so that** I can have another go immediately without missing the result of the last one.

- **Priority**: Must Have
- **Requirements**: FR1.5
- **Dependencies**: US5.1 (the game-over state); can be tested from a forced game-over state

**Acceptance criteria**

- **AC6.1.1** — Given the GAME OVER sequence is still playing, When I press a key or tap at 1.9 s, Then the game does not restart and everything on the game-over screen stays as it is.
- **AC6.1.2** — Given the GAME OVER sequence has ended, When the game-over screen shows, Then a blinking "PRESS ANY KEY" message appears.
- **AC6.1.3** — Given "PRESS ANY KEY" is showing, When I press any key or tap anywhere, Then a new game starts at once with 3 lives and a score of 0.
- **AC6.1.4** — Given I was still holding an arrow key when the game ended, When "PRESS ANY KEY" appears, Then the held key does not restart the game until I release it and press a key again.

**INVEST notes**: Small and self-contained.

### US6.2 — Keep my best score and see when I beat it

**As** Sam, the casual web player, **I want** my best score to be saved on this device and a clear message when I beat it, **so that** I have a reason to keep coming back.

- **Priority**: Should Have
- **Requirements**: FR6.3, FR6.4, FR6.5, FR6.6, FR1.5
- **Dependencies**: US5.1 (the game-over screen) and US6.1 (the restart rules)

**Acceptance criteria**

- **AC6.2.1** — Given a stored high score exists, When I open the game later on the same browser, Then that high score is shown on the title screen, and it is shown again on the game-over screen after each game.
- **AC6.2.2** — Given a game ends with a score higher than the stored high score, When the game-over screen shows, Then "NEW HIGH SCORE" is displayed and the new score is saved in localStorage.
- **AC6.2.3** — Given a game ends with a score equal to or lower than the stored high score, When the game-over screen shows, Then "NEW HIGH SCORE" is not displayed and the stored high score does not change.
- **AC6.2.4** — Given localStorage cannot be read or written (for example in private browsing), When I play, Then the game runs normally with no error shown and keeps the high score for this session only.
- **AC6.2.5** — Given the stored high score is not a non-negative whole number, When the game loads, Then the high score is treated as 0.
- **AC6.2.6** — Given "NEW HIGH SCORE" is shown on the game-over screen, When I press a key or tap at 1.9 s, Then the message stays visible, and it stays until a new game starts.

**Story assumption (gate feedback R-06)**: requirements.md says only "show the high score on screen" (FR6.4). This story places it on the title screen and the game-over screen, where a player compares scores, and keeps it off the play screen so the score and lives stay easy to read. Correct this if it should also show during play.

**INVEST notes**: Can be left out without breaking the play loop, which is why it is Should Have.

---

## 7. Look and sound

### US7.1 — See and hear a retro LCD handheld game

**As** Jordan, the hackathon judge, **I want** the game to look like a monochrome LCD handheld with original pixel art and to sound like a retro electronic game, **so that** the "resurrection" of the classic handheld experience is obvious at first sight.

- **Priority**: Must Have
- **Requirements**: FR9.1, FR9.2, FR9.3, FR9.4, NFR5
- **Dependencies**: none

**Acceptance criteria**

- **AC7.1.1** — Given the game is open, When any screen is shown, Then it is drawn in a monochrome LCD style inside a retro handheld console casing.
- **AC7.1.2** — Given a game is in play, When I look at the screen, Then HUMAN, LLM MODEL, GPU, ROBOT and VIRUS are each drawn as distinct pixel art that can be told apart at a glance, and the score and lives are easy to read.
- **AC7.1.3** — Given the sounds in the game, When I listen, Then they are retro electronic tones, and there is no mute switch.
- **AC7.1.4** — Given the project's assets (pixel art, casing, sounds, fonts), When their source is checked, Then each is original work or has recorded terms of use and licence, and none is taken from Game & Watch or another existing game.

**INVEST notes**: AC7.1.1 and AC7.1.2 are checked by eye against the design; AC7.1.4 is checked against the asset record.

### US7.2 — Enjoy the extra effects

**As** Sam, the casual web player, **I want** extra effects when I score, hit a VIRUS or lose a life, **so that** each moment feels responsive and alive.

- **Priority**: Should Have
- **Requirements**: FR6.2, FR7.4, FR7.5, FR7.6
- **Dependencies**: US4.1 (catches) and US5.1 (VIRUS contact, lost lives)

**Acceptance criteria**

- **AC7.2.1** — Given a rescue object is caught, When the points are added, Then a score-gain display (for example "+150") appears briefly.
- **AC7.2.2** — Given HUMAN touches a VIRUS, When the life is removed, Then a glitch effect plays on the screen.
- **AC7.2.3** — Given a life has just been lost, When lives are still above 0, Then a warning effect shows that a life was lost.
- **AC7.2.4** — Given any of these effects is playing, When objects keep falling, Then play carries on underneath and the game does not pause.

**INVEST notes**: Can be dropped without breaking the play loop.

---

## 8. Devices and screens

### US8.1 — Play on PC or smartphone, even on a small screen

**As** Sam, the casual web player, **I want** the game to load fast and fit my screen on PC or phone, **so that** I can play wherever I am without scrolling or waiting.

- **Priority**: Must Have
- **Requirements**: NFR1, NFR2, NFR3, NFR4, FR9.5
- **Dependencies**: none

**Acceptance criteria**

- **AC8.1.1** — Given a browser viewport of 375 × 520 CSS pixels (portrait) or 667 × 320 CSS pixels (landscape), When the game is open, Then the whole play area and the score and lives display are visible without scrolling.
- **AC8.1.2** — Given any supported viewport, When the game is shown, Then the casing and play area keep their aspect ratio, are as large as fits and centred, and the pixel art has sharp, unsmoothed edges.
- **AC8.1.3** — Given the latest Chrome, Firefox, Safari or Edge, When I open the game, Then it loads and plays.
- **AC8.1.4** — Given a typical laptop or a mid-range smartphone released within the last 3 years, When a game is in play, Then it runs at 60 fps.
- **AC8.1.5** — Given a first visit, When the game loads, Then the total download is under 1 MB and no server-side processing is needed to play.

**INVEST notes**: Cuts across every screen, but each criterion is checked on its own.

### US8.2 — Turn my phone during play

**As** Sam, the casual web player, **I want** to turn my phone between portrait and landscape mid-game without losing anything, **so that** I can hold the phone however is comfortable.

- **Priority**: Should Have
- **Requirements**: FR9.6
- **Dependencies**: US8.1 (screen fitting)

**Acceptance criteria**

- **AC8.2.1** — Given a game is in play in portrait, When I rotate the phone to landscape, Then the layout fits the new visible area straight away, and the score, lives and falling objects are unchanged.
- **AC8.2.2** — Given a game is in play, When the phone is rotated, Then the game keeps running and does not pause or restart.
- **AC8.2.3** — Given the phone has been rotated during play, When I keep playing, Then objects still take the same time to fall the full height of the play area as before the rotation.

**INVEST notes**: Can be dropped without breaking play in a fixed orientation.

---

## 9. Submission

### US9.1 — Check the entry meets the Kiroween repository rules

**As** Jordan, the hackathon judge, **I want** the project's source to be in a public GitHub repository with its `.kiro` directory and an open-source licence, **so that** I can confirm the entry was built with Kiro and is eligible to be judged.

- **Priority**: Must Have
- **Requirements**: NFR6
- **Dependencies**: none

**Acceptance criteria**

- **AC9.1.1** — Given the repository URL from the submission, When I open it without signing in, Then the repository is public on GitHub and holds all the game's source code and assets.
- **AC9.1.2** — Given the repository, When I look at its root, Then a `.kiro` directory is there, and `.gitignore` does not list `.kiro`.
- **AC9.1.3** — Given the repository, When I look at its root, Then an MIT licence file is there and GitHub shows the licence as MIT.

**INVEST notes**: Not player-facing, but it is a pass/fail condition for the whole entry, so it is a Must Have story with its own checks [gate feedback R-01]. Independent of every other story. Pushing the repository to GitHub is done by the developer; this story only checks the result.
