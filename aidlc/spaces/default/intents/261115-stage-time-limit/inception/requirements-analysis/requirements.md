# Requirements: Stage Time Limit and Difficulty Rebalance

Intent: `261115-stage-time-limit` (express scope, Minimal depth).

## Intent Analysis

Original request (verbatim): "課題があります。・最終ステージがほどよい難しさです。stage2がstage4ほどの難しさがいいです。アイテムの落下速度を1.2-1.5倍にしてください ・必ずクリアした時に8000点となるのがほとんどなので、90秒を各ステージの制限時間として0秒になったらゲームオーバーに"

The player finds Stage 4 well balanced but Stages 1-3 too easy, and a full clear almost always scores about 8000. The goals are:

- Raise the challenge earlier in the run: Stage 2 should feel like Stage 4 does today, and collectibles should fall faster.
- Add time pressure: each stage has 90 seconds, and running out ends the run.
- Make scores reflect skill: faster clears score more, so full-clear scores spread out.

Today a full clear scores 3600 (Stages 1-3) + 2000 (4 clear bonuses) + about 2400 (Stage 4) = about 8000, because score depends only on the fixed required counts (`developer-scan.md`, "Points and Why a Clear Scores About 8000").

Answers behind these requirements: `requirements-analysis-questions.md` (Q1 A, Q2 A, Q3 B, Q4 D, Q5 B, Q6 A, Q7 C, Q8 A, Q9 A).

## Functional Requirements

### FR1 Stage difficulty curve (Q1 A)

- **FR1.1** Stage 2 uses the current Stage 4 difficulty values: start `{fallSpeedMultiplier 1.3, spawnInterval 0.9, virusShare 0.55, maxObjects 5}`, cap `{1.7, 0.7, 0.60, 6}`.
- **FR1.2** Stage 3 and Stage 4 are raised so that each stage's start and cap values are no easier than the previous stage's on every value and strictly harder on at least one. This keeps the existing ordering rule (`tests/game/config.test.ts:78-87`). Exact Stage 3 and Stage 4 values are chosen in Code Generation and kept in `src/game/config.ts`.
- **FR1.3** Stage 1 difficulty values, the required counts (10/12/14/16), and the clear bonus (500) do not change.

### FR2 Faster collectibles (Q2 A, Q3 B, Q4 D)

- **FR2.1** Every collectible (mainframe, tape, floppy, llm, gpu, robot) falls faster by a per-stage factor: Stage 1 1.2x, Stage 2 1.3x, Stage 3 1.4x, Stage 4 1.5x. The factor multiplies the speed the object already gets from its `FALL_TIME` and the stage's `fallSpeedMultiplier`.
- **FR2.2** VIRUS does not get this factor. Its speed still follows `FALL_TIME.virus` and the stage's `fallSpeedMultiplier` (so it rises in Stages 2-4 only through FR1).

### FR3 Stage time limit (Q6 A)

- **FR3.1** Each stage has a time limit of 90 seconds.
- **FR3.2** The remaining time resets to 90 seconds when each stage starts.
- **FR3.3** The remaining time counts down only in the `playing` phase. It does not change during the stage intro, stage clear, victory, game over, or title screens.
- **FR3.4** When the remaining time reaches 0 during play, the run ends in game over with the reason "time", even if lives remain. The score earned so far is submitted to the local high score as today.
- **FR3.5** If the catch that clears the stage and the time running out happen in the same update, the stage clear wins.
- **FR3.6** The remaining time is available to rendering and the announcer through the game view.

### FR4 Timer display and warning (Q7 C)

- **FR4.1** During play the HUD shows the remaining whole seconds (rounded up, so it starts at 90 and shows 1 until time runs out) as text in the free area of the HUD row (about x 130-200, y 4), for example `T 90`.
- **FR4.2** During the last 10 seconds the timer text blinks.
- **FR4.3** During the last 10 seconds a short beep plays once each time the displayed second changes (10, 9, ..., 1). The beep is an original sound synthesized with the Web Audio API and respects the existing sound on/off setting.

### FR5 Time-out game over (Q8 A)

- **FR5.1** The `game-over` event carries its reason: lives ran out or time ran out.
- **FR5.2** After a time-out, the game over screen shows `TIME UP`. A lives game over shows no cause line, as today.
- **FR5.3** After a time-out, the screen reader announcement starts with "Time up." followed by the existing game over text. The lives game over announcement does not change.

### FR6 Time bonus (Q9 A)

- **FR6.1** When a stage is cleared, the score increases by the remaining whole seconds (rounded down) x 10 points, in addition to the existing clear bonus of 500.
- **FR6.2** The points per second (10) is a tunable in `src/game/config.ts`.

## Non-Functional Requirements

- **NFR1 Tunables:** The time limit, warning window, collectible speed factors, time bonus rate, and stage difficulty values live in `src/game/config.ts`.
- **NFR2 VIRUS reaction time:** At Stage 1 start, a VIRUS takes at least 1.2 seconds to reach HUMAN (Q5 B). The test floor at `tests/game/config.test.ts:111-120` drops from 1.5 s to 1.2 s. Stage 1 VIRUS speed does not change, so today's 1.705 s still applies.
- **NFR3 Clearable in time:** With perfect catching, every stage's minimum clear time (required count divided by the collectible supply rate, plus the first spawn delay) is at most 60 seconds, which leaves at least 30 seconds of margin under the 90-second limit. A test checks this from the config values.
- **NFR4 First heart loss unchanged:** The existing beginner simulation (`tests/game/first-heart.test.ts`) still gives a median first-life-lost time of 5-10 seconds.
- **NFR5 Quality gates:** Game logic changes are test-driven. `npm run typecheck`, `npm run coverage` (lines at least 80%), `npm run build`, and `npm run size` pass. Tests that pin changed values are updated to the new values.
- **NFR6 Readability and accessibility:** The timer and `TIME UP` use the existing pixel font and do not rely on color. The time-out cause is also given in the screen reader announcement.
- **NFR7 Dependencies and originality:** No new dependency, backend, or external service. All new visuals and sounds are original.

## Constraints

- Browser HTML5 Canvas game in TypeScript; sound via the Web Audio API (`architecture` rule).
- Game logic stays separate from rendering (`coding-standards` rule).
- No rankings, accounts, online play, or external AI (`scope-guardrails` rule).

## Assumptions

- "Stage 2 as hard as Stage 4" covers the difficulty values (speed, spawn interval, VIRUS share, max objects). Required counts stay as they are because Q1 did not ask to change them.
- The 1.2-1.5x range from the request is spread across the four stages in equal 0.1 steps (Q4 D).
- The tie rule in FR3.5 favors the player, who made the clearing catch before the time ran out within the same frame.
- The beep reuses the existing sound player and its mute setting, so no new audio settings are needed.
- With a 90-second limit and a 10-point rate, the time bonus is at most about 700 points per stage, so the total score spreads over a few thousand points by clear speed.

## Out of Scope

- A separate "TIME BONUS" line on the stage clear screen (the bonus is added to the score shown in the HUD).
- A score bonus for remaining lives.
- Pause, difficulty selection, or a per-stage time setting in the UI.
- Changes to the title screen, story text, or victory ending.
- Rankings or any online feature.

## Open Questions

- Exact Stage 3 and Stage 4 difficulty values (FR1.2) are set in Code Generation within the ordering rule and NFR3. The user checks the feel on the preview deployment.
