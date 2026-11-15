# Refined Mockups: AI CATCH (four-stage MVP)

Mid-fidelity mockups for every screen, drawn on the real 240 x 160 logical LCD. They refine `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/rough-mockups/wireframes.md` and `user-flow.md`, cover the stories in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md` (US1.1-US7.1), and implement `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`. Answers are in `refined-mockups-questions.md` (Q1-Q7). Pixel coordinates are starting values for implementation and may shift by a few pixels; colours and tokens are in `design-system-mapping.md`.

Grid notes: the LCD is 240 x 160 logical pixels. The 3 x 5 pixel font advances 4 px per character at scale 1 (12 px at scale 3). Seven-segment digits are 5 x 9 px, 6 px per digit, 6 digits per number (36 px wide). Sprites are 16 x 16; HUMAN is 20 x 20.

## Console (all screens) — Q1

```
+----------------------------------------------------+   320 x 240, silver-grey casing
|                     AI CATCH                       |   label, top centre (page h1)
|   +--------------------------------------------+   |
|   |                                            |   |   bezel 260 x 180
|   |          LCD  240 x 160 (canvas)           |   |
|   |                                            |   |
|   +--------------------------------------------+   |
|      ◀ ▶ MOVE                          [START]     |   controls row
+----------------------------------------------------+
```

- Casing changes from beige to silver-grey; the "AI CATCH" label stays (Q1).
- The POWER button is removed. The controls row has the "◀ ▶ MOVE" hint text on the left and the START button on the right. There are no on-screen arrow buttons; touch movement uses the left and right halves of the screen (Q1, FR2.2).
- The console keeps its 4:3 aspect ratio, fits the visible area, stays centred, and keeps sharp pixels (FR11.5).

Stories: US1.1, US6.1.

## Screen 1: Title — US1.1

```
 0         60        120       180      240
 +------------------------------------------+  y
 |                                          |
 |            A I   C A T C H               |  16  scale 3, centred
 |                                          |
 |   [main] [tape] [disk] [llm] [virus]     |  44  sprites row, 16 px each
 |                                          |
 |       2045. A VIRUS BROKE THE AI.        |  72  scale 1, centred
 |       RECOVER COMPUTING HISTORY.         |  80
 |                SAVE IT.                  |  88
 |                                          |
 |         HI-SCORE  [0 0 1 2 0 0]          |  104 label + seven-segment
 |                                          |
 |              PRESS START                 |  132 blinks 1 Hz
 +------------------------------------------+
