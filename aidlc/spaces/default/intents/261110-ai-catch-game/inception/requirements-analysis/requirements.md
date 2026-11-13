# Requirements — AI CATCH

## Intent Analysis

AI CATCH is a retro handheld-electronic-game-style web action game built for the Resurrection category of the Kiroween 2026 hackathon. Based on the Intent Statement ([intent-statement.md](../../ideation/intent-capture/intent-statement.md)), it resurrects the simple play experience of Game & Watch-style games in an AI-era setting. The name "AI CATCH" is settled (Intent Capture Q10).

The player becomes a human (HUMAN) who catches and rescues the building blocks of AI (LLM MODEL / GPU / ROBOT) falling from the top of the screen, while avoiding VIRUS. The game keeps monochrome LCD-style pixel art, simple left/right-only controls and short play sessions.

The goal is to finish a single-screen game that is playable instantly in a browser, with both technical quality (PC and smartphone support, retro UI effects, sound effects) and solid gameplay.

Source tags such as [Q6] refer to the answers in `requirements-analysis-questions.md`; [spec] refers to `original_spec.md`; [gate feedback R-nn] refers to the developer's decisions on review finding R-nn at the approval gate.

## Functional Requirements

### Game state management

**FR1** — The game is a single-screen game with these state transitions: power-off → power-on (startup) → title → playing → game over → playing again [spec]

- **FR1.1** — The page opens with the game console powered off and a POWER button visible. Pressing POWER (click, key or tap) starts the startup sequence. Pass: nothing animates and no sound plays before POWER is pressed; the startup sequence starts on the press [Q16]
- **FR1.2** — After the startup sequence, show a title screen; pressing START starts the game [spec]
- **FR1.3** — In the playing state, spawn falling objects and handle player input, collision detection and score calculation [spec]
- **FR1.4** — When lives reach 0, move to the game-over state and show the GAME OVER sequence [spec][Q2]
- **FR1.5** — Restart input is accepted only after the GAME OVER sequence (FR7.7, 2.0 s) has finished; key presses and taps during the sequence are ignored. When it has finished, a blinking "PRESS ANY KEY" message appears, and from then any new key press or tap restarts the game immediately with 3 lives and a score of 0. A key that is still held down from earlier does not count until it is released and pressed again. Pass: a tap 1.9 s after game over does not restart the game and the NEW HIGH SCORE message (FR6.5) stays visible; a tap after "PRESS ANY KEY" appears (2.0 s) restarts it at once [Q11][gate feedback R-10, R-11]

### Player controls

**FR2** — The player moves HUMAN left and right along the bottom of the screen to catch falling objects [spec]

- **FR2.1** — On PC, HUMAN moves while the left or right arrow key is held [spec]
- **FR2.2** — On smartphones, HUMAN moves while the player touches the left half or the right half of the screen. There are no on-screen arrow buttons [Q14]
- **FR2.3** — HUMAN cannot move past the left or right edge of the play area. Pass: holding a direction at an edge leaves HUMAN fully visible at that edge [assumption A1]
- **FR2.4** — When both directions are held at once (both arrow keys, or touches on both halves of the screen), the direction pressed most recently is the one that moves HUMAN. When that direction is released while the other is still held, HUMAN moves in the direction still held. Pass: hold Left, then also press Right → HUMAN moves right; release Right while still holding Left → HUMAN moves left [gate feedback R-08][assumption A5]

### Falling objects

**FR3** — Four kinds of objects fall from the top of the screen. Each kind has its own movement. Fall speed is given as the time an object takes to fall the full height of the play area, so it holds at any screen size [Q6][Q20]

- **FR3.1** — LLM MODEL falls straight down; starting fall time 4.0 s [spec][Q20]
- **FR3.2** — GPU falls straight down, the fastest object; starting fall time 2.5 s [spec][Q20]
- **FR3.3** — ROBOT sways left and right as it falls; starting fall time 3.5 s [spec][Q20]
- **FR3.4** — VIRUS falls with an irregular sideways movement; starting fall time 3.0 s [spec][Q20]
- **FR3.5** — Difficulty rises every 15 s of play: the spawn interval is multiplied by 0.9 and fall speed is multiplied by 1.1. Each stops changing when it reaches 2× the starting difficulty (spawn interval 0.6 s; fall speed 2.0×, i.e. half the starting fall times). Pass: at 15 s the interval is 1.08 s and LLM MODEL takes about 3.64 s; at 120 s and later the interval is 0.6 s and fall speed is 2.0× [Q21][assumption A2]
- **FR3.6** — At the start of play, one object appears every 1.2 s at a random horizontal position inside the play area [Q21]
- **FR3.7** — No VIRUS appears during the first 10 s of play. From 10 s, 20% of new objects are VIRUS; the share rises by 5 percentage points every 15 s after that (25% at 25 s, 30% at 40 s, 35% at 55 s) up to 40% from 70 s [Q7][Q22]
- **FR3.8** — The objects that are not VIRUS are split equally between LLM MODEL, GPU and ROBOT [assumption A3]

