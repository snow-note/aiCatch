# Unit Test Instructions: u3-sound

## Framework and Configuration

- Vitest 5.1.0 with the existing `vitest.config.ts` (`environment: node`, `include: tests/**/*.test.ts`). No configuration change and no new dependency.
- Node has no `AudioContext`, so the tests exercise the note tables, the pure mapping, and the silent-failure path only.

## How to Run This Unit's Tests

Run from the project root. Commands are scoped to this unit's test files.

```bash
npx vitest run tests/audio
```

Single file, for the Red/Green steps:

```bash
npx vitest run tests/audio/sound.test.ts
```

Type check (whole project; it also proves `startup` is gone from `SoundName`):

```bash
npm run typecheck
```

`npx vitest run tests/audio` runs on the unchanged tree before the first Red step (plan Step 2).

## Test Scope (Standard strategy)

| File | Component | Tests (approx.) |
|---|---|---|
| `tests/audio/sound.test.ts` (extended) | `SOUNDS` cue tables | existing 3 + 6-7 |
| `tests/audio/sound.test.ts` (extended) | `soundForEvent` | 5-6 |
| `tests/audio/sound.test.ts` (kept) | `SoundPlayer` silent failure | existing 1 (cue name updated) |

Each component covers the happy path and at least two edge cases (length boundaries, events with no cue, playing before unlock, no Web Audio). Audible output and the `main.ts` wiring are checked by playing (team practice).

## Expected Coverage Targets

The `mvp` scope floor is 80% line coverage, measured by Build and Test on the full suite. No coverage tool is installed (team practice; adding one needs the developer's approval), so this unit does not measure it. Every exported pure function in `sound.ts` has tests; Web Audio scheduling is play-checked.

## Mocking and Stubbing

- No Web Audio mock: `SoundPlayer` is tested only for not throwing when `AudioContext` is missing.
- `GameEvent` values are built literally in the C2 shape from `src/game/types.ts`.

## Test Data

- Existing cue note lists are copied into the test as literals so any change to them fails (BR1.2).
- Length limits come from the rules: 0.4 s (new catch cues), 1.0 s (stage clear), 2.0-3.0 s (victory), 2.0 s (game over).
