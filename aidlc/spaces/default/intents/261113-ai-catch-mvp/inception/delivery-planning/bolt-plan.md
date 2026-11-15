# Bolt Plan: AI CATCH (four-stage MVP)

A **Bolt** is one build pass over a piece of the work that ends in something that runs and is checked. Each Bolt here builds one unit from `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`, in an order allowed by `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work-dependency.md` (Q1, Q3 in `delivery-planning-questions.md`). Bolts run one after another (serial). The reasons are in `risk-and-sequencing-rationale.md`.

Inputs also used: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/refined-mockups/mockups.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work-story-map.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md`.

**Walking skeleton**: none. A walking skeleton is a minimal version that runs end to end, built first to prove the pieces connect. The team affirmed that the existing game already does this, so no Bolt carries the marker.

**Way of working**: each Bolt is built on a short-lived feature branch and merged into `main` through a pull request; tests first for game logic; `npm run typecheck`, `npm test`, and `npm run build` pass before merge.

## Sequence

| Order | Bolt | Unit | Stories |
|---|---|---|---|
| 1 | B1 | U1 u1-game-rules | US1.1, US2.1, US3.1, US4.1, US5.1, US7.1 |
| 2 | B2 | U2 u2-screens-and-art | US1.1, US2.1, US3.1, US4.1, US5.1, US6.1 |
| 3 | B3 | U3 u3-sound | US1.1, US6.1 |
| 4 | B4 | U4 u4-accessibility | US6.1 |
| 5 | B5 | U5 u5-publishing | US7.1 |

Milestone: after B2 the full four-stage game is playable with its final look. After B5 it is deployed; target 2026-11-30 (feature-complete and deployed), submission deadline 2026-12-04.

## B1 — Game rules (U1)

- **Definition of Done**:
  - Four stages with their collectibles, required counts, AI restoration, clear bonus, and victory work in game logic, with Vitest tests written first.
  - New phases (stage-intro, stage-clear, victory) replace power-off and startup; input rules and held-key rules hold.
  - Difficulty rises by stage and within a stage.
  - High score is saved at game over and victory.
  - `main.ts` and the Renderer compile with placeholder drawing for the new phases (contract C5).
  - `npm run typecheck`, `npm test`, `npm run build` pass.
- **Confidence hypothesis**: the four-stage run, from title to victory or game over, works and can be played end to end, and the starting values give a game that a first-time player can clear Stage 1 of.
- **Expected demo**: play a full run in the browser with simple placeholder screens: title → four stages → victory, and a run that ends in game over.

## B2 — Screens and art (U2)

- **Definition of Done**:
  - All six screens drawn as in `mockups.md`: title, stage intro (including Stage 4), playing with the extended HUD, stage clear with the AI bar, game over, and the victory sequence with the AI face.
  - New original art: mainframe, magnetic tape, floppy disk, AI face (two looks), font glyphs `%` `.` `:` dash `/`.
  - Silver-grey casing, POWER removed, single `h1`, `main` landmark.
  - Sprite and layout tests pass.
- **Confidence hypothesis**: the screens are readable on the smallest supported screen and the objects can be told apart by shape.
- **Expected demo**: play on desktop and on a phone in portrait and landscape.

## B3 — Sound (U3)

- **Definition of Done**: new catch tones, stage-clear and victory sounds; startup sound removed; first START unlocks audio; sound table tests pass; silent fallback kept.
- **Confidence hypothesis**: each new event has a distinct, original sound that fits its screen's duration.
- **Expected demo**: play with sound on a desktop and a phone.

## B4 — Accessibility (U4)

- **Definition of Done**: ScreenAnnouncer text builder with unit tests; hidden polite live region written only when the text changes.
- **Confidence hypothesis**: a screen-reader user hears which screen is showing and its key values without being flooded.
- **Expected demo**: a screen reader announces the title, each stage, stage clears, and the ending.

## B5 — Publishing (U5)

- **Definition of Done**: production build under 1 MB with no external requests; README with how to play, how to run, and asset originality notes; open-source licence and `/.kiro` committed; Cloudflare Pages connected to the GitHub repository with production on `main`; the public URL plays the game.
- **Confidence hypothesis**: a judge can open the public URL on desktop or phone and play straight away.
- **Expected demo**: open the public URL and play a run; run the pre-release manual checklist on desktop and phone.
