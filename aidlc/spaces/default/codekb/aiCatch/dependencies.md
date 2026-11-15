# Dependencies
## External (npm, all devDependencies; no runtime dependencies)
| Package | Version | Purpose |
|---|---|---|
| vite | 8.3.7 | dev server and production build |
| typescript | 7.0.2 | type check (`tsc --noEmit`) |
| vitest | 5.1.0 | unit tests |
| @vitest/coverage-v8 | 5.1.0 | line coverage (80% threshold) |
Versions are exact pins in `package.json`; `package-lock.json` is present (not read in detail). Carried over from the prior store; not re-verified in this run.
## External (CI)
- `actions/checkout@v7`, `actions/setup-node@v7` (`.github/workflows/ci.yml`).
## Internal module imports (src/)
```
main.ts        -> style.css, audio/sound, game/announcer, game/highscore, game/state, render/layout, render/renderer
game/state     -> collision, config, difficulty, input, objects, run, spawner, types
game/spawner   -> config, objects, types
game/objects   -> config, types
game/difficulty-> config, types
game/run       -> config, types
game/announcer -> types
render/renderer-> game/config, game/types, render/sprites, render/screen-timing
render/screen-timing -> game/config, game/types
render/layout  -> (nothing)
render/sprites -> (nothing)
audio/sound    -> game/types
```
- Re-verified in this run: imports of `main.ts:1-7`, `renderer.ts` header, `screen-timing.ts:5-16`, `layout.ts` (none), `sprites.ts` (none). The `game/*` rows are carried over.
- `layout.ts` is a leaf with no imports, so layout rules do not depend on game config; `CASING_W/H` are separate from `PLAY_W/H` (`config.ts:5-6`), and the 240x160 canvas size is duplicated in `index.html:20-21`, `style.css:66-67`, and `config.ts:5-6`.
- No circular imports found in the files read. `src/game/` imports nothing from `render/` or `audio/`.
## Browser APIs relied on by layout and input
`window.visualViewport` (optional, with `innerWidth/innerHeight` fallback), `resize`, `orientationchange` (legacy event), Pointer Events, `requestAnimationFrame`.
## Python scripts
- `scripts/aidlc_stage_usage_hook.py` -> `scripts/aidlc_usage.py` (subprocess); `scripts/aidlc_hook_event.py` writes `.usage/hook-events.jsonl`. Python stdlib only.
