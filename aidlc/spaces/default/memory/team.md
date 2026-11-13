# Team-Level Rules

> This team's affirmed practices and corrections. Loaded after `org.md` as
> strict-additive guidance; contradictions with broader policy are rejected.
> Populated by the practices-discovery affirmation gate. Edit at the gate,
> not directly.

## Way of Working

- **Team shape**: One developer working solo; the developer decides everything.
- **Branching**: Short-lived feature branches merged into `main` through pull requests.
- **Review**: No second reviewer exists. The developer self-reviews each pull request and relies on automated checks.
- **Schedule**: Internal feature-complete 2026-11-30; submission deadline 2026-12-04.
- **Scope control**: Features outside the requirements need prior approval; no backend, accounts, rankings, or multiplayer.

## Walking Skeleton

- **Stance**: No separate walking-skeleton slice. The existing game already runs end to end (input, state, rendering, audio, high score) and builds with Vite. MVP work extends it.
- **End-to-end check**: `npm run build` plus play in the browser.

## Testing Posture

- **Methodology**: tdd
- **Methodology evidence**: The developer chose tests first for game logic. The repository already holds Vitest tests that mirror `src/game`, so the pattern fits the existing layout.
- **Ordering**: Write a failing Vitest test for each game-logic behaviour, implement until it passes, then check rendering, sound, and input wiring by playing the game.
- **Framework**: Vitest 5.1.0, `environment: node`, `tests/**/*.test.ts`, run with `npm test`.
- **Type check**: `npm run typecheck` (`tsc --noEmit`, strict, `noUnusedLocals`, `noUnusedParameters`).
- **Coverage**: No coverage floor and no coverage tool. The existing suite stays green and new game logic gets tests.
- **Manual checklist**: Before each release, run a short manual checklist on desktop (keyboard) and smartphone (touch, portrait and landscape).
- **Not unit-tested**: Rendering, sound, and input wiring (`src/main.ts`, `src/render/renderer.ts`) are checked by playing.

## Guard Policy

<!-- Affirmed by the team. Mode: strict, relaxed, or off. Strict here holds for every intent, whatever one person asks in chat; relaxed or off here applies to every intent whose policy came from its scope, unless project.md or the person sets another; changing this line changes it. A section under the retired Change Control heading, written by an earlier release, is still read. -->

## Deployment

- **Target**: Public GitHub repository plus Cloudflare Pages, free tier, static hosting only.
- **Build**: `npm run build` (`vite build`) outputs `dist/`, which is git-ignored.
- **Release flow**: Cloudflare Pages is connected to GitHub. A push to `main` deploys to production; pull requests and other branches get preview URLs.
- **Environments**: Production plus Pages preview URLs. No staging.
- **Rollback**: Revert the commit on `main`, or redeploy an earlier Pages build.
- **CI**: Not yet defined. To be decided in the CI Pipeline stage.
- **Secrets**: None needed; no backend or external API.

## Code Style

- **Language**: TypeScript, ES2022, ES modules, strict mode.
- **Exports**: Named exports only; no default exports.
- **Structure**: One module per concern under `src/game`, `src/render`, and `src/audio`; `src/main.ts` wires them together. Game rules stay free of DOM and drawing code.
- **Tunable numbers**: All tunable numbers live in `src/game/config.ts`.
- **Naming**: camelCase for functions and variables.
- **Comments**: Requirement ids may appear in comments.
- **Formatter and linter**: None. We rely on strict `tsc` and the existing code style.
- **Dependencies**: Kept to a minimum; adding a library requires prior approval.
- **Python helpers**: `scripts/*.py` are usage-tracking tools only, tested with `unittest`; tracked `__pycache__/*.pyc` files are left as they are.
## Forbidden

<!-- Team-specific forbidden patterns -->

## Mandated

<!-- Team-specific mandates -->

## Corrections

<!-- Self-learning loop appends here. -->
