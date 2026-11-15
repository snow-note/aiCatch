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

- Clearing a stage gives +500 points (`config.ts:76`). Clearing Stage 4 gives AI 100% and the victory ending.

## Key Functionality
- Start screen, four-stage progression, score, 3 lives, game over, restart, local high score (`src/game/highscore.ts`).
- Keyboard (left/right arrows, Enter/Space) and touch (left/right half of the screen) controls (`src/main.ts:59-106`).
- Original pixel art, Web Audio sound effects, screen-reader announcements (`src/render/sprites.ts`, `src/audio/sound.ts`, `src/game/announcer.ts`).
- No backend, accounts, rankings, or external AI services; the high score is stored in the browser only.

## Game Rules Relevant to Difficulty (see architecture.md for the numbers)
- Touching a VIRUS costs one life; objects that reach the bottom vanish with no penalty (`state.ts:271-272`, `state.ts:287`).
- Game over at 0 lives. START_LIVES is 3 (`config.ts:37`).
- Difficulty grows per stage and in 8-second steps within a stage (`config.ts:58-59`).

## Stakeholders and Delivery
- Single-developer project, MIT license (`package.json`, `LICENSE`), deployed to Cloudflare Pages via Git integration (`README.md` Publishing; CSP in `public/_headers`).
- Active intent (this run): make the first heart loss occur about 5-10 s into a typical first-time playthrough with the smallest effective changes (see code-quality-assessment.md "Intent Findings").
