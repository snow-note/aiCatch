# Tech Stack Decisions: u5-publishing

The unit keeps the existing stack in `aidlc/spaces/default/codekb/aiCatch/technology-stack.md` (Vite 8.3.7 static build, `base: './'`, output `dist/`). No dependency is added. Requirements: `security-requirements.md` in this folder and `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; contract C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; answers in `nfr-requirements-questions.md`.

| ID | Area | Decision | Rationale | Check |
|---|---|---|---|---|
| NFR8.24 | Build runtime | `.node-version` with `24` at the repository root [Q1] | Cloudflare recommends pinning a modern Node.js version; 24 satisfies Vite (`^20.19.0 \|\| >=22.12.0`) and Vitest (`^22.12.0 \|\| ^24.0.0 \|\| >=26.0.0`); a file is read by production and preview builds alike | Pages build log shows Node 24 |
| NFR8.25 | Size check | `scripts/check-size.mjs` using only Node's built-in `node:fs` and `node:path`, wired as `"size": "node scripts/check-size.mjs"` in `package.json` [Q3]. Its pure total-and-limit function is exported and unit-tested in Vitest | No dependency; ready to be one CI step later | `npm run size`; Vitest |
| NFR8.26 | Headers | `public/_headers` in Cloudflare Pages' `_headers` format; Vite copies `public/` into `dist/` unchanged [Q2] | Native Pages feature; no Worker or config file needed | `dist/_headers` exists after build; `curl -sI` on the preview URL |
| NFR8.27 | Hosting | Cloudflare Pages Git integration (free tier), production branch `main` | Team practice; no other service | Pages settings |

`scripts/` so far holds only the Python usage-tracking tools. The size checker is a separate Node file there; it is a build check, not a usage tool, and touches nothing else in that folder.

Rejected: a size-limit or bundle-analyzer package (new dependency), a `wrangler.toml` or Pages Functions (not needed for static hosting), setting `NODE_VERSION` only in the dashboard (not visible in the repository), and a CSP `<meta>` tag (cannot set `frame-ancestors`).
