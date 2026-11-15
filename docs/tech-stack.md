# AI CATCH Tech Stack

See also [architecture.md](architecture.md) for the screen flow and module structure.

Consolidated after the final versions of the intents `261113-ai-catch-mvp`, `261115-early-heart-loss`, `261115-stage-time-limit`, `261115-responsive-orientation`, and `261115-ending-message` were completed. The first intent, `261110-ai-catch-game`, is excluded. Every row was checked against the files named in the Evidence column.

## 1. Runtime (what ships to the player)

| Area | Technology | Evidence |
|---|---|---|
| Language | TypeScript 7.0.2 (strict, ES2022, ESNext modules, `noUnusedLocals`, `noUnusedParameters`) | `package.json`, `tsconfig.json` |
| Rendering | HTML5 Canvas 2D; all sprites and the 3x5 pixel font are bitmap rows drawn with rectangles | `src/render/sprites.ts`, `src/render/renderer.ts` |
| Sound | Web Audio API; every cue is a square-wave note list generated at run time, no audio files | `src/audio/sound.ts`, `ASSETS.md` |
| Page | Plain HTML and CSS, no framework. Casing and bezel are drawn in CSS | `index.html`, `src/style.css` |
| Input | Keyboard (arrow keys, Enter, Space) and touch via Pointer Events | `src/game/input.ts`, `src/main.ts` |
| Responsive layout | Visual Viewport API, `orientationchange`, CSS `env(safe-area-inset-*)` | `src/main.ts`, `src/render/layout.ts`, `src/style.css` |
| Accessibility | `aria-live="polite"` announcer region, `aria-hidden` on the canvas | `index.html`, `src/game/announcer.ts` |
| Persistence | `localStorage` only (local high score), guarded for private browsing | `src/main.ts`, `src/game/highscore.ts` |
| Runtime dependencies | None. All `package.json` entries are devDependencies | `package.json` |
| External services at run time | None. CSP sets `connect-src 'none'` | `public/_headers` |

Source layout: game logic in `src/game/`, drawing in `src/render/`, audio in `src/audio/`, wiring in `src/main.ts`. About 2,400 lines of TypeScript in total.

## 2. Build, test, and quality

| Area | Technology | Evidence |
|---|---|---|
| Bundler and dev server | Vite 8.3.7 | `package.json`, `vite.config.ts` |
| Unit tests | Vitest 5.1.0, node environment, 18 test files under `tests/` (game, render, audio, tooling) | `vitest.config.ts`, `tests/` |
| Coverage | `@vitest/coverage-v8`, 80% line threshold on `src/**/*.ts` | `vitest.config.ts` |
| Type check | `tsc --noEmit` | `package.json` |
| Size gate | `scripts/check-size.mjs` (Node built-ins only): `dist/` must stay under 1 MiB | `scripts/check-size.mjs` |
| Node | 24 | `.node-version` |
| Package manager | npm with `package-lock.json` | `package-lock.json` |

No linter, formatter, or DOM test environment is configured.

## 3. Delivery

| Area | Technology | Evidence |
|---|---|---|
| Source control | Git, GitHub repository `snow-note/aiCatch`, feature branches merged by pull request | `git remote -v`, `git log` |
| CI | GitHub Actions on pull requests and pushes to `main`: typecheck, coverage, build, size gate | `.github/workflows/ci.yml` |
| Hosting | Cloudflare Pages (Git integration, preview deployment per branch, production from `main`), served at `https://aicatch.snow-note.com` | `README.md`, `aidlc/.../261115-responsive-orientation/operation/deployment-execution/deployment-log.md` |
| Security headers | CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` via `public/_headers` | `public/_headers` |

## 4. AI-assisted development

| Area | Technology | Evidence |
|---|---|---|
| IDE and agent | Kiro IDE with the project steering rules (`product`, `architecture`, `coding-standards`, `scope-guardrails`, `copyright-policy`, `language`, `usage-tracking`) | `.kiro/steering/` |
| Process | AI-DLC (AI-Driven Development Life Cycle): 6 intents, scopes `poc`, `mvp`, `express`, `bugfix`, with approval gates, written record under `aidlc/`, and 14 specialist agents | `aidlc/spaces/default/intents/intents.json`, `.kiro/agents/` |
| MCP servers | Configured in `.kiro/settings/mcp.json`: `context7` (library docs), `github`, `cloudflare-api`, `cloudflare-docs` | `.kiro/settings/mcp.json` |
| Usage tracking | Kiro hook plus Python 3 stdlib scripts and `unittest`. Records per-stage time and Kiro credits; the report is `.usage/aidlc-usage.md` | `.kiro/hooks/`, `scripts/aidlc_usage.py`, `.usage/aidlc-usage.md` |

Not used: external AI APIs, backends, databases, accounts, analytics, third-party fonts, images, or audio.
