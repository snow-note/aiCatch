## Developer Code Scan Results

### Scan Coverage
- **Analyzed deeply**:
  - `src/game/` (config.ts, state.ts, objects.ts, collision.ts, spawner.ts, difficulty.ts, types.ts, run.ts, input.ts, announcer.ts, highscore.ts)
  - `src/main.ts`
  - `src/render/layout.ts`, `src/render/screen-timing.ts`
  - `src/render/renderer.ts` (life HUD, event effects, bitmap centering read; draw layout skimmed)
  - `src/audio/sound.ts` (event-to-sound mapping and cue table read)
  - `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `public/_headers`, `.github/workflows/ci.yml`, `.node-version`, `scripts/check-size.mjs`
  - `tests/game/config.test.ts` (pins on difficulty values)
- **Skimmed only**:
  - `src/render/sprites.ts` (export list and VIRUS bitmap), `src/style.css`
  - `tests/` (file list, `state.test.ts` test names, `config.test.ts`); other test files not opened
  - `scripts/aidlc_usage.py`, `scripts/aidlc_stage_usage_hook.py`, `scripts/aidlc_hook_event.py`, `tests/scripts/test_aidlc_usage.py` (project usage-tracking tools, headers only)
  - `.usage/` (CSV and report, existence only), `README.md`, `ASSETS.md`, `original_spec.md` (headers and first lines), `LICENSE`, `.gitignore`, `.kiroignore`, `.vscode/settings.json`
- **Left out**: `node_modules/`, `dist/`, `coverage/`, `__pycache__/` folders (ignored by `.gitignore` or build output/caches; not opened); AI-DLC install and workspace (`.kiro/`, `aidlc/`, AI-DLC sections of `AGENTS.md`/`.gitignore`) not scanned as project code.

### Packages Found
- ai-catch — single npm package (private, v1.0.0, ESM) — TypeScript — browser Canvas game, no runtime dependencies (`package.json:1-20`)
- scripts/ — Python 3 helper scripts — usage tracking for AI-DLC (not part of the game build)

### Build System
- **Type**: npm scripts, Vite (bundler/dev server), `tsc --noEmit` type check, Vitest
- **Config Files**: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `.node-version` (24), `.github/workflows/ci.yml`
- **Build Dependencies**: all devDependencies only: vite 8.3.7, typescript 7.0.2, vitest 5.1.0, @vitest/coverage-v8 5.1.0

### APIs Discovered
- No HTTP/network API. Internal contracts C1-C4 in `src/game/types.ts` (GameView, GameEvent, DifficultyValues/StageDefinition, GameControls) — 8 event types, 6 control methods
- Browser APIs used: Canvas 2D, Web Audio, localStorage (key `ai-catch:high-score`), pointer/keyboard events, `visualViewport`

### Frameworks & Libraries
- No runtime framework or library. Dev only: Vite 8.3.7, TypeScript 7.0.2, Vitest 5.1.0, @vitest/coverage-v8 5.1.0

### Test Coverage
- **Test Directories**: `tests/game`, `tests/render`, `tests/audio`, `tests/tooling`, `tests/scripts` (Python unittest)
- **Test Frameworks**: Vitest (node environment), Python unittest
- **Coverage Config**: present; v8 provider, 80% line threshold (`vitest.config.ts`); not executed in this scan

### Code Quality Indicators
- **Linting**: none (no ESLint/Prettier config); strict TypeScript with `noUnusedLocals/Parameters`
- **CI/CD**: `.github/workflows/ci.yml` runs typecheck, coverage, build, size on PR/push to main
- **Documentation**: README with how to play and release checklist; `ASSETS.md`; doc comments cite requirement IDs (FR/BR/NFR)

### Technical Debt Signals
- Game-rule numbers live in one file, `src/game/config.ts`, but some tests pin the Stage 1 values (`tests/game/config.test.ts:79-94`) and will need updates if values change
- Renderer draws the hearts from `START_LIVES` (`src/render/renderer.ts:354`), so changing START_LIVES also changes the HUD slot count
- `src/render/renderer.ts` is 486 lines (largest file); `src/game/state.ts` 296 lines
- No TODO/FIXME markers were seen in the files read

## Handoff Summary
- **Intent-relevant finding**: The first heart is hard to lose in the first 5-10 s of play. Details with evidence:
  - Play starts after a 2.0 s intro (`config.ts:40`, `state.ts:146`). Stage 1 first spawn is at 1.2 s of play, because `spawnTimer` starts at 0 and `spawnInterval` is 1.2 (`config.ts:74`, `state.ts:255-261`).
  - VIRUS share in Stage 1 is only 10% per spawn (`config.ts:74`; `spawner.ts:17`). VIRUS falls the full height in 3.0 s, 53.3 px/s at multiplier 1.0 (`config.ts:23`, `objects.ts:58`).
  - HUMAN occupies y 140-160 and the hit box is 20x20 (`config.ts:11-12`, `state.ts:53`). A VIRUS (16x16 box) first overlaps at y>124, which is 2.33 s after its spawn, so the earliest possible hit is about 3.5 s into play.
  - Only about 6 spawns can reach HUMAN within 10 s of play, so P(at least one VIRUS) is about 47%. Hit probability per VIRUS for a stationary player is about 16% (36 px overlap window out of a 224 px spawn range). This is an analytic estimate, not measured.
  - A hit has no invulnerability: `lives -1`, the VIRUS is removed, other objects stay (`state.ts:287-294`, `state.ts:267-268`). Lives start at 3 (`config.ts:37`). Two VIRUS touched in one update cost one life, and a collectible touched in the same update is dropped (`collision.ts:25-42`).
  - Difficulty steps every 8 s for 4 steps (`config.ts:58-59`, `difficulty.ts:15`), so Stage 1 stays at start values through the whole 8 s window.
- **Risks / follow-up**:
  - Tests pin Stage 1 start/cap values (`tests/game/config.test.ts:79-94`) and stage monotonicity (`:63-78`). They also pin the 2.0 s intro (`tests/game/state.test.ts:108`). Any tuning must update them.
  - Stage 1 `maxObjects: 3` can bind because collectibles stay on screen 4.0 s with a 1.2 s interval (about 3.3 in flight), which silently skips spawns (`state.ts:258`).
  - The intent's "5-10 seconds" may be measured from START press (includes the 2.0 s intro) or from play start; this is not defined in the code.
  - The VIRUS bitmap is 16x12 inside a 16x16 hit box, drawn centered (`sprites.ts:79-92`, `renderer.ts:232`, `renderer.ts:401-404`), so contact begins 2 px before the sprite visually touches.
  - Nothing was executed (no tests/builds), so all behavior statements come from reading code.
