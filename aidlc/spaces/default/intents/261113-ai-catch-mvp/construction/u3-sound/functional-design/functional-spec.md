# Functional Specification: u3-sound

Behaviour of the sound unit: which original cue plays for which game event, when audio unlocks, and how failures stay silent. Data shapes are in `entities.md`, rules in `rules.md`.

Inputs: U3 scope in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md` and `unit-of-work-story-map.md`; stories in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`; FR12 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; SoundPlayer in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; C2 events and C5 sections in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; `functional-design-questions.md` (Q1 A, Q2 A).

## Stories Implemented

US1.1 (sound unlocked by the first START, AC1.1.5) and US6.1 (matching original sounds, silent fallback, AC6.1.5, AC6.1.6), per the story map.

## Module Placement

| File | Change |
|---|---|
| `src/audio/sound.ts` | `SoundName` without `startup`; new cues `catch-mainframe`, `catch-tape`, `catch-floppy`, `stage-clear`, `victory`; new pure `soundForEvent(e: GameEvent)`; doc comment updated (POWER no longer unlocks) |
| `src/main.ts` (sound section only, C5) | Replace inline `soundFor` with `soundForEvent`; START button and Enter/Space handlers call `sound.unlock()` before `pressStart()` (already the case after U1; kept) |
| `tests/audio/sound.test.ts` | Extended |

## Workflows

### W1 — Unlock

1. The player presses START (button, Enter, or Space).
2. Bootstrap calls `sound.unlock()`, then `state.pressStart()`.
3. `unlock` creates the `AudioContext` once (or resumes it when suspended). Any failure leaves it empty.

### W2 — Event to sound

1. Bootstrap drains the events once per step (existing loop).
2. For each event, `soundForEvent(e)` returns a cue name or none (BR1.1).
3. When a name is returned, `sound.play(name)` schedules its notes from `currentTime + 0.01` (existing).

### Timeline at the end of a run

| Time | Event | Cue |
|---|---|---|
| Stage 4 target reached | `catch`, `stage-clear` | catch tone, then stage-clear arpeggio (≤ 1.0 s) |
| +2.5 s | `victory` | victory fanfare (2.0-3.0 s), over the reboot and restore steps |
| +3.5 s after victory | (hold) | silence; PRESS ANY KEY |

Game over: `virus-hit` then `game-over` in the same step; the game-over cue (≤ 2.0 s) overlaps the end of the VIRUS cue, as today.

## Cue Design (starting values)

All original square-wave note lists, written for this game.

| Cue | Idea | Length |
|---|---|---|
| catch-mainframe | Two low "relay" blips (330 Hz, 392 Hz) | ~0.2 s |
| catch-tape | Short upward glide (440 → 660 Hz) like a reel spinning up | ~0.2 s |
| catch-floppy | Three quick mid "drive seek" clicks (587, 523, 784 Hz) | ~0.25 s |
| stage-clear | Rising arpeggio C5-E5-G5-C6 | ~0.8 s |
| victory | Rising fanfare in three phrases ending on a held high note | ~2.5 s |

## Edge Cases

| Case | Behaviour |
|---|---|
| No Web Audio (old browser, test runner) | `unlock` and `play` do nothing, no error (BR2.2) |
| Audio blocked until a gesture | First START unlocks; earlier events are silent |
| Several events in one step | Each schedules its own cue; overlapping is allowed |
| Unknown event type | `soundForEvent` returns none |

## Test Plan

- `soundForEvent`: every event type and every catch kind maps as BR1.1; `stage-start` and `life-lost` give none.
- Existing cues unchanged (compare with their note lists).
- All six catch cues distinct; new catch cues ≤ 0.4 s.
- `stage-clear` ≤ 1.0 s and rising; `victory` between 2.0 s and 3.0 s; `game-over` ≤ 2.0 s.
- Every note has positive frequency and length and non-negative start (existing).
- `SoundPlayer` never throws without Web Audio (existing).
- Play check: sounds on desktop and phone; silent on a phone before START; nothing breaks with sound muted.

## Story Mapping

| Story | Parts |
|---|---|
| US1.1 | W1 unlock |
| US6.1 | W2, cue design, silent fallback |
