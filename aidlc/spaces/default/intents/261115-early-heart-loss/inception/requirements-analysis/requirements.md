# Requirements: early-heart-loss

Gameplay tuning of the existing AI CATCH MVP so that a first-time player loses the first heart about 5-10 seconds into a run.

## Sources

- Initial description: the person's request (`aidlc engine workspace project-description`): make the first heart loss occur approximately 5-10 s into a typical first-time playthrough with the smallest effective changes; focus on hazards and collision, movement and avoidance, damage frequency and invulnerability, hearts, fairness; no scripted damage; an enhancement, not a redesign. [desc]
- Workflow-selected scope: express. [scope]
- Answers in `requirements-analysis-questions.md`: Q1 B, Q2 A, Q3 all levers (A+B+C+D), Q4 B, Q5 A, Q6 A, Q7 A. [Q1]-[Q7]
- Code facts: `aidlc/spaces/default/codekb/aiCatch/` (business-overview.md, architecture.md, code-structure.md) and the scan handoff `aidlc/spaces/default/intents/261115-early-heart-loss/inception/reverse-engineering/developer-scan.md`.
- Product rules: `.kiro/steering/product.md` §5-§6 (VIRUS in every stage; difficulty rises from stage to stage; a VIRUS contact costs one life).
- Team practice: `aidlc/spaces/default/memory/team.md` and `project.md` (tests first for game logic; every tunable in `src/game/config.ts`; game rules free of DOM code; no new dependency without approval).

## Intent Analysis

Today a first-time player rarely loses a heart early. From the code (analytic estimates, not measured): play starts after a 2.0 s intro, the first object appears 1.2 s into play, only 10% of Stage 1 spawns are VIRUS, a VIRUS takes about 2.3 s to reach HUMAN, and a VIRUS lands at a random x. A player standing still loses the first heart within 10 s only about 8% of the time. The opening therefore feels harmless, and the VIRUS threat is not felt until much later.

The goal is to make the danger felt early through the existing hazard rules, so the first heart is lost about 5-10 s after START for a typical beginner, while every hit stays the fair result of a visible VIRUS that the player could have avoided. Type: enhancement. Scope: game rules (`src/game/`) and their tests. Complexity: simple. Depth: Minimal.

## Functional Requirements

### FR1 — First-heart-loss target

- **FR1.1** — For the beginner model of FR1.2, the median time from the START press to the first life lost, over the seed set of FR1.3, is at least 5.0 s and at most 10.0 s. Because the stage intro lasts 2.0 s, this is 3.0-8.0 s of play. [Q1][Q2]
- **FR1.2** — The beginner model is a fixed, simple input rule: each update it holds Left or Right toward the horizontal centre of the collectible that HUMAN can reach soonest, holds nothing when none is on screen or HUMAN is already under it, and never reacts to VIRUS. It uses only the normal `GameControls` inputs and the read-only `GameView`; it is test code, not part of the shipped game. [Q2]
- **FR1.3** — The check runs as a Vitest test under node with the game's injectable random source: 200 fixed seeds, a fixed 1/60 s step, starting at the START press of a new run, stopping at the first `life-lost` event or after 60 s of game time. A run with no life lost within 60 s counts as 60 s. [Q2]
- **FR1.4** — Before release the developer plays the first stage at least 3 times as a beginner would (catching, not dodging) and confirms the first heart is usually lost around 5-10 s after START. The result is recorded in Build and Test. [Q2]

### FR2 — Tuning of existing levers

All values below are tunables in `src/game/config.ts`; the numbers are starting points and the final values are whatever makes FR1.1 pass. [Q3]

- **FR2.1** — Stage 1 VIRUS share is raised (starting range about 0.25-0.30 at the stage start, with a cap at least as high). [Q3 A]
- **FR2.2** — The first object of every stage appears sooner after play starts than today's one full spawn interval (starting value about 0.5 s), through one new tunable for the first-spawn delay. Later spawns keep the stage's spawn interval. [Q3 B]
- **FR2.3** — VIRUS falls faster in Stage 1 than today (today 3.0 s for the full height at multiplier 1.0), through the existing VIRUS fall time or the Stage 1 fall-speed multiplier. [Q3 C]
- **FR2.4** — Stage 2, 3 and 4 values change only as far as needed to keep the existing rule that each later stage is equal or harder than the one before on every difficulty value and strictly harder on at least one (MVP requirement FR6.1, pinned by `tests/game/config.test.ts`). [Q3 A][product §5]

