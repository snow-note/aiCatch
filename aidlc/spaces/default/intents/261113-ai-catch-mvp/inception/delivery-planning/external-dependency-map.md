# External Dependency Map: AI CATCH (four-stage MVP)

Things outside the Bolts in `bolt-plan.md` that a Bolt waits on. A **Bolt** is one build pass over a piece of the work that ends in something that runs and is checked. Source: `delivery-planning-questions.md` Q4, the deployment practice in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md`, and unit U5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`.

The game is fully client-side with no external API, data, or other team, so B1-B4 have no external dependencies.

| Dependency | Owner | Lead time | Blocks | If it slips |
|---|---|---|---|---|
| Public GitHub repository | The developer | Minutes | B5 | Keep working locally; publish when ready |
| Cloudflare Pages project connected to the repository (free tier) | The developer | Under an hour, assumed | B5 (public URL) | Show the game from a local `npm run preview` build until it is fixed; the submission still needs a public URL before 2026-12-04 |
| YouTube account for the demo video | The developer | Minutes | Not a Bolt; submission work after B5 | Record the video once the public URL works |

Lead times are the developer's estimates and have not been checked.
