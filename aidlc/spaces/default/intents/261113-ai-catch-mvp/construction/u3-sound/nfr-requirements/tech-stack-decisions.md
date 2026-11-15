# Tech Stack Decisions: u3-sound

The unit keeps the existing stack in `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`. No dependency is added. Design: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u3-sound/functional-design/functional-spec.md`, `rules.md`; requirements: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; contracts: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

| ID | Area | Decision | Rationale |
|---|---|---|---|
| NFR8.17 | Synthesis | Web Audio API square-wave `OscillatorNode` plus `GainNode` envelope (existing `SoundPlayer`) | Mandated stack (Web Audio); no files to license |
| NFR8.18 | Cue format | `Note[]` tables in `SOUNDS` | Existing; testable shape and length |
| NFR8.19 | Mapping | Pure `soundForEvent(e: GameEvent)` in `sound.ts` | Functional design Q1; testable under node |
| NFR2.3 | Size | No audio assets; a few hundred bytes of note tables | Keeps the build tiny |

Rejected: audio files or a sound library (asset licences, download size, new dependency), and an AudioWorklet synth (unnecessary for short tones).
