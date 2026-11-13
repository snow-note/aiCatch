# CI/CD Pipeline: u1-game-rules

How the game-rules unit is built, checked, and delivered. U1 is a `library` unit inside the single static web build: it has no infrastructure, services, or monitoring of its own (no backend, NFR5). The checks below implement the verification points in `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/nfr-design/security-design.md` (SD-1 to SD-8) for the modules listed in `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/nfr-design/logical-components.md`. Component boundaries come from `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`, behaviour from `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/functional-spec.md`, and the build contract (C6) and `main.ts` section rule (C5) from `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

No stage questions were needed: the release flow is already affirmed in the team practices (feature branch, pull request, Cloudflare Pages deploys `main`), and the choice of automated CI checks is left to the later CI Pipeline stage.

## Pipeline Stages

1. **Branch**: work on a short-lived feature branch (for example `feature/u1-game-rules`) off `main`.
2. **Tests first**: for each behaviour, write a failing Vitest test, then implement (team TDD practice).
3. **Local verification** (the recorded Construction Verification Command), run before every push:
   `npm run typecheck && npm test && npm run build`
4. **Unit-specific checks** (by review in the pull request):
   - `src/game/` imports only sibling modules and uses no `window`, `document`, `localStorage`, `fetch`, `XMLHttpRequest`, or `WebSocket` (SD-1, SD-2).
   - `package.json` has no new dependency (SD-8).
   - `main.ts` changes stay inside the U1 section (C5), and the Renderer still compiles with placeholder drawing for the new phases.
5. **Pull request**: push the branch; Cloudflare Pages builds a preview URL from it.
6. **Play check on the preview**: title → Stage 1 starts, objects fall, a stage can be cleared, game over returns to the title (placeholder screens are acceptable until U2).
7. **Merge**: the developer self-reviews and merges to `main`; Cloudflare Pages deploys production.

## Stage to Gate Mapping

| Stage | Gate | Blocks merge |
|---|---|---|
| Type check | `npm run typecheck` passes (C1-C4 contract test) | yes |
| Unit tests | `npm test` passes, existing suite green, new rules covered | yes |
| Build | `npm run build` produces `dist/` | yes |
| Import and dependency review | SD-1, SD-2, SD-8 hold | yes |
| Preview play check | game runs from title to game over | yes |
| Automated CI on pull requests | decided in the CI Pipeline stage | not yet defined |

## Deployment, Rollback, Secrets

| Facet | Choice | Rationale |
|---|---|---|
| Deployment strategy | Cloudflare Pages: preview per branch, production on `main` | Affirmed team practice; static files only |
| Promotion | Preview URL → merge to `main` → production | One environment plus previews; no staging |
| Rollback | Revert the merge commit on `main`, or redeploy an earlier Pages build | Affirmed team practice |
| Secrets | None | No backend, API key, or external service |
| Artifacts | `dist/` built by Pages from the repository; not committed | `dist/` is git-ignored |
