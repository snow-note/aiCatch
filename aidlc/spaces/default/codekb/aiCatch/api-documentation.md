# API Documentation
## External APIs
None. The game makes no network requests (`connect-src 'none'` in `public/_headers`) and exposes no HTTP, GraphQL, or RPC endpoints.
## Browser event surface used for layout and input (`src/main.ts`)
| Event / API | Source | Handler |
|---|---|---|
| `resize` (window) | `main.ts:47` | `refit` |
| `orientationchange` (window) | `main.ts:48` | `refit` |
| `visualViewport` `resize` | `main.ts:49` | `refit` (optional chaining; no `scroll` listener) |
| `pointerdown` (window, passive) | `main.ts:87-100` | touch direction by `clientX < window.innerWidth / 2`; mouse press has no direction; ignored on buttons |
| `pointerup`, `pointercancel` | `main.ts:105-106` | release `touch:<id>` and `mouse:<id>` |
| `touchmove` (document, non-passive) | `main.ts:109` | `preventDefault` to stop scroll and pinch |
| `contextmenu` | `main.ts:110` | `preventDefault` |
| `keydown` / `keyup` / `blur` | `main.ts:63-81` | arrows, Enter/Space; `blur` calls `releaseAll` |
| `click` on `#start-button` | `main.ts:52-56` | unlock sound, `pressStart`, blur button |
Page-level declarations: viewport meta `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover` (`index.html:5-8`); `theme-color` `#1d2b3a` (`:9`). Not used anywhere in scope: `matchMedia`, `devicePixelRatio`, `screen.orientation`.
## Internal contracts (`src/game/types.ts`; carried over from `c41d919`, `src/game` not re-analyzed)
### C1 GameView (read-only, `types.ts:37-62`)
`phase`, `phaseTime`, `canReturnToTitle`, `score`, `lives`, `best`, `newHighScore`, `stage`, `stageIndex`, `caught`, `aiRestoration`, `human {x,y,w,h}`, `objects[] {kind,x,y,w,h}`. Consumed by `Renderer.draw` and `screenAnnouncement`. Commit `a48cb16` added `timeLeft` and `gameOverReason` (read by `renderer.ts` HUD and game-over screen).
### C2 GameEvent (`types.ts:65-73`)
`run-start`, `stage-start{stageIndex}`, `catch{kind,points,x,y}`, `virus-hit{x,y}`, `life-lost{lives}`, `stage-clear{stageIndex,bonus,aiRestoration}`, `victory{score,newHighScore}`, `game-over{score,newHighScore}`. Drained once per fixed step by `main.ts:113-119`. The renderer reacts to `catch`, `virus-hit`, `life-lost`, `run-start` only (`renderer.ts:119-142`).
### C3 Stage and difficulty (`types.ts:15-34`)
`DifficultyValues {fallSpeedMultiplier, spawnInterval, virusShare, maxObjects}`; `StageDefinition {stageNumber, name, collectibles, requiredCount, difficultyStart, difficultyCap, clearBonus}` (plus `collectibleSpeedFactor` since `a48cb16`).
### C4 GameControls (`types.ts:76-88`)
`pressStart()`, `inputDown(id, dir)`, `inputUp(id)`, `releaseAll()`, `update(dt)`, `drainEvents()`. None throws; non-finite or non-positive `dt` is ignored (`state.ts:142`).
## Pure function surfaces
| Function | Location | Contract |
|---|---|---|
| `fitCasing(viewportW, viewportH)` | `render/layout.ts:21` | returns `{scale, offsetX, offsetY, width, height}`; `scale = min(w/320, h/240)` unrounded; invalid or non-positive size gives scale 0 and finite offsets |
| `CASING_W`, `CASING_H` | `render/layout.ts:2-3` | 320, 240 |
| `hudTexts / reachedLine / timerText / timerVisible` | `screen-timing.ts` | HUD strings (`name`, `AI n%`, `caught/required`), `REACHED STAGE n NAME`, `T n`, timer blink |
| `blinkOn / barFill / victoryStep / messagesShown / noiseLines / victoryBarFill` | `screen-timing.ts` | display timing helpers, bad time treated as 0 |
| `difficultyAt(stage, stageTime)` | `difficulty.ts:12` | step-wise interpolation start to cap |
| `spawnObject / pickKind` | `spawner.ts:12,28` | VIRUS by share, else collectibles in equal parts; x uniform in [0, 224] |
| `createObject / stepObject / isBelowPlayArea` | `objects.ts:41,64,86` | object creation, motion, bottom test |
| `overlaps / resolveCollisions` | `collision.ts:9,26` | AABB overlap; one handled object per update |
| `recordCatch / advanceStage / newRun` | `run.ts:25,36,13` | stage progress and AI percentage |
| `soundForEvent` | `audio/sound.ts:106` | event to cue name |
| `screenAnnouncement` | `announcer.ts:39` | `{key, text}` for the live region |
| `HighScoreStore` | `highscore.ts:20` | `best`, `submit(score)`, `load()` over `StorageLike` |
## Renderer contract (`src/render/renderer.ts:108-125`)
`new Renderer(canvas)` takes the 2D context once and turns off image smoothing (`:116-118`); with a null context every method is a no-op. `draw(view, seconds)` paints 240 x 160 logical pixels (`PLAY_W`, `PLAY_H`) with no knowledge of CSS size, scale, or `devicePixelRatio`.
## Announcer texts (`announcer.ts:17-37`; carried over)
- title, stage-intro, playing, stage-clear, game-over, victory strings as in the prior store; key is `game-over:<stageNumber>`.
## Browser storage
- localStorage key `ai-catch:high-score` (`highscore.ts:7`); storage errors are swallowed and the score is kept in memory.
## CLI (npm scripts, `package.json`)
`dev`, `build`, `preview`, `typecheck`, `test`, `coverage`, `size`.
