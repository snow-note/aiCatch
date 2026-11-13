# NFR Requirements Questions: u5-publishing

Inputs: NFR2, NFR3, NFR5, NFR6, NFR7 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; AC7.1.2-AC7.1.6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`; contract C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`; team practice (Cloudflare Pages connected to GitHub, production on `main`, previews per branch, no secrets, CI decided later).

Checked facts: remote `origin` is `https://github.com/snow-note/aiCatch.git`; `LICENSE` is MIT; `.kiro/` is tracked (382 files); there is no `README.md`; `dist/` is git-ignored and is 36 KB today; Vite 8.3.7 needs Node `^20.19.0 || >=22.12.0` and Vitest 5.1.0 needs `^22.12.0 || ^24.0.0 || >=26.0.0`; the local Node is 26.12.0. Cloudflare's Pages changelog strongly recommends pinning a modern Node.js version, and the build image accepts a version file in the repository or an environment variable ([Cloudflare Pages build image](https://developers.cloudflare.com/pages/configuration/build-image), [Pages changelog](https://developers.cloudflare.com/pages/platform/changelog)).

Already settled and not asked again: build command `npm run build`, output `dist/`, relative base `./` (C6); README with how to play, how to run, and asset originality and licence notes (U5 scope); the Cloudflare and GitHub account steps are done by the developer.

## Q1. How is the Node.js version for the Cloudflare Pages build pinned?

A. Commit a `.node-version` file with `24` (an LTS line that both Vite and Vitest support). It lives in the repository, so production and preview builds read the same value.
B. Set `NODE_VERSION=24` in the Cloudflare Pages dashboard only (no repository file).
C. Do not pin; use whatever the build image provides.
X. Other (please specify)

[Answer]: A

## Q2. Should the site send basic security headers?

A. Yes. Add `public/_headers` (Cloudflare Pages reads it; Vite copies `public/` into `dist/`) with a strict Content-Security-Policy (`default-src 'self'`, no external sources, `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, and `Referrer-Policy: no-referrer`. The game loads only its own files, so nothing else is needed.
B. No. Keep Cloudflare's defaults and add no file.
X. Other (please specify)

[Answer]: A

## Q3. How is the "under 1 MB" size budget (NFR2) checked before publishing?

A. By hand: after `npm run build`, run `du -sk dist` and confirm it is under 1024 KB. The command and the current size go in the README release checklist. No new script.
B. Add a small Node script and an `npm run size` command that fails above 1 MB, ready for the CI Pipeline stage.
X. Other (please specify)

[Answer]: B

## Assumptions & Open Questions

None.
