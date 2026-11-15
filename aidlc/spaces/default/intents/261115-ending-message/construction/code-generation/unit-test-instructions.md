# Unit Test Instructions: Ending Message

## Framework and Configuration

- Vitest (existing), `environment: node`, config in `vitest.config.ts`. No configuration change and no new dependency.
- Type check: `npm run typecheck`.

## Commands for This Work

Run the test files this work touches (exact paths):

```bash
npx vitest run tests/render/ending.test.ts tests/render/screen-timing.test.ts tests/render/sprites.test.ts tests/render/renderer.test.ts tests/game/config.test.ts tests/game/state.test.ts tests/game/announcer.test.ts
```

Runnable before the first Red step (the file already exists):

```bash
npx vitest run tests/render/screen-timing.test.ts
```

## Tests to Write or Change (Minimal strategy, about 12)

| File | Test | Requirement |
|---|---|---|
| `tests/render/ending.test.ts` (new) | `ENDING_LINES` equals the 19 requested lines | FR1.1, FR1.2 |
| `tests/render/ending.test.ts` | Every character has a glyph in `FONT` | FR4.1 |
| `tests/render/ending.test.ts` | Every line fits 240 px at scale 1 | FR2.2, NFR1 |
| `tests/render/ending.test.ts` | `endingDuration(ENDING_LINES)` is 19.8 | FR2.3 |
| `tests/render/screen-timing.test.ts` | `endingView` reveals lines one by one with partial typing | FR2.1 |
| `tests/render/screen-timing.test.ts` | `endingView` never shows more than the window and keeps the newest line last | FR2.2 |
| `tests/render/screen-timing.test.ts` | After the message, the last window of lines shows in full; `victoryStep` is 'hold' from 22.3 s | FR2.4 |
| `tests/render/sprites.test.ts` | `,` `?` `'` glyphs exist and are 3 x 5 | FR4.1, NFR7 |
| `tests/render/renderer.test.ts` | Victory screen draws at 0.5, 2, 3, 10, 22, 25 s | FR1.3, FR2.4 |
| `tests/game/config.test.ts` | `VICTORY_DURATION` 22.3 equals restore end plus message length; ending tunables pinned | FR2.3, FR3.3, NFR4 |
| `tests/game/state.test.ts` | No return to title before 22.3 s; new press after it returns | FR3.1, FR3.2 |
| `tests/game/announcer.test.ts` | New short victory text, with and without the high-score suffix | FR5.1 |

Existing pins to update: `VICTORY_DURATION` 3.5 (`config.test.ts`), the 3.5 s return rule (`state.test.ts`), `victoryStep` 'hold' boundary and the `messagesShown` tests (`screen-timing.test.ts`), the victory announcer text (`announcer.test.ts`), and victory draw times (`renderer.test.ts`).

## Expected Coverage

The project floor is 80% line coverage (`vitest.config.ts`), checked by Build and Test with `npm run coverage` on the full suite, not by the command above. Never lower the threshold.

## Mocking and Test Data

- Pure helpers take plain arguments (time, lines, window size).
- `state.test.ts` uses the existing fakes and drives time with `update(dt)` in small steps.
- `renderer.test.ts` uses the existing fake 2D context.
- No DOM, network, or external data.
