# CI/CD Pipeline: u5-publishing

How the finished game moves from a branch to the public URL. It implements `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u5-publishing/nfr-design/security-design.md` (SD5-1 to SD5-7) and C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`. Components: all of `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md` ship in the one build. Hosting details: `infrastructure-specification.md` in this folder.

No stage questions were needed; automated CI checks (for example a GitHub Actions run of the same commands) are decided in the CI Pipeline stage.

## Pipeline Stages

1. **Branch**: short-lived feature branch (for example `feature/u5-publishing`).
2. **Tests first**: failing Vitest test for `checkTotal` in `tests/tooling/check-size.test.ts`, then implement `scripts/check-size.mjs` (SD5-3).
3. **Local verification** (recorded Construction Verification Command): `npm run typecheck && npm test && npm run build`, then `npm run size` (exit 0) and confirm `dist/_headers` exists.
4. **Pull request review** (self-review):
   - `.node-version` is `24`; `public/_headers` matches NFR5.15 exactly.
   - `package.json` gains only the `size` script; no dependency added.
   - README has every SD5-6 section and the release checklist.
   - `git ls-files` shows no `.env` or secret.
5. **Preview deployment**: Cloudflare Pages builds the branch and posts a preview URL.
6. **Preview release checklist** (README): `curl -sI` headers; console has no CSP error; network panel shows only same-origin requests and load within 2 s (Fast 4G); play check on desktop and phone (60 fps feel, sounds, VoiceOver announcements, portrait and landscape).
7. **Merge** to `main`; Cloudflare Pages deploys production.
8. **Production smoke check**: open the production URL, start a run, and re-check headers once.

## Stage to Gate Mapping

| Stage | Gate | Blocks merge |
|---|---|---|
| Type check | `npm run typecheck` passes | yes, by the developer's rule until CI exists |
| Tests | `npm test` passes, including `checkTotal` tests | yes, by the developer's rule |
| Build | `npm run build` succeeds; `dist/_headers` present | yes; Cloudflare Pages also runs it |
| Size | `npm run size` exits 0 | yes, by the developer's rule |
| Review | Stage 4 items hold | yes, by the developer's rule |
| Preview checklist | Stage 6 items hold | yes, by the developer's rule |
| Automated CI | decided in the CI Pipeline stage | not yet defined |

## Deployment, Rollback, Secrets

| Facet | Choice |
|---|---|
| Strategy | Cloudflare Pages: preview per branch, production on `main` (all-at-once static swap) |
| Rollback | Revert the merge on `main`, or roll back to an earlier production deployment in the Pages dashboard |
| Secrets | None; no Pages environment variables |
| Artifacts | `dist/` built by Pages from the commit; not committed |
