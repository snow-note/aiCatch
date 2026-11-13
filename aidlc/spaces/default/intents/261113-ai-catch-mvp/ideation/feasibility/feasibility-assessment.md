# Feasibility Assessment: AI CATCH (four-stage MVP)

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/intent-capture/intent-statement.md` (intent statement), `feasibility-questions.md` (answers Q1-Q6), `.kiro/steering/product.md` (authoritative product definition), and the Kiroween 2026 rules summary (`aidlc/spaces/default/intents/261110-ai-catch-game/ideation/intent-capture/kiroween-rules-ja.md`). Market research was not run in this workflow, so no market inputs were used.

## Verdict

**Feasible.** The four-stage MVP described in the intent statement can be delivered by one developer working with Kiro before the 2026-12-04 2:00 PM PT deadline, with no paid services and no external AI service. The main risk is the schedule, not the technology.

## Technical Viability

| Area | Assessment | Basis |
|---|---|---|
| Platform | Viable. A browser game on HTML5 Canvas with Web Audio runs on desktop and mobile browsers with no backend. | Q3, Q6, architecture steering |
| Starting point | Viable. A working single-screen AI CATCH game already exists in this workspace. Its 89 automated tests passed when run during this stage (2026-11-13). | Q1, workspace check |
| Hosting | Viable. The build output is a static site, which Cloudflare Pages can host for free. Source code goes to a public GitHub repository. | Q4, Q6 |
| Regulation | No industry regulation applies. The game stores only a local high score and handles no personal data. | Q2 |
| Skills | The stack the developer already uses (TypeScript, Canvas, Web Audio, Vite, Vitest) covers everything the MVP needs. | Q3 |

## Build on the Existing Game or Start Over (Q1)

The developer asked to extend the existing code if that saves effort, and to start over if extending causes problems. This assessment recommends **extending the existing game (Q1 option A)**.

What the existing game already provides, which the four-stage MVP also needs:
- Horizontal movement with keyboard and touch input, falling objects, catch detection, VIRUS hits, lives, and game over
- Local high-score storage, which falls back safely when storage is unavailable
- The LCD-style screen, console casing, original pixel art, seven-segment digits, and synthesized sound effects
- Scaling to fit desktop and mobile screens
- A test suite and a build that already pass

What the four-stage MVP adds or changes (from `product.md`):
- Four stages (FORTRAN, COBOL, BASIC, LLM) with their own collectibles and a required count per stage, in place of one endless screen
- AI restoration progress from 0% to 100%, in 25% steps
- Stage transition screens and a victory ending ("AI RESTORED — 100%")
- Difficulty that rises by stage, with VIRUS present in every stage, in place of difficulty that rises over time
- New pixel art for the mainframe, magnetic tape, and floppy disk collectibles

The game rules are kept separate from drawing and sound in the existing code, so the stage logic can be added mainly in the rules layer. Starting over would rebuild input, rendering, sound, scaling, and high-score storage that already work and are tested. Switch to starting over (Q1 option B) only if a later design stage finds that the existing structure blocks the stage progression.

This recommendation is an assessment, not a measured effort estimate.

## Risk Summary

The full list is in `raid-log.md`. The highest risks are:
- **Schedule (High):** About three weeks remain until the deadline, and the deadline cannot be extended. The submission also needs a demo video, an English description, and a write-up of how Kiro was used, not only the game.
- **Rule on new work (Low likelihood, High impact):** The rules require the project to be created after the submission period began (2026-10-30) and to disclose any existing code that was brought in. The existing game was built in this repository in the earlier workflow `261110-ai-catch-game` (dated 2026-11-10), after that date. Whether the submission should mention the earlier workflow has not been checked.
- **Originality (Medium):** All sprites and sounds must stay original, and the casing must not resemble Game & Watch or other existing products.

## Assumptions & Open Questions

- [assumption] Cloudflare Pages' free plan is enough for a static game of this size. Its current limits have not been checked.
- [assumption] The existing code was created on or after 2026-11-10, the date of the earlier workflow record. The git history has a single commit dated 2026-11-13, so it cannot show an earlier date.
