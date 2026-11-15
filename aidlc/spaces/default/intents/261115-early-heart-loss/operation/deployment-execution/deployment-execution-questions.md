# Deployment Execution Questions: early-heart-loss

Sources: `aidlc/spaces/default/intents/261115-early-heart-loss/construction/build-and-test/test-results.md` and `build-and-test-summary.md` (all automated targets Met; FR1.4 play check open); the existing pipeline in the workspace: `.github/workflows/ci.yml` (typecheck, coverage, build, size on pull requests to `main` and pushes to `main`), the `main` ruleset requiring the `typecheck, test with coverage, build, size` check, and Cloudflare Pages project `ai-catch` (preview per branch, production on `main`, `https://aicatch.snow-note.com`). Deployment Pipeline was skipped because this pipeline is unchanged.

Pre-deployment facts: branch `feature/early-heart-loss` from `origin/main`, changes not committed; no database, migration, or dependent service; rollback is reverting the merge on `main` or redeploying an earlier Pages build.

## Q1. How should this change be deployed?

A. The agent commits on `feature/early-heart-loss` and pushes it. The developer opens a pull request to `main`; CI and the Cloudflare Pages preview run. The developer plays the preview (Stage 1 at least 3 times for FR1.4, plus a look at Stages 2-4 for the difficulty risk) and merges if it feels right; production then updates. The agent smoke-checks production after the merge.
B. Same as A, but stop after the preview: the pull request stays open and production is not changed in this workflow.
X. Other (please specify)

[Answer]: A

## Q2. What goes into the commit?

A. The game change (`src/game/config.ts`, `src/game/spawner.ts`, `src/game/state.ts`, the four test files), the AI-DLC records for this intent, the refreshed code knowledge base, and the usage report (`.usage/`). Leave out `.kiro/settings/mcp.json` (your local MCP connection change) and machine-local files.
B. Only the game change and its tests; AI-DLC records and `.usage/` stay uncommitted.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.
