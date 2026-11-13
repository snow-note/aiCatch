# Intent Backlog: AI CATCH (four-stage MVP)

Prioritized with MoSCoW, ordered value-first (Q4). Based on `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/intent-capture/intent-statement.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/feasibility/feasibility-assessment.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/feasibility/constraint-register.md`, and `scope-document.md`. These are proto-units for later stages to refine, not final units of work.

"Existing" means the feasibility assessment found the capability already in the current game and expects it to be kept or adapted.

## Backlog

| Order | Item | Scope items | MoSCoW | Existing? | Depends on |
|---|---|---|---|---|---|
| 1 | **Stage progression and AI restoration.** Four stages in order, a required number of collectibles per stage, +25% AI per completed stage, Stage 4 completion ends the game in victory. | S2, S9 | Must | No | — |
| 2 | **Stage collectibles and VIRUS per stage.** The right collectibles fall in each stage, VIRUS falls in every stage, catching and scoring work for every collectible. | S3, S4, S5, S6 | Must | Partly (catching, VIRUS, score) | 1 |
| 3 | **Lives, game over, and restart across stages.** | S7, S12 | Must | Partly (single-screen version) | 1 |
| 4 | **Difficulty by stage.** Falling speed, VIRUS frequency, and the number of objects at once rise from stage to stage. | S8 | Must | No (current difficulty rises over time) | 1, 2 |
| 5 | **Start screen, stage completion feedback, and victory ending.** Shows the current stage, the recovered generation, and the AI restoration level. | S1, S10, S11 | Must | Partly (start screen) | 1 |
| — | *Milestone: the full game is playable from start to victory ending.* | | | | 1-5 |
| 6 | **Original art for the new collectibles and screens.** Mainframe, magnetic tape, floppy disk, AI restoration display, and stage and ending screens in the LCD style. | S13 | Must | Partly (LLM, GPU, ROBOT, VIRUS, HUMAN art) | 2, 5 |
| 7 | **Sound for the new events.** Stage completion and victory sounds alongside the existing sounds. | S13 | Must | Partly | 5 |
| 8 | **Controls and high score check.** Keyboard and touch work across all stages, and the local high score is kept. | S14, S15 | Must | Yes | 1-3 |
| 9 | **Public deployment.** The game builds and is published on Cloudflare Pages from the public GitHub repository. | S16 | Must | No | 1-8 |
| — | *Milestone: feature complete and deployed by 2026-11-30.* | | | | 1-9 |
| 10 | Extra LCD flicker, glitch, and corruption effects | — | Could | No | 6 |
| 11 | Richer stage transition and victory animations | — | Could | No | 5, 6 |
| 12 | Different falling movement per object type | — | Could | Partly (ROBOT sway, VIRUS jitter exist) | 2 |

## Outside This Backlog

Hackathon submission work after 2026-11-30: the demo video (3 minutes or less, on YouTube), the English text description, the Kiro usage write-up, and the category selection. These come from the Kiroween rules (constraint register HC1, HC3, HC5) and are not game features.

## Assumptions & Open Questions

None.
