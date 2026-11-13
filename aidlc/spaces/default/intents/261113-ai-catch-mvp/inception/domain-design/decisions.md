# Architecture Decision Records: Domain Design

Decisions for `components.md`, taken from `domain-design-questions.md` (Q1-Q5). Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`, `aidlc/spaces/default/codekb/aiCatch/architecture.md`, `aidlc/spaces/default/codekb/aiCatch/component-inventory.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md`.

Security and compliance, for every decision below: the game is client-only, stores only a local high score, handles no personal data, and calls no external service or AI API (NFR5). None of these decisions adds a network call, a new storage location, or a dependency, so none changes the security or compliance position.

## ADR-001: Separate the stage story from the screen phases

- **Context** — The four-stage MVP adds rules that live for a whole run: stage order, progress toward a target, a combined count in Stage 4, AI restoration in 25% steps, and victory after Stage 4 (FR3, FR7, US2.1, US3.1, US4.1). The existing GameState already holds screen phases and play rules. Team practice asks for tests first on game logic and no unnecessary abstractions.
- **Decision** — Add RunProgress (the current run's stage index, progress, AI %, completion) and StageCatalog (fixed stage data, kept in `config.ts`). GameState keeps the screen phases and calls RunProgress (Q1 option A).
- **Consequences** — Positive: the story rules are small pure logic, tested without screens or time; stage data can be tuned without touching rules. Negative: two more modules and one more call boundary inside the game layer.
- **Alternatives Rejected** — Put all stage and run logic in GameState (Q1 option B): fewer files, but a larger class mixing timing, play, and story rules, harder to test in isolation.

## ADR-002: Difficulty and Spawner receive stage parameters

- **Context** — Difficulty must rise from stage to stage and also over time inside a stage (FR6.1, FR6.2). Today Difficulty and Spawner work from elapsed time only.
- **Decision** — Keep them as small pure functions. GameState passes the current stage's starting values, caps, and collectible kinds; Difficulty returns current values from time in stage; Spawner picks from the given kinds and VIRUS share. Neither knows stage numbers (Q2 option A).
- **Consequences** — Positive: the existing tested functions change shape only slightly; per-stage tuning is pure data. Negative: GameState must pass a few more arguments each update.
- **Alternatives Rejected** — Pass the stage number and let each look up its values (Q2 option B): couples two more components to the stage table and spreads stage knowledge.

## ADR-003: New screens are GameState phases

- **Context** — The MVP adds a stage intro (~2 s), stage clear (~2.5 s), and a victory sequence (~3.5 s), removes the power-off and startup screens, and ignores input on the automatic screens (FR1.1-FR1.7, interaction spec).
- **Decision** — Add `stage-intro`, `stage-clear`, and `victory` phases with timers to GameState next to `title`, `playing`, and `game-over`; remove `power-off` and `startup`. The Renderer reads the phase and its elapsed time to draw sequences (Q3 option A).
- **Consequences** — Positive: all timing and input rules are in the tested game layer; drawing stays a pure reader of state. Negative: the existing state and tests for power-off and startup must be rewritten.
- **Alternatives Rejected** — Renderer owns sequence timing and reports completion (Q3 option B): puts rules in the drawing code, against the team rule, and is not testable without a canvas.

## ADR-004: Announcement text is a pure function

- **Context** — Screen readers need a short text per screen (FR13.2, Should Have). DOM access must stay out of the game rules.
- **Decision** — Add ScreenAnnouncer, a pure function from game state to text; Bootstrap writes it into the hidden live region only when it changes (Q4 option A).
- **Consequences** — Positive: the wording is unit-tested; DOM code stays in one place. Negative: one more small module.
- **Alternatives Rejected** — Build the text inside `main.ts` (Q4 option B): untestable without a browser and mixes wording with wiring.

## ADR-005: Extend the existing drawing, sprite, and sound owners

- **Context** — New art (mainframe, magnetic tape, floppy disk, AI face, font glyphs), new sounds (three catches, stage clear, victory), and new screens are needed (FR9, FR11, FR12).
- **Decision** — Sprites owns new bitmaps and glyphs, SoundPlayer owns new tones, Renderer draws new screens and one shared AI restoration bar. No new drawing or audio components (Q5 option A).
- **Consequences** — Positive: one place per concern, as today; no new abstraction. Negative: `renderer.ts` (already the largest file) grows further.
- **Alternatives Rejected** — A separate victory component with its own drawing and sound (Q5 option B): splits drawing code across two places for one screen.

## ADR-006: Entity ownership

- **Context** — Score and lives carry across stages for a run, while stage position belongs to the story (FR4.4, FR5.2). Each entity needs exactly one owner.
- **Decision** — GameState owns GameSession (phase, timers, score, lives, HUMAN, falling objects, events); RunProgress owns Run (stage index, progress, AI %, completion); StageCatalog owns StageDefinition. Score and lives stay in GameSession because they are play values the existing rules already manage.
- **Consequences** — Positive: minimal change to the existing score and lives code; RunProgress stays a pure story tracker. Negative: a "run" is reset in two places (GameSession values and a new Run) when a new run starts; GameState does both together.
- **Alternatives Rejected** — Move score and lives into Run: one place for all run values, but a larger rewrite of tested code with no new benefit for the MVP.
