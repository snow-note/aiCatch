# Business Overview
## Purpose
AI CATCH is a browser-based, retro handheld-style catching game. The player controls HUMAN, who moves left and right to catch falling items and avoid VIRUS, restoring a corrupted AI in four stages (`README.md`, `src/game/config.ts:68-105`).
## Domain Context
- Tagline: "SAVE THE AI. SAVE THE FUTURE." Story set in 2045; a VIRUS attack corrupts the AI and HUMAN restores it by recovering computing history (`README.md:1-12`).
- Four stages, each restoring 25% of AI (`config.ts:55`, `run.ts:30`):
| Stage | Name | Collectible | Required catches |
|---|---|---|---|
| 1 | FORTRAN | mainframe | 10 |
| 2 | COBOL | tape | 12 |
| 3 | BASIC | floppy | 14 |
| 4 | LLM | llm, gpu, robot | 16 |
- Clearing a stage gives +500 points (`config.ts:76,85,94,103`). Clearing Stage 4 gives AI 100% and the victory ending.
## Key Functionality
- Start screen, four-stage progression, score, 3 lives, game over, restart, local high score (`src/game/highscore.ts`).
- Keyboard (left/right arrows, Enter/Space) and touch (left/right half of the screen) controls (`src/main.ts:59-106`).
- Original pixel art, Web Audio sound effects, screen-reader announcements (`src/render/sprites.ts`, `src/audio/sound.ts`, `src/game/announcer.ts`).
- No backend, accounts, rankings, or external AI services; the high score is stored in the browser only.
## Game Rules Relevant to Difficulty (see architecture.md for the numbers)
- Touching a VIRUS costs one life; objects that reach the bottom vanish with no penalty (`state.ts:280-281`, `state.ts:296`).
- The only way a run ends in game over today is lives reaching 0 (`state.ts:299-302`). There is no time limit in a stage; a stage ends only by catching its required count (`run.ts:25-33`).
- START_LIVES is 3 (`config.ts:37`).
- Difficulty grows per stage and in 8-second steps within a stage, reaching the cap after 32 s of play (`config.ts:58-59`, `difficulty.ts:12-23`).
## Scoring (why a full clear is almost always about 8000)
- Points per catch: 100 for mainframe, tape, floppy, llm; 150 gpu; 200 robot (`config.ts:28-35`). Clear bonus 500 per stage. VIRUS hits and lost lives never change the score (`state.ts:296-298`).
- Stages 1-3 give a fixed (10 + 12 + 14) x 100 = 3600. Four bonuses give 2000. Stage 4 gives 16 catches drawn uniformly from llm/gpu/robot (`spawner.ts:17-20`), mean 2400, range 1600-3200, sd about 163.
- A full clear therefore scores 8000 on average (range 7200-8800), whatever the player's skill: the score depends on fixed required counts, not on speed or lives.
## Stakeholders and Delivery
- Single-developer project, MIT license (`package.json`, `LICENSE`), deployed to Cloudflare Pages via Git integration (`README.md` Publishing; CSP in `public/_headers`).
- Active intent (this run): per-stage 90 s time limit (game over at 0 s), Stage 2 as hard as Stage 4, and item fall speed 1.2-1.5x, because a clear almost always scores 8000 and Stage 4 feels about right (see code-quality-assessment.md "Intent Findings: stage time limit"). The earlier intent (first heart loss at 5-10 s) shaped the current Stage 1 values.
