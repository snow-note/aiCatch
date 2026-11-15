# Contract Summary: AI CATCH (four-stage MVP)

Contracts between the units in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`, one per edge in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work-dependency.md`. Shapes come from the entities in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; behaviour from `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`. Decisions are in `contract-design-questions.md` (Q1-Q5).

There is no network API and no external consumer: everything is in-process TypeScript inside one static web build. The specs below are TypeScript type contracts (Q1), shown as fenced `ts` shared-schema blocks; the names and fields are binding, the exact file placement is decided in Functional Design. The type check (`npm run typecheck`) is the contract test.

## Contracts

| # | Provider Unit | Consumer | Mechanism | Owner |
|---|---|---|---|---|
| C1 | U1 u1-game-rules | U2 u2-screens-and-art, U4 u4-accessibility | Shared TypeScript type: read-only game view (via `state.view`) and shared phase-duration constants | U1 |
| C2 | U1 u1-game-rules | U2 u2-screens-and-art, U3 u3-sound | Shared TypeScript type: game event union, drained once per frame | U1 |
| C3 | U1 u1-game-rules | U2 u2-screens-and-art, U4 u4-accessibility | Shared TypeScript type: stage definition | U1 |
| C4 | U1 u1-game-rules | Bootstrap wiring (`src/main.ts`, sections owned by U2, U3, U4) | In-process method calls: input and time | U1 |
| C5 | `src/main.ts` shared wiring | U1, U2, U3, U4 | Section ownership of one file | U1 (file skeleton) |
| C6 | U1-U4 | U5 u5-publishing | Build output in `dist/` | U5 |

## C1 — Game view (read-only)

What U2 (drawing) and U4 (announcements) may read. They never write to it.

```ts
// Contract C1. Owner: U1. Consumers: U2, U4. Read-only.
export type Phase =
  | 'title'
  | 'stage-intro'
  | 'playing'
  | 'stage-clear'
  | 'victory'
  | 'game-over';
// 'power-off' and 'startup' are removed.

export interface GameView {
  readonly phase: Phase;
  /** Seconds since the current phase began (drives intro, clear, victory, game-over sequences). */
  readonly phaseTime: number;
  /** True once game-over or victory accepts a new press to return to the title. */
  readonly canReturnToTitle: boolean;

  readonly score: number;
  readonly lives: number;
  readonly best: number;          // high score
  readonly newHighScore: boolean; // set at game over and victory

  readonly stage: StageDefinition;  // the current (or just cleared) stage, see C3
  readonly stageIndex: number;      // 0-3
  readonly caught: number;          // progress toward stage.requiredCount (combined in Stage 4)
  readonly aiRestoration: number;   // 0, 25, 50, 75, 100 (percent)

  readonly human: { readonly x: number; readonly y: number; readonly w: number; readonly h: number };
  readonly objects: ReadonlyArray<{
    readonly kind: ObjectKind;
    readonly x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
  }>;
}

export type ObjectKind =
  | 'mainframe'
  | 'tape'
  | 'floppy'
  | 'llm'
  | 'gpu'
  | 'robot'
  | 'virus';
```

Behaviour: reading never throws and never changes state. Values are always finite and in range (score ≥ 0, 0 ≤ lives ≤ start lives, aiRestoration in 25% steps).

How consumers get the view (review R-01): GameState implements both `GameView` (C1) and `GameControls` (C4) and also exposes a `view: GameView` getter that returns itself typed as `GameView`. Bootstrap passes only `state.view` to the Renderer and to ScreenAnnouncer; their parameters are typed `GameView`, so they cannot call input or time methods.

Values per phase (review R-02):

| Phase | `stageIndex` / `stage` | `caught` | `aiRestoration` |
|---|---|---|---|
| `title` | 0 / Stage 1 | 0 | 0 |
| `stage-intro` | the stage about to be played | 0 | AI % reached so far (before this stage) |
| `playing` | the stage being played | caught so far in this stage | AI % reached so far (before this stage) |
| `stage-clear` | the stage just cleared | equals `stage.requiredCount` | already raised by 25% for the cleared stage |
| `victory` | 3 / Stage 4 (LLM) | equals Stage 4 `requiredCount` | 100 |
| `game-over` | the stage where the run ended | caught in that stage when lives reached 0 | AI % reached (cleared stages only) |

`stageIndex` advances and `caught` resets to 0 only when the next `stage-intro` begins. The stage-clear screen animates the AI bar from `aiRestoration - 25` to `aiRestoration` using `phaseTime`.

Phase durations (review R-04) are shared constants in `src/game/config.ts`, imported by both U1 (to change phase) and U2 (to draw progress):

```ts
// Part of contract C1. Owner: U1. Starting values, tuned by playtesting.
export const STAGE_INTRO_DURATION = 2.0;   // seconds
export const STAGE_CLEAR_DURATION = 2.5;   // seconds
export const VICTORY_DURATION = 3.5;       // seconds before canReturnToTitle
export const GAME_OVER_DURATION = 2.0;     // seconds before canReturnToTitle (existing)
```

## C2 — Game events

What U2 (effects) and U3 (sounds) react to. Bootstrap drains the queue once per frame and passes each event to both, in order.

```ts
// Contract C2. Owner: U1. Consumers: U2, U3.
export type GameEvent =
  | { type: 'run-start' }                                          // a new run begins at Stage 1
  | { type: 'stage-start'; stageIndex: number }                    // stage intro begins
  | { type: 'catch'; kind: Exclude<ObjectKind, 'virus'>; points: number; x: number; y: number } // never 'virus'
  | { type: 'virus-hit'; x: number; y: number }
  | { type: 'life-lost'; lives: number }
  | { type: 'stage-clear'; stageIndex: number; bonus: number; aiRestoration: number }
  | { type: 'victory'; score: number; newHighScore: boolean }
  | { type: 'game-over'; score: number; newHighScore: boolean };
// 'power-on' is removed; 'game-start' is replaced by 'run-start'.
```

