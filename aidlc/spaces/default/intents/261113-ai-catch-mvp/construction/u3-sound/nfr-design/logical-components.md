# Logical Components: u3-sound

Where the U3 NFR patterns apply. Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u3-sound/nfr-requirements/security-requirements.md`, `tech-stack-decisions.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u3-sound/functional-design/functional-spec.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

All components run in the player's browser tab inside the single static build.

| Component | File | Role | NFR patterns | Failure domain |
|---|---|---|---|---|
| SOUNDS table | `src/audio/sound.ts` | Original note lists | Code-defined only (SD3-1, SD3-5) | Compile time |
| soundForEvent | `src/audio/sound.ts` | Pure event-to-cue mapping | Default branch, tested (SD3-2, SD3-6) | Pure |
| SoundPlayer | `src/audio/sound.ts` | Web Audio unlock and playback | Guarded calls, low gain (SD3-2, SD3-4) | Audio only |
| Sound section of Bootstrap | `src/main.ts` | Unlock on START; play per event | Gesture-gated unlock (SD3-3) | One step's events |

## Isolation and Blast Radius

- A Web Audio failure silences sound only; drawing, rules, and announcements continue.
- The sound unit reads events and never changes game state.
- Shared resource: `src/main.ts`; U3 edits only its sound section (C5).
