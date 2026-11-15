# API Documentation

## External APIs
None. The game makes no network requests (`connect-src 'none'` in `public/_headers`) and exposes no HTTP, GraphQL, or RPC endpoints.

## Internal contracts (`src/game/types.ts`)

### C1 GameView (read-only, `types.ts:37-62`)
`phase`, `phaseTime`, `canReturnToTitle`, `score`, `lives`, `best`, `newHighScore`, `stage`, `stageIndex`, `caught`, `aiRestoration`, `human {x,y,w,h}`, `objects[] {kind,x,y,w,h}`. Consumed by `Renderer.draw` and `screenAnnouncement`.

### C2 GameEvent (`types.ts:65-73`)
`run-start`, `stage-start`, `catch`, `virus-hit`, `life-lost`, `stage-clear`, `victory`, `game-over`. A VIRUS hit emits `virus-hit` then `life-lost` (`state.ts:288-289`). Drained once per fixed step by `main.ts:113-119`.

### C3 Stage and difficulty (`types.ts:15-34`)
`DifficultyValues {fallSpeedMultiplier, spawnInterval, virusShare, maxObjects}`; `StageDefinition {stageNumber, name, collectibles, requiredCount, difficultyStart, difficultyCap, clearBonus}`.

### C4 GameControls (`types.ts:76-88`)
`pressStart()`, `inputDown(id, dir)`, `inputUp(id)`, `releaseAll()`, `update(dt)`, `drainEvents()`. None throws; non-finite or non-positive `dt` is ignored (`state.ts:141`).

## Pure function surfaces
| Function | Location | Contract |
|---|---|---|
| `difficultyAt(stage, stageTime)` | `difficulty.ts:12` | step-wise interpolation start to cap |
| `spawnObject / pickKind` | `spawner.ts:12,24` | VIRUS by share, else collectibles in equal parts; x uniform in [0, 224] |
| `createObject / stepObject / isBelowPlayArea` | `objects.ts:41,64,86` | object creation, motion, bottom test |
| `overlaps / resolveCollisions` | `collision.ts:9,26` | AABB overlap; one handled object per update |
| `recordCatch / advanceStage / newRun` | `run.ts` | stage progress and AI percentage |
| `soundForEvent` | `audio/sound.ts:106` | event to cue name |
| `screenAnnouncement` | `announcer.ts:39` | `{key, text}` for the live region |
| `fitCasing` | `render/layout.ts:21` | scale and offset of the 320x240 casing |
| `HighScoreStore` | `highscore.ts:20` | `best`, `submit(score)`, `load()` over `StorageLike` |

## Browser storage
- localStorage key `ai-catch:high-score` (`highscore.ts:7`); storage errors are swallowed and the score is kept in memory.

## CLI (npm scripts, `package.json`)
`dev`, `build`, `preview`, `typecheck`, `test`, `coverage`, `size`.