### Catch detection and scoring

**FR4** — When HUMAN touches a falling object, the game handles it according to the object's kind [spec]

- **FR4.1** — Catching an LLM MODEL adds +100 points [spec]
- **FR4.2** — Catching a GPU adds +150 points [spec]
- **FR4.3** — Catching a ROBOT adds +200 points [spec]
- **FR4.4** — Touching a VIRUS removes 1 life; it does not change the score [spec]
- **FR4.5** — A rescue object (LLM MODEL, GPU, ROBOT) that reaches the bottom of the play area without being caught disappears with no penalty: score and lives are unchanged [Q8]
- **FR4.6** — An object is removed from the screen as soon as it is handled (caught or touched) or reaches the bottom of the play area [Q8][Q23]
- **FR4.7** — At most one object is handled per game update. If HUMAN touches several objects in the same update and one of them is a VIRUS, the VIRUS is handled and every other touched object disappears with no effect. If none is a VIRUS, the object that appeared earliest is handled and the others disappear with no effect [Q10][Q23][assumption A4]
- **FR4.8** — There is no invulnerability after a VIRUS hit: every VIRUS contact removes a life [Q9]
- **FR4.9** — "Touch" is an approximate check: HUMAN touches an object when their rectangular bounding boxes overlap. Pixel-exact collision is not required. Pass: an object whose box overlaps HUMAN's box by at least one pixel is handled; an object whose box does not overlap is not [gate feedback R-07]

### Lives

**FR5** — A lives system governs the progress of the game [spec]

- **FR5.1** — The game starts with 3 lives [Q1]
- **FR5.2** — The game is over when lives reach 0. There is no time limit [Q2]
- **FR5.3** — Show the current number of lives on screen [spec]

### Score display

**FR6** — Show the score on screen and save the high score locally [spec][Q3]

- **FR6.1** — Show the score in a seven-segment style [spec]
- **FR6.2** — Show a score-gain effect when an object is caught [spec]
- **FR6.3** — Save the high score in localStorage when a game ends with a score higher than the stored high score [Q3]
- **FR6.4** — Show the high score on screen [Q3]
- **FR6.5** — When a game ends with a score higher than the previous high score, show "NEW HIGH SCORE" on the game-over screen [Q12]
- **FR6.6** — If localStorage cannot be read or written (private browsing, storage disabled), the game still runs and keeps the high score only for the current session, with no error shown. A stored value that is not a non-negative whole number is treated as 0 [Q13]

### Effects and animation

**FR7** — Implement retro handheld-game-style effects and animation [spec]

- **FR7.1** — Startup sequence after POWER is pressed [spec][Q16]
- **FR7.2** — Falling animation for objects [spec]
- **FR7.3** — Reaction effect on a catch [spec]
- **FR7.4** — Score-gain display effect [spec]
- **FR7.5** — Glitch effect on VIRUS contact [spec]
- **FR7.6** — Warning effect when a life is lost [spec]
- **FR7.7** — GAME OVER sequence, lasting a fixed 2.0 s from the moment lives reach 0 [spec][gate feedback R-11]

### Sound effects

**FR8** — Implement sound effects based on retro electronic tones. Sound is always on; there is no mute toggle [spec][Q5]

- **FR8.1** — Startup sound, played when POWER is pressed. That press also unlocks sound playback on smartphones [spec][Q16]
- **FR8.2** — Game-start sound [spec]
- **FR8.3** — Catch sound (one per object kind) [spec]
- **FR8.4** — VIRUS contact sound [spec]
- **FR8.5** — Game-over sound, which starts when lives reach 0 and ends within the 2.0 s GAME OVER sequence (FR7.7). Pass: the sound has finished by the time "PRESS ANY KEY" appears (FR1.5) [spec][gate feedback R-13]

### UI and design

**FR9** — Adopt a retro monochrome LCD-style design [spec]

- **FR9.1** — Monochrome LCD-style screen [spec]
- **FR9.2** — Characters drawn as pixel art (all original work) [spec]
- **FR9.3** — Retro electronic-game-console casing design [spec]
- **FR9.4** — Simple, highly legible screen layout [spec]
- **FR9.5** — The console casing and the play area keep a fixed aspect ratio. They are scaled up or down, keeping that ratio, to the largest size that fits the visible area, and centred; any space left over is filled with the background colour. Pixel art is scaled without smoothing (nearest-neighbour). Pass: on any supported viewport the play area is not stretched, and pixel edges stay sharp [gate feedback R-12]
- **FR9.6** — Turning a smartphone between portrait and landscape during play does not pause or reset the game: the layout is fitted to the new visible area straight away and play carries on. Pass: rotating the device mid-game keeps the score, lives and falling objects, and the game keeps running [gate feedback R-12][Q4]

