# Entities: u3-sound

Entities for the sound unit. Owner and shape come from SoundPlayer and SoundCue in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; events from contract C2 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; scope from U3 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md` and `unit-of-work-story-map.md`; requirements FR12 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; stories in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`. Decisions from `functional-design-questions.md` [Qn].

```yaml
entities:
  - name: Note
    owner: SoundPlayer
    description: One square-wave tone inside a cue.
    identifier: none (value object)
    attributes:
      - { name: freq, type: decimal, required: true, min: 20, max: 4000, constraints: "Hz" }
      - { name: start, type: decimal, required: true, min: 0, constraints: "seconds from the cue start" }
      - { name: dur, type: decimal, required: true, min: 0.01, constraints: "seconds" }
      - { name: slideTo, type: decimal, required: false, min: 20, constraints: "Hz the note glides to" }

  - name: SoundCue
    owner: SoundPlayer
    description: A named, original note list played for one game event.
    identifier: name
    attributes:
      - { name: name, type: enum, required: true, unique: true, allowed: [game-start, catch-mainframe, catch-tape, catch-floppy, catch-llm, catch-gpu, catch-robot, virus-hit, stage-clear, victory, game-over] }
      - { name: notes, type: "list of Note", required: true, constraints: "non-empty" }
    derived:
      - { name: duration, logic: "max(start + dur) over notes" }
    constraints:
      - "Every catch cue is distinct from every other catch cue."
      - "stage-clear duration <= 1.0 s (fits the 2.5 s clear screen) [Q2]."
      - "victory duration between 2.0 s and 3.0 s (ends before the 3.5 s hold) [Q2]."
      - "game-over duration <= 2.0 s (existing)."
      - "The startup cue no longer exists."

  - name: AudioUnlockState
    owner: SoundPlayer
    description: Whether the Web Audio context exists and is running.
    identifier: none (one per page)
    attributes:
      - { name: context, type: "AudioContext or none", required: true, default: none }
    constraints:
      - "Created or resumed only from a user gesture: the first START press (key, click, or tap)."
```

## Summary

| Entity | Owner | Note |
|---|---|---|
| Note | SoundPlayer | One square-wave tone, optional glide |
| SoundCue | SoundPlayer | Eleven cues; startup removed; three new catch tones, stage clear, victory |
| AudioUnlockState | SoundPlayer | Context created on the first START press; failures leave it empty |

The mapping from `GameEvent` (C2) to `SoundCue.name` is the pure function `soundForEvent` in `src/audio/sound.ts` [Q1].
