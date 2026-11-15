# Dependencies
## External (npm, all devDependencies; no runtime dependencies)
| Package | Version | Purpose |
|---|---|---|
| vite | 8.3.7 | dev server and production build |
| typescript | 7.0.2 | type check (`tsc --noEmit`) |
| vitest | 5.1.0 | unit tests |
| @vitest/coverage-v8 | 5.1.0 | line coverage (80% threshold) |
Versions are exact pins in `package.json`; `package-lock.json` is present (not read in detail). Carried over from the prior store; not re-verified in this focused run.
## External (CI)
- `actions/checkout@v7`, `actions/setup-node@v7` (`.github/workflows/ci.yml`).
## Internal module imports (src/)
```
main.ts        -> audio/sound, game/announcer, game/highscore, game/state, render/layout, render/renderer, style.css
game/state     -> collision, config, difficulty, input, objects, run, spawner, types
game/spawner   -> config, objects, types
game/objects   -> config, types
game/difficulty-> config, types
game/run       -> config, types
game/announcer -> types
render/renderer-> game/config, game/types, render/sprites, render/screen-timing
render/screen-timing -> game/config, game/types
audio/sound    -> game/types
```
- Re-verified in this run for `src/game` and `src/render` (import lists of `state.ts:1-29`, `renderer.ts:1-27`, `screen-timing.ts:5-15`, `spawner.ts:1-3`, `difficulty.ts:1-2`, `run.ts:1-2`).
- No circular imports found in the files read. `src/game/` imports nothing from `render/` or `audio/` (logic/rendering separation).
- `src/render/` imports constants from `src/game/config.ts` (OBJECT_W/H, PLAY_W/H, START_LIVES, CLEAR_BAR_FILL, timings).
## Python scripts
- `scripts/aidlc_stage_usage_hook.py` -> `scripts/aidlc_usage.py` (subprocess); `scripts/aidlc_hook_event.py` writes `.usage/hook-events.jsonl`. Python stdlib only.
