# Build and Test Questions

Inputs: every `construction/*/code-generation/code-generation-plan.md` (Testing Contract: `mvp` scope floor "Meet an 80% line-coverage floor" and "Run the selected tests in CI before merge"), `unit-test-instructions.md`, and `code-summary.md` for U1-U5; every `nfr-requirements/` and `nfr-design/` artifact; `aidlc-state.md` (CI Pipeline is still ahead; Performance Validation and all Operation stages are skipped); team practice in `aidlc/spaces/default/memory/team.md` (no coverage tool installed; adding a dependency needs approval).

Checked facts: `npm run typecheck && npm test && npm run build` passes (15 files, 200 tests); `npm run size` reports 29,497 bytes. No coverage provider is installed (`node_modules/@vitest/` has only `mocker` and `spy`). `@vitest/coverage-v8@5.1.0` exists on npm and its peer dependency is `vitest: 5.1.0`, matching the project. Nothing has been committed or pushed yet; the Cloudflare Pages project does not exist yet.

The Build and Test rules say a defined quality target may never be lowered, and an applicable target that cannot be measured counts as `Unverified`, which fails the stage. The CI target is owned by the later CI Pipeline stage and is not affected.

## Q1. How is the 80% line-coverage floor measured?

A. Add `@vitest/coverage-v8` pinned to exactly `5.1.0` as a dev dependency, and add a `"coverage": "vitest run --coverage"` script plus a `coverage` block in `vitest.config.ts` (provider `v8`, `include: ['src/**/*.ts']`, reporter `text` and `json-summary`, output under the already git-ignored `coverage/`). Build and Test runs it once on the whole project and records the line percentage. Rendering and wiring files (`src/main.ts`, `src/render/renderer.ts`) stay inside the measured set; if the total is under 80%, the stage reports it as `Not Met` and the failure handling decides the next step.
B. Do not add a tool. The coverage target stays `Unverified`, so this stage fails and stops for your decision.
X. Other (please specify)

[Answer]: A

## Q2. How are the targets that need the live Cloudflare site checked?

These targets can only be measured on a deployed URL, and no later stage in this plan owns them: security headers (NFR5.15), no other-origin requests (NFR5.14), first screen within about 2 s (NFR3.2), public repository and Pages URL (NFR7.1, NFR7.2).

A. You do the U5 Step 8 publishing steps now: commit and push (I commit and push only if you ask me to), make the repository public, create the Pages project, and send me the preview URL. I then check the headers with `curl -sI`, and record your network-panel and load-time results.
B. Leave them for later. They stay `Unverified`, so this stage fails and stops for your decision; the gate lists them.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.

## Q3. How are the commit and push done? (asked after run 2)

A. The agent commits all U1-U5 work as one commit on `feature/u5-publishing` and pushes it to `origin` with `-u`, leaving out the machine-local `.usage/current-stage.json` and `aidlc/.aidlc-turn-counter`; no push to `main`.
B. The developer commits and pushes.
X. Other (please specify)

[Answer]: A
