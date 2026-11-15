# Component Inventory

## Console Shell
- Files: `index.html`, `src/style.css`
- Responsibility: casing, bezel, canvas element, POWER and START buttons, hint text. Fixed logical 320x240 casing scaled by script.
- Depends on: `main.ts` (script), `layout.ts` (scale applied inline).

## Bootstrap
- Files: `src/main.ts`
- Responsibility: composition root. Finds DOM elements, wires keyboard, pointer, buttons, resize; runs the fixed-step rAF loop; maps events to sounds and effects.
- Depends on: GameState, Renderer, SoundPlayer, HighScoreStore, Layout.

## GameState
- Files: `src/game/state.ts`
- Responsibility: phase machine, score, lives, elapsed time, object list, event queue, restart rules.
- Depends on: Config, Difficulty, Spawner, FallingObjects, Collision, InputTracker; injected high-score store.

## Config
- Files: `src/game/config.ts`
- Responsibility: all tunable constants (sizes, speeds, points, difficulty, durations).
- Depends on: none.

## FallingObjects
- Files: `src/game/objects.ts`
- Responsibility: object kinds, factory, per-kind motion (LLM and GPU straight, ROBOT sine sway, VIRUS jitter), bottom check.
- Depends on: Config.

## Spawner
- Files: `src/game/spawner.ts`
- Responsibility: choose next kind (VIRUS by share, else equal LLM/GPU/ROBOT) and random x.
- Depends on: Difficulty, FallingObjects, Config.

## Difficulty
- Files: `src/game/difficulty.ts`
- Responsibility: spawn interval, speed multiplier, and VIRUS share as functions of elapsed seconds.
- Depends on: Config.

## Collision
- Files: `src/game/collision.ts`
- Responsibility: AABB overlap and single-object resolution (VIRUS first, then earliest spawned).
- Depends on: none.

## InputTracker
- Files: `src/game/input.ts`
- Responsibility: tracks held keys and touches; latest held direction wins; detects new presses.
- Depends on: none.

## HighScoreStore
- Files: `src/game/highscore.ts`
- Responsibility: load and save best score with safe parsing and in-memory fallback.
- Depends on: injected `StorageLike`.

## Renderer
- Files: `src/render/renderer.ts`
- Responsibility: draws startup, title, playing, game over; HUD, seven-segment numbers, text, effects (popup, spark, glitch, warning, flash).
- Depends on: Sprites, Config, GameState (read only).

## Sprites
- Files: `src/render/sprites.ts`
- Responsibility: original bitmaps for HUMAN, LLM, GPU, ROBOT, VIRUS, LIFE; 3x5 font; seven-segment table.
- Depends on: none.

## Layout
- Files: `src/render/layout.ts`
- Responsibility: scale and center the casing in the visible viewport.
- Depends on: none.

## SoundPlayer
- Files: `src/audio/sound.ts`
- Responsibility: note-list sound table and Web Audio square-wave playback; failures swallowed.
- Depends on: Web Audio API.

## Usage Tracking Scripts
- Files: `scripts/aidlc_usage.py`, `scripts/aidlc_stage_usage_hook.py`, `scripts/aidlc_hook_event.py`, `tests/scripts/test_aidlc_usage.py`
- Responsibility: dev-time AI-DLC stage duration and credit tracking into `.usage/`. Not part of the game.
- Depends on: Python standard library; Kiro session logs.

## Test Suites
- Files: `tests/audio`, `tests/game`, `tests/render`
- Responsibility: Vitest unit tests for game rules, sprites, layout, sound table.
- Depends on: the modules under `src/` they mirror.
