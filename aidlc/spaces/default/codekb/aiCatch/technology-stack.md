# Technology Stack

| Area | Technology | Version | Evidence |
|---|---|---|---|
| Language | TypeScript (ES2022 target, ESNext modules, Bundler resolution) | 7.0.2 | `package.json`, `tsconfig.json` |
| Bundler / dev server | Vite | 8.3.7 | `package.json`, `vite.config.ts` |
| Test runner | Vitest (node environment) | 5.1.0 | `vitest.config.ts` |
| Rendering | HTML5 Canvas 2D, CSS | n/a | `renderer.ts`, `style.css` |
| Audio | Web Audio API (square oscillators) | n/a | `sound.ts` |
| Persistence | `localStorage` | n/a | `highscore.ts` |
| Dev tooling | Python 3 standard library | n/a | `scripts/*.py` (cache files show CPython 3.14) |
| License | MIT | n/a | `package.json`, `LICENSE` |

Notes:
- Package is `type: module`, private, version 1.0.0.
- Scripts: `dev`, `build`, `preview`, `typecheck` (`tsc --noEmit`), `test` (`vitest run`).
- Versions are exact pins (no ranges). Whether those versions exist or are current was not verified against a registry.
- Vite config: `base: './'` (relative assets), `outDir: dist`.
- tsconfig: `strict`, `noUnusedLocals`, `noUnusedParameters`, `isolatedModules`, `noEmit`, `types: []`; includes `src`, `tests`, and the two config files.
- Fonts: system `Courier New` stack in CSS; in-canvas text uses an own bitmap font. No external font or image files.
- No lint, formatter, or CI tooling.
