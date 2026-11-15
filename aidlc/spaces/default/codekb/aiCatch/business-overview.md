# Business Overview
## Purpose
AI CATCH is a browser-based, retro handheld-style catching game. The player controls HUMAN, who moves left and right to catch falling items and avoid VIRUS, restoring a corrupted AI in four stages (`README.md`, `src/game/config.ts:68-109`).
## Domain Context
- Tagline: "SAVE THE AI. SAVE THE FUTURE." Story set in 2045; a VIRUS attack corrupts the AI and HUMAN restores it by recovering computing history (`README.md:1-12`; title screen text `renderer.ts:194-196`).
- Four stages, each restoring 25% of AI (`config.ts:55`, `run.ts:30`):
| Stage | Name | Collectible | Required catches |
|---|---|---|---|
| 1 | FORTRAN | mainframe | 10 |
| 2 | COBOL | tape | 12 |
| 3 | BASIC | floppy | 14 |
| 4 | LLM | llm, gpu, robot | 16 |
- Clearing a stage gives +500 points plus 10 points per whole second left (`config.ts:76,85,94,103,116`, `state.ts:213-214`). Clearing Stage 4 gives AI 100% and the victory ending.
## Key Functionality
- Start screen, four-stage progression, score, 3 lives, 90 s stage timer, game over (lives or time), restart, local high score (`src/game/highscore.ts`).
- Keyboard (left/right arrows, Enter/Space) and touch (left or right half of the casing area, `touchSide` in `render/layout.ts:89-91`, wired at `src/main.ts:144-157`) controls.
- Original pixel art, Web Audio sound effects, screen-reader announcements (`src/render/sprites.ts`, `src/audio/sound.ts`, `src/game/announcer.ts`).
- No backend, accounts, rankings, or external AI services; the high score is stored in the browser only.
## Victory Ending (active intent `261115-ending-message`)
- The product definition ends the game with "AI RESTORED — 100%", "HUMANS SAVED AI.", "SAVE THE AI. SAVE THE FUTURE." (`renderer.ts:309-311`). The intent replaces this completion message with a longer multi-paragraph narrative that starts "AI RESTORED!" and ends "The future is yours to code." (verbatim in the intent's `project-description.json`; 19 lines, 13 of text).
- Constraints from the intent: readable retro ending screen, scrolling or progressive text allowed, readable on desktop and mobile in portrait and landscape, gameplay and completion logic unchanged, no unrelated features.
- Current ending flow, timing, font limits and pinning tests are recorded once in architecture.md "Victory Ending Flow" and code-quality-assessment.md "Intent Findings: ending message".
## Game Rules (verified at `49efe17`, `src/game/` re-read this run)
- Touching a VIRUS costs one life; objects that reach the bottom vanish with no penalty (`state.ts:303-304,332-339`). A run ends in game over when lives reach 0 or the 90 s stage timer runs out (`state.ts:307`, `config.ts:112`).
- START_LIVES is 3 (`config.ts:37`).
- Difficulty grows per stage and in 8-second steps within a stage, reaching the cap after 32 s of play (`config.ts:58-59`, `difficulty.ts`).
## Scoring
- Points per catch: 100 for mainframe, tape, floppy, llm; 150 gpu; 200 robot (`config.ts:28-35`). Clear bonus 500 per stage plus the time bonus. VIRUS hits and lost lives never change the score.
- Prior-store estimate (before the time bonus): stages 1-3 give a fixed 3600, four bonuses give 2000, stage 4 gives 1600-3200 (mean 2400); a full clear scored about 8000 plus time bonus.
## Stakeholders and Delivery
- Single-developer project, MIT license (`package.json`, `LICENSE`), deployed to Cloudflare Pages via Git integration (`README.md` Publishing; CSP in `public/_headers`).
- Earlier intents: first heart loss at 5-10 s, the per-stage 90 s time limit (`a48cb16`), and responsive orientation handling (`49efe17`, "Harden layout for orientation changes and safe areas").
