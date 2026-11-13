# Code Generation Plan — AI CATCH

## Summary

- Builds: the AI CATCH browser game (Vite + TypeScript, HTML5 Canvas, Web Audio), client-side only
- Touches: new `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `LICENSE`, `src/`, `tests/` at the project root
- Tests: about 40 Vitest unit tests in 8 files, covering game rules, input, high score, layout and sound timing

## Inputs

- Requirements: [requirements.md](../../inception/requirements-analysis/requirements.md) (FR1–FR9, NFR1–NFR6)
- Stories: [stories.md](../../inception/user-stories/stories.md) (US1.1–US9.1)
- This is zero-Unit work (poc scope, no Units Generation), so there is one build for the whole game. No design stages ran; the technical choices below are made here and recorded in `code-summary.md`.

## Technical Approach

- **Stack**: TypeScript, Vite (dev server and static build), Vitest (unit tests). Exact versions, pinned: `vite` 8.3.7, `vitest` 5.1.0, `typescript` 7.0.2. No runtime dependencies, so the shipped game is only our own code (NFR4).
- **Rendering**: one `<canvas>` for the LCD screen, drawn at a fixed logical resolution of 240 × 160 and scaled with `image-rendering: pixelated` (FR9.1, FR9.5). The console casing is HTML/CSS around the canvas, with a fixed logical size of 320 × 240, scaled as a whole to the largest size that fits the visible area and centred (FR9.5). One casing layout is used in both orientations; whether portrait gets its own layout stays an open design question.
- **Pixel art**: every sprite (HUMAN, LLM MODEL, GPU, ROBOT, VIRUS) is defined in code as a small bitmap of strings and drawn pixel by pixel, so all art is original and costs no download (FR9.2, NFR5).
- **Sound**: every sound is synthesised with Web Audio oscillators from a note list in code. No audio files, so nothing to license and nothing to download (FR8, NFR5). The AudioContext is created on the POWER press, which also unlocks sound on smartphones (FR8.1).
- **Game rules** are pure TypeScript modules with no DOM access, driven by a fixed time step, so they can be unit-tested in Node. The DOM, canvas and audio layer only reads the game state and forwards input.
- **Speeds** are expressed as "seconds to fall the full play-area height" (FR3), converted to logical pixels per second at the logical resolution, so they do not change with screen size or rotation (FR9.6).
- **Interactive elements** carry `data-testid` attributes: `power-button`, `start-button`, `game-canvas`, `console`.
- The person's files (`.gitignore`, `.kiroignore`, `AGENTS.md`, `original_spec.md`, `.vscode/settings.json`, `scripts/`) are not changed. `.gitignore` already does not list `.kiro` (checked), as US9.1 needs.

## Testing Contract
```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "org",
  "ordering": "implement each applicable testable layer, then write and run that layer's tests.",
  "scope": "poc",
  "test_strategy": "minimal",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    }
  ],
  "obligations": {
    "strategy": "minimal",
    "strategy_volume": [
      "One verifiable test per requirement at the narrowest effective level.",
      "At least one happy-path unit test per component.",
      "Unit tests are the default; a bugfix/security scope floor may require an integration or E2E regression when that is the narrowest level that reproduces the defect."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:c5db1280ba0333b655bcf97bdcaeaa0fd9cc0f50807a6ee879935b8aff3e17e0",
  "contract_sha256": "sha256:be5041ec2297dded1a31f328fae6a86555cf649f231018ea8168c9bb8dd811a5"
}
```

### Applying the contract

Methodology is test-after: each layer is implemented, then its tests are written and run. Layers that do not exist in a client-only game are omitted:

- **Data model / database behavior**: not applicable. There is no database; the only data is the game state, which belongs to the business-logic layer.
- **Repository / data access**: the high-score store over `localStorage` (Steps 5 and 6).
- **Business logic**: the game rules (Steps 3 and 4).
- **API / endpoint**: not applicable. There is no server or API (requirements Constraints: no server-side processing).
- **Frontend behavior**: screen fitting, sprites, sound timing, rendering and DOM wiring (Steps 7 and 8).

## Steps

### Step 1: Project structure and production configuration skeleton

- [x] Create `package.json` (name `ai-catch`, `"private": true`, `"type": "module"`, `"license": "MIT"`) with pinned devDependencies `vite` 8.3.7, `vitest` 5.1.0, `typescript` 7.0.2 and scripts `dev` (`vite`), `build` (`vite build`), `preview` (`vite preview`), `typecheck` (`tsc --noEmit`), `test` (`vitest run`)
- [x] Create `tsconfig.json` (strict mode, ES2022, DOM lib, `noEmit`, includes `src` and `tests`)
- [x] Create `vite.config.ts` (relative `base: './'` so the build runs from any static host, output to `dist/`)
- [x] Create `index.html` (viewport meta with `viewport-fit=cover`, the casing markup with `data-testid` attributes, and the canvas) and `src/style.css` (centring, background colour fill, `image-rendering: pixelated`, `touch-action: none`, no page scrolling)
- [x] Create `src/main.ts` as the entry point (filled in at Step 7)
- [x] Create `LICENSE` with the MIT licence text, copyright "2026 AI CATCH authors" (the developer can replace the holder name)
- [x] Run `npm install` to install the pinned devDependencies and write `package-lock.json`

**Stories**: US9.1 (licence), US8.1 (build set-up)

### Step 2: Bootstrap the test runner

- [x] Create `vitest.config.ts` with `environment: 'node'` and `include: ['tests/**/*.test.ts']`
- [x] Confirm the runner starts: `npx vitest run tests/ --passWithNoTests`
- [x] The exact command for this build's tests is recorded in `unit-test-instructions.md`

**Stories**: none directly (enables all tests)

### Step 3: Business logic — implement

- [x] `src/game/config.ts`: every number from the requirements in one place: logical play area 240 × 160; starting fall times LLM MODEL 4.0 s, ROBOT 3.5 s, VIRUS 3.0 s, GPU 2.5 s; scores 100 / 150 / 200; 3 starting lives; spawn interval 1.2 s; 15 s difficulty step; ×0.9 interval and ×1.1 speed per step; cap at 2× (interval 0.6 s, speed 2.0×); VIRUS from 10 s at 20%, +5 points every 15 s, max 40%; GAME OVER sequence 2.0 s
- [x] `src/game/difficulty.ts`: pure functions of elapsed play time: `spawnInterval(t)`, `speedMultiplier(t)`, `virusShare(t)`, using compounding steps with the caps (FR3.5, FR3.6, FR3.7, assumption A2)
- [x] `src/game/spawner.ts`: picks the next object kind from an injectable random source: VIRUS with probability `virusShare(t)`, otherwise LLM MODEL, GPU and ROBOT in equal shares; picks a random x inside the play area (FR3.6, FR3.7, FR3.8)
- [x] `src/game/objects.ts`: falling-object model (kind, position, size, spawn order) and its per-step movement: straight fall for LLM MODEL and GPU, sideways sway for ROBOT, irregular sideways jitter for VIRUS, all kept inside the play area (FR3.1–FR3.4)
- [x] `src/game/collision.ts`: bounding-box overlap of at least one pixel (FR4.9) and the one-object-per-update rule: VIRUS first, otherwise the earliest-spawned object; the others are removed with no effect (FR4.7, assumption A4)
- [x] `src/game/input.ts`: direction resolver that tracks held left/right sources (keys and touches) and returns the most recently pressed one still held (FR2.1, FR2.2, FR2.4, assumption A5); new-press detection so a key held from earlier does not count (FR1.5)
- [x] `src/game/state.ts`: the game state machine `power-off → startup → title → playing → game-over` advanced by a fixed time step. Covers POWER and START (START from the START button, Enter or Space; arrow keys and other taps do not start), HUMAN movement and edge clamping (FR2.3), spawning and falling, scoring, lives with no invulnerability and no time limit, removal at the bottom with no penalty (FR4.5, FR4.6), game over at 0 lives, the 2.0 s GAME OVER sequence with input ignored, then "PRESS ANY KEY" and restart on a new press with 3 lives and score 0. It emits events (`catch`, `virus-hit`, `life-lost`, `game-over`, `power-on`, `game-start`) for the sound and effects layers

**Stories**: US1.1, US2.1, US3.1, US4.1, US5.1, US6.1

### Step 4: Business logic — write and run its tests

- [x] `tests/game/difficulty.test.ts`: interval and speed at 0 s, 15 s (1.08 s, 1.1×), 30 s (about 0.972 s, 1.21×) and 120 s (0.6 s, 2.0×, no further change); VIRUS share 0% before 10 s, then 20%, 25%, 30%, 35% and 40% from 70 s
- [x] `tests/game/spawner.test.ts`: no VIRUS before 10 s; with a stubbed random source, rescue objects are split equally; x stays inside the play area
- [x] `tests/game/collision.test.ts`: overlap by one pixel counts and no overlap does not; VIRUS wins over a rescue object; with no VIRUS the earliest-spawned object wins
- [x] `tests/game/input.test.ts`: Left then Right gives right; releasing Right while Left is held gives left; a key held from before is not a new press
- [x] `tests/game/state.test.ts`: nothing happens before POWER; POWER starts the startup sequence; only START, Enter or Space start a game from the title; starting fall times per kind; catches add 100 / 150 / 200; a VIRUS removes one life and leaves the score; a second VIRUS straight after removes another life; 3 lives at start; game over at 0 lives; a missed rescue object changes nothing; a press at 1.9 s into GAME OVER is ignored and one at 2.0 s or later restarts with 3 lives and score 0; a key held from play does not restart; no time limit
- [x] Run `npx vitest run tests/game/` and fix until green

**Stories**: US1.1, US2.1, US3.1, US4.1, US5.1, US6.1

### Step 5: Repository / data access — implement

- [x] `src/game/highscore.ts`: a high-score store over an injectable `Storage`. `load()` returns the stored value, or 0 when the value is not a non-negative whole number; `submit(score)` returns whether it is a new high score and saves it only when it is higher. When storage throws on read or write, it keeps the high score in memory for the session and shows no error (FR6.3, FR6.4, FR6.5, FR6.6)

**Stories**: US6.2

### Step 6: Repository / data access — write and run its tests

- [x] `tests/game/highscore.test.ts`: a higher score is saved and reported as new; an equal or lower score is not; invalid stored values (`"abc"`, `"-5"`, `"1.5"`) load as 0; a storage that throws still keeps the session high score
- [x] Run `npx vitest run tests/game/highscore.test.ts` and fix until green

**Stories**: US6.2

### Step 7: Frontend behavior — implement

- [x] `src/render/layout.ts`: pure function that, given the visible viewport size, returns the scale and offset that fit the 320 × 240 casing as large as possible, keeping its aspect ratio, centred (FR9.5, NFR1)
- [x] `src/render/sprites.ts`: original bitmaps for HUMAN, LLM MODEL (brain-like chip), GPU (graphics board), ROBOT (small robot) and VIRUS (spiky digital bug), plus seven-segment digit shapes (FR6.1, FR9.2)
- [x] `src/render/renderer.ts`: draws the LCD screen in two tones (dark segments on a pale green-grey LCD background, with faint "ghost" segments for the unlit LCD look): power-off blank screen, startup sequence, title with high score, play screen with score (seven-segment), lives and HUMAN, falling objects, catch reaction, score-gain text, VIRUS glitch, life-lost warning, GAME OVER, NEW HIGH SCORE, blinking PRESS ANY KEY, high score on the game-over screen (FR6.1, FR6.2, FR6.4, FR6.5, FR7.1–FR7.7, FR9.1, FR9.4)
- [x] `src/audio/sound.ts`: note lists for the startup, game-start, three catch, VIRUS-hit and game-over sounds (the game-over sound ends within 2.0 s), and a player that creates the AudioContext on the POWER press and plays the note lists with square-wave oscillators (FR8.1–FR8.5)
- [x] `src/main.ts`: wires it together: POWER and START buttons, keyboard (arrow keys, Enter, Space, any key on game over), touch on the left or right half of the screen (multi-touch, most recent touch wins), a `requestAnimationFrame` loop driving the fixed time step, the high-score store over `window.localStorage`, and re-fitting the casing on `resize`, `orientationchange` and `visualViewport` resize without pausing the game (FR2, FR9.5, FR9.6)
- [x] `index.html` and `src/style.css`: casing styling (retro handheld look, original design), `data-testid` attributes, no scrolling (FR9.3)

**Stories**: US1.1, US2.1, US4.1, US5.1, US6.2, US7.1, US7.2, US8.1, US8.2

### Step 8: Frontend behavior — write and run its tests

- [x] `tests/render/layout.test.ts`: at 375 × 520 and 667 × 320 the whole casing fits with no overflow; the aspect ratio is kept; the result is centred; a large desktop viewport scales up
- [x] `tests/render/sprites.test.ts`: every sprite has rows of equal width using only the two drawing characters (monochrome); the five object sprites are all different from each other
- [x] `tests/audio/sound.test.ts`: the game-over sound's total length is 2.0 s or less; each of the three catch sounds is different
- [x] Run `npx vitest run tests/render/ tests/audio/` and fix until green

**Stories**: US5.1, US7.1, US8.1

### Step 9: Environment / build configuration

- [x] Run `npm run typecheck` and fix until clean
- [x] Run `npm run build` and confirm the total size of `dist/` is under 1 MB (NFR4)
- [x] Run the full suite once: `npx vitest run tests/`

**Stories**: US8.1

### Step 10: Documentation and traceability

- [x] The stage writes `code-summary.md` (what was built, how to run it, decisions, tests run and not run) and `traceability.json` after this build; no README or other documentation file is added to the project

**Stories**: all

### Step 11: Mouse click restarts after GAME OVER (gate feedback R-02)

Requested at the Code Generation approval gate: "R-02 クリックでも再スタート". On PC a mouse click on the screen now counts as a new press for restart, alongside any key and a tap. It only restarts after the 2.0 s GAME OVER sequence (FR1.5). It does not move HUMAN, does not start a game from the title (story assumption on START, AC1.1.5), and clicks on the casing buttons keep their own meaning.

- [x] `src/main.ts`: in the `pointerdown` handler, pass a mouse press (not on a casing button) to the game as a direction-less press (`state.inputDown('mouse:<pointerId>', null)`), and release it on `pointerup` / `pointercancel`
- [x] `tests/game/state.test.ts`: a direction-less press is ignored at 1.9 s into GAME OVER and restarts with 3 lives and score 0 at 2.0 s; it does not start a game from the title; it does not move HUMAN during play
- [x] Run `npx vitest run tests/game/state.test.ts`, then `npm run typecheck` and `npm run build`, and fix until green

**Stories**: US6.1

## Story-to-Step Traceability

| Story | Steps |
|---|---|
| US1.1 Power on and start | 3, 4, 7 |
| US2.1 Move HUMAN | 3, 4, 7 |
| US3.1 Falling objects and difficulty | 3, 4 |
| US4.1 Catching and scoring | 3, 4, 7 |
| US5.1 Lives and game over | 3, 4, 7, 8 |
| US6.1 Restart | 3, 4, 11 |
| US6.2 High score | 5, 6, 7 |
| US7.1 Retro look and sound | 7, 8 |
| US7.2 Extra effects | 7 |
| US8.1 PC and smartphone | 1, 7, 8, 9 |
| US8.2 Rotation | 7 |
| US9.1 Repository rules | 1 (licence); the public GitHub push is done by the developer |

## Not Checked by Automated Tests

These are checked by playing the game, not by unit tests, and Build and Test will list them:

- The look of the LCD screen, casing and pixel art (AC7.1.1, AC7.1.2), the extra effects (US7.2), and the sounds being heard (AC1.1.2, AC1.1.3)
- 60 fps on the reference devices (AC8.1.4) and the latest four browsers (AC8.1.3)
- Real touch input and rotation on a smartphone (AC2.1.2, AC2.1.5, US8.2)
- The repository being public on GitHub (AC9.1.1, AC9.1.3), after the developer pushes it
