## Developer Code Scan Results

Repo: aiCatch (unrecorded project-root repo). Intent: 261113-ai-catch-mvp. Breadth: full. Depth: Standard. Snapshot head commit: 53a3be89113a15be53941297db150eba11dffc2e.

### Scan Coverage
- **Analyzed deeply**:
  - `src/main.ts`
  - `src/game/` (config, state, objects, spawner, difficulty, collision, highscore, input)
  - `src/render/` (renderer, sprites, layout)
  - `src/audio/sound.ts`
  - `src/style.css`, `src/vite-env.d.ts`
  - `index.html`
  - `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `.gitignore`
  - `original_spec.md`
  - `scripts/` (aidlc_usage.py, aidlc_stage_usage_hook.py, aidlc_hook_event.py): function inventory plus full read of the hook script and hook-event script; the first 80 lines and the function list of aidlc_usage.py
  - `tests/game/state.test.ts` (first 60 lines), `tests/render/sprites.test.ts` (whole)
- **Skimmed only**:
  - `tests/audio/`, `tests/game/` (other files), `tests/render/layout.test.ts`: counted test cases per file with a pattern search, bodies not read
  - `tests/scripts/test_aidlc_usage.py`: class and test-method names only
  - `package-lock.json`: not opened; versions taken from `package.json`
  - `LICENSE`: not opened (package.json declares MIT)
- **Left out**:
  - `node_modules/`, `dist/` (ignored by .gitignore, build/dependency output)
  - `scripts/__pycache__/`, `tests/scripts/__pycache__/` (compiled caches; note they are tracked by git despite being caches)
  - `.git/`, `.vscode/`, `.DS_Store` files, `.usage/` (usage-tracking data, not code), `.kiroignore`
  - AI-DLC's own install: `.kiro/`, `aidlc/`, and the AI-DLC marked sections of `AGENTS.md` and `.gitignore`

### Packages Found
- ai-catch — single npm package (private, ESM) — TypeScript — browser game, bundled by Vite into `dist/`
- src/game — module group — TypeScript — pure game rules (no DOM): state machine, objects, spawning, difficulty, collision, input tracking, high score
- src/render — module group — TypeScript — Canvas 2D drawing, bitmap sprites/font, casing fit math
- src/audio — module — TypeScript — Web Audio square-wave note lists
- scripts — Python 3 dev tooling — AI-DLC usage tracking (not shipped with the game)

### Build System
- **Type**: npm scripts + Vite (`vite build`, `vite`, `vite preview`), type check with `tsc --noEmit`, tests with `vitest run`
- **Config Files**: `package.json`, `tsconfig.json`, `vite.config.ts` (base `./`, outDir `dist`), `vitest.config.ts` (node environment, `tests/**/*.test.ts`)
- **Build Dependencies**: `index.html` -> `src/main.ts` -> `src/style.css`, `src/audio/sound`, `src/game/*`, `src/render/*`

### APIs Discovered
- No network or HTTP APIs. No backend.
- Internal TypeScript module APIs: GameState (press/input/update/drainEvents), HighScoreStore, InputTracker, difficulty functions, spawner functions, collision functions, Renderer (onEvent/update/draw), SoundPlayer (unlock/play), fitCasing.
- Browser APIs consumed: Canvas 2D, Web Audio, localStorage (key `ai-catch:high-score`), Pointer/Keyboard events, visualViewport, requestAnimationFrame.
- Python CLI: `aidlc_usage.py` subcommands start/end/report/backfill; `aidlc_stage_usage_hook.py` reads PostToolUse JSON on stdin.

### Frameworks & Libraries
- TypeScript — 7.0.2 (exact pin) — language, strict type check only (noEmit)
- Vite — 8.3.7 (exact pin) — dev server and bundler
- Vitest — 5.1.0 (exact pin) — unit tests
- No runtime dependencies. Python scripts use only the standard library.

### Test Coverage
- **Test Directories**: `tests/audio`, `tests/game`, `tests/render`, `tests/scripts`
- **Test Frameworks**: Vitest (node environment) for TS; `unittest` for Python
- **Coverage Config**: absent (no coverage provider or threshold configured)
- Counts (by pattern search): TS about 75 `it`/`test` calls (audio 5, collision 6, difficulty 11, highscore 8, input 9, spawner 6, state 22, layout 4, sprites 4; `it.each` expands more); Python 60 `test_` methods.
- No tests for `main.ts`, `renderer.ts`, `style.css`, `index.html`.

### Code Quality Indicators
- **Linting**: none (no ESLint, Prettier, or EditorConfig). Quality gate is `tsc` strict plus `noUnusedLocals`/`noUnusedParameters`.
- **CI/CD**: none in the repo (no `.github/`, no pipeline files).
- **Documentation**: no README. Doc comments on most functions, referencing requirement ids (FR/NFR/A#) from the earlier intent 261110. `original_spec.md` is a Japanese product spec.

### Technical Debt Signals
- The game has one flat loop: no stage, level, or objective concept. `GameState.phase` is `power-off | startup | title | playing | game-over` (`src/game/state.ts`). There is no victory phase.
- Object model is fixed to `llm | gpu | robot | virus` (`src/game/objects.ts`, `OBJECT_SPRITES`, `FALL_TIME`, `POINTS`). No mainframe, magnetic tape, or floppy disk kinds or sprites.
- Difficulty is time-based (`difficulty.ts`, 15 s steps), not stage-based.
- Rescue/catch has no objective counter or AI restoration percentage; the HUD is score plus lives only (`renderer.ts drawPlaying`).
- Sound events map from `GameEvent` in `main.ts`; new events (stage clear, victory) have no sound or effect mapping.
- Font has no lowercase and lacks characters needed by product text: `%`, `.`, `:`, `'`, `/` are absent from `FONT` (`sprites.ts`); `%` is needed for "AI RESTORED - 100%".
- `renderer.ts` (368 lines) mixes screen drawing, effects, and drawing primitives; no tests.
- `main.ts` holds all DOM/event wiring in one `start()` closure and is untested.
- Mouse press is direction-less (only restarts); desktop mouse cannot steer, touch halves use `window.innerWidth`.
- Python `__pycache__` `.pyc` files are tracked in git.
- `tsconfig` has `types: []` and the engine pins very new major versions; not verified against registries.

## Handoff Summary
- **Intent-relevant finding**: The current game is a single-screen endless catcher with no stages. Evolving to four stages (FORTRAN, COBOL, BASIC, LLM) needs a stage/objective layer in `src/game/state.ts` and `config.ts`, new collectible kinds and sprites in `objects.ts` and `sprites.ts`, a restoration percentage HUD and stage-transition/victory screens in `renderer.ts`, and new sound mappings in `main.ts`/`sound.ts`. Reusable as is: collision, input tracker, high-score store, layout fit, fixed-step loop, event-drain pattern between game and renderer/sound.
- **Risks / follow-up**: Existing tests encode the old single-loop behavior (`tests/game/state.test.ts`, difficulty, spawner) and will need to change with the rules. The 3x5 font lacks `%`, `.`, `:`. Game logic stays DOM-free, and that separation (coding-standards) should be kept. No lint or CI exists; the ci-pipeline stage will start from nothing. The 240x160 canvas is small for the ending text.
