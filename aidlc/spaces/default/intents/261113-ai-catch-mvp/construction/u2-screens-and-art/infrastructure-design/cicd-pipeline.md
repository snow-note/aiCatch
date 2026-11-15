# CI/CD Pipeline: u2-screens-and-art

How U2 changes are built, checked, and delivered. U2 shares the one static build and release flow with every unit. Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/nfr-design/security-design.md` (SD2-1 to SD2-6), `performance-design.md` (PD-1 to PD-7), `logical-components.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/functional-design/functional-spec.md`; components in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; C5 and C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

No stage questions were needed; automated CI checks are left to the CI Pipeline stage.

## Pipeline Stages

1. **Branch**: work on a short-lived feature branch (for example `feature/u2-screens-and-art`) after U1 is in place.
2. **Tests first for pure helpers**: write failing Vitest tests for `screen-timing.ts` and the new sprite checks, then implement.
3. **Local verification** (the recorded Construction Verification Command), before every push: `npm run typecheck && npm test && npm run build`.
4. **Pull request review** (self-review):
   - No `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `fetch`, `<img>`, or `@font-face` added (SD2-1, SD2-2, SD2-6).
   - `package.json` unchanged (PD-4).
   - `main.ts` changes stay in the drawing and layout section (C5); the Renderer receives `state.view` (SD2-3).
   - `ASSETS.md` lists every new sprite and glyph group as original (SD2-5).
   - Bundle size from the build output compared with the previous build (PD-4).
5. **Preview play check** on the Cloudflare Pages preview URL, desktop and phone (portrait and landscape): every screen against `mockups.md`, victory sequence, glitch and warning effects, greyscale outline check, keyboard-only run, DOM check for one `h1` and a `main` landmark.
6. **Merge** to `main`; Cloudflare Pages deploys production.

## Stage to Gate Mapping

| Stage | Gate | Blocks merge |
|---|---|---|
| Type check | `npm run typecheck` passes | yes |
| Tests | `npm test` passes, including new helper and sprite tests | yes |
| Build | `npm run build` succeeds; size within budget | yes |
| Review | Step 4 items hold | yes |
| Preview play check | Step 5 items hold | yes |
| Automated CI | decided in the CI Pipeline stage | not yet defined |

## Deployment, Rollback, Secrets

| Facet | Choice |
|---|---|
| Strategy | Cloudflare Pages: preview per branch, production on `main` |
| Rollback | Revert the merge commit, or redeploy an earlier Pages build |
| Secrets | None |
| Artifacts | `dist/` built by Pages; not committed |
