# Code Summary: u3-sound

Built from the approved `code-generation-plan.md` (9 steps) with no deviation. Branch `feature/u3-sound` (created with `git switch -c`, not committed).

## Files Changed

| File | Change |
|---|---|
| `src/audio/sound.ts` | Removed the `startup` cue from `SoundName` and `SOUNDS` (BR1.6). Added original square-wave cues `catch-mainframe`, `catch-tape`, `catch-floppy` (each ≤ 0.4 s), `stage-clear` (rising C5-E5-G5-C6, ≤ 1.0 s), and `victory` (2.0-3.0 s). Added the pure `soundForEvent(e: GameEvent): SoundName \| null` (type-only import, no DOM or audio access). Doc comments now say audio unlocks on the first START press. Existing cues and `SoundPlayer` scheduling (peak gain 0.12) unchanged. |
| `src/main.ts` | Sound section only: the inline `soundFor` is replaced by `soundForEvent`; unused `SoundName` and `GameEvent` imports removed. `sound.unlock()` still runs before `pressStart()` in the START button and Enter/Space handlers. |
| `tests/audio/sound.test.ts` | 5 → 15 tests: existing cues equal their literal note lists, new catch cues exist and are ≤ 0.4 s, six catch cues pairwise distinct, stage-clear rising and ≤ 1.0 s, victory 2.0-3.0 s, no `startup` key, note sanity for every cue, `soundForEvent` for every event type and catch kind, `SoundPlayer` silent without Web Audio (plays `game-start`). |
| `ASSETS.md` | Sounds section: every cue is an original note list generated at run time with the Web Audio API; no audio files, no third-party sounds. |

## TDD Evidence

- Step 2 baseline: `npx vitest run tests/audio` — 5 passed.
- Step 3 and 5 Red: `npx vitest run tests/audio/sound.test.ts` — 10 failed, 5 passed (missing cues, 4 of 6 unique catch cues, `startup` still present, `soundForEvent is not a function`). BR1.2 tests passed at Red by design (they pin existing values).
- Green: all 15 pass.

## Verification

- `npm run typecheck && npm test && npm run build`: pass; 13 test files, 178 tests.
- JS bundle 25.26 kB (8.26 kB gzip), +0.48 kB against U2.
- Not verified: audible behaviour. The developer still has to play in `npm run dev` on desktop and phone (distinct catch sounds, stage-clear and victory cues, silence before START on a phone, no break when muted). Plan Step 8 stays unticked until then.

## Loop-back 1 Repair (Step 10, 2026-11-13)

Reason: Build and Test run 1 measured 47.1% full-suite line coverage against the 80% floor; `src/audio/sound.ts` was 18/39 lines with `SoundPlayer` scheduling untested (`aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/build-and-test/test-results.md`, Loop-back 1).

| File | Change |
|---|---|
| `tests/audio/sound.test.ts` | 10 new tests with a hand-written fake `AudioContext` installed on `globalThis` and removed in `afterEach`: `unlock` creates once; resumes when `suspended` (a rejected `resume` is swallowed) and not when `running`; `play` before `unlock` does nothing; `play('virus-hit')` makes one square oscillator per note wired oscillator → gain → destination with start and stop times; slide notes ramp frequency, plain notes do not; gain peak exactly 0.12 and envelope ends at 0.0001 (NFR5.10); a throwing `createOscillator` stays silent (NFR5.8); `webkitAudioContext` fallback; a throwing constructor stays silent. |

`src/audio/sound.ts` is unchanged; no defect was found.

Verification: `npx vitest run tests/audio` 25/25; `npm run typecheck && npm test && npm run build` pass (16 files, 230 tests; JS 26.32 kB, 8.72 kB gzip, unchanged); `npm run coverage`: `sound.ts` 39/39 lines, full suite 597/690 lines (86.52%). These run in Node with a fake context; audible output is still the developer's play check (Step 8).
