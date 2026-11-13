# Infrastructure Specification: u2-screens-and-art

U2 is the drawing layer and static console page inside the one static web build. It needs no infrastructure of its own; this file records that, and what U2 relies on from the shared hosting that U5 sets up. Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/nfr-design/performance-design.md`, `security-design.md`, `logical-components.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/functional-design/functional-spec.md`; components in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`; build contract C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

No stage questions were needed: hosting is the affirmed team practice (GitHub plus Cloudflare Pages, static only).

## Deployment

| Facet | Choice | Rationale |
|---|---|---|
| Compute model | None; code runs in the player's browser | Static game (NFR5) |
| Networking | Browser fetches `index.html`, one CSS file, and one JS bundle from the same origin; no other request | SD2-1 |
| Storage | None in U2 | Draws only |
| Environments | Shared with all units: Cloudflare Pages production on `main`, preview per branch | Team practice |
| IaC approach | None; Cloudflare Pages is configured once by the developer (U5) | Free tier, no IaC tool |
| Resource sizing | Not applicable; bundle under 1 MB (U2 adds a few kB) | PD-4, NFR2 |

## Infrastructure Services

| Service | Role | Configuration | Notes |
|---|---|---|---|
| Cloudflare Pages | cdn | Serves `dist/` built by `npm run build`; relative asset paths (`base: './'`) | Owned by U5; U2 adds no files outside the bundle |

## Shared Infrastructure

| Shared Resource | Owner Unit | Consumer Units | Access Boundary |
|---|---|---|---|
| Static build (`dist/`) and Pages project | U5 | U1, U2, U3, U4 | Source changes only through pull requests; build command fixed in C6 |
| `src/main.ts` | U1 (skeleton) | U2 (drawing and layout section), U3, U4 | C5 section ownership |
