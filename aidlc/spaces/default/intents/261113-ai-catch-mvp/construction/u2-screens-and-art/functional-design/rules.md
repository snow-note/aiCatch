# Display Rules: u2-screens-and-art

Display rules for the U2 drawing layer, numbered so the stories in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md` can be traced to them. Behaviour and layout details are in `functional-spec.md` (SC-1 to SC-6); requirements in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; contracts in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

```yaml
rules:
  - id: BR1.1
    statement: The drawn screen always follows view.phase; U2 never changes game state.
    category: constraint
    applies_to: Renderer.draw
    trigger: every frame
    logic: "Draw SC-1 for title, SC-2 for stage-intro, SC-3 for playing, SC-4 for stage-clear, SC-5 for game-over, SC-6 for victory. Read only GameView and GameEvent."
    violation: type check fails (Renderer takes GameView only)
    source: FR1, FR1.1
  - id: BR1.2
    statement: The title shows the name, the sprites row, three story lines, the high score, and a blinking PRESS START.
    category: policy
    applies_to: SC-1
    trigger: phase title
    logic: "Story lines '2045. A VIRUS BROKE THE AI.', 'RECOVER COMPUTING HISTORY.', 'SAVE IT.'; PRESS START while blinkOn."
    violation: play check fails
    source: FR1.2
  - id: BR1.3
    statement: The stage intro shows the stage number and name, each collectible with the required count (TOTAL in Stage 4), the VIRUS, and the AI bar.
    category: policy
    applies_to: SC-2
    trigger: phase stage-intro
    logic: "Values from view.stage and view.aiRestoration."
    violation: play check fails
    source: FR1.3, FR3.4, FR7.2
  - id: BR1.4
    statement: The stage-clear screen shows "<NAME> RECOVERED", the AI bar filling by 25% over CLEAR_BAR_FILL, "+25%" after the fill, the bonus, and the score.
    category: calculation
    applies_to: SC-4, barFill
    trigger: phase stage-clear
    logic: "fill = clamp(aiRestoration - 25 + 25 x min(1, t / CLEAR_BAR_FILL), 0, 100)."
    violation: unit test of barFill fails
    source: FR1.4, FR4.3, FR7.1
  - id: BR1.5
    statement: The game-over screen shows the AI bar, the REACHED STAGE line, score, high score, NEW! when beaten, and PRESS ANY KEY once canReturnToTitle.
    category: policy
    applies_to: SC-5
    trigger: phase game-over
    logic: "reachedLine = 'REACHED STAGE ' + stageNumber + ' ' + name."
    violation: unit test of reachedLine or play check fails
    source: FR1.6, FR1.7, FR10.2
  - id: BR1.6
    statement: The victory ending runs reboot, restore, messages, hold, with the three product messages and the high score.
    category: calculation
    applies_to: SC-6, victoryStep, messagesShown
    trigger: phase victory
    logic: "victoryStep: reboot t<1.5, restore t<2.5, messages t<3.5, else hold; messagesShown = 0 before 2.5, then 1, 2, 3 every 0.33 s; messages 'AI RESTORED — 100%', 'HUMANS SAVED AI.', 'SAVE THE AI. SAVE THE FUTURE.'."
    violation: unit test of victoryStep or messagesShown fails
    source: FR9, FR9.1, FR9.2, FR9.3
  - id: BR2.1
    statement: The HUD row shows stage name, AI %, score in seven-segment digits, caught/required, and lives, above a rule at y 14 that the play area never crosses.
    category: policy
    applies_to: SC-3, hudTexts
    trigger: phase playing
    logic: "hudTexts gives [name, 'AI n%', 'caught/required']; Stage 4 shows one combined count."
    violation: unit test of hudTexts fails
    source: FR8, FR8.1, FR8.2
  - id: BR2.2
    statement: Each object kind is drawn with its own original sprite, and each sprite is distinct by outline.
    category: constraint
    applies_to: spriteFor, Sprites
    trigger: drawing objects
    logic: "mainframe, tape, floppy, llm, gpu, robot, virus each map to a different bitmap that fits 16 x 16."
    violation: sprite test fails
    source: FR11.2
  - id: BR2.3
    statement: Catch, VIRUS hit, and life lost each start their existing visual effect.
    category: policy
    applies_to: Renderer.onEvent
    trigger: catch, virus-hit, life-lost events
    logic: "catch -> pop-up 0.8 s, spark 0.28 s, flash 0.16 s; virus-hit -> glitch 0.45 s; life-lost -> warning 1.0 s."
    violation: play check fails
    source: FR11.4
  - id: BR3.1
    statement: The LCD uses only the background, ink, and ghost tones; the font includes %, ., :, a dash, and /.
    category: constraint
    applies_to: Renderer, FONT
    trigger: all drawing
    logic: "Unknown glyphs draw as a space; new glyphs are 3 x 5."
    violation: sprite test fails
    source: FR11.1, FR11.3
  - id: BR3.2
    statement: Blinking prompts blink at 1 Hz.
    category: calculation
    applies_to: blinkOn
    trigger: drawing a prompt
    logic: "blinkOn(t) = (t mod 1) < 0.5."
    violation: unit test fails
    source: FR11.1
  - id: BR4.1
    statement: The console page has a silver-grey casing, one h1 "AI CATCH", a main landmark, no POWER button, an aria-hidden canvas, and an empty polite live region.
    category: constraint
    applies_to: ConsoleShell
    trigger: page load
    logic: "Markup in index.html; colours in style.css; layout fit unchanged."
    violation: DOM inspection fails
    source: FR1.1, FR11.1, FR11.5, FR13.1, FR13.2
  - id: BR4.2
    statement: Every asset is original and recorded in ASSETS.md.
    category: policy
    applies_to: Sprites, ASSETS.md
    trigger: adding art
    logic: "ASSETS.md lists each bitmap as original; no external asset is used."
    violation: review fails
    source: NFR6
```

## Rules Summary

| ID | Rule | Source |
|---|---|---|
| BR1.1 | Screen follows `view.phase`; read-only | FR1 |
| BR1.2 | Title content | FR1.2 |
| BR1.3 | Stage intro content | FR1.3, FR3.4 |
| BR1.4 | Stage clear with 1.0 s bar fill | FR1.4, FR7.1 |
| BR1.5 | Game over content | FR1.6, FR1.7 |
| BR1.6 | Victory sequence and messages | FR9 |
| BR2.1 | HUD row | FR8 |
| BR2.2 | Distinct original sprites | FR11.2 |
| BR2.3 | Effects on events | FR11.4 |
| BR3.1 | Two tones plus ghost; extended font | FR11.1, FR11.3 |
| BR3.2 | 1 Hz blink | FR11.1 |
| BR4.1 | Console page markup | FR13.1, FR11.5 |
| BR4.2 | Asset record | NFR6 |
