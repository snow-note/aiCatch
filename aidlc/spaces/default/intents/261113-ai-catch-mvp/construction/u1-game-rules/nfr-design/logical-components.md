# Logical Components: u1-game-rules

Component-level view of where the NFR patterns in `security-design.md` apply. Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/nfr-requirements/security-requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/nfr-requirements/tech-stack-decisions.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/functional-spec.md` (module placement), and `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

The unit is one in-process TypeScript library inside the single static web build. There is no service, process, or infrastructure boundary; every component below runs in the same browser tab.

## Inventory

| Component | File | Role | NFR patterns applied | Failure domain |
|---|---|---|---|---|
| Types | `src/game/types.ts` | Shared contract types (C1-C4), no runtime code | Type check is the contract test (NFR8.9) | Compile time only |
| Config and StageCatalog | `src/game/config.ts` | All tunables and the four stages | Catalogue monotonicity test (NFR8.10) | Compile time / test time |
| RunProgress | `src/game/run.ts` | Stage index, progress, AI % | Clamped values (SD-6) | Run state |
| Difficulty | `src/game/difficulty.ts` | Current values from stage and time | Invalid time → start values (SD-5) | Pure function |
| Spawner | `src/game/spawner.ts` | Next kind and position | Injected random (SD-2) | Pure function |
| FallingObjects | `src/game/objects.ts` | Kinds and motion | Position clamp (SD-6) | Object list |
| Collision | `src/game/collision.ts` | Touch resolution | Pure function | Pure function |
| InputTracker | `src/game/input.ts` | Held inputs | Duplicate and unknown ids ignored (SD-5) | Held list |
| HighScoreStore | `src/game/highscore.ts` | Best score | Untrusted text parse, swallowed storage errors (SD-3, SD-4) | Device storage |
| GameState | `src/game/state.ts` | Phases and play rules, `GameView`, `GameControls` | Guard clauses, clamps, bounded spawn loop (SD-5, SD-6, SD-7) | Whole session |

## Isolation and Blast Radius

- **Only external dependency**: `localStorage`, reached through `StorageLike`. Its failure is contained in HighScoreStore: the game continues with a session-only best (SD-4).
- **Shared resource**: the GameSession object. It is changed only through `GameControls`; consumers get the read-only `GameView` type (C1), so U2 and U4 cannot change it by mistake.
- **Blast radius of a rules bug**: the current tab's game only. No data leaves the device and nothing is shared between players.
- **No retries or circuit breakers**: there is no remote call to protect.
