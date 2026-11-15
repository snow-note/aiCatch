# Dependencies
## External (npm, all devDependencies; no runtime dependencies)
| Package | Version | Purpose |
|---|---|---|
| vite | 8.3.7 | dev server and production build |
| typescript | 7.0.2 | type check (`tsc --noEmit`) |
| vitest | 5.1.0 | unit tests |
| @vitest/coverage-v8 | 5.1.0 | line coverage (80% threshold) |
Versions are exact pins in `package.json` (re-read this run); `package-lock.json` is present (not read).
## External (CI)
- `actions/checkout@v7`, `actions/setup-node@v7` (`.github/workflows/ci.yml`).
## Internal module imports (src/)
```
main.ts        -> style.css, audio/sound, game/announcer, game/highscore, game/state, render/layout, render/renderer
game/state     -> collision, config, difficulty, input, objects, run, spawner, types
game/run       -> config, types
game/announcer -> types
game/config    -> types
game/input     -> (nothing)
game/spawner -> config, objects, types
game/objects, game/difficulty -> config, types
game/collision, game/highscore -> (nothing)
render/renderer-> game/config, game/types, render/sprites, render/screen-timing
render/screen-timing -> game/config, game/types
render/layout  -> (nothing)
render/sprites -> (nothing)
audio/sound    -> game/types
```
- Re-verified this run from import lines: `main.ts:1-19`, `state.ts:1-33`, `renderer.ts:1-29`, `screen-timing.ts:5-16`, `run.ts:1-2`, `announcer.ts:6`, `config.ts:2`, `objects.ts`, `spawner.ts`, `difficulty.ts`, `collision.ts`, `highscore.ts`.
- Victory-related coupling: `screen-timing.ts` imports the victory constants from `game/config`; the renderer imports the helpers, so a change of timing constants flows into both. `sprites.ts` is a leaf; adding font glyphs affects only the renderer and `sprites.test.ts`.
- No circular imports found. `src/game/` imports nothing from `render/` or `audio/`.
## Browser APIs relied on
`window.visualViewport` (optional, with `innerWidth/innerHeight` fallback), `getComputedStyle` for insets, `resize`, `orientationchange`, Pointer Events, `requestAnimationFrame`, Canvas 2D `fillRect`/`drawImage`.
## Python scripts
- `scripts/aidlc_stage_usage_hook.py` -> `scripts/aidlc_usage.py` (subprocess); `scripts/aidlc_hook_event.py` writes `.usage/hook-events.jsonl`. Python stdlib only.
