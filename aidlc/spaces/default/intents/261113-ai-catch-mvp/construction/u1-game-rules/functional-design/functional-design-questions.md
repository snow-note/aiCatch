# Functional Design Questions: u1-game-rules

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`, `unit-of-work-story-map.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`, and the existing `src/game/*.ts`.

Already settled upstream and not asked again: stage order, collectibles, required counts (10/12/14/16), points, +500 clear bonus, 3 lives with no refill, screen durations, phase list and per-phase view values (C1), event list (C2), input methods (C4), Stage 4 passing through stage-clear before victory (FR1.4), and objects cleared at stage clear (FR1.5).

## Q1. Where do the shared contract types live?

Contract Design left open where `ObjectKind`, `Phase`, `GameView`, `GameEvent`, `DifficultyValues`, and `StageDefinition` are exported. Today `objects.ts` imports `config.ts`; putting the stage catalogue in `config.ts` would make `config.ts` need `ObjectKind` from `objects.ts`, an import loop.

A. A new type-only file `src/game/types.ts` holds all shared contract types. `config.ts` (with the stage catalogue), `objects.ts`, and `state.ts` import from it; no import loop.
B. Keep `ObjectKind` in `objects.ts`, and move the stage catalogue out of `config.ts` into a new `stages.ts`.
X. Other (please specify)

[Answer]: A

## Q2. How does difficulty rise inside a stage?

Each stage has starting values and a cap (C3). The existing game multiplies by fixed factors every 15 s.

A. In steps: every `DIFFICULTY_STEP_SECONDS` (starting value 8 s) of play in the stage, each value moves an equal part of the way from the stage's start value to its cap, reaching the cap after `DIFFICULTY_STEPS_TO_CAP` steps (starting value 4, so about 32 s). `maxObjects` is rounded down.
B. Keep the existing fixed factors (×0.9 interval, ×1.1 speed, +0.05 VIRUS share every 15 s), stopped at the stage cap.
X. Other (please specify)

[Answer]: A

## Q3. What happens when the screen already holds the stage's maximum number of objects?

A. That spawn is skipped and the spawn timer starts again, so the next object comes one full interval later. No burst of objects when room frees up.
B. The spawn waits and happens as soon as an object leaves the screen.
X. Other (please specify)

[Answer]: A

## Q4. When does VIRUS start falling in a stage?

The existing game holds VIRUS back for the first 10 s of play.

A. From the first spawn of every stage, at the stage's VIRUS share (Stage 1 starts low, 10%). No grace period; simpler and every stage shows VIRUS at once (product §5).
B. Keep a short VIRUS-free grace period at the start of each stage (starting value 3 s).
X. Other (please specify)

[Answer]: A

## Q5. Starting difficulty values per stage

Proposed starting values (tuned later by playtesting). Fall speed is a multiplier on each kind's base fall time; interval is seconds between spawns.

| Stage | Fall speed start → cap | Spawn interval start → cap | VIRUS share start → cap | Max objects start → cap |
|---|---|---|---|---|
| 1 FORTRAN | 1.0 → 1.2 | 1.2 → 1.0 | 0.10 → 0.15 | 3 → 4 |
| 2 COBOL | 1.1 → 1.35 | 1.1 → 0.9 | 0.15 → 0.22 | 4 → 5 |
| 3 BASIC | 1.2 → 1.5 | 1.0 → 0.8 | 0.20 → 0.28 | 4 → 5 |
| 4 LLM | 1.3 → 1.7 | 0.9 → 0.7 | 0.25 → 0.35 | 5 → 6 |

Base fall times: mainframe, magnetic tape, floppy disk 4.0 s each (new, straight falls); LLM 4.0 s, ROBOT 3.5 s, GPU 2.5 s, VIRUS 3.0 s (existing).

A. Use these values.
B. Make every stage gentler (lower speeds and VIRUS shares) and tune up from there.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.
