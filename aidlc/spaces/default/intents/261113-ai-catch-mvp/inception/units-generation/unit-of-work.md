# Units of Work: AI CATCH (four-stage MVP)

Five units grouping the components in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`, following `units-generation-questions.md` (Q1-Q4) and the ADRs in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/decisions.md`. They implement `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md` and `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md` (story map in `unit-of-work-story-map.md`). The dependency graph is in `unit-of-work-dependency.md`. Build order is chosen later in Delivery Planning.

All units ship together as one static web build on Cloudflare Pages (Q4); none is deployed on its own. Per the team practices, there is no separate walking-skeleton unit.

## Units

| Unit ID | Directory | Kind | Complexity | Deployment |
|---|---|---|---|---|
| U1 | `u1-game-rules` | library | L | embedded in the single web build |
| U2 | `u2-screens-and-art` | ui | L | embedded in the single web build |
| U3 | `u3-sound` | library | S | embedded in the single web build |
| U4 | `u4-accessibility` | library | S | embedded in the single web build |
| U5 | `u5-publishing` | packaging | M | produces the single web build and its hosting |

## U1 — Game rules (`u1-game-rules`)

- **Description**: The four-stage game logic, with no DOM, drawing, or sound code.
- **Components**: StageCatalog (new), RunProgress (new), GameState, Config, Difficulty, Spawner, FallingObjects, Collision, InputTracker, HighScoreStore.
- **Responsibilities**:
  - Stage definitions in `config.ts`: names, collectibles, required counts (10/12/14/16), difficulty starting values and caps, clear bonus (+500).
  - RunProgress: stage order, progress (combined in Stage 4), AI restoration in 25% steps, run completion.
  - GameState phases: title, stage-intro (~2 s), playing, stage-clear (~2.5 s), victory (~3.5 s sequence), game-over (~2 s); power-off and startup removed; input ignored on the automatic screens; objects cleared at stage clear; high score submitted at game over and victory; new events (stage-start, stage-clear, victory).
  - Difficulty and Spawner take the current stage's parameters and time in stage (ADR-002).
  - New object kinds: mainframe, magnetic tape, floppy disk, with points and fall times.
  - InputTracker clears held inputs when the window loses focus.
- **Boundaries**: Exposes GameState (read-only state plus input methods and the event queue) to the other units. Owns GameSession, Run, StageDefinition, FallingObject, HeldInput, HighScore.
- **Implementation notes**: Tests first in Vitest for every behaviour (team practice). Existing tests for power-off, startup, and time-only difficulty are rewritten to the new rules. All tunable numbers in `config.ts`.

## U2 — Screens and art (`u2-screens-and-art`)

- **Description**: Everything the player sees.
- **Components**: Renderer, Sprites, ConsoleShell, Layout, and the drawing and layout parts of Bootstrap.
- **Responsibilities**:
  - New screens: title (story lines, sprites row), stage intro (including the Stage 4 variant), stage clear (AI bar fill), extended HUD (stage, AI %, score, progress, lives), game over (AI bar, REACHED STAGE line, NEW!), victory sequence with the AI face.
  - Shared AI restoration bar.
  - New original bitmaps: mainframe, magnetic tape, floppy disk, AI face (broken and restored looks); font glyphs `%`, `.`, `:`, dash, `/`.
  - Console: silver-grey casing, POWER button removed, "MOVE" hint and START only, single `h1`, `main` landmark.
  - Startup screen drawing removed.
- **Boundaries**: Reads GameState only; never changes game rules.
- **Implementation notes**: Sprite shape checks and layout fit stay unit-tested as today; screens are checked by playing (team practice).

## U3 — Sound (`u3-sound`)

- **Description**: Original synthesized sound cues for the new events.
- **Components**: SoundPlayer, and the event-to-sound mapping in Bootstrap.
- **Responsibilities**: Add catch tones for mainframe, magnetic tape, and floppy disk, a stage-clear sound, and a victory sound; remove the startup sound; unlock audio on the first START press; keep silent failure.
- **Boundaries**: Reacts to GameState events only.
- **Implementation notes**: The sound table stays unit-tested (distinct cues, durations within their screens); hearing them is a play check.

## U4 — Accessibility (`u4-accessibility`)

- **Description**: Screen-reader announcements.
- **Components**: ScreenAnnouncer (new), and the live-region writing in Bootstrap.
- **Responsibilities**: Build the per-screen text as a pure function; write it to a hidden polite live region only when it changes (on entering a screen, and when lives change during play).
- **Boundaries**: Reads GameState only.
- **Implementation notes**: Text builder unit-tested; screen-reader behaviour is a play check (FR13.2 is Should Have).

## U5 — Publishing (`u5-publishing`)

- **Description**: Getting the finished game to a public URL.
- **Components**: none of the game components; build configuration and repository files.
- **Responsibilities**: Confirm the production build passes typecheck, tests, and the 1 MB size budget; update the README (how to play, how to run, asset originality and licence notes); confirm the open-source licence and the committed `/.kiro` directory; set up Cloudflare Pages connected to the GitHub repository with production on `main` and preview URLs for branches.
- **Boundaries**: Changes no game behaviour.
- **Implementation notes**: The Cloudflare and GitHub account steps are done by the developer; this unit documents and checks them. CI checks are decided in the CI Pipeline stage.
