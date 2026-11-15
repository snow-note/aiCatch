# CI/CD Pipeline: u3-sound

How the sound unit is built, checked, and delivered. U3 is a `library` unit inside the single static web build and needs no infrastructure of its own. The checks implement `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u3-sound/nfr-design/security-design.md` (SD3-1 to SD3-6) for the components in `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u3-sound/nfr-design/logical-components.md`. Component boundaries: SoundPlayer and Bootstrap in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; behaviour: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u3-sound/functional-design/functional-spec.md`; C5 and C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

No stage questions were needed; automated CI checks are decided in the CI Pipeline stage.

## Pipeline Stages

1. **Branch**: short-lived feature branch (for example `feature/u3-sound`) on top of the U1 and U2 work.
2. **Tests first**: failing Vitest tests for `soundForEvent` and the new cues, then implement.
3. **Local verification** (recorded Construction Verification Command): `npm run typecheck && npm test && npm run build`.
4. **Pull request review** (self-review):
   - No `fetch`, `Audio`, `decodeAudioData`, or URL in `src/audio` (SD3-1).
   - `unlock()` is called only from the START handlers (SD3-3); gain values unchanged (SD3-4).
   - `ASSETS.md` has a sounds line (SD3-5); `package.json` unchanged.
   - `main.ts` edits stay in the sound section (C5).
5. **Preview play check** on the Cloudflare Pages preview URL: every cue plays on desktop and phone; nothing plays on a phone before START; the game runs normally with sound muted.
6. **Merge** to `main`; Cloudflare Pages deploys production.

## Stage to Gate Mapping

| Stage | Gate | Blocks merge |
|---|---|---|
| Type check | `npm run typecheck` passes (`startup` removed from `SoundName`) | yes, by the developer's rule until CI exists |
| Tests | `npm test` passes, including mapping and cue-length tests | yes, by the developer's rule |
| Build | `npm run build` succeeds | yes; Cloudflare Pages also runs it |
| Review | Step 4 items hold | yes, by the developer's rule |
| Preview play check | Step 5 items hold | yes, by the developer's rule |
| Automated CI | decided in the CI Pipeline stage | not yet defined |

## Deployment, Rollback, Secrets

| Facet | Choice |
|---|---|
| Strategy | Cloudflare Pages: preview per branch, production on `main` |
| Rollback | Revert the merge commit, or redeploy an earlier Pages build |
| Secrets | None |
| Artifacts | `dist/` built by Pages; not committed |
