# Functional Design Questions: u3-sound

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`, `unit-of-work-story-map.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/refined-mockups/interaction-spec.md` (Sound Cues), and the existing `src/audio/sound.ts` and `src/main.ts`.

Already settled and not asked again: keep the existing game-start, per-kind catch, VIRUS, and game-over sounds; add catch tones for mainframe, magnetic tape, floppy disk, a rising stage-clear arpeggio, and a longer victory fanfare; remove the startup sound; unlock audio on the first START press; silent failure; square waves through Web Audio only.

## Q1. Where does the event-to-sound mapping live?

Today `soundFor(event)` is an inline function in `src/main.ts`, so it cannot be unit-tested.

A. Move it to a pure function `soundForEvent(e: GameEvent): SoundName | null` in `src/audio/sound.ts` and test it (every event type and every catch kind). `main.ts` keeps only the call in its sound section (C5).
B. Keep it inline in `main.ts` and check it by playing.
X. Other (please specify)

[Answer]: A

## Q2. How long are the stage-clear and victory sounds?

A. Stage clear: about 0.8 s, ending well inside the 2.5 s clear screen. Victory: about 2.5 s, started by the `victory` event so it plays over the reboot and restore steps and ends before the 3.5 s hold. Both are unit-tested against those limits.
B. Victory fanfare runs the full 3.5 s.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.
