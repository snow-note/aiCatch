# Business Overview

## Product
AI CATCH is a browser-based retro handheld-style catching game. The player controls HUMAN, who moves left and right at the bottom of a single LCD-style screen and catches falling objects. Evidence: `index.html`, `src/main.ts`, `original_spec.md`.

## Current Behavior (as built)
- Four falling object kinds: LLM (100 points), GPU (150), ROBOT (200), and VIRUS (costs one life). Values in `src/game/config.ts`.
- Three lives. Lives reaching zero ends the game.
- Endless play: difficulty rises every 15 seconds through faster fall speed and shorter spawn interval. VIRUS first appears at 10 seconds (`difficulty.ts`).
- Screens: power-off, startup animation, title, playing, game over (`state.ts`).
- Local high score in `localStorage` (`highscore.ts`).
- Retro presentation: monochrome LCD palette, pixel sprites, seven-segment score, console casing, glitch and warning effects (`renderer.ts`, `style.css`).
- Original square-wave sound effects through Web Audio, no audio files (`sound.ts`).
- Controls: Left/Right arrows, Enter/Space for start, touch on left/right half of the screen, POWER and START buttons.

## Gap To The Target Product
The target (see `.kiro/steering/product.md`, outside this scan) is a four-stage story game: FORTRAN (mainframes), COBOL (magnetic tapes), BASIC (floppy disks), LLM (LLM, GPU, ROBOT), each stage restoring 25% of the AI, with a victory ending. The existing code covers only the Stage 4 collectibles as an endless mode. It has no stages, objectives, restoration percentage, stage transitions, or victory ending.

## Reusable Business Capabilities
- Catch and avoid loop, lives, score, game over and restart.
- High score persistence with in-memory fallback.
- Keyboard and touch input, responsive casing fit.
- Retro effects: glitch, warning blink, catch spark and popup.

## Origin
`original_spec.md` (Japanese) is the Kiroween 2026 spec: category Resurrection, tagline "SAVE THE AI. SAVE THE FUTURE.", no AI needed at runtime, original assets only, ranking and online features out of the first version.
