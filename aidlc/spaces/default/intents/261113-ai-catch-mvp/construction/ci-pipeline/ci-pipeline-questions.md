# CI Pipeline Questions

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/build-and-test/build-and-test-summary.md` (TC-CI: "Run the selected tests in CI before merge" is owned by this stage), `test-results.md`, `build-instructions.md`; every `construction/*/code-generation/code-summary.md`; `construction/u5-publishing/infrastructure-design/cicd-pipeline.md` ("automated CI checks are decided in the CI Pipeline stage"); team practice in `aidlc/spaces/default/memory/team.md` (solo developer, short-lived feature branches merged into `main` through pull requests, self-review, Cloudflare Pages builds and deploys on push, no secrets).

Checked facts: the repository has no CI today (no `.github/` folder). The repository is public on GitHub, so GitHub Actions minutes on standard runners are free. The latest action releases are `actions/checkout` v7.0.1 and `actions/setup-node` v7.1.0 (GitHub releases API, 2026-11-15). Node is pinned by `.node-version` (24). Build and Test records these commands: `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `npm run size`, `npm run coverage`.

Already settled and not asked again: deployment stays with Cloudflare Pages Git integration (previews per branch, production on `main`); no secrets, artifact registry, or container image is needed (static site).

## Q1. Which CI tool runs the checks?

A. GitHub Actions: one workflow `.github/workflows/ci.yml` on `pull_request` to `main` and on `push` to `main`, `ubuntu-latest`, `actions/checkout@v7` and `actions/setup-node@v7` with `node-version-file: .node-version` and npm cache, no secrets and `permissions: contents: read`.
B. No CI service; keep running the checks by hand before each merge (TC-CI would then stay unmet).
X. Other (please specify)

[Answer]: A

## Q2. Which quality gates does the workflow run?

A. In order: `npm ci`, `npm run typecheck`, `npm run coverage` (runs the full test suite and fails if line coverage drops below 80%, by adding `thresholds: { lines: 80 }` to the coverage block in `vitest.config.ts`), `npm run build`, `npm run size`. Any failure fails the run.
B. Same as A without the coverage threshold: `npm test` instead of `npm run coverage`; the 80% floor stays a manual check.
X. Other (please specify)

[Answer]: A

## Q3. Does a failing check block the merge into `main`?

A. Yes. After the first run, you turn on a branch protection rule (or ruleset) for `main` in GitHub settings that requires the CI check to pass before a pull request can merge. You do this in the GitHub UI; I document the steps.
B. No. The check shows a red mark on the pull request, but merging is still possible; you decide each time.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.
