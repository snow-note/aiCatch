# Business Rules: u1-game-rules

Rules for the four-stage game logic. Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md` (FR/NFR), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md` (AC), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md` (C1-C4), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`, the U1 scope in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md` and `unit-of-work-story-map.md`, and `functional-design-questions.md` [Qn]. Entities are in `entities.md`.

```yaml
rules:
  # BR1 - Screen phases and run lifecycle
  - id: BR1.1
    statement: The session starts on the title. There is no power-off or startup phase.
    category: policy
    applies_to: GameSession.phase
    trigger: session created
    logic: "IF a GameSession is created THEN phase = title, phaseTime = 0, Run at Stage 1 with caught 0 and AI 0%, score 0, lives START_LIVES."
    violation: not applicable (initial value)
    source: FR1.1
  - id: BR1.2
    statement: START on the title begins a new run at Stage 1.
    category: policy
    applies_to: GameControls.pressStart
    trigger: pressStart while phase is title
    logic: "IF phase = title THEN reset Run (stageIndex 0, caught 0, aiRestoration 0, complete false), score 0, lives START_LIVES, newHighScore false, objects empty; emit run-start; enter stage-intro (BR1.4)."
    violation: pressStart in any other phase does nothing, except BR1.6
    source: FR1.2, FR1.7, FR5.1
  - id: BR1.3
    statement: An arrow key or any inputDown on the title never starts a run.
    category: validation
    applies_to: GameControls.inputDown
    trigger: inputDown while phase is title
    logic: "IF phase = title THEN record the held input only; phase stays title."
    violation: ignored silently
    source: FR1.2
  - id: BR1.4
    statement: Each stage begins with a timed stage intro that ignores input and then starts play on its own.
    category: policy
    applies_to: GameSession.phase
    trigger: entering stage-intro; update during stage-intro
    logic: "ON entering stage-intro: phaseTime = 0, objects empty, spawnTimer = 0, stageTime = 0, Human to bottom centre; emit stage-start with stageIndex. IF phaseTime >= STAGE_INTRO_DURATION (starting value 2.0 s) THEN phase = playing, phaseTime = 0."
    violation: input during the intro changes nothing but held-input tracking
    source: FR1.3
  - id: BR1.5
    statement: The stage-clear screen is timed and then moves to the next stage intro, or to victory after Stage 4.
    category: policy
    applies_to: GameSession.phase
    trigger: update during stage-clear
    logic: "IF phaseTime >= STAGE_CLEAR_DURATION (starting value 2.5 s) THEN IF Run.complete THEN enter victory (BR2.7) ELSE stageIndex + 1, caught 0, enter stage-intro (BR1.4)."
    violation: input during stage-clear is ignored
    source: FR1.4, FR3.7
  - id: BR1.6
    statement: Game over and victory return to the title on a new press once their sequence ends; a key held from play is not a new press.
    category: policy
    applies_to: GameControls.pressStart, GameControls.inputDown
    trigger: pressStart, or inputDown that InputTracker reports as new, while phase is game-over or victory
    logic: "IF canReturnToTitle (game-over: phaseTime >= GAME_OVER_DURATION 2.0 s; victory: phaseTime >= VICTORY_DURATION 3.5 s) THEN enter title: phaseTime 0, Run reset to Stage 1 / caught 0 / AI 0%, score 0, lives START_LIVES, newHighScore false. A repeated inputDown for an id already held is not new."
    violation: a press before canReturnToTitle, or a held key, does nothing
    source: FR1.7
  - id: BR1.7
    statement: There is no pause; time advances only through update(dt).
    category: constraint
    applies_to: GameControls.update
    trigger: update(dt)
    logic: "IF dt is not finite or dt <= 0 THEN ignore the call ELSE advance phaseTime by dt (and stageTime in playing). No method pauses or freezes the game."
    violation: an invalid dt is ignored silently
    source: FR1.8
  - id: BR1.8
    statement: The read-only view exposes values per phase exactly as contract C1 tabulates them.
    category: constraint
    applies_to: GameView
    trigger: any read
    logic: "IF phase = stage-clear THEN stage is the stage just cleared, caught = requiredCount, aiRestoration already raised. IF phase = stage-intro or playing THEN aiRestoration is the value before this stage. stageIndex advances and caught resets only when the next stage-intro begins. Reading never changes state or throws."
    violation: not applicable
    source: FR7.2, FR8.2
  - id: BR1.9
    statement: One physical press causes at most one phase transition; the press that returns to the title never also starts a run.
    category: constraint
    applies_to: GameControls.pressStart, GameControls.inputDown
    trigger: Bootstrap reports Enter or Space as inputDown followed by pressStart in the same key event
    logic: "ON entering title through BR1.6, set titleEnteredByPress = true. IF pressStart arrives while phase = title AND titleEnteredByPress THEN ignore it and clear the flag. Every update(dt) with a valid dt clears the flag, so the next separate press starts a run."
    violation: the second call of the same press is ignored silently
    source: FR1.7
  - id: BR1.10
    statement: Timer and step boundaries tolerate floating-point error.
    category: calculation
    applies_to: GameSession.phaseTime, GameSession.stageTime
    trigger: any timed comparison
    logic: "A duration D is reached when phaseTime >= D - EPS (EPS = 1e-9). Difficulty steps use n = floor((stageTime + EPS) / DIFFICULTY_STEP_SECONDS). With the fixed step of 1/60 s, a boundary is never missed by one frame."
    violation: not applicable
    source: FR1.3, FR1.4, FR6.2

  # BR2 - Stages, progress, AI restoration
  - id: BR2.1
    statement: The stage catalogue has four stages in fixed order with their collectibles and required counts.
    category: constraint
    applies_to: StageDefinition
    trigger: catalogue definition
    logic: "Stage 1 FORTRAN [mainframe] 10; Stage 2 COBOL [tape] 12; Stage 3 BASIC [floppy] 14; Stage 4 LLM [llm, gpu, robot] 16 (starting values). Every stage clearBonus 500 (starting value). No stage lists virus."
    violation: a unit test fails on a catalogue that breaks this shape
    source: FR3, FR3.1, FR3.2, FR3.3, FR3.4, FR3.5
  - id: BR2.2
    statement: Each catch of a current-stage collectible adds 1 to progress; in Stage 4 the three kinds share one count.
    category: calculation
    applies_to: Run.caught
    trigger: a collectible is handled (BR4.2)
    logic: "IF handled kind is in stage.collectibles THEN caught + 1."
    violation: a non-virus kind outside the stage's collectibles still scores but adds no progress (cannot normally fall, see BR6.2)
    source: FR3.4, FR3.6, FR8.2
  - id: BR2.3
    statement: Reaching the required count clears the stage in the same update.
    category: policy
    applies_to: Run, GameSession
    trigger: caught reaches stage.requiredCount
    logic: "IF caught >= requiredCount THEN remove every falling object, score + stage.clearBonus, aiRestoration + 25 (BR2.4), set complete IF stageIndex = 3, emit stage-clear (stageIndex, bonus, aiRestoration) after the catch event, enter stage-clear with phaseTime 0."
    violation: not applicable
    source: FR1.4, FR1.5, FR3.7, FR4.3
  - id: BR2.4
    statement: AI restoration rises by exactly 25% per cleared stage.
    category: calculation
    applies_to: Run.aiRestoration
    trigger: stage clear
    logic: "aiRestoration = min(100, aiRestoration + AI_RESTORATION_STEP (25)). Values are only 0, 25, 50, 75, 100."
    violation: not applicable
    source: FR7, FR7.1
  - id: BR2.5
    statement: Score and lives carry from stage to stage; lives are never refilled and no extra lives exist.
    category: policy
    applies_to: GameSession.score, GameSession.lives
    trigger: entering the next stage-intro
    logic: "IF a new stage begins in the same run THEN keep score and lives unchanged."
    violation: not applicable
    source: FR4.4, FR5.1, FR5.2
  - id: BR2.6
    statement: A collectible that reaches the bottom uncaught disappears with no penalty.
    category: policy
    applies_to: FallingObject
    trigger: object y >= PLAY_H
    logic: "IF an object leaves the bottom THEN remove it; score, caught, and lives are unchanged. Missed objects do not respawn."
    violation: not applicable
    source: FR3.6
  - id: BR2.7
    statement: Clearing Stage 4 leads through its stage-clear screen to the victory ending, where the high score is submitted.
    category: policy
    applies_to: GameSession.phase
    trigger: stage-clear ends with Run.complete
    logic: "Enter victory: phaseTime 0, objects empty, newHighScore = store.submit(score) (false with no store), emit victory (score, newHighScore)."
    violation: not applicable
    source: FR1.4, FR9, FR9.2, FR10.1

  # BR3 - Scoring
  - id: BR3.1
    statement: Each collectible kind has fixed points.
    category: calculation
    applies_to: GameSession.score
    trigger: a collectible is handled
    logic: "score + POINTS[kind]: mainframe 100, tape 100, floppy 100, llm 100, gpu 150, robot 200 (starting values); emit catch (kind, points, x, y)."
    violation: not applicable
    source: FR4, FR4.1, FR4.2
  - id: BR3.2
    statement: Touching a VIRUS never changes the score and is never reported as a catch.
    category: policy
    applies_to: GameSession.score
    trigger: a VIRUS is handled
    logic: "IF handled kind = virus THEN score unchanged; no catch event."
    violation: not applicable
    source: FR4.5

  # BR4 - VIRUS, lives, collision, game over
  - id: BR4.1
    statement: Each VIRUS contact removes one life, with no invulnerability afterwards.
    category: calculation
    applies_to: GameSession.lives
    trigger: a VIRUS is handled
    logic: "lives = max(0, lives - 1); emit virus-hit (x, y) then life-lost (lives). The next VIRUS contact, even in the next update, removes another life."
    violation: not applicable
    source: FR5.3
  - id: BR4.2
    statement: At most one touched object is handled per update; a VIRUS wins, otherwise the earliest spawned.
    category: policy
    applies_to: Collision
    trigger: Human overlaps one or more objects in an update
    logic: "Overlap is a bounding-box overlap of at least one pixel. IF any touched object is a virus THEN handle the virus with the lowest order ELSE the object with the lowest order. Remove every touched object; the others have no effect."
    violation: not applicable
    source: FR5.4
  - id: BR4.3
    statement: Lives reaching 0 ends the run in game over, where the high score is submitted.
    category: policy
    applies_to: GameSession.phase
    trigger: lives become 0 during playing
    logic: "Enter game-over: phaseTime 0, objects empty, Run keeps its stageIndex, caught, and aiRestoration (cleared stages only), newHighScore = store.submit(score), emit game-over (score, newHighScore)."
    violation: not applicable
    source: FR1.6, FR10.1

  # BR5 - Difficulty
  - id: BR5.1
    statement: Inside a stage, difficulty rises in equal steps from the stage's start values to its cap.
    category: calculation
    applies_to: Difficulty
    trigger: every playing update
    logic: "n = floor((stageTime + EPS) / DIFFICULTY_STEP_SECONDS (starting value 8 s)) (BR1.10); f = min(n, DIFFICULTY_STEPS_TO_CAP (starting value 4)) / DIFFICULTY_STEPS_TO_CAP; each value = start + (cap - start) x f; maxObjects rounded down. IF stageTime is not finite or < 0 THEN use the start values."
    violation: not applicable
    source: FR6, FR6.2
  - id: BR5.2
    statement: Difficulty returns to the next stage's start values when a new stage begins.
    category: policy
    applies_to: GameSession.stageTime
    trigger: entering stage-intro
    logic: "stageTime = 0; it advances only while phase is playing."
    violation: not applicable
    source: FR6.2
  - id: BR5.3
    statement: Each later stage is equal or harder than the one before on every difficulty value and strictly harder on at least one; each cap is equal or harder than its start.
    category: validation
    applies_to: StageDefinition
    trigger: catalogue definition (checked by a unit test)
    logic: "Harder means larger fallSpeedMultiplier, smaller spawnInterval, larger virusShare, larger maxObjects. FOR n = 1..3, compare stage n+1 with stage n on difficultyStart and on difficultyCap."
    violation: the unit test fails; the build is not released
    source: FR6.1
  - id: BR5.4
    statement: Stage 1 is gentle for a first-time player.
    category: policy
    applies_to: StageDefinition (Stage 1)
    trigger: catalogue definition
    logic: "Stage 1 starting values: fall speed 1.0 to 1.2, spawn interval 1.2 s to 1.0 s, VIRUS share 0.10 to 0.15, max objects 3 to 4 [Q5]. Later stages per the table in functional-spec.md. All values tuned by playtesting."
    violation: tuned after a failed play check
    source: FR6.3

  # BR6 - Spawning
  - id: BR6.1
    statement: Objects spawn on the current spawn interval, but never above the current maximum on screen.
    category: constraint
    applies_to: Spawner, GameSession.objects
    trigger: every playing update
    logic: "spawnTimer + dt. WHILE spawnTimer >= current spawnInterval (at most 100 times per update): spawnTimer - interval; IF objects.length >= current maxObjects THEN skip this spawn ELSE spawn one object [Q3]."
    violation: a skipped spawn is not retried
    source: FR6.1, FR6.2
  - id: BR6.2
    statement: VIRUS falls from the first spawn of every stage by its share; other spawns are the stage's collectibles in equal shares.
    category: calculation
    applies_to: Spawner
    trigger: a spawn
    logic: "IF random() < current virusShare THEN kind = virus ELSE kind = stage.collectibles[floor(random() x count)] (index clamped to the last). No VIRUS-free grace period [Q4]."
    violation: not applicable
    source: FR3.4, FR3.5
  - id: BR6.3
    statement: A new object appears at the top at a random position inside the play area, falling at its kind's speed times the current multiplier.
    category: calculation
    applies_to: FallingObject
    trigger: a spawn
    logic: "x = random() x (PLAY_W - OBJECT_W); y = 0; vy = PLAY_H / FALL_TIME[kind] x fallSpeedMultiplier; FALL_TIME mainframe 4.0, tape 4.0, floppy 4.0, llm 4.0, robot 3.5, gpu 2.5, virus 3.0 s (starting values); the new kinds fall straight."
    violation: a non-finite x is treated as 0 and clamped into the play area
    source: FR3, FR6.1

  # BR7 - Movement and input
  - id: BR7.1
    statement: HUMAN moves left or right while a direction is held and stops fully inside the play area.
    category: calculation
    applies_to: Human.x
    trigger: every playing update
    logic: "x = clamp(x + direction x HUMAN_SPEED (130 px/s) x dt, 0, PLAY_W - HUMAN_W). Only in phase playing."
    violation: not applicable
    source: FR2, FR2.1, FR2.2, FR2.3
  - id: BR7.2
    statement: When both directions are held, the most recently pressed one wins; releasing it falls back to the one still held.
    category: policy
    applies_to: InputTracker
    trigger: direction read
    logic: "direction = the dir of the most recently pressed held input whose dir is not null, else 0."
    violation: not applicable
    source: FR2.4
  - id: BR7.3
    statement: Inputs during automatic screens change nothing, but a direction still held when play starts moves HUMAN at once.
    category: policy
    applies_to: GameControls.inputDown, GameControls.pressStart
    trigger: input while phase is stage-intro or stage-clear
    logic: "Record the held input only. ON entering playing, direction is read from the held inputs on the first update."
    violation: ignored silently
    source: FR1.3, FR1.4
  - id: BR7.4
    statement: When the window loses focus every held input is released.
    category: policy
    applies_to: GameControls.releaseAll
    trigger: releaseAll
    logic: "Clear all HeldInput. A later inputDown for any id counts as a new press."
    violation: not applicable
    source: FR2.1

  # BR8 - High score
  - id: BR8.1
    statement: A score above the stored best replaces it at game over and at victory.
    category: calculation
    applies_to: HighScore
    trigger: entering game-over or victory
    logic: "IF score is a safe whole number > best THEN best = score, save to storage, newHighScore = true ELSE newHighScore = false."
    violation: not applicable
    source: FR10, FR10.1, FR9.2
  - id: BR8.2
    statement: Storage that cannot be read or written never stops the game; an invalid stored value counts as 0.
    category: policy
    applies_to: HighScoreStore
    trigger: load or save
    logic: "IF storage throws THEN keep best in memory for the session, show no error. IF the stored text is not a non-negative whole number THEN best = 0."
    violation: errors are swallowed inside the store
    source: FR10.3

  # BR9 - Testability and boundaries
  - id: BR9.1
    statement: Game rules contain no DOM, drawing, or sound code and take their random source and high-score store by injection.
    category: constraint
    applies_to: src/game
    trigger: every change
    logic: "Rules run in Vitest under node. Each new behaviour gets a failing test before its implementation; the existing suite stays green (tests for power-off, startup, and time-only difficulty are rewritten)."
    violation: a test or type check fails
    source: NFR8
  - id: BR9.2
    statement: No GameControls method and no GameView read throws.
    category: constraint
    applies_to: GameControls, GameView
    trigger: any call
    logic: "Invalid input (unknown ids, release of an id not held, invalid dt) is ignored."
    violation: not applicable
    source: NFR8
