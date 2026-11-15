# Technology Stack
| Area | Technology | Version | Evidence |
|---|---|---|---|
| Language | TypeScript (strict, ES2022 target, ESNext modules) | 7.0.2 | `package.json`, `tsconfig.json` |
| Bundler / dev server | Vite | 8.3.7 | `package.json`, `vite.config.ts` (`base: './'`, `outDir: dist`) |
| Test runner | Vitest (node environment) | 5.1.0 | `vitest.config.ts` |
| Coverage | @vitest/coverage-v8, 80% line threshold | 5.1.0 | `vitest.config.ts` |
| Runtime | Browser: HTML5 Canvas 2D, Web Audio API, localStorage | n/a | `src/render/renderer.ts`, `src/audio/sound.ts`, `src/game/highscore.ts` |
| Node (build) | Node 24 | 24 | `.node-version` |
| CI | GitHub Actions (ubuntu-latest) | actions/checkout@v7, setup-node@v7 | `.github/workflows/ci.yml` |
| Hosting | Cloudflare Pages (Git integration); security headers via `public/_headers` | n/a | `README.md`, `public/_headers` |
| Usage tooling | Python 3 scripts (stdlib only) + unittest | n/a | `scripts/*.py`, `tests/scripts/` |
## Notes
- Zero runtime dependencies; all `package.json` entries are devDependencies.
- tsconfig: `strict`, `noUnusedLocals`, `noUnusedParameters`, `isolatedModules`, `noEmit`, `types: []`.
- No linter or formatter is configured.
- CSP: `default-src 'self'; connect-src 'none'` etc. (`public/_headers`), so no external requests are possible.
- Size gate: `dist/` must stay under 1 MiB (`scripts/check-size.mjs`).
- Not re-verified in this focused run (outside the snapshot paths); carried over from the prior store.
