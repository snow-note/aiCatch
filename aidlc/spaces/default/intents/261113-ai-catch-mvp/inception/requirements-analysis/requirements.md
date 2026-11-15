# Requirements: AI CATCH (four-stage MVP)

## Intent Analysis

AI CATCH is an original retro handheld-style catching game for the Kiroween 2026 hackathon, Resurrection category. The player, HUMAN, restores an AI corrupted by a VIRUS attack in 2045 by recovering four generations of computing: FORTRAN, COBOL, BASIC, and finally modern AI (LLM). Each cleared stage restores 25% of the AI; clearing Stage 4 restores it to 100% and shows the victory ending. The goal is a complete, polished browser game that anyone can understand without instructions, on desktop and smartphone, with no external AI service (intent statement, `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/intent-capture/intent-statement.md`).

The work extends the existing single-screen AI CATCH game rather than rebuilding it (feasibility assessment; reverse-engineering knowledge base `aidlc/spaces/default/codekb/aiCatch/`, see `business-overview.md`, `architecture.md`, `code-structure.md`). Movement, catching, VIRUS hits, lives, score, local high score, keyboard and touch input, screen fitting, and sound already exist; this work adds the stage progression, AI restoration, new collectibles, new screens, and the ending. The in/out boundary comes from the scope document (`aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/scope-definition/scope-document.md`, items S1-S16); the product definition is `.kiro/steering/product.md`, which wins where it differs from `original_spec.md`.

Development follows the affirmed team practices (`aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md`): tests first for game logic, game rules free of DOM and drawing code, all tunable numbers in `src/game/config.ts`.

Source tags: [Qn] = answers in `requirements-analysis-questions.md`; [product] = `.kiro/steering/product.md`; [scope Sn] = scope document item; [mockup] = `wireframes.md` / `user-flow.md` and their gate decisions (R-nn); [existing] = behaviour the current game already has and keeps; [practices] = affirmed team practices. Numbers marked "starting value" are tuned by playtesting and live in `src/game/config.ts`.

## Functional Requirements

### Game flow and screens

**FR1** — The game moves through these screens: title → (stage intro → playing → stage clear) for each of the four stages in order → victory ending; or, from any stage, playing → game over. The victory ending and game over both return to the title [mockup][scope S1, S2, S11, S12]

- **FR1.1** — Opening the page shows the title screen at once. There is no power-off screen, POWER button, or startup sequence. Pass: the first screen after load is the title [mockup Q1]
- **FR1.2** — The title shows the game name, a one-line 2045 story text, a "PRESS START" prompt, and the high score. Enter, Space, or the START button starts a run. Pass: each of the three inputs starts Stage 1 [mockup][existing]
- **FR1.3** — Each stage begins with a stage intro showing the stage number and name, the collectible(s) to catch and the required count, the VIRUS to avoid, and the current AI restoration. It advances to play on its own after about 2 s (starting value) and needs no input [mockup][Q7]
- **FR1.4** — When the stage target is reached (FR3), a stage-clear screen shows "<NAME> RECOVERED" and the AI restoration rising by 25%. It advances on its own after about 2.5 s (starting value) and needs no input. This also happens after Stage 4 ("LLM RECOVERED", 75% → 100%), followed by the victory ending [mockup R-03][Q7]
- **FR1.5** — When the stage target is reached, every object still falling disappears at once; the next stage starts with an empty play area. Pass: no object from Stage n is visible when Stage n+1 play begins [Q6]
- **FR1.6** — When lives reach 0 in any stage, the game-over screen appears. It shows the AI restoration reached, the score, and the high score [mockup]
- **FR1.7** — From the game-over screen or the victory ending, a new key press or tap returns to the title. A key still held from play does not count until it is released and pressed again. A new run always starts at Stage 1 with 0% AI, score 0, and full lives [mockup Q2][existing]
- **FR1.8** — There is no pause. Leaving the browser tab does not trigger any pause logic in the game [mockup R-09][Q7]

### Player controls

**FR2** — The player moves HUMAN left and right along the bottom of the play area [product §6][existing]

- **FR2.1** — Desktop: HUMAN moves while the left or right arrow key is held [product §9][existing]
- **FR2.2** — Smartphone: HUMAN moves while the player touches the left or right half of the screen [product §9][existing]
- **FR2.3** — HUMAN stops at the edges of the play area and stays fully visible [existing]
- **FR2.4** — When both directions are held, the most recently pressed one wins; releasing it moves HUMAN in the direction still held [existing]
- **FR2.5** — The whole game, from title to ending and restart, can be played with the keyboard alone [Q9]

### Stages and collectibles

**FR3** — The game has four stages in a fixed order, each with its own collectibles and a required count to clear it [product §5][scope S2, S4]

