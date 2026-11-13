# Announcement Rules: u4-accessibility

Rules for what the hidden live region says and when. Sources: FR13.2 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; AC6.1.9 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`; ADR-004 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/decisions.md`; C1, C5 and the no-throw rule in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; Screen Announcement table in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/refined-mockups/interaction-spec.md`; checklist items 9 and 10 in `accessibility-checklist.md`; `entities.md`; `functional-design-questions.md` [Qn].

```yaml
rules:
  - id: BR1.1
    statement: The announcement is built by a pure function screenAnnouncement(view) in src/game/announcer.ts that reads GameView only.
    category: constraint
    applies_to: screenAnnouncement
    trigger: every frame (called by Bootstrap)
    logic: "No DOM, audio, storage, or time access; equal views give equal results."
    violation: unit test or type check fails
    source: ADR-004, Q1
  - id: BR1.2
    statement: Each screen has one text shape, following the interaction spec.
    category: calculation
    applies_to: screenAnnouncement.text
    trigger: every call
    logic: "title -> 'AI CATCH. Press Start. Arrow keys to move. High score {best}.'; stage-intro -> 'Stage {n}, {NAME}. Collect {required} {items}. Avoid virus. AI {ai}%.'; playing -> 'Stage {n} {NAME}, AI {ai}%, score {score}, {caught} of {required}, {lives} lives'; stage-clear -> '{NAME} recovered. AI {ai}%.'; game-over -> 'Game over. AI {ai}%. Score {score}. High score {best}.'; victory -> 'AI restored, 100%. Humans saved AI. Save the AI, save the future. Score {score}.'"
    violation: unit test fails
    source: FR13.2, AC6.1.9
  - id: BR1.3
    statement: Stage items are named in plain words.
    category: calculation
    applies_to: screenAnnouncement.text (stage-intro)
    trigger: stage-intro
    logic: "Stage 1 'mainframes'; Stage 2 'magnetic tapes'; Stage 3 'floppy disks'; Stage 4 'LLM, GPU, and robot parts'."
    violation: unit test fails
    source: FR13.2
  - id: BR1.4
    statement: Lives use the singular form for one life.
    category: calculation
    applies_to: screenAnnouncement.text (playing)
    trigger: playing with lives = 1
    logic: "'1 life'; otherwise '{n} lives'."
    violation: unit test fails
    source: FR13.2
  - id: BR1.5
    statement: Game over and victory add 'New high score.' when newHighScore is true, matching the NEW! shown on screen.
    category: calculation
    applies_to: screenAnnouncement.text (game-over, victory)
    trigger: newHighScore true
    logic: "Append ' New high score.' to the text."
    violation: unit test fails
    source: FR13.2, FR10.1
  - id: BR1.6
    statement: No extra 'press any key' announcement is made on game over or victory.
    category: constraint
    applies_to: screenAnnouncement
    trigger: canReturnToTitle turns true
    logic: "canReturnToTitle is not read; key and text do not change."
    violation: unit test fails
    source: Q3
  - id: BR2.1
    statement: The key changes on entering a screen and when lives change during play, never on score or progress changes.
    category: calculation
    applies_to: screenAnnouncement.key
    trigger: every call
    logic: "key = '{phase}:{stageNumber}' plus ':{lives}' only when phase is playing."
    violation: unit test fails
    source: FR13.2, Q2, accessibility checklist item 10
  - id: BR2.2
    statement: Bootstrap writes the text to the live region only when the key differs from the last written key.
    category: policy
    applies_to: main.ts announcement section
    trigger: every frame after drawing
    logic: "if key !== lastKey: region.textContent = text; lastKey = key. The first frame writes the title text."
    violation: code review or screen-reader play check fails
    source: FR13.2, C5, Q2
  - id: BR2.3
    statement: The live region is written with textContent only.
    category: constraint
    applies_to: main.ts announcement section
    trigger: write
    logic: "No innerHTML or other markup insertion."
    violation: code review fails
    source: NFR5 (no injected markup)
  - id: BR2.4
    statement: Announcement failures are silent; the game keeps running.
    category: policy
    applies_to: main.ts announcement section
    trigger: missing #announcer or a failed DOM write
    logic: "Look up #announcer without throwing; if missing, skip writes; wrap the write in try/catch."
    violation: play check fails
    source: C5 no-throw rule
```

## Rules Summary

| ID | Rule | Source |
|---|---|---|
| BR1.1 | Pure builder in `src/game/announcer.ts` | ADR-004, Q1 |
| BR1.2 | One text shape per screen | FR13.2 |
| BR1.3 | Plain item names per stage | FR13.2 |
| BR1.4 | "1 life" singular | FR13.2 |
| BR1.5 | "New high score." on game over and victory | FR13.2 |
| BR1.6 | No extra press-any-key announcement | Q3 |
| BR2.1 | Key = screen (+ lives in play) | FR13.2, Q2 |
| BR2.2 | Write only when the key changes | FR13.2, C5 |
| BR2.3 | `textContent` only | NFR5 |
| BR2.4 | Silent failure | C5 |