### FR3 — Aimed VIRUS spawns

- **FR3.1** — In every stage, a share of VIRUS spawns (starting value 1 in 3) is "aimed": its spawn x is HUMAN's centre at the spawn moment minus half the object width, plus a random offset spread uniformly over about ±1 HUMAN width, clamped to the play area. All other spawns keep a uniformly random x. [Q3 D][Q6]
- **FR3.2** — An aimed VIRUS moves exactly like any other VIRUS after it spawns (same fall and jitter); it never follows HUMAN. [Q6]
- **FR3.3** — Whether a VIRUS is aimed and its offset come from the injected random source, so tests are deterministic. The aimed share and the spread are tunables in `src/game/config.ts`. [Q6]

### FR4 — Damage and invulnerability unchanged

- **FR4.1** — A VIRUS contact still costs exactly one life, and only the touched object is removed. No invulnerability window is added. Two hearts may be lost close together; this is accepted. [Q4][Q7]

### FR5 — Hearts unchanged

- **FR5.1** — Runs still start with 3 lives (`START_LIVES = 3`); the HUD still shows 3 heart slots. [Q5]

### FR6 — Existing behaviour kept

- **FR6.1** — Everything not named in FR2-FR3 is unchanged: stage order and required counts, points, scoring, intro and clear durations, collectibles' fall, collision boxes, HUMAN size and speed, in-stage difficulty steps, game over, victory, high score, input, rendering, sound, and announcements. [desc]

## Non-Functional Requirements

- **NFR1** — Fairness (no scripted damage): every life lost comes from a VIRUS that was spawned by the normal spawner, fell by the normal rules, and overlapped HUMAN's collision box. No code path removes a life on a timer or targets the first loss to a time. Checked by code review and by the FR1.3 test stopping only on `life-lost` events. [desc]
- **NFR2** — Avoidability: at the Stage 1 start values, a VIRUS is on screen for at least 1.5 s before it can first touch HUMAN, and HUMAN at `HUMAN_SPEED` can leave the overlap zone within that time. Checked by a unit test computing it from the config values. [desc]
- **NFR3** — Testability: the new logic lives in `src/game/` with no DOM or drawing code, uses the injected random source, and has failing Vitest tests written before the implementation (team TDD practice). [memory:team]
- **NFR4** — The FR1.3 simulation test finishes in under 5 s on the developer's machine and in CI, so `npm run coverage` stays fast. [memory:team]
- **NFR5** — No new dependency, no new asset; the existing gates stay green: `npm run typecheck`, `npm run coverage` (80% line floor), `npm run build`, `npm run size`. [memory:team]
- **NFR6** — Every new tunable lives in `src/game/config.ts`. [memory:project]

## Constraints

- TypeScript, Canvas, Web Audio only; no backend or external service (`project.md` Forbidden).
- Game rules stay free of DOM and drawing code (`project.md` Mandated).
- `product.md` §5: VIRUS appears in every stage and difficulty rises from stage to stage.

## Assumptions

- A "typical first-time playthrough" is a player who tries to catch the falling items and does not yet dodge VIRUS; the FR1.2 model represents that player, and the median over 200 seeds represents "typical". Reason: the person chose this measure in Q2. [Q2]
- The 5-10 s window is measured from the START press, so it includes the 2.0 s Stage 1 intro. [Q1]
- The target applies to Stage 1, the first seconds of a first run; Stages 2-4 only keep their ordering. Reason: the first heart is always lost in Stage 1 under the target. [desc]

## Out of Scope

- Invulnerability frames, extra lives, or any change to the number of hearts. [Q4][Q5]
- Visual or sound changes (for example a warning when an aimed VIRUS spawns).
- Difficulty settings, tutorials, or adaptive difficulty.
- Changes to scoring, stage targets, or the victory sequence.

## Open Questions

- The final tuned values (Stage 1 VIRUS share and cap, first-spawn delay, Stage 1 VIRUS fall, aimed share and spread, and any Stage 2-4 adjustments) are chosen in Code Generation by running the FR1.3 simulation; they are not fixed here.
