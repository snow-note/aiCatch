# Monitoring Design: u2-screens-and-art

The game has no backend, telemetry, or analytics (no external service, NFR5), so U2 has no runtime monitoring. Checks happen at build time and by playing. Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/nfr-design/performance-design.md`, `security-design.md`, `logical-components.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/functional-design/functional-spec.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

## Metrics & KPIs

| Metric | Source | Threshold | Why it matters |
|---|---|---|---|
| JS bundle size (gzip) | `npm run build` output | Growth from U2 under 10 kB; whole build under 1 MB | NFR2, PD-4 |
| Smoothness | Play check on the developer's phone and desktop | No visible stutter at 60 fps | NFR1, PD-1 |
| Unit tests for pure helpers and sprites | `npm test` | All pass | NFR8.14 |

## Alerts

| Alert | Condition | Severity | Routes to |
|---|---|---|---|
| Build or test failure | `npm run typecheck`, `npm test`, or `npm run build` fails | blocks merge | Developer (local run; CI decided in the CI Pipeline stage) |
| Pages build failure | Cloudflare Pages build fails on a branch | blocks merge | Developer (Pages dashboard and pull request status) |

## SLIs / SLOs

| SLI | SLO target | Measurement window |
|---|---|---|
| Not applicable | No runtime service; correctness is checked before each merge | Per pull request |

## Logs & Tracing

No logs or tracing are collected from players. During development, the browser console and performance panel are used ad hoc. Drawing code never writes to the console in production paths.
