# Unit Test Instructions: Stage Time Limit and Difficulty Rebalance

## Framework and Configuration

- Vitest (existing), `environment: node`, config in `vitest.config.ts`. No configuration change is needed.
- Type check: `npm run typecheck`.

## Commands for This Work

Run the test files this work touches (exact paths):

```bash
npx vitest run tests/game/config.test.ts tests/game/spawner.test.ts tests/game/state.test.ts tests/game/announcer.test.ts tests/game/difficulty.test.ts tests/game/first-heart.test.ts tests/render/screen-timing.test.ts tests/render/renderer.test.ts tests/audio/sound.test.ts
```

Runnable before the first Red step (the files already exist):

```bash
npx vitest run tests/game/config.test.ts
```

## Tests to Write or Change (Minimal strategy, about 14)

| File | Test | Requirement |
|---|---|---|
| `tests/game/config.test.ts` | Stage 2-4 start and cap values pinned; ordering test kept | FR1.1, FR1.2 |
| `tests/game/config.test.ts` | Stage 1 values, required counts, bonus unchanged | FR1.3 |
| `tests/game/config.test.ts` | `collectibleSpeedFactor` 1.2/1.3/1.4/1.5 | FR2.1 |
| `tests/game/config.test.ts` | `STAGE_TIME_LIMIT` 90, `TIME_WARNING_SECONDS` 10, `TIME_BONUS_PER_SECOND` 10 | FR3.1, FR6.2, NFR1 |
| `tests/game/config.test.ts` | Stage 1 VIRUS reaction time at least 1.2 s | NFR2 |
| `tests/game/config.test.ts` | Minimum clear time per stage at most 60 s | NFR3 |
| `tests/game/spawner.test.ts` | Collectible gets the factor; VIRUS does not | FR2.1, FR2.2 |
| `tests/game/state.test.ts` | `timeLeft` 90 at play start, counts only during play | FR3.2, FR3.3, FR3.6 |
| `tests/game/state.test.ts` | Time-out ends in game over with reason `time` and lives left | FR3.4, FR5.1 |
| `tests/game/state.test.ts` | Clear wins a tie with time-out | FR3.5 |
| `tests/game/state.test.ts` | `time-warning` once each for 10..1 | FR4.3 |
| `tests/game/state.test.ts` | Clear adds `floor(timeLeft) x 10`; event has `timeBonus` | FR6.1 |
| `tests/game/announcer.test.ts` | Time-out text starts with `Time up. ` | FR5.3 |
| `tests/render/screen-timing.test.ts` | `timerText` and `timerVisible` | FR4.1, FR4.2 |
| `tests/audio/sound.test.ts` | `time-warning` maps to `time-tick` | FR4.3 |
| `tests/render/renderer.test.ts` | Playing and time-out game over screens draw | FR4.1, FR5.2 |

Existing pins to update to the new values: `config.test.ts` Stage 2-4 values and the 1.5 s floor, `spawner.test.ts` `slow.vy = PLAY_H / 4.0`, the clear-score expectation in `state.test.ts`, and fake views in `renderer.test.ts`. `difficulty.test.ts` pins Stage 1 only and should stay unchanged. `first-heart.test.ts` (NFR4) must stay green unchanged.

## Expected Coverage

The project floor is 80% line coverage (`vitest.config.ts`). Build and Test checks it on the full suite with `npm run coverage`; it is not judged by the command above. Never lower the threshold.

## Mocking and Test Data

- Use the existing fakes: the injected `random` function, the fake input, and the fake high-score store used in `state.test.ts`; the fake canvas context in `renderer.test.ts`.
- Drive time with `update(dt)` in small steps (for example 0.1 s) so phase changes happen at the expected moments.
- No external data or network.
