# Technology Stack
| Area | Technology | Version | Evidence |
|---|---|---|---|
| Language | TypeScript (strict, ES2022 target, ESNext modules) | 7.0.2 | `package.json`, `tsconfig.json` |
| Bundler / dev server | Vite | 8.3.7 | `package.json`, `vite.config.ts` |
| Test runner | Vitest (node environment, includes `tests/**/*.test.ts`) | 5.1.0 | `vitest.config.ts` |
| Coverage | @vitest/coverage-v8, 80% line threshold over `src/**/*.ts` | 5.1.0 | `vitest.config.ts` |
| Runtime | Browser: HTML5 Canvas 2D, Web Audio API, localStorage, Pointer Events, Visual Viewport API | n/a | `src/render/renderer.ts`, `src/audio/sound.ts`, `src/main.ts` |
| Page | Plain HTML + CSS, no framework, no CSS preprocessor | n/a | `index.html`, `src/style.css` |
| Node (build) | Node 24 | 24 | `.node-version` |
| CI | GitHub Actions (ubuntu-latest) | actions/checkout@v7, setup-node@v7 | `.github/workflows/ci.yml` |
| Hosting | Cloudflare Pages (Git integration); security headers via `public/_headers` | n/a | `README.md`, `public/_headers` |
| Usage tooling | Python 3 scripts (stdlib only) + unittest | n/a | `scripts/*.py`, `tests/scripts/` |
## Notes
- Zero runtime dependencies; all `package.json` entries are devDependencies. Versions re-read from `package.json` this run.
- Text is drawn only with the project's own 3x5 bitmap font on the canvas (`sprites.ts:249`); no web font or DOM text is used for game screens.
- tsconfig: `strict`, `noUnusedLocals`, `noUnusedParameters`, `isolatedModules`, `noEmit`, `types: []` (prior store).
- No linter or formatter is configured. No DOM test environment (jsdom, happy-dom) is installed, so `main.ts` code cannot be unit-tested without adding a dependency (needs approval per the scope guardrails). The renderer is tested with a hand-written fake 2D context (`tests/render/renderer.test.ts:6-31`).
- CSP: `default-src 'self'; connect-src 'none'` etc. (`public/_headers`).
- Size gate: `dist/` must stay under 1 MiB (`scripts/check-size.mjs`).
