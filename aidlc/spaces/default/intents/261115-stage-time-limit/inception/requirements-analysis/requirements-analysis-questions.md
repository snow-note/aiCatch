# Requirements Analysis Questions

Intent: 261115-stage-time-limit. Request: make Stage 2 about as hard as Stage 4, make falling items 1.2-1.5x faster, and add a 90-second limit per stage that ends the run at 0.

Facts from the code scan (`inception/reverse-engineering/developer-scan.md`):

- Stage 2 today: speed 1.1 -> 1.35, spawn interval 1.1 -> 0.9 s, VIRUS share 0.45 -> 0.50, max objects 4 -> 5, 12 catches required.
- Stage 4 today: speed 1.3 -> 1.7, spawn interval 0.9 -> 0.7 s, VIRUS share 0.55 -> 0.60, max objects 5 -> 6, 16 catches required.
- A test requires each later stage to be harder than the one before; Stage 3 sits between Stage 2 and Stage 4.
- A test requires at least 1.5 s for a VIRUS to reach HUMAN at Stage 1 start (1.705 s today; 1.42 s at 1.2x).
- A full clear scores about 8000 because the score depends only on the fixed required counts (3600 + 2000 bonuses + about 2400 in Stage 4). Time and lives do not affect it.
- With perfect catching, the minimum clear time is about 20 / 24 / 28 / 32 s for Stages 1-4.

## Question 1
How should the stage difficulty curve change so Stage 2 is about as hard as Stage 4 today?

A. Stage 2 takes the current Stage 4 values; Stage 3 and Stage 4 are raised above it so each stage is still harder than the one before
B. Stages 2, 3 and 4 all use the current Stage 4 values (flat from Stage 2)
C. Stage 2 takes the current Stage 4 values; Stages 3 and 4 stay as they are (Stage 3 becomes easier than Stage 2)
X. Other (please specify)

[Answer]: A

## Question 2
Where should the 1.2-1.5x fall speed increase apply?

A. Every stage (whole game)
B. Stage 2 only, as the way to bring it to Stage 4 difficulty
C. Stages 2-4 only (Stage 1 stays as it is)
X. Other (please specify)

[Answer]: A

## Question 3
Which falling objects get faster?

A. All objects, including VIRUS
B. Collectibles only (VIRUS speed unchanged)
X. Other (please specify)

[Answer]: B

## Question 4
Which speed factor?

A. 1.2x
B. 1.3x
C. 1.5x
D. Rising by stage: 1.2x in the first sped-up stage up to 1.5x in Stage 4
X. Other (please specify)

[Answer]: D

## Question 5
If VIRUS gets faster in Stage 1, the current 1.5 s minimum reaction time (time for a VIRUS to reach HUMAN) would fail. What should happen?

A. Keep the 1.5 s minimum; limit the Stage 1 VIRUS speed so it still holds
B. Lower the minimum to 1.2 s
C. Remove the minimum
D. Not relevant (Stage 1 VIRUS is not sped up by my earlier answers)
X. Other (please specify)

[Answer]: B

## Question 6
How should the 90-second timer run?

A. Resets to 90 at the start of each stage; counts down only during play (stops on the stage intro and stage clear screens)
B. Resets to 90 at the start of each stage; also counts down during the stage intro screen
C. Leftover seconds carry over to the next stage (90 added per stage)
X. Other (please specify)

[Answer]: A

## Question 7
How should the remaining time be shown during play?

A. A small text timer on the HUD row (for example `T 90`), no warning
B. A small text timer that blinks during the last 10 seconds
C. A small text timer that blinks and plays a short beep each second during the last 10 seconds
X. Other (please specify)

[Answer]: C

## Question 8
Should a time-out game over be distinguishable from losing all lives?

A. Yes: show `TIME UP` on the game over screen and say "Time up" in the screen reader announcement
B. No: use the same game over screen and announcement as today
X. Other (please specify)

[Answer]: A

## Question 9
A time limit alone does not change the score of a full clear (still about 8000). Should the score change too?

A. Add a time bonus at each stage clear: remaining seconds x 10 points
B. Add a time bonus at each stage clear: remaining seconds x 20 points
C. No score change; only the time limit (runs that time out score less than a clear)
X. Other (please specify)

[Answer]: A