## Non-Functional Requirements

**NFR1** — The game is playable on PC and on smartphones, in both portrait and landscape orientation. The smallest supported screen is the iPhone SE (3rd generation): 1334 × 750 physical pixels, which is 667 × 375 CSS pixels at its 2× pixel density. The check is made against the area actually visible in the browser, with its toolbars showing, not the full screen. Target visible areas: 375 × 520 CSS pixels in portrait and 667 × 320 CSS pixels in landscape. Pass: at each of these viewport sizes, the whole play area and the score/lives display are visible without scrolling [spec][Q15][gate feedback R-04, R-09][assumption A6]

**NFR2** — The game runs in the latest versions of Chrome, Firefox, Safari and Edge [spec]

**NFR3** — The game runs at 60 fps on a mid-range smartphone released within the last 3 years and on a typical laptop [Q17]

**NFR4** — The total download needed to play is under 1 MB, and the game needs no server-side processing to run [Q17][Q9 of Intent Capture]

**NFR5** — All assets (characters, pixel art, sound effects) are original work or have confirmed terms of use, and their sources and licences are recorded [spec]

**NFR6** — The repository meets the Kiroween 2026 submission requirements: public GitHub repository, the `.kiro` directory at the root and not git-ignored, and an MIT licence file at the top of the repository [Q18][Intent Capture Q12]

## Constraints

- **Technology stack**: HTML5 Canvas, JavaScript / TypeScript, Web Audio API [spec]
- **Hosting**: Cloudflare is the planned host. Deploying is done by the developer later and is not part of this work [spec][Q19]
- **Source control**: GitHub (public repository) [spec]
- **Server-side processing**: not part of the initial version; the game works client-side only [Intent Capture Q9]
- **AI features**: AI is not required for the game to work [spec]
- **Pause**: none [Q4]
- **Sound mute**: no toggle; sound is always on [Q5]
- **Copyright**: do not reuse characters, images or audio from Game & Watch or other existing works. Everything is original work [spec]

## Assumptions

- **A1** — HUMAN is stopped at the edges of the play area (FR2.3). Reason: no answer or spec line covers it, and leaving the screen would make HUMAN invisible.
- **A2** — "Every 15 s the interval shortens by 10% and fall speed rises by 10%" [Q21] is read as compounding steps (×0.9 and ×1.1 each step), each capped at 2× the starting difficulty (FR3.5). Reason: the answer gives a percentage per step and a 2× cap but not whether steps compound; compounding reaches the cap at about 105–120 s, inside a typical short session.
- **A3** — Non-VIRUS objects are split equally between the three rescue objects (FR3.8). Reason: the spec and the answers set no mix, and an equal split keeps all three visible.
- **A4** — When several rescue objects and no VIRUS are touched in the same update, the earliest-spawned one is handled (FR4.7). Reason: Q23 settles only the case where a VIRUS is among them.
- **A5** — When the most recently pressed direction is released while the other is still held, HUMAN moves in the direction still held (FR2.4). Reason: the gate feedback "the last one pressed wins" settles which direction wins while both are held, but not what happens on release; carrying on in the held direction avoids HUMAN stopping while a key is still down.
- **A6** — The visible-area targets in NFR1 (375 × 520 portrait, 667 × 320 landscape, in CSS pixels) were chosen by the developer's request to leave the size to me. Reason: they are the full iPhone SE width with a margin under the screen height for the browser's address and tool bars. They are design targets, not measured values: the real visible height depends on the browser and its settings, so the first device test may adjust them.

## Out of Scope

- Additional features such as global rankings, daily challenges and Ghost Replay [Intent Capture Q7]
- Server-side processing, databases and user authentication [Intent Capture Q9]
- Deploying to Cloudflare [Q19]
- Multiplayer
- Building AI features into gameplay [spec]
- Pause feature [Q4]
- Sound on/off toggle [Q5]
- On-screen arrow buttons on smartphones [Q14]
- Invulnerability after a VIRUS hit [Q9]
- Sharing game results [spec]

## Open Questions

- The amplitude and pattern of ROBOT's sway and VIRUS's irregular movement (decided in design)
- The pixel size and resolution of the pixel art and of the play area (decided in design)
- Whether the console casing's buttons and decorations are arranged differently in portrait and landscape (decided in design)