- **FR3.1** — Stage 1 FORTRAN: the collectible is a mainframe computer; required count 10 (starting value) [product §5][Q1]
- **FR3.2** — Stage 2 COBOL: the collectible is a magnetic tape; required count 12 (starting value) [product §5][Q1]
- **FR3.3** — Stage 3 BASIC: the collectible is a floppy disk; required count 14 (starting value) [product §5][Q1]
- **FR3.4** — Stage 4 LLM: the collectibles are LLM, GPU, and ROBOT; catches of all three count together toward one required count of 16 (starting value) [product §5][mockup R-01][Q1]
- **FR3.5** — VIRUS falls in every stage [product §5]
- **FR3.6** — Each catch of a stage collectible adds 1 to the stage progress. A collectible that reaches the bottom uncaught disappears with no penalty and does not lower the progress. Pass: missing an object leaves progress, score, and lives unchanged [Q5][existing]
- **FR3.7** — Reaching the required count clears the stage at once (FR1.4, FR1.5) [product §5]

### Scoring

**FR4** — Catches and stage clears add points [product §6][scope S6]

- **FR4.1** — Mainframe, magnetic tape, and floppy disk: +100 points each (starting value) [Q3]
- **FR4.2** — Stage 4: LLM +100, GPU +150, ROBOT +200 (starting values, from the existing game) [Q3][existing]
- **FR4.3** — Clearing a stage adds a +500 bonus (starting value), including Stage 4 [Q3]
- **FR4.4** — The score carries over across stages for the whole run [product §6]
- **FR4.5** — Touching a VIRUS does not change the score [existing]

### Lives and VIRUS

**FR5** — Lives govern how long a run lasts [product §6][scope S7]

- **FR5.1** — A run starts with 3 lives (starting value); no extra lives are gained [Q2]
- **FR5.2** — Lives carry over from stage to stage; they are not refilled at a new stage [mockup R-04]
- **FR5.3** — Each VIRUS contact removes 1 life. There is no invulnerability after a hit [product §6][existing]
- **FR5.4** — At most one object is handled per game update; if a VIRUS is among the touched objects, the VIRUS is handled [existing]

### Difficulty

**FR6** — Difficulty rises from stage to stage, and also over time inside each stage [product §5][Q4][scope S8]

- **FR6.1** — Each stage has its own starting fall speed, spawn interval, VIRUS share, and maximum number of objects on screen at once. Each later stage is harder than the one before on at least one of these and easier on none. Pass: the configured values for Stage n+1 are each equal to or harder than Stage n, with at least one strictly harder [Q4]
- **FR6.2** — Inside a stage, difficulty rises in steps over time from that stage's starting values (as the existing game does), up to a cap per stage. Difficulty resets to the next stage's starting values when a new stage begins [Q4][existing]
- **FR6.3** — Stage 1 is gentle enough for a first-time player: slow falls and few VIRUS. All difficulty numbers are starting values in `config.ts`, tuned by playtesting [Q4][practices]

### AI restoration

**FR7** — AI restoration shows the player's progress through the story [product §4][scope S9]

- **FR7.1** — AI restoration starts at 0% and rises by exactly 25% per cleared stage: 25% after Stage 1, 50% after Stage 2, 75% after Stage 3, 100% after Stage 4 [product §5]
- **FR7.2** — The current AI restoration is visible on the stage intro, during play, on the stage-clear screen, and on game over [mockup]

### Playing-screen display (HUD)

**FR8** — During play a top bar always shows the stage name, the AI restoration %, the score in seven-segment style digits, the stage progress (caught / required, e.g. 3/10), and the remaining lives [mockup Q3]

- **FR8.1** — HUMAN and the falling objects remain the most prominent elements; the top bar does not cover the play area [mockup Q3]
- **FR8.2** — In Stage 4 the progress shows one combined count for LLM, GPU, and ROBOT [mockup R-01]

### Victory ending

**FR9** — Completing Stage 4 shows the victory ending [product §7][scope S11]

- **FR9.1** — The ending shows "AI RESTORED — 100%", "HUMANS SAVED AI.", and "SAVE THE AI. SAVE THE FUTURE.", with the final score [product §7]
- **FR9.2** — The ending updates the local high score when the score beats it, and shows the high score [mockup R-07]
- **FR9.3** — The ending includes a victory animation and visual feedback showing the AI's change from corrupted to restored. Its exact form is decided in design [product §7][mockup R-06]

### High score

**FR10** — The best score is kept on the player's device [product §10][scope S15][existing]

- **FR10.1** — At game over or the ending, a score higher than the stored high score replaces it in local storage [existing][mockup R-07]
- **FR10.2** — The title, game-over, and ending screens show the high score [mockup]
- **FR10.3** — If local storage cannot be read or written, the game still runs and keeps the high score for the session only, with no error shown; an invalid stored value counts as 0 [existing]

### Visuals

**FR11** — Original retro LCD-style visuals [product §8][scope S13]

