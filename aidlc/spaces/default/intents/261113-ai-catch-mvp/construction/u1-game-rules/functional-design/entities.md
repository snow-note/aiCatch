# Entities: u1-game-rules

Entity model for the four-stage game rules. Entity names and owners come from `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; shapes that cross unit boundaries follow `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md` (C1-C4). Scope is the U1 unit in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`; behaviour comes from `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md` and the stories in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md` mapped in `unit-of-work-story-map.md`. Decisions from `functional-design-questions.md` are tagged [Qn].

All numbers marked "starting value" are tunable and live in the general constants (Config) or the stage catalogue. Positions and sizes are in play-area logical pixels (240 × 160, origin top-left), the coordinate space the view (C1) exposes.

```yaml
entities:
  - name: GameSession
    owner: GameState
    description: The single game for one page load. Holds the screen phase, the current run's score and lives, the play-area contents, and the event queue.
    identifier: session (exactly one per page load)
    attributes:
      - { name: phase, type: enum, required: true, allowed: [title, stage-intro, playing, stage-clear, victory, game-over], default: title }
      - { name: phaseTime, type: decimal, required: true, default: 0, min: 0, constraints: "seconds since the current phase began; reset to 0 on every phase change" }
      - { name: stageTime, type: decimal, required: true, default: 0, min: 0, constraints: "seconds of play in the current stage; advances only in phase playing; drives difficulty" }
      - { name: score, type: integer, required: true, default: 0, min: 0 }
      - { name: lives, type: integer, required: true, default: "START_LIVES (starting value 3)", min: 0, max: START_LIVES }
      - { name: newHighScore, type: boolean, required: true, default: false, constraints: "set only when entering game-over or victory" }
      - { name: human, type: Human, required: true }
      - { name: objects, type: "list of FallingObject", required: true, default: empty, constraints: "length never above the current maxObjects after a spawn" }
      - { name: spawnTimer, type: decimal, required: true, default: 0, min: 0, constraints: "internal; seconds accrued toward the next spawn" }
      - { name: nextOrder, type: integer, required: true, default: 0, min: 0, constraints: "internal; next FallingObject.order" }
      - { name: events, type: "list of GameEvent", required: true, default: empty, constraints: "emptied by drainEvents" }
    derived:
      - { name: canReturnToTitle, logic: "phase is game-over and phaseTime >= GAME_OVER_DURATION, or phase is victory and phaseTime >= VICTORY_DURATION" }
      - { name: best, logic: "HighScore.best, or 0 when no store is given" }
    constraints:
      - "Nothing spawns or moves while phase is title, stage-intro, stage-clear, victory, or game-over."
      - "objects is empty in every phase except playing."
    relationships:
      - { to: Run, cardinality: "1..1", direction: "GameSession holds the current Run" }
      - { to: FallingObject, cardinality: "0..*", direction: "GameSession holds the objects currently falling" }
      - { to: HeldInput, cardinality: "0..*", direction: "GameSession tracks held inputs through InputTracker" }
      - { to: HighScore, cardinality: "0..1", direction: "GameSession reads and submits to an injected store" }

  - name: Human
    owner: GameState
    description: The player character at the bottom of the play area. A value held inside GameSession.
    identifier: none (part of GameSession)
    attributes:
      - { name: x, type: decimal, required: true, default: "(PLAY_W - HUMAN_W) / 2", min: 0, max: "PLAY_W - HUMAN_W" }
      - { name: y, type: decimal, required: true, default: "PLAY_H - HUMAN_H", constraints: "fixed" }
      - { name: w, type: integer, required: true, default: "HUMAN_W (20)" }
      - { name: h, type: integer, required: true, default: "HUMAN_H (20)" }

  - name: Run
    owner: RunProgress
    description: One play from START to game over or victory. Its position in the four-stage story.
    identifier: run (one per press of START on the title)
    attributes:
      - { name: stageIndex, type: integer, required: true, default: 0, min: 0, max: 3 }
      - { name: caught, type: integer, required: true, default: 0, min: 0, constraints: "<= current stage requiredCount; reset to 0 only when the next stage begins" }
      - { name: aiRestoration, type: integer, required: true, default: 0, allowed: [0, 25, 50, 75, 100], constraints: "AI_RESTORATION_STEP (25) x stages cleared" }
      - { name: complete, type: boolean, required: true, default: false, constraints: "true once Stage 4 is cleared" }
    derived:
      - { name: stage, logic: "StageCatalog entry at stageIndex" }
      - { name: stageCleared, logic: "caught >= stage.requiredCount" }
    relationships:
      - { to: StageDefinition, cardinality: "1..1", direction: "a Run is on exactly one StageDefinition at a time" }

  - name: StageDefinition
    owner: StageCatalog
    description: Fixed data for one stage, kept in the stage catalogue in Config (contract C3). Read-only.
    identifier: stageNumber
    attributes:
      - { name: stageNumber, type: integer, required: true, unique: true, allowed: [1, 2, 3, 4] }
      - { name: name, type: enum, required: true, unique: true, allowed: [FORTRAN, COBOL, BASIC, LLM] }
      - { name: collectibles, type: "list of ObjectKind", required: true, constraints: "non-empty; never contains virus; Stage 1 [mainframe], Stage 2 [tape], Stage 3 [floppy], Stage 4 [llm, gpu, robot]" }
      - { name: requiredCount, type: integer, required: true, min: 1, default: "starting values 10, 12, 14, 16" }
      - { name: difficultyStart, type: DifficultyValues, required: true }
      - { name: difficultyCap, type: DifficultyValues, required: true, constraints: "equal to or harder than difficultyStart on every value" }
      - { name: clearBonus, type: integer, required: true, min: 0, default: "starting value 500" }
    constraints:
      - "The catalogue holds exactly four stages, ordered by stageNumber 1-4."
      - "For n = 1..3, stage n+1 is equal to or harder than stage n on every value of difficultyStart and of difficultyCap, and strictly harder on at least one value."

  - name: DifficultyValues
    owner: StageCatalog
    description: Value object with the four difficulty values (contract C3). Also the shape Difficulty returns for the current moment.
    identifier: none (value object)
    attributes:
      - { name: fallSpeedMultiplier, type: decimal, required: true, min: 0.1, constraints: "harder = larger" }
      - { name: spawnInterval, type: decimal, required: true, min: 0.1, constraints: "seconds; harder = smaller" }
      - { name: virusShare, type: decimal, required: true, min: 0, max: 1, constraints: "harder = larger" }
      - { name: maxObjects, type: integer, required: true, min: 1, constraints: "harder = larger" }

  - name: FallingObject
    owner: FallingObjects
    description: One object falling in the play area.
    identifier: order (spawn sequence number, unique within a session)
    attributes:
      - { name: order, type: integer, required: true, unique: true, min: 0 }
      - { name: kind, type: ObjectKind, required: true, allowed: [mainframe, tape, floppy, llm, gpu, robot, virus] }
      - { name: x, type: decimal, required: true, min: 0, max: "PLAY_W - OBJECT_W" }
      - { name: y, type: decimal, required: true, min: 0 }
      - { name: w, type: integer, required: true, default: "OBJECT_W (16)" }
      - { name: h, type: integer, required: true, default: "OBJECT_H (16)" }
      - { name: baseX, type: decimal, required: true, constraints: "centre line of sideways movement; internal" }
      - { name: age, type: decimal, required: true, default: 0, min: 0, constraints: "internal" }
      - { name: vy, type: decimal, required: true, constraints: "PLAY_H / FALL_TIME[kind] x fallSpeedMultiplier at spawn" }
      - { name: phase, type: decimal, required: true, default: 0, constraints: "random phase for VIRUS jitter; internal" }
    constraints:
      - "mainframe, tape, floppy, llm, gpu fall straight; robot sways; virus jitters (existing motion kept)."
      - "Removed once y >= PLAY_H."

  - name: HeldInput
    owner: InputTracker
    description: One key or touch currently held down.
    identifier: inputId (key code or pointer id)
    attributes:
      - { name: inputId, type: string, required: true, unique: true }
      - { name: direction, type: enum, required: false, allowed: [-1, 1, null], constraints: "null for a non-direction source" }
      - { name: pressOrder, type: integer, required: true, constraints: "position in the held list; most recent last" }

  - name: HighScore
    owner: HighScoreStore
    description: The best score on this device.
    identifier: storageKey ("ai-catch:high-score")
    attributes:
      - { name: storageKey, type: string, required: true, unique: true }
      - { name: best, type: integer, required: true, default: 0, min: 0, constraints: "an invalid or unreadable stored value counts as 0" }
```

## Summary

| Entity | Owner | Lifetime | Key point |
|---|---|---|---|
| GameSession | GameState | page load | Phase, phase and stage timers, score, lives, objects, events |
| Human | GameState | page load | Player box at the bottom, clamped inside the play area |
| Run | RunProgress | one run | Stage index 0-3, progress, AI % in 25% steps, complete flag |
| StageDefinition | StageCatalog | fixed | Four stages; collectibles, required count, difficulty start and cap, bonus |
| DifficultyValues | StageCatalog | value | Speed, interval, VIRUS share, max objects |
| FallingObject | FallingObjects | spawn to catch or bottom | Seven kinds; three new kinds fall straight |
| HeldInput | InputTracker | press to release | Most recent direction wins; all cleared on focus loss |
| HighScore | HighScoreStore | device | Safe fallback to session memory |

Shared contract types (`ObjectKind`, `Phase`, `GameView`, `GameEvent`, `DifficultyValues`, `StageDefinition`, `GameControls`) are declared in one type-only file, `src/game/types.ts`, which every other game file imports; this removes the `config.ts` / `objects.ts` import loop [Q1].
