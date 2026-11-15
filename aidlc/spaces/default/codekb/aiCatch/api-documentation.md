# API Documentation
## External APIs
None. The game makes no network requests (`connect-src 'none'` in `public/_headers`) and exposes no HTTP, GraphQL, or RPC endpoints.
## Internal contracts (`src/game/types.ts`)
### C1 GameView (read-only, `types.ts:37-62`)
`phase`, `phaseTime`, `canReturnToTitle`, `score`, `lives`, `best`, `newHighScore`, `stage`, `stageIndex`, `caught`, `aiRestoration`, `human {x,y,w,h}`, `objects[] {kind,x,y,w,h}`. Consumed by `Renderer.draw` and `screenAnnouncement`. `phaseTime` is seconds since the phase began (`types.ts:39-40`); during `playing` it equals the in-stage play time because it resets when `playing` starts (`state.ts:148-150`). The private `stageTime` (`state.ts:62`) is not part of the view. There is no remaining-time field.
### C2 GameEvent (`types.ts:65-73`)
`run-start`, `stage-start{stageIndex}`, `catch{kind,points,x,y}`, `virus-hit{x,y}`, `life-lost{lives}`, `stage-clear{stageIndex,bonus,aiRestoration}`, `victory{score,newHighScore}`, `game-over{score,newHighScore}`. A VIRUS hit emits `virus-hit` then `life-lost` (`state.ts:297-298`), then `game-over` at 0 lives (`state.ts:300`); the `game-over` event has no reason field. A clear catch emits `catch` then `stage-clear` (`state.ts:289,199`). Drained once per fixed step by `main.ts:113-119`. The renderer reacts to `catch`, `virus-hit`, `life-lost`, `run-start` only (`renderer.ts:119-142`).
### C3 Stage and difficulty (`types.ts:15-34`)
`DifficultyValues {fallSpeedMultiplier, spawnInterval, virusShare, maxObjects}`; `StageDefinition {stageNumber, name, collectibles, requiredCount, difficultyStart, difficultyCap, clearBonus}`. There is no time-limit field in `StageDefinition`.
### C4 GameControls (`types.ts:76-88`)
`pressStart()`, `inputDown(id, dir)`, `inputUp(id)`, `releaseAll()`, `update(dt)`, `drainEvents()`. None throws; non-finite or non-positive `dt` is ignored (`state.ts:142`).
## Pure function surfaces
| Function | Location | Contract |
|---|---|---|
| `difficultyAt(stage, stageTime)` | `difficulty.ts:12` | step-wise interpolation start to cap; invalid time gives start values |
| `spawnObject / pickKind` | `spawner.ts:12,28` | VIRUS by share, else collectibles in equal parts; x uniform in [0, 224]; one third of VIRUS aimed at HUMAN |
| `createObject / stepObject / isBelowPlayArea` | `objects.ts:41,64,86` | object creation (`vy = 160 / FALL_TIME x mult`), motion, bottom test |
| `overlaps / resolveCollisions` | `collision.ts:9,26` | AABB overlap; one handled object per update |
| `recordCatch / advanceStage / newRun` | `run.ts:25,36,13` | stage progress and AI percentage |
| `soundForEvent` | `audio/sound.ts:106` | event to cue name |
| `screenAnnouncement` | `announcer.ts:39` | `{key, text}` for the live region |
| `hudTexts / reachedLine` | `screen-timing.ts:74,87` | HUD strings (`name`, `AI n%`, `caught/required`); `REACHED STAGE n NAME` |
| `blinkOn / barFill / victoryStep / messagesShown / noiseLines / victoryBarFill` | `screen-timing.ts:32-71` | display timing helpers, bad time treated as 0 |
| `fitCasing` | `render/layout.ts:21` | scale and offset of the 320x240 casing |
| `HighScoreStore` | `highscore.ts:20` | `best`, `submit(score)`, `load()` over `StorageLike` |
## Announcer texts (`announcer.ts:17-37`)
- title: `AI CATCH. Press Start. Arrow keys to move. High score N.`
- stage-intro: `Stage n, NAME. Collect REQ ITEMS. Avoid virus. AI x%.`
- playing: `Stage n NAME, AI x%, score s, c of REQ, L lives|life`
- stage-clear: `NAME recovered. AI x%.`
- game-over: `Game over. AI x%. Score s. High score b.[ New high score.]` (`:32-33`). Key is `game-over:<stageNumber>` (`:42`).
- victory: `AI restored, 100%. Humans saved AI. Save the AI, save the future. Score s.[ New high score.]`
## Browser storage
- localStorage key `ai-catch:high-score` (`highscore.ts:7`); storage errors are swallowed and the score is kept in memory.
## CLI (npm scripts, `package.json`)
`dev`, `build`, `preview`, `typecheck`, `test`, `coverage`, `size`.
