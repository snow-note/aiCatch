# API Documentation

The app exposes no network API, no HTTP endpoints, and no public package API. The surfaces below are internal module contracts and browser integration points.

## GameState (`src/game/state.ts`)
- `new GameState({ random?, highScore? })`
- Fields: `phase` (`'power-off' | 'startup' | 'title' | 'playing' | 'game-over'`), `score`, `lives`, `elapsed`, `startupTime`, `gameOverTime`, `newHighScore`, `human`, `objects`; getters `best`, `canRestart`.
- `pressPower()`: power-off to startup.
- `pressStart()`: title or restartable game-over to playing.
- `inputDown(id, dir?)`, `inputUp(id)`: held key/touch tracking; a new press after game-over restarts.
- `update(dt)`: advance by seconds; ignores non-finite or non-positive `dt`.
- `drainEvents(): GameEvent[]`.
- `GameEvent` union: `power-on`, `game-start`, `catch {kind, points, x, y}`, `virus-hit {x, y}`, `life-lost {lives}`, `game-over {score, newHighScore}`.
- `HighScoreLike { best; submit(score): boolean }`.

## Game helpers
- `objects.ts`: `createObject(kind, x, order, speedMult?, phase?)`, `stepObject(o, dt)`, `isRescue(kind)`, `isBelowPlayArea(o)`; types `ObjectKind` (`llm|gpu|robot|virus`), `RescueKind`, `FallingObject`.
- `spawner.ts`: `pickKind(t, random)`, `spawnObject(t, order, random)`; type `Random`.
- `difficulty.ts`: `spawnInterval(t)`, `speedMultiplier(t)`, `virusShare(t)`.
- `collision.ts`: `overlaps(a, b)`, `resolveCollisions(human, objects)` returning `{handled, touched}`.
- `input.ts`: `InputTracker.press(id, dir?)`, `release(id)`, `direction()`, `clear()`.
- `highscore.ts`: `HighScoreStore(storage, key?)` with `load()`, `best`, `submit(score)`; `parseStoredScore(raw)`; `StorageLike`; `HIGH_SCORE_KEY = 'ai-catch:high-score'`.
- `config.ts`: tunable constants (play size 240x160, speeds, points, difficulty, durations).

## Rendering and audio
- `Renderer(canvas)`: `onEvent(e)`, `update(dt)`, `draw(state, nowSeconds)`.
- `fitCasing(viewportW, viewportH): Fit`; constants `CASING_W=320`, `CASING_H=240`.
- `sprites.ts`: bitmaps `HUMAN`, `LLM_MODEL`, `GPU`, `ROBOT`, `VIRUS`, `LIFE`, `OBJECT_SPRITES`, `SEVEN_SEGMENT`, `FONT`, `ALL_SPRITES`.
- `SoundPlayer`: `unlock()` (call from a user gesture), `play(name)`; `SOUNDS` note table; `soundDuration(notes)`. `SoundName`: `startup, game-start, catch-llm, catch-gpu, catch-robot, virus-hit, game-over`.

## Browser integration points (`src/main.ts`, `index.html`)
- DOM ids: `console`, `screen` (canvas), `power-button`, `start-button`; `data-testid` attributes on console, canvas, and both buttons.
- Keyboard: ArrowLeft/ArrowRight move; Enter/Space power or start.
- Pointer: touch left or right half of the window moves; mouse press only restarts after game over.
- Storage: `localStorage['ai-catch:high-score']` as a non-negative integer string.

## Dev tooling CLI (Python, not shipped)
- `python3 scripts/aidlc_usage.py start|end|report|backfill`
- `scripts/aidlc_stage_usage_hook.py`: reads PostToolUse JSON from stdin.
- `scripts/aidlc_hook_event.py <event>`: appends a JSON line to `.usage/hook-events.jsonl`.
