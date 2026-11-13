# Units Generation Questions

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md` (17 components), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/decisions.md` (ADR-001 to ADR-006), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md` (US1.1-US7.1). Team practice: no separate walking-skeleton slice; one developer; the game is one static web build.

A unit of work is a piece of the change that is built, tested, and reviewed on its own in Construction. This stage only describes which units exist and what depends on what; the build order is chosen later, in Delivery Planning.

## Q1. How should the work be split into units?

A. Five units by concern:
   - U1 game rules (`library`): StageCatalog, RunProgress, the new GameState phases, Difficulty and Spawner changes, new object kinds, InputTracker focus-loss clearing, HighScoreStore at victory. Pure logic, tested first.
   - U2 screens and art (`ui`): Renderer, Sprites (new bitmaps, AI face, font glyphs), ConsoleShell (silver-grey casing, POWER removed), Layout. Depends on U1.
   - U3 sound (`library`): SoundPlayer's new and removed cues and their wiring to game events. Depends on U1.
   - U4 accessibility (`library`): ScreenAnnouncer and the hidden live region wiring. Depends on U1.
   - U5 publishing (`packaging`): production build checks, README and licence notes, Cloudflare Pages and GitHub publishing setup. Depends on U1-U4.
B. Three coarser units: U1 game rules; U2 presentation (screens, art, sound, accessibility together); U3 publishing.
C. One unit for all game changes plus one publishing unit.
X. Other (please specify)

[Answer]: A

## Q2. May independent units be built at the same time?

A. Yes: units with no dependency between them (for example screens, sound, and accessibility once the game rules exist) may be built in parallel; each must pass its own tests with only the units it depends on.
B. No: build strictly one unit after another.
X. Other (please specify)

[Answer]: A

## Q3. How do units connect to each other?

A. In-process only: the presentation, sound, and accessibility units read GameState and its event queue (catch, virus-hit, life-lost, stage-start, stage-clear, victory, game-over), as the existing code does. No network or shared storage between units.
B. Other integration (please specify).
X. Other (please specify)

[Answer]: A

## Q4. Deployment model

A. One deployment: all units ship together as a single static web build on Cloudflare Pages; units are not deployed separately.
B. Other (please specify).
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
