# Infrastructure Specification: u5-publishing

The hosting for AI CATCH. It implements `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u5-publishing/nfr-design/security-design.md` (SD5-1 to SD5-7) and the build contract C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`. Components (ConsoleShell, Bootstrap, and the rest) are in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; all of them ship inside one static build and none needs a server. U5 is a `packaging` unit with no `functional-spec.md` of its own; the game behaviour it hosts is defined by the U1-U4 functional specs (for example `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/functional-spec.md`).

No stage questions were needed.

## Resources

| Resource | Provider | Configuration | Owner of the setup step |
|---|---|---|---|
| Source repository | GitHub, `snow-note/aiCatch` | Public; default branch `main`; MIT `LICENSE`; `.kiro/` committed | Developer (visibility setting) |
| Static hosting | Cloudflare Pages (free tier), Git integration with the repository | Framework preset: none; build command `npm run build`; build output directory `dist`; root directory `/`; production branch `main`; preview deployments for all other branches; no environment variables; Web Analytics off | Developer (dashboard) |
| Build runtime | Cloudflare Pages build image | Node.js 24 from the committed `.node-version` (SD5-1). Not yet verified on a real build: if the first build log does not show Node 24, set `NODE_VERSION=24` in the Pages project as a fallback (a non-secret build setting, the only exception to "no environment variables") | Repository file |
| Response headers | Cloudflare Pages `_headers` | `public/_headers` copied to `dist/_headers`; one `/*` rule with the CSP, `X-Content-Type-Options`, and `Referrer-Policy` of NFR5.15 (SD5-2) | Repository file |
| Domain | `*.pages.dev` subdomain assigned by Pages | No custom domain for the MVP | Cloudflare (automatic) |

No database, storage bucket, Worker, Pages Function, queue, or secret is used (NFR5).

## Environments

| Environment | Source | URL | Purpose |
|---|---|---|---|
| Local | Working tree | `http://localhost:5173` (`npm run dev`), `npm run preview` for the built files | Development and tests |
| Preview | Any non-`main` branch or pull request | The preview URL Pages shows for the deployment (a `*.pages.dev` address) | Release checklist and play checks before merge |
| Production | `main` | `https://<project>.pages.dev` | Public URL for players and judges |

## Capacity and Cost

The build is about 36 KB. Pages serves it from Cloudflare's CDN; the free tier's build and bandwidth allowances are far above what a hackathon game needs. Exact free-tier limits were not re-checked for this design; if the project ever approaches them, the Pages dashboard shows usage.

## Failure and Recovery

| Failure | Effect | Recovery |
|---|---|---|
| A Pages build fails | The previous deployment is expected to stay live (standard Pages behaviour, not yet observed on this project) | Fix and push; the build log in the dashboard names the error |
| A bad change reaches `main` | Players get the broken build | Revert the merge on `main`, or use "Rollback to this deployment" on an earlier production build in the Pages dashboard |
| Cloudflare Pages outage | Game unreachable | None needed for the MVP; the repository can be served from any static host |
