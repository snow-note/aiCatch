# API Documentation
## External APIs
None. The game makes no network requests (`connect-src 'none'` in `public/_headers`) and exposes no HTTP, GraphQL, or RPC endpoints.
## Browser event surface (`src/main.ts`, re-read this run)
| Event / API | Source | Handler |
|---|---|---|
| `resize`, `orientationchange` (window) | `main.ts:103-104` | `scheduleRefit` (now, next frame, +300 ms) |
| `visualViewport` `resize` and `scroll` | `main.ts:105-106` | `scheduleRefit` |
| `pointerdown` (window, passive) | `main.ts:144-157` | ignored on buttons; mouse gives a direction-less press (`mouse:<id>`); touch direction from `touchSide(clientX, lastArea ?? viewport)` |
| `pointerup`, `pointercancel` | `main.ts:158-163` | release `touch:<id>` and `mouse:<id>` |
| `touchmove` (document, non-passive), `contextmenu` | `main.ts:166-167` | `preventDefault` |
| `keydown` / `keyup` / `blur` | `main.ts:120-138` | arrows move; Enter/Space call `pressStart`; repeat ignored; `blur` calls `releaseAll` |
| `click` on `#start-button` | `main.ts:109-113` | unlock sound, `pressStart`, blur button |
Any new press (key, touch, mouse) in `victory` or `game-over` after the phase duration returns to the title through `GameState.inputDown` (`state.ts:142-145`).
## Internal contracts (`src/game/types.ts`, re-read this run)
### C1 GameView (read-only, `types.ts:41-70`)
`phase`, `phaseTime`, `canReturnToTitle`, `score`, `lives`, `best`, `newHighScore`, `stage`, `stageIndex`, `caught`, `aiRestoration`, `timeLeft`, `gameOverReason`, `human {x,y,w,h}`, `objects[] {kind,x,y,w,h}`. Consumed by `Renderer.draw` and `screenAnnouncement`. `Phase` = `title | stage-intro | playing | stage-clear | victory | game-over` (`types.ts:6-12`).
### C2 GameEvent (`types.ts:73-82`)
`run-start`, `stage-start{stageIndex}`, `catch{kind,points,x,y}`, `virus-hit{x,y}`, `life-lost{lives}`, `stage-clear{stageIndex,bonus,timeBonus,aiRestoration}`, `time-warning{secondsLeft}`, `victory{score,newHighScore}`, `game-over{score,newHighScore,reason}`. Drained by `main.ts:170-176`; the renderer reacts to `catch`, `virus-hit`, `life-lost`, `run-start` only (`renderer.ts:122-145`); `soundForEvent` maps `victory` to the cue `victory` (`sound.ts:119`).
### C3 Stage and difficulty (`types.ts:15-36`)
`DifficultyValues {fallSpeedMultiplier, spawnInterval, virusShare, maxObjects}`; `StageDefinition {stageNumber, name, collectibles, requiredCount, difficultyStart, difficultyCap, clearBonus, collectibleSpeedFactor}`.
### C4 GameControls (`types.ts:85-97`)
`pressStart()`, `inputDown(id, dir)`, `inputUp(id)`, `releaseAll()`, `update(dt)`, `drainEvents()`. None throws; non-finite or non-positive `dt` is ignored (`state.ts:156`).
## Pure function surfaces
| Function | Location | Contract |
|---|---|---|
| `victoryStep(t)` | `screen-timing.ts:33` | returns reboot, restore, messages, or hold; boundaries at 1.5 / 2.5 / 3.5 s |
| `messagesShown(t)` | `screen-timing.ts:42` | 0 before 2.5 s, then +1 per 0.33 s, max 3 |
| `victoryBarFill(t)`, `noiseLines(t)` | `screen-timing.ts:55,61` | 75 to 100 and 6 to 0 over 1.5 s |
| `blinkOn(t)` | `screen-timing.ts:67` | true in the first half of each second |
| `hudTexts / reachedLine / timerText / timerVisible / barFill` | `screen-timing.ts` | HUD strings, `REACHED STAGE n NAME`, `T n`, timer blink, stage-clear bar |
| `fitCasing / fitArea / placeCasing / chooseFit / touchSide / orientationOf` | `layout.ts:38-96` | casing fit, safe-area area, last-valid-fit rule, touch half, orientation |
| `difficultyAt`, `spawnObject / pickKind`, `createObject / stepObject / isBelowPlayArea`, `overlaps / resolveCollisions` | `src/game/*` | re-read this run; contracts as in the prior store |
| `recordCatch / advanceStage / newRun` | `run.ts:25,36,13` | stage progress and AI percentage |
| `soundForEvent` | `audio/sound.ts:106` | event to cue name |
| `screenAnnouncement` | `announcer.ts:39` | `{key, text}`; key = `phase:stageNumber` (+ `:lives` while playing) |
| `HighScoreStore` | `highscore.ts` | `best`, `submit(score)` over `StorageLike` |
## Renderer contract (`src/render/renderer.ts:108-185`)
`new Renderer(canvas)` takes the 2D context once and turns off image smoothing; with a null context every method is a no-op. `draw(view, seconds)` fills 240 x 160 logical pixels (`PLAY_W`, `PLAY_H`) with the background and calls one screen method by phase. Private text API: `drawText(ctx, text, x, y, scale, color, centered)` (`:433-456`) and `textWidth(text, scale)` (`:428-430`).
## Announcer texts (`announcer.ts:17-37`)
- title: `AI CATCH. Press Start. Arrow keys to move. High score N.`; stage-intro, playing, stage-clear (`<NAME> recovered. AI n%.`), game-over (`[Time up. ]Game over. AI n%. Score N. High score N.[ New high score.]`).
- victory (default branch, `:35`): `AI restored, 100%. Humans saved AI. Save the AI, save the future. Score N.[ New high score.]`.
## Browser storage
- localStorage key `ai-catch:high-score` (`highscore.ts`); storage errors are swallowed and the score is kept in memory.
## CLI (npm scripts, `package.json`)
`dev`, `build`, `preview`, `typecheck`, `test`, `coverage`, `size`.
