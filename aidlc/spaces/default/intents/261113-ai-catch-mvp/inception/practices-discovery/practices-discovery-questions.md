# Practices Discovery Questions

Draft under review: `team-practices.md`, `discovered-rules.md`, `evidence.md` (same folder). Evidence: the reverse-engineering knowledge base at `aidlc/spaces/default/codekb/aiCatch/`. The repository has one commit, no CI, no linter or formatter, and no coverage tool.

## Q1. Way of working: where do changes go, and who commits?

A. Work directly on `main`. The developer makes every commit (AI-DLC commits only when asked). Squash merges for any branch AI-DLC creates during construction.
B. Short-lived feature branches merged into `main` through pull requests.
C. Not yet defined.
X. Other (please specify)

[Answer]: B

## Q2. Build a thin end-to-end slice first? A walking skeleton is a minimal version that runs the whole way through, built first to prove the pieces connect before the real features go in.

A. No separate slice: the existing game already runs end to end, so build the four-stage features directly.
B. Yes: first make a bare four-stage run (start, four stages with placeholder art, victory) work end to end, then add the rest.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q3. Testing: when are tests written?

A. Test-after: implement each game-logic module, then write and run its Vitest tests. Rendering, sound, and input wiring are checked by playing the game.
B. Tests first (TDD) for game logic; rendering and sound checked by playing.
C. Not yet defined.
X. Other (please specify)

[Answer]: B

## Q4. Testing: coverage floor

A. Adopt the 80% line-coverage floor for game-logic files only (`src/game/`), measured with Vitest's coverage plugin. Adding that plugin is a new dev dependency, approved here.
B. No coverage floor and no new tool; the existing suite must stay green and new logic gets tests.
C. Not yet defined.
X. Other (please specify)

[Answer]: B

## Q5. Testing: manual checks

A. Before each release, the developer plays a short checklist on desktop (keyboard) and on a smartphone (touch, portrait and landscape).
B. No written checklist; the developer plays as needed.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q6. Deployment: how the game reaches the public URL

A. Cloudflare Pages connected to the GitHub repository: every push to `main` builds and deploys to production. Pull requests or other branches get preview URLs. No separate staging. Rollback by reverting the commit or redeploying an earlier build in Cloudflare.
B. Manual upload of `dist/` to Cloudflare Pages when the developer decides to release.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q7. Deployment: automatic checks before deploy

A. Add a GitHub Actions workflow that runs install, typecheck, tests, and build on every push and pull request (free for public repositories).
B. No CI; the developer runs the checks locally before pushing.
C. Not yet defined.
X. Other (please specify)

[Answer]: C

## Q8. Code style: formatter and linter

A. No new tools: rely on strict TypeScript (`tsc`) and the existing code's style.
B. Add Prettier (formatter) only. New dev dependency, approved here.
C. Add Prettier and ESLint. New dev dependencies, approved here.
D. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q9. Code style: conventions to keep

A. Keep what the code already does: camelCase names, one module per concern under `src/game`, `src/render`, `src/audio`; game rules stay free of DOM and drawing code; all tunable numbers in `src/game/config.ts`; requirement ids may appear in comments.
B. Option A, but drop requirement ids from comments.
C. Not yet defined.
X. Other (please specify)

[Answer]: A

## Q10. Housekeeping: tracked Python cache files

A. Remove the tracked `__pycache__/*.pyc` files from Git and ignore them from now on.
B. Leave them as they are.
C. Not yet defined.
X. Other (please specify)

[Answer]: B

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
