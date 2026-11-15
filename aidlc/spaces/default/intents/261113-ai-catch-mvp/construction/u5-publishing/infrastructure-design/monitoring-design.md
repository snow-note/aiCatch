# Monitoring Design: u5-publishing

How the developer knows the published game is up and correct. Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u5-publishing/nfr-design/security-design.md`; `infrastructure-specification.md` in this folder; components in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

The game collects no telemetry: there is no backend, and the CSP (`connect-src 'none'`) blocks any analytics call by design (NFR5). Monitoring is therefore build- and check-based.

## Signals

| Signal | Where | When checked | Healthy |
|---|---|---|---|
| Build status | Cloudflare Pages dashboard, Deployments list; GitHub commit status from the Pages integration | Every push | "Success" on the latest preview and production deployment |
| Build log | Pages deployment details | On failure, and once after the first deployment | Shows Node 24, `npm run build` success, `dist` uploaded |
| Size | `npm run size` locally | Before each merge to `main` | Exit 0, total under 1 MB |
| Headers | `curl -sI https://<project>.pages.dev/` | After the first production deployment and after any `_headers` change | CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` present |
| Console and network | Browser dev tools on the preview URL | Release checklist | No CSP violation, no error, only same-origin requests; load within 2 s with Fast 4G throttling |
| Play check | Desktop and phone on the preview URL | Release checklist | Smooth play, sounds, announcements, layout in portrait and landscape |

## Alerting

None automated for the MVP. The GitHub commit status from the Pages integration shows a failed build on the branch. If the Cloudflare dashboard offers failed-build notifications for Pages (not verified for this design), the developer may enable them; it is optional.

## Incident Handling

A broken production build is handled by rollback (see `infrastructure-specification.md`, Failure and Recovery), then a fix on a branch with a preview check before merging again.
