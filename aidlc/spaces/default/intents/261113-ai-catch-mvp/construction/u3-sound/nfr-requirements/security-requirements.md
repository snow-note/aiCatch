# Security Requirements: u3-sound

Security, safety, and originality requirements for the sound unit (`src/audio/sound.ts` and the sound section of `src/main.ts`). Sources: NFR5, NFR6, NFR8 and FR12 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; contracts C2 and C5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u3-sound/functional-design/functional-spec.md` and `rules.md`; stack in `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`.

No stage questions were needed.

## Threat Context

The unit synthesizes short square-wave tones with the browser's Web Audio API. It loads no audio file, reads no user data, and talks to no service. Its only inputs are game events (C2) and a user gesture that unlocks audio.

## Requirements

| ID | Requirement | Check |
|---|---|---|
| NFR5.7 | No audio file, URL, or network request: every cue is an in-code note list. | Code review; network panel shows no audio request |
| NFR5.8 | `unlock` and `play` never throw: no Web Audio, a suspended or blocked context, or any API error leaves the game running silently. | Existing and extended unit tests under node (no AudioContext) |
| NFR5.9 | Audio starts only after a user gesture (first START press), as browsers require. | Code review of `main.ts`; phone play check |
| NFR5.10 | Volume stays modest: peak gain 0.12 per oscillator (existing), no cue louder than the existing ones. | Code review |
| NFR6.4 | Every cue is an original note sequence written for this game; no melody is copied from an existing game or song. No external sound source is used, so there is no source or licence to record; `ASSETS.md` states that sounds are code-defined and original. | Review of `SOUNDS` and `ASSETS.md` |
| NFR8.16 | `soundForEvent` is a pure function with no DOM or audio access. Each new cue and the mapping get a failing Vitest test before the implementation, and `npm test` stays green. | Unit tests |

NFR5.8 to NFR5.10 are safety requirements derived from FR12.3 and FR12.4 (and rules BR2.1, BR2.2); they are listed under NFR5 because they keep the unit free of any outside dependency at run time. NFR5.10 is a per-oscillator limit; overlapping cues may sum above it, which is accepted (short, infrequent overlaps).

## Not Applicable Here

| NFR | Reason |
|---|---|
| NFR1, NFR3, NFR4, NFR9 | Frame rate, load time, layout, readability are U2 and U5 |
| NFR7 | Publishing is U5 |