- **FR11.1** — Monochrome grey-green LCD screen with dark pixels, inside a silver-grey console casing; all art original, nothing modelled on Game & Watch or Nintendo [product §8, §12][mockup Q4]
- **FR11.2** — New original pixel art for the mainframe, magnetic tape, and floppy disk. Every collectible and the VIRUS can be told apart by shape alone. Pass: in a greyscale screenshot, each object type is recognisable by its outline [product §8][Q9 of rough mockups]
- **FR11.3** — The original pixel font is extended with `%`, `.`, `:`, and a dash so the HUD and ending messages can be drawn [Q10]
- **FR11.4** — Effects: a short score pop-up and flash on a catch, a glitch effect on a VIRUS hit, and a warning when a life is lost [existing]
- **FR11.5** — The console and play area keep a fixed aspect ratio, scale to the largest size that fits the visible area, stay centred, and keep pixel edges sharp; rotating a smartphone re-fits the layout without resetting the game [existing]

### Sound

**FR12** — Original retro sound effects through the Web Audio API [product §8][scope S13]

- **FR12.1** — Keep the existing sounds (game start, catch per object kind, VIRUS hit, game over) [existing]
- **FR12.2** — Add sounds for the new collectibles, the stage clear, and the victory ending [scope S13]
- **FR12.3** — The first START press (key, click, or tap) also unlocks sound on smartphones, since the POWER press that used to do this is removed. Pass: on a smartphone, sound plays from the first stage onward [mockup Q1][existing]
- **FR12.4** — If sound cannot play, the game runs silently with no error [existing]

### Accessibility

**FR13** — Practical accessibility basics [mockup Q6][Q9]

- **FR13.1** — The casing title "AI CATCH" is the page's only top-level heading [mockup R-05]
- **FR13.2** — A hidden text element tells screen readers which screen is showing and its key values (for example "Stage 1 FORTRAN, AI 0%, score 300, 3 lives"), updated when the screen changes [Q9][mockup R-08]

## Non-Functional Requirements

**NFR1** — The game runs smoothly on a recent desktop browser and a recent smartphone, with a target of 60 frames per second. The exact browsers and devices are chosen by the developer during testing [Q8]

**NFR2** — The built game (everything downloaded to play) is under 1 MB [Q8][existing]

**NFR3** — The first screen appears within about 2 s on a normal connection [Q8]

**NFR4** — The game works on desktop and smartphone, in portrait and landscape, with the whole play area and HUD visible without scrolling [product §9][existing]

**NFR5** — The game needs no server-side processing, no external service, and no external AI API [product §9][scope S16]

**NFR6** — All characters, pixel art, UI, casing, and sounds are original or have a clear licence, with any external source and licence recorded [product §12]

**NFR7** — The game is published at a public URL: the source on a public GitHub repository with an open-source licence and the `/.kiro` directory committed, hosted on Cloudflare Pages [scope S16][practices]

**NFR8** — Game rules stay testable without a browser: they live in `src/game/` with no DOM or drawing code, and every new game-logic behaviour has a Vitest test written before its implementation. The existing test suite stays green [practices]

**NFR9** — Text on the LCD stays readable at the smallest supported screen size [mockup Q6]

## Constraints

- HTML5 Canvas, TypeScript, Web Audio API; Vite and Vitest [practices][existing]
- No new dependency library without the developer's approval [practices]
- No backend, database, accounts, rankings, multiplayer, or external AI APIs [product §11]
- Feature-complete and deployed by 2026-11-30; submission deadline 2026-12-04 2:00 PM PT [scope]
- One developer; no paid services [feasibility]

## Assumptions

- **A1** — The required counts, points, bonus, lives, difficulty values, and screen timings are starting values. Reason: the developer chose to tune them by playtesting [Q1-Q4, Q7].
- **A2** — Browsers usually stop updating a page in a hidden tab, so with no pause logic (FR1.8) the game will most likely appear frozen while the tab is hidden and continue when it returns. Reason: the existing loop follows the browser's frame updates; this is general browser behaviour, not checked in this project, and is confirmed during verification [Q7].
- **A3** — A collectible missed by HUMAN does not respawn; the stage keeps spawning new objects until the target is reached. Reason: with no miss penalty [Q5], the target is always reachable by catching later objects.
- **A4** — The mix of Stage 4 collectibles is an equal share of LLM, GPU, and ROBOT among non-VIRUS objects. Reason: the existing game splits them equally [existing].

## Out of Scope

- Rankings and leaderboards, user accounts, online multiplayer, backend services and databases, external AI APIs [product §11][intent]
- World ranking, daily challenges, play history, result sharing, Ghost Replay [scope]
- Pause [mockup R-09]
- Power-off screen and startup sequence [mockup Q1]
- Retrying from the stage where the run was lost [mockup Q2]
- Extra lives [Q2]
- Nice-to-have polish unless time remains: extra LCD flicker, glitch, and corruption effects; richer transition animations; different falling movement for new object types [scope]

## Open Questions

- The exact difficulty values per stage and their in-stage step size and cap (decided in design and tuned by playtesting).
- The form of the victory animation (FR9.3) and whether the "NEW!" high-score marker, the "REACHED STAGE" line, and the intro AI bar are kept (decided in design) [mockup R-06].
- Whether the console's on-screen `[ < ]` `[ > ]` marks are drawn as hints only (decided in design) [mockup R-02].
- The exact title story wording and "RECOVERED" wording (decided in design).
- CI checks before deploy (decided in the CI Pipeline stage) [practices].
