# Sound Rules: u3-sound

Rules for when and what the game plays. Sources: FR12, FR12.1-FR12.4 and FR11.4 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; AC1.1.5, AC6.1.5, AC6.1.6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`; events (C2) and `main.ts` sections (C5) in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; `entities.md`; `functional-design-questions.md` [Qn].

```yaml
rules:
  - id: BR1.1
    statement: Each game event maps to at most one cue through the pure function soundForEvent.
    category: calculation
    applies_to: soundForEvent
    trigger: every drained GameEvent
    logic: "run-start -> game-start; catch mainframe -> catch-mainframe; catch tape -> catch-tape; catch floppy -> catch-floppy; catch llm -> catch-llm; catch gpu -> catch-gpu; catch robot -> catch-robot; virus-hit -> virus-hit; stage-clear -> stage-clear; victory -> victory; game-over -> game-over; stage-start and life-lost -> none."
    violation: unit test fails
    source: FR12, FR12.1, FR12.2
  - id: BR1.2
    statement: The existing game-start, LLM, GPU, ROBOT, VIRUS, and game-over cues are kept unchanged.
    category: constraint
    applies_to: SOUNDS
    trigger: definition
    logic: "Note lists identical to the existing ones."
    violation: unit test fails
    source: FR12.1
  - id: BR1.3
    statement: Mainframe, magnetic tape, and floppy disk each get a new short original catch tone, distinct from every other catch cue.
    category: constraint
    applies_to: SOUNDS
    trigger: definition
    logic: "Each new catch cue lasts at most 0.4 s and differs from the other five catch cues."
    violation: unit test fails
    source: FR12.2
  - id: BR1.4
    statement: The stage-clear cue is a rising arpeggio that ends inside the clear screen.
    category: constraint
    applies_to: SOUNDS.stage-clear
    trigger: definition
    logic: "Duration <= 1.0 s; each note higher than the one before."
    violation: unit test fails
    source: FR12.2
  - id: BR1.5
    statement: The victory cue is a longer fanfare that ends before the victory hold step.
    category: constraint
    applies_to: SOUNDS.victory
    trigger: definition
    logic: "2.0 s <= duration <= 3.0 s (VICTORY_DURATION is 3.5 s)."
    violation: unit test fails
    source: FR12.2
  - id: BR1.6
    statement: The startup cue is removed with the POWER button.
    category: constraint
    applies_to: SoundName
    trigger: definition
    logic: "'startup' is not a SoundName."
    violation: type check fails
    source: FR1.1
  - id: BR2.1
    statement: The first START press (Enter, Space, START button click or tap) unlocks audio.
    category: policy
    applies_to: SoundPlayer.unlock, main.ts sound section
    trigger: START press
    logic: "Call unlock() before pressStart() in the START button handler and in the Enter/Space key handler."
    violation: play check fails on a smartphone
    source: FR12.3
  - id: BR2.2
    statement: Sound failures are silent; the game keeps running.
    category: policy
    applies_to: SoundPlayer
    trigger: unlock or play
    logic: "No AudioContext, a blocked context, or any Web Audio error -> nothing plays, no error escapes."
    violation: unit test fails
    source: FR12.4
```

## Rules Summary

| ID | Rule | Source |
|---|---|---|
| BR1.1 | Event-to-cue mapping is a pure function | FR12 |
| BR1.2 | Existing cues kept | FR12.1 |
| BR1.3 | Three new distinct catch tones ≤ 0.4 s | FR12.2 |
| BR1.4 | Stage-clear rising arpeggio ≤ 1.0 s | FR12.2 |
| BR1.5 | Victory fanfare 2.0-3.0 s | FR12.2 |
| BR1.6 | Startup cue removed | FR1.1 |
| BR2.1 | First START unlocks audio | FR12.3 |
| BR2.2 | Silent failure | FR12.4 |
