# Security Requirements: u5-publishing

Security, size, and publishing requirements for getting the finished game to a public URL. Sources: NFR1-NFR7 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; AC7.1.1-AC7.1.6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`; contract C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; stack in `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`; answers in `nfr-requirements-questions.md` (Q1 A, Q2 A, Q3 B).

U5 is a `packaging` unit, so it has no `functional-spec.md` or `rules.md` of its own (Functional Design does not run for it). The game behaviour it publishes is defined by the U1-U4 functional specs and rules, for example `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/functional-spec.md` and `rules.md`; U5 changes none of it. Its scope comes from U5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`.

## Threat Context

The site is static: `index.html`, one JS file, and one CSS file from `dist/`, served by Cloudflare Pages. It has no server code, no accounts, no forms, and no secrets. The realistic risks are (1) a future change pulling in an external script or request, (2) the page being framed by another site, (3) a secret slipping into the public repository, and (4) an unreproducible build on Cloudflare.

## Requirements

| ID | Requirement | Check |
|---|---|---|
| NFR2.5 | `npm run size` measures every file under `dist/` and exits non-zero when the total is 1 MB (1,048,576 bytes) or more; it prints the total. Run after `npm run build` and before every publish [Q3]. | Run `npm run size`; a test of the size function with sizes just under and at the limit |
| NFR3.2 | The first screen appears within about 2 s on a normal connection: the page loads only its own three files (HTML, JS, CSS), with no web fonts or images to fetch. Pass: in the browser's network panel with "Fast 4G" throttling and cache disabled, the load event fires within 2 s on the preview URL. | Network panel on the preview URL; play check |
| NFR5.14 | The deployed page makes no request to any other origin (no server, external service, or AI API). | Network panel on the preview URL shows only same-origin requests |
| NFR5.15 | Cloudflare Pages sends these headers for every path (one `/*` rule in `public/_headers`) [Q2]: `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`. The game still runs with no CSP violation in the console. | `curl -sI` on the preview URL; browser console on desktop and phone |
| NFR5.16 | No secret, token, or `.env` file is committed; Cloudflare Pages needs no environment variable or secret. | Review of `git ls-files`; `.gitignore` keeps `.env*` |
| NFR6.5 | The README states that all art, sounds, and UI are original work made for AI CATCH, that no third-party assets are used, and points to `ASSETS.md`. | README review |
| NFR7.1 | The GitHub repository `snow-note/aiCatch` is public, carries the MIT `LICENSE`, and has the `.kiro/` directory committed. | Repository page check by the developer |
| NFR7.2 | Cloudflare Pages is connected to that repository with build command `npm run build`, output directory `dist`, production branch `main`, and previews for other branches; the Node.js version comes from a committed `.node-version` file containing `24` [Q1]. | Pages project settings and a successful preview build log |
| NFR7.3 | `README.md` explains what the game is, how to play (keyboard and touch), how to run, test, and build locally, the release checklist (typecheck, test, build, size, preview play check), the public URL, and the licence. | README review |
| NFR1.5 | The published game is play-checked at about 60 fps on a recent desktop browser and a recent smartphone chosen by the developer (AC7.1.1). | Release checklist play check |

NFR5.15 is an addition chosen by the developer in Q2. It enforces NFR5 in the browser: even if a later change added an external request, the browser would block it. `connect-src 'none'` is safe because the game uses no `fetch` or WebSocket; Web Audio and `localStorage` are not governed by CSP. Cloudflare Web Analytics or any other injected script must stay off for this project; the CSP would block it, which is intended (no external service, NFR5).

## Not Applicable Here

| NFR | Reason |
|---|---|
| NFR4, NFR9 | Layout and LCD readability are U2; U5 only re-checks them in the preview play check |
| NFR8 (game rules) | Game-rule testability is U1-U4; U5 keeps `npm test` green. U5's own stack decisions under NFR8 (NFR8.24-NFR8.27) are in `tech-stack-decisions.md` |