```

## Rules Summary

| ID | Category | Rule | Source |
|---|---|---|---|
| BR1.1 | policy | Session starts on the title; no power-off or startup | FR1.1 |
| BR1.2 | policy | START on the title begins a run at Stage 1 | FR1.2, FR1.7, FR5.1 |
| BR1.3 | validation | Arrow keys on the title never start a run | FR1.2 |
| BR1.4 | policy | Timed stage intro (2.0 s), input ignored, then play | FR1.3 |
| BR1.5 | policy | Timed stage clear (2.5 s), then next intro or victory | FR1.4, FR3.7 |
| BR1.6 | policy | Game over / victory return to title on a new press after 2.0 s / 3.5 s | FR1.7 |
| BR1.7 | constraint | No pause; invalid dt ignored | FR1.8 |
| BR1.8 | constraint | View values per phase follow C1 | FR7.2, FR8.2 |
| BR1.9 | constraint | One press, at most one transition; the press that returns to title never starts a run | FR1.7 |
| BR1.10 | calculation | Timer and step boundaries use EPS = 1e-9 | FR1.3, FR1.4, FR6.2 |
| BR2.1 | constraint | Four stages, collectibles, counts 10/12/14/16, bonus 500 | FR3.1-FR3.5 |
| BR2.2 | calculation | Catch adds 1 progress; Stage 4 combined | FR3.4, FR3.6 |
| BR2.3 | policy | Target reached clears the stage at once | FR1.4, FR1.5, FR3.7, FR4.3 |
| BR2.4 | calculation | AI +25% per clear | FR7.1 |
| BR2.5 | policy | Score and lives carry over; no refill | FR4.4, FR5.2 |
| BR2.6 | policy | Missed collectible vanishes, no penalty | FR3.6 |
| BR2.7 | policy | Stage 4 clear → victory, high score submitted | FR9, FR10.1 |
| BR3.1 | calculation | Points per kind | FR4.1, FR4.2 |
| BR3.2 | policy | VIRUS never scores | FR4.5 |
| BR4.1 | calculation | VIRUS −1 life, no invulnerability | FR5.3 |
| BR4.2 | policy | One object per update, VIRUS first | FR5.4 |
| BR4.3 | policy | 0 lives → game over, high score submitted | FR1.6 |
| BR5.1 | calculation | Equal steps every 8 s to the cap after 4 steps | FR6.2 |
| BR5.2 | policy | Difficulty resets per stage | FR6.2 |
| BR5.3 | validation | Later stages equal or harder, one strictly | FR6.1 |
| BR5.4 | policy | Stage 1 gentle | FR6.3 |
| BR6.1 | constraint | Spawn on interval; skip at the max | FR6.1 |
| BR6.2 | calculation | VIRUS by share from the first spawn; collectibles equal | FR3.4, FR3.5 |
| BR6.3 | calculation | Random x, kind fall time × multiplier | FR3 |
| BR7.1 | calculation | HUMAN moves and stays inside | FR2.1-FR2.3 |
| BR7.2 | policy | Most recent direction wins | FR2.4 |
| BR7.3 | policy | Input on automatic screens ignored; held direction moves at play start | FR1.3, FR1.4 |
| BR7.4 | policy | Focus loss releases all inputs | FR2.1 |
| BR8.1 | calculation | Higher score replaces the best | FR10.1, FR9.2 |
| BR8.2 | policy | Storage failure is silent; invalid value is 0 | FR10.3 |
| BR9.1 | constraint | No DOM in rules; injected random and store; tests first | NFR8 |
| BR9.2 | constraint | No method or read throws | NFR8 |
