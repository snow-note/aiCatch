# Risk and Sequencing Rationale: AI CATCH (four-stage MVP)

Why the Bolts in `bolt-plan.md` run in this order. A **Bolt** is one build pass over a piece of the work that ends in something that runs and is checked. Inputs: `delivery-planning-questions.md` (Q1-Q5), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work-dependency.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/refined-mockups/mockups.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md`.

## Heuristic

**Value-first** (in the sense of Mike Cohn's value-driven ordering: deliver the most valuable working increment first), within the order the dependency graph allows (Q1). No formal scoring model such as WSJF (Weighted Shortest Job First: value and urgency divided by size) is used: with five units and one dependency chain, the order follows directly from value and dependencies (Q2).

## Order and Reasons

| Order | Bolt | Reason |
|---|---|---|
| 1 | B1 U1 game rules | Everything else depends on it. It also delivers the most value: the whole four-stage story becomes playable, even with placeholder screens. It addresses the main worry (Q5): balance can be playtested and tuned early. |
| 2 | B2 U2 screens and art | Turns the playable game into the finished-looking product the judges see; largest remaining value (Design criterion). |
| 3 | B3 U3 sound | Adds feedback and polish; smaller than U2 and independent of it. |
| 4 | B4 U4 accessibility | Should Have content (FR13.2); smallest unit; independent of U2 and U3. |
| 5 | B5 U5 publishing | Needs all units; ends in the public URL before 2026-11-30. |

U3 before U4 is a value choice, not a dependency: either order is allowed by the graph.

## Deviation from Topological Order

None. Every Bolt starts only after the units it depends on are done. U2, U3, and U4 could run in parallel after U1 (the graph allows it), but they run one after another (Q3) so that each merge into the shared `src/main.ts` (contract C5) happens on its own, with the type check and tests passing after each.

## Risks Tackled by the Order

| Risk | How the order handles it |
|---|---|
| Schedule: feature-complete by 2026-11-30 (Q5) | The most valuable unit first; if time runs short, the later, smaller units (U4 Should Have parts) are the ones squeezed. |
| Stage balance (Q5) | B1 makes the full run playable early, leaving time to tune the starting values in `config.ts` during B2-B5. |
| `main.ts` merge conflicts | Serial Bolts; U1 keeps the build green first (contract C5). |
| Small-screen readability of new art and text | Checked in B2's demo on a phone. |
| Cloudflare setup slipping | Last Bolt, with a local-build fallback (`external-dependency-map.md`). |

## Construction Settings

- Iteration: one unit at a time (unit-major): each unit's design stages and code are done and checked before the next unit starts.
- Execution: serial.
- Checkpoints: each completed unit is verified with the project check and approved by the developer.