Behaviour: events are emitted in the order they happen within an update; each is delivered once. Consumers handle the types they care about and ignore the rest (`switch` with a `default`). VIRUS contact is reported only as `virus-hit` (and `life-lost`), never as `catch` (review R-03).

Visual effects (score pop-up, catch flash and spark, glitch, life warning, blinking prompts) are derived by U2 only from these events and from `phaseTime` (C1); the view carries no effect state (review R-05).

## C3 — Stage definition

The shape of one stage in the StageCatalog (kept in `config.ts`). Consumers use it to draw names, icons, and counts.

```ts
// Contract C3. Owner: U1. Consumers: U2, U4 (read-only).
export interface DifficultyValues {
  readonly fallSpeedMultiplier: number;
  readonly spawnInterval: number;   // seconds
  readonly virusShare: number;      // 0..1
  readonly maxObjects: number;
}

export interface StageDefinition {
  readonly stageNumber: 1 | 2 | 3 | 4;
  readonly name: 'FORTRAN' | 'COBOL' | 'BASIC' | 'LLM';
  readonly collectibles: ReadonlyArray<ObjectKind>; // never includes 'virus'
  readonly requiredCount: number;                   // starting values 10, 12, 14, 16
  readonly difficultyStart: DifficultyValues;
  readonly difficultyCap: DifficultyValues;
  readonly clearBonus: number;                      // starting value 500
}
```

Behaviour: the catalogue has exactly four stages in order; each later stage is equal or harder on every difficulty value and strictly harder on at least one (FR6.1). All numbers are starting values tuned by playtesting.

## C4 — Input and time

How Bootstrap drives U1. These are the only ways anything outside U1 changes the game.

```ts
// Contract C4. Owner: U1. Caller: Bootstrap (src/main.ts).
export interface GameControls {
  /** Enter, Space, or the START button. Starts a run from the title; ignored elsewhere. */
  pressStart(): void;
  /** Any key or touch going down. dir is -1/1 for a left/right source, else null. */
  inputDown(id: string, dir: -1 | 1 | null): void;
  inputUp(id: string): void;
  /** Window lost focus: release every held input. */
  releaseAll(): void;
  /** Advance by dt seconds (fixed step). Non-finite or non-positive dt is ignored. */
  update(dt: number): void;
  /** Take and clear the queued events (C2). */
  drainEvents(): GameEvent[];
}
```

Behaviour:
- `pressStart` and a new `inputDown` on game-over or victory return to the title only when `canReturnToTitle` is true; a key held from play is not a new press (FR1.7).
- Input during stage-intro and stage-clear is ignored; a direction still held when play starts moves HUMAN at once.
- A START button activation is reported once: Bootstrap does not also send it as a key press.
- None of these methods throw.

## C5 — Shared wiring file `src/main.ts`

`src/main.ts` is the composition root shared by several units (Q5).

| Section | Owner | Content |
|---|---|---|
| Skeleton, loop, input wiring, START button | U1 | Fixed-step loop (existing `MAX_FRAME` clamp kept), keyboard, touch halves, START, `releaseAll` on blur, POWER path removed |
| Drawing and layout | U2 | Renderer creation, `renderer.onEvent`, `renderer.draw`, console fit |
| Sound mapping | U3 | Event-to-sound map, first-START unlock |
| Announcement writing | U4 | Live-region element lookup and write-on-change |

Rules:
- U1's change keeps `main.ts` and the Renderer compiling, with placeholder drawing for the new phases, so the build stays green after U1 alone.
- Each unit edits only its own section.
- If U2, U3, and U4 are built in parallel, they are merged one at a time; `npm run typecheck` and `npm test` must pass after each merge.

## C6 — Build output

```yaml
# Contract C6. Owner: U5. Producers: U1-U4 (source). Consumer: Cloudflare Pages.
build:
  command: npm run build
  output_dir: dist/
  base_path: ./            # relative paths, as today
  checks_before_publish:
    - npm run typecheck
    - npm test
    - total size of dist/ under 1 MB (NFR2)
  external_requests: none  # no server, service, or AI API (NFR5)
```

## Contract Ownership Rules

- U1 owns C1-C4 and the `main.ts` skeleton; U5 owns C6. Consumers never edit a contract; they ask the owner for additions (Q2).
- Additive changes (a new field, a new event type, a new object kind) are safe; consumers ignore what they do not use (Q3).
- A breaking change (rename or removal) updates every consumer in the same change and must pass the type check (Q3).
- No contract throws across a boundary. Renderer, SoundPlayer, and the announcement writer handle their own failures (missing canvas, blocked audio, failed DOM write) so the game keeps running. Events are not retried (Q4).

## Open Questions

| Contract | Question | Blocks |
|---|---|---|
| C1 | Exact file that exports the types (for example `state.ts` or a small `types.ts`) and whether `ObjectKind` moves out of `objects.ts` to avoid the `config.ts`/`objects.ts` import loop (Domain Design R-02) | U1 Functional Design |
| C1 | Exact split of the victory sequence's sub-steps (reboot, restore, messages) inside `VICTORY_DURATION`; the Renderer derives them from `phaseTime` | U2 Functional Design |
| C3 | Final starting values for each stage's difficulty | U1 playtesting |