```

- Title text and story lines from Q3. The sprites row shows the journey: mainframe, magnetic tape, floppy disk, LLM, VIRUS.
- "PRESS START" blinks (on 0.5 s, off 0.5 s), as in the existing game.
- Enter, Space, or START starts a run (FR1.2).

## Screen 2: Stage Intro — US2.1

Stages 1-3:

```
 +------------------------------------------+
 |                                          |
 |                STAGE 1                   |  20  scale 2
 |                FORTRAN                   |  36  scale 2
 |                                          |
 |       COLLECT  [main]  X 10              |  64
 |       AVOID    [virus]                   |  88
 |                                          |
 |   AI [##########                ]   0%   |  124 bar 160 x 6
 |                                          |
 +------------------------------------------+
```

Stage 4 (combined target, FR3.4):

```
 +------------------------------------------+
 |                STAGE 4                   |
 |                  LLM                     |
 |                                          |
 |   COLLECT [llm][gpu][robot]  X 16 TOTAL  |
 |   AVOID   [virus]                        |
 |                                          |
 |   AI [##############################  ]  75%  |
 +------------------------------------------+
```

- Shown for about 2 s, then play starts on its own; input is ignored and nothing falls (Q5, FR1.3).
- The AI bar on the intro is kept (Q4).
- Stage names and collectibles: 1 FORTRAN mainframe, 2 COBOL magnetic tape, 3 BASIC floppy disk, 4 LLM LLM/GPU/ROBOT. Counts are starting values (FR3.1-FR3.4).

## Screen 3: Playing — US2.1

```
 0                                         240
 +------------------------------------------+
 |FORTRAN AI 25% [000300] 3/10   <3 <3 <3   |  0-13  HUD row
 |------------------------------------------|  14    1 px rule
 |                                          |
 |       [main]                             |
 |                         [virus]          |
 |              [main]                      |
 |                                          |
 |                                          |
 |                    (HUMAN)               |  ~136
 |__________________________________________|  159   1 px rule
 +------------------------------------------+
```

HUD row layout (left to right, y = 4 for text, y = 3 for digits):

| Element | x (start) | Width | Notes |
|---|---|---|---|
| Stage name | 2 | up to 28 (7 chars) | "FORTRAN", "COBOL", "BASIC", "LLM" |
| AI % | 34 | up to 28 | "AI 100%" needs `%` (FR11.3) |
| Score | 66 | 36 | seven-segment, 6 digits |
| Progress | 108 | up to 20 | caught/required, e.g. "3/10", "16/16" |
| Lives | 202 | 3 x 7 + 2 x 3 = 27 | hearts; lost hearts drawn faint |

- The play area below the rule (y 15-158) is never covered by the HUD (FR8.1).
- In Stage 4, progress is one combined count (FR8.2).
- Effects kept from the existing game: "+points" pop-up and spark on a catch, HUMAN flashes inverted; glitch slices on a VIRUS hit; blinking frame and blinking last heart when a life is lost (FR11.4).

## Screen 4: Stage Clear — US3.1, US4.1

```
 +------------------------------------------+
 |                                          |
 |             FORTRAN                      |  28  scale 2
 |            RECOVERED                     |  44  scale 2
 |                                          |
 |   AI [########                    ] 25%  |  76  bar fills 0% -> 25% over ~1 s
 |                 +25%                     |  88
 |                                          |
 |         BONUS  +500                      |  108
 |         SCORE  [0 0 1 8 0 0]             |  124
 |                                          |
 +------------------------------------------+
```

- Shown for about 2.5 s, then the next intro (or, after Stage 4, the victory ending) follows; input is ignored (Q5, FR1.4).
- After Stage 4 the same screen shows "LLM RECOVERED" and the bar fills 75% → 100% (FR1.4).
- Any objects still falling were removed the moment the target was reached (FR1.5).

## Screen 5: Game Over — US5.1

```
 +------------------------------------------+
 |                                          |
 |             G A M E   O V E R            |  20  scale 3
 |                                          |
 |   AI [##########            ]  50%       |  56
 |       REACHED  STAGE 3  BASIC            |  68
 |                                          |
 |       SCORE     [0 0 2 4 0 0]            |  88
 |       HI-SCORE  [0 0 3 1 0 0]   NEW!     |  104 NEW! blinks when beaten
 |                                          |
 |             PRESS ANY KEY                |  136 blinks, after ~2 s
 +------------------------------------------+
```

- "REACHED STAGE n NAME" and "NEW!" are kept (Q4).
- The glitch effect from the final VIRUS hit plays over the start of this screen (existing behaviour).
- "PRESS ANY KEY" appears after the game-over sequence (about 2 s, existing behaviour); then a new key press or tap returns to the title (FR1.7).

## Screen 6: Victory Ending — US4.1

The ending plays as a short sequence (Q2), then holds:

| Phase | Time (approx.) | What shows |
|---|---|---|
| 1. Reboot | 0.0-1.5 s | AI face icon in its broken look, heavy glitch noise; the AI bar fills 75% → 100% while the noise fades |
| 2. Restore | 1.5-2.5 s | The face icon switches to its calm restored look; noise gone |
| 3. Messages | 2.5-3.5 s | "AI RESTORED — 100%", then "HUMANS SAVED AI.", then "SAVE THE AI. SAVE THE FUTURE." appear one after another |
| 4. Hold | from ~3.5 s | Score and high score (with "NEW!" when beaten), then "PRESS ANY KEY" |

Final held frame:

```
 +------------------------------------------+
 |              ( AI face )                 |  8   restored face, 24 x 24
 |                                          |
 |          AI RESTORED — 100%              |  40  scale 2
 |   [##################################]   |  58  full bar
 |                                          |
 |             HUMANS SAVED AI.             |  76
 |      SAVE THE AI. SAVE THE FUTURE.       |  90
 |                                          |
 |       SCORE     [0 0 4 8 0 0]            |  108
 |       HI-SCORE  [0 0 4 8 0 0]   NEW!     |  122
 |             PRESS ANY KEY                |  144
 +------------------------------------------+
```

- The three messages are exactly those in `product.md` §7 (FR9.1). The dash and full stops need the extended font (FR11.3).
- The high score is updated when beaten and shown (FR9.2, FR10.1).
- The AI face icon is new original pixel art with two looks: broken (scrambled rows, missing pixels) and restored (complete, symmetric) (FR9.3).
- Input during phases 1-3 is ignored; "PRESS ANY KEY" accepts a new press, then the title shows (FR1.7).

## New Pixel Art Needed

All original, 16 x 16 unless noted, told apart by outline alone (FR11.2):

| Sprite | Outline idea |
|---|---|
| Mainframe | Tall cabinet with two tape reels on top and a row of panel lights |
| Magnetic tape | Wide open reel: a circle with a hub and a strip of tape trailing out |
| Floppy disk | Square with a cut corner, a metal shutter rectangle at the top, and a label area |
| AI face (24 x 24) | Rounded screen-head; broken look and restored look |
| Font glyphs | `%`, `.`, `:`, `—` (and `/` for progress if missing) in the 3 x 5 style |

The existing HUMAN, LLM, GPU, ROBOT, VIRUS, and heart sprites are kept.

## Responsive Behaviour

- One layout for all screens; the console (320 x 240) scales as a whole to the largest size that fits, keeping 4:3, centred, with the background colour around it (FR11.5).
- Smallest supported visible areas: about 375 x 520 CSS px portrait and 667 x 320 landscape (Q6). In portrait the scale is about 1.17x, in landscape about 1.33x; the scale-1 font must stay legible at these scales (NFR9).
- Rotating a smartphone re-fits the layout without resetting the run.

## Story Coverage

| Story | Screens |
|---|---|
| US1.1 | Console, Title |
| US2.1 | Stage Intro, Playing |
| US3.1 | Stage Clear |
| US4.1 | Stage Clear (Stage 4), Victory Ending |
| US5.1 | Game Over |
| US6.1 | All screens (look, sound cues in `interaction-spec.md`, accessibility in `accessibility-checklist.md`) |
| US7.1 | Console (responsive behaviour) |
