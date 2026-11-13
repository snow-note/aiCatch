# CI/CD Pipeline: u4-accessibility

How the screen-announcement unit is built, checked, and delivered. U4 is a `library` unit inside the single static web build and needs no infrastructure of its own. The checks implement `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u4-accessibility/nfr-design/security-design.md` (SD4-1 to SD4-6) for the components in `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u4-accessibility/nfr-design/logical-components.md`. Component boundaries: ScreenAnnouncer and Bootstrap in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; behaviour: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u4-accessibility/functional-design/functional-spec.md`; C5 and C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

No stage questions were needed; automated CI checks are decided in the CI Pipeline stage.

## Pipeline Stages

1. **Branch**: short-lived feature branch (for example `feature/u4-accessibility`) on top of the U1-U3 work.
2. **Tests first**: failing Vitest tests for `screenAnnouncement` texts and keys, then implement (SD4-5).
3. **Local verification** (recorded Construction Verification Command): `npm run typecheck && npm test && npm run build`; JS bundle within +1 kB of 25.26 kB (SD4-6).
4. **Pull request review** (self-review):
   - No `innerHTML` or `insertAdjacentHTML` in `src/`; the region is written with `textContent` (SD4-1).
   - `#announcer` looked up with `getElementById`; one `try/catch` covers both the build and the write (SD4-2, SD4-4).
   - `src/game/announcer.ts` imports only the `GameView` type; no DOM, storage, or network (SD4-3).
   - The write runs only when `key !== lastKey`, and `lastKey` is updated after the write (SD4-4, NFR1.4).
   - `index.html` still has `#announcer` with `role="status"`, `aria-live="polite"`, and `.visually-hidden` (NFR8.21).
   - `main.ts` edits stay in the announcement section (C5); `package.json` unchanged.
5. **Preview play check** on the Cloudflare Pages preview URL with VoiceOver (macOS Safari and iOS): title, each stage intro, a lost life, stage clear, game over, and victory are announced; catches are not.
6. **Merge** to `main`; Cloudflare Pages deploys production.

## Stage to Gate Mapping

| Stage | Gate | Blocks merge |
|---|---|---|
| Type check | `npm run typecheck` passes (builder typed `GameView`) | yes, by the developer's rule until CI exists |
| Tests | `npm test` passes, including text and key tests | yes, by the developer's rule |
| Build | `npm run build` succeeds within the size note | yes; Cloudflare Pages also runs it |
| Review | Step 4 items hold | yes, by the developer's rule |
| Preview play check | Step 5 items hold | yes, by the developer's rule (FR13.2 is Should Have; a screen-reader gap is logged, not hidden) |
| Automated CI | decided in the CI Pipeline stage | not yet defined |

## Deployment, Rollback, Secrets

| Facet | Choice |
|---|---|
| Strategy | Cloudflare Pages: preview per branch, production on `main` |
| Rollback | Revert the merge commit, or redeploy an earlier Pages build |
| Secrets | None |
| Artifacts | `dist/` built by Pages; not committed |
