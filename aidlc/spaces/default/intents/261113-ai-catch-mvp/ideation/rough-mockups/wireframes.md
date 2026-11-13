# Wireframes: AI CATCH (four-stage MVP)

Low-fidelity wireframes for every screen. Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/intent-capture/intent-statement.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/scope-definition/scope-document.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/scope-definition/intent-backlog.md`, and `rough-mockups-questions.md` (answers Q1-Q6). The look follows the existing game and `product.md` §8 (Q4). Layout positions, counts, and wording below are rough proposals to refine later, not final values.

## Console Frame (around every screen)

The page shows one console. The LCD screen sits inside it. There is no POWER button and no startup screen: the page opens directly on the title screen (Q1).

```
+--------------------------------------------------+
|                    AI CATCH                      |   <- casing label
|  +--------------------------------------------+  |
|  |                                            |  |
|  |            LCD SCREEN  (240 x 160)         |  |   <- all game screens
|  |                                            |  |
|  +--------------------------------------------+  |
|        [ < ]      < > MOVE      [ > ]   [START]  |   <- hint + START button
+--------------------------------------------------+
```

- Desktop: left and right arrow keys move; Enter or Space acts as START (Q5).
- Smartphone: touching the left or right half of the screen moves; tapping START starts. Works in portrait and landscape; the console scales to fit (Q5).

Accessibility: the casing label "AI CATCH" is the page's only `h1`. Each screen's name below is `h2`-level and is given through the canvas text label, which changes with the screen (Q6). Landmarks: `main` (console). Keyboard entry point: the START key (Enter / Space) with focus on the page.

## Screen 1: Title

```
+--------------------------------------------+
|                                            |
|              A I   C A T C H               |
|                                            |
|   2045. A VIRUS BROKE THE AI.              |
|   SAVE IT.                                 |
|                                            |
|            PRESS START                     |
|                                            |
|   HI-SCORE  [ 0 0 1 2 0 0 ]                |
+--------------------------------------------+
```

- Shows the game name, a one-line 2045 story, the START prompt, and the local high score (Q1).
- Purpose: the player understands the goal without instructions.

Accessibility: heading `h2` "TITLE" (canvas label); region: `main`; keyboard entry point: Enter / Space starts.

## Screen 2: Stage Intro

```
+--------------------------------------------+
|                                            |
|              STAGE 1                       |
|              FORTRAN                       |
|                                            |
|      COLLECT  [mainframe icon]  x 10       |
|      AVOID    [virus icon]                 |
|                                            |
|      AI  [####................]  0%       |
+--------------------------------------------+
```

- Shown briefly before each stage, then play starts.
- Shows the stage number and generation name, what to collect and how many, the VIRUS to avoid, and the current AI restoration.
- Per stage: FORTRAN collects mainframes, COBOL collects magnetic tapes, BASIC collects floppy disks, LLM collects LLM / GPU / ROBOT (scope S4).

Stage 4 variant: the three collectible types count together toward one target (gate decision R-01).

```
+--------------------------------------------+
|                                            |
|              STAGE 4                       |
|              LLM                           |
|                                            |
|  COLLECT [llm] [gpu] [robot]  x 10 TOTAL   |
|  AVOID   [virus icon]                      |
|                                            |
|      AI  [###############.....]  75%      |
+--------------------------------------------+
```

Accessibility: heading `h2` "STAGE n — NAME"; region: `main`; keyboard entry point: no input needed, the screen advances to play on its own.

## Screen 3: Playing

```
+--------------------------------------------+
| FORTRAN  AI 0%  [000300]  3/10   <3 <3 <3  |   <- top bar (HUD)
|--------------------------------------------|
|                                            |
|      [mainframe]                           |
|                          [virus]           |
|            [mainframe]                     |
|                                            |
|                                            |
|                   (HUMAN)                  |
|____________________________________________|
```

- Most prominent: HUMAN and the falling objects (Q3).
- Top bar, always visible: stage name, AI restoration %, score in seven-segment digits, stage progress (collected / required), and lives (Q3).
- In Stage 4 the progress counter is one combined total for LLM, GPU, and ROBOT (gate decision R-01):

```
| LLM  AI 75%  [004200]  4/10   <3 <3 <3     |
```

- Lives carry over from stage to stage for the whole run; they are not refilled at a new stage (gate decision R-04). The three hearts are a placeholder count.
- Collectibles and VIRUS are told apart by shape, not by colour (Q6).
- Effects on events: a short score pop-up and flash on a catch; a glitch effect and life warning on a VIRUS hit.

Accessibility: heading `h2` "STAGE n — NAME" (canvas label updates per stage); region: `main`; keyboard entry point: left / right arrow keys.

## Screen 4: Stage Clear

```
+--------------------------------------------+
|                                            |
|          FORTRAN RECOVERED                 |
|                                            |
|      AI  [#####.............]  25%        |
|           +25%                             |
|                                            |
|      SCORE  [ 0 0 1 2 0 0 ]                |
|                                            |
+--------------------------------------------+
```

- Names the recovered generation and shows the AI restoration bar rising by 25% (scope S10).
- Then the next stage intro appears.
- After Stage 4 this screen also appears ("LLM RECOVERED", AI 75% to 100%), and the victory ending follows it (gate decision R-03).

Accessibility: heading `h2` "NAME RECOVERED"; region: `main`; keyboard entry point: no input needed, the screen advances on its own.

## Screen 5: Game Over

```
+--------------------------------------------+
|                                            |
|              G A M E   O V E R             |
|                                            |
|      AI  [#########.........]  50%        |
|      REACHED  STAGE 3  BASIC               |
|                                            |
|      SCORE     [ 0 0 2 4 0 0 ]             |
|      HI-SCORE  [ 0 0 3 1 0 0 ]  NEW!       |
|                                            |
|            PRESS ANY KEY                   |
+--------------------------------------------+
```

- Shows how far the AI was restored, the stage reached, the score, and the high score (with "NEW!" when beaten).
- Any input returns to the title; the next run starts from Stage 1 (Q2).

Accessibility: heading `h2` "GAME OVER"; region: `main`; keyboard entry point: any key returns to the title.

## Screen 6: Victory Ending

```
+--------------------------------------------+
|                                            |
|        AI RESTORED  —  100%                |
|      [##############################]      |
|                                            |
|          HUMANS SAVED AI.                  |
|                                            |
|     SAVE THE AI. SAVE THE FUTURE.          |
|                                            |
|      SCORE     [ 0 0 4 8 0 0 ]             |
|      HI-SCORE  [ 0 0 4 8 0 0 ]             |
|            PRESS ANY KEY                   |
+--------------------------------------------+
```

- Shows the three required messages from `product.md` §7 and the final score (scope S11).
- A winning run updates the local high score when the score beats it, and the screen shows the high score (gate decision R-07).
- Any input returns to the title (Q2).
- The victory animation and visual feedback that `product.md` §7 asks for are not drawn here; they are specified in a later stage (gate decision R-06).

Accessibility: heading `h2` "AI RESTORED — 100%"; region: `main`; keyboard entry point: any key returns to the title.

## Information Architecture

```
AI CATCH (single page)
└── Console
    └── LCD screen
        ├── Title
        ├── Stage loop (x4: FORTRAN, COBOL, BASIC, LLM)
        │   ├── Stage intro
        │   ├── Playing
        │   └── Stage clear
        ├── Game over
        └── Victory ending
```

There is no menu, settings, or navigation: one screen at a time, driven by START and the move inputs.

## Assumptions & Open Questions

- [assumption] The required count per stage (shown as "x 10" and "3/10") is a placeholder. The real numbers are set during balancing.
- [assumption] The number of lives (three hearts) is a placeholder, set during balancing.
- [assumption] The title story line and the "RECOVERED" wording are draft text, to be finalised in later stages.
- [assumption] Draft extras not yet confirmed, to be decided in a later stage (gate decision R-06): the "NEW!" high-score marker and the "REACHED STAGE" line on the game-over screen, the AI restoration bar on the stage intro, and the victory animation.
- [assumption] Canvas text is not a real heading for assistive technology. A later stage gives each screen name a DOM or ARIA text equivalent, not only the canvas text (gate decision R-08).
- [assumption] Whether the "NEW!" marker also appears on the victory screen is decided with the other extras in a later stage (gate decision R-06).
- [assumption] The on-screen [ < ] and [ > ] marks on the console frame stay as drawn; whether they are buttons or only a hint is settled in a later stage (gate decision R-02: accepted as is).
