# CI Configuration: AI CATCH

Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/build-and-test/build-and-test-summary.md` (TC-CI), `test-results.md`, `build-instructions.md`; every `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/*/code-generation/code-summary.md`; `construction/u5-publishing/infrastructure-design/cicd-pipeline.md`; answers in `ci-pipeline-questions.md` (Q1 A, Q2 A, Q3 A).

## Tool and Triggers

| Facet | Choice |
|---|---|
| CI service | GitHub Actions (free for the public repository `snow-note/aiCatch`) |
| Workflow file | `.github/workflows/ci.yml` |
| Triggers | `pull_request` to `main`; `push` to `main` |
| Runner | `ubuntu-latest`, timeout 10 min |
| Node | `actions/setup-node@v7` with `node-version-file: .node-version` (24) and npm cache |
| Checkout | `actions/checkout@v7` (latest release v7.0.1, 2026-07-20) |
| Permissions | `contents: read` only; no secrets; `pull_request` (not `pull_request_target`) |
| Concurrency | One run per ref; a newer push cancels the older run |

## Steps (the Build and Test commands)

| Order | Command | Fails when |
|---|---|---|
| 1 | `npm ci` | lockfile and `package.json` disagree, or install fails |
| 2 | `npm run typecheck` | any TypeScript error |
| 3 | `npm run coverage` | any test fails, or line coverage of `src/**/*.ts` is below 80% (`thresholds: { lines: 80 }` in `vitest.config.ts`) |
| 4 | `npm run build` | Vite build fails |
| 5 | `npm run size` | `dist/` is 1,048,576 bytes or more |

`npm run coverage` replaces `npm test` in CI because it runs the same full suite and also enforces the floor.

## Local Dry Run (2026-11-15)

The same five commands ran in order on the developer machine: all exit 0; 230 tests; lines 596/689 (86.5%); `dist` 29,428 bytes. `npx vitest run --coverage --coverage.thresholds.lines=95` exited 1 with "Coverage for lines (86.5%) does not meet global threshold (95%)", which shows the threshold fails a run when not met. The first real GitHub Actions run happens on the pull request below.

## Deployment (unchanged)

CI only checks. Cloudflare Pages keeps building and deploying on its own Git integration: a preview for every branch push, production on `main`. No deploy step, artifact registry, or token is in CI.

## Developer Steps

1. Open a pull request from `feature/u5-publishing` to `main` on GitHub. The CI run starts and shows as "CI / typecheck, test with coverage, build, size".
2. After that first run is green, add a ruleset for `main`: Settings → Rules → Rulesets → New branch ruleset; target the default branch; enable **Require a pull request before merging** (0 approvals, since you work alone) and **Require status checks to pass**, adding the check `typecheck, test with coverage, build, size`; enable **Block force pushes**. Save as Active.
3. Merge the pull request. Cloudflare Pages then deploys the MVP to production (`https://aicatch.snow-note.com`).
