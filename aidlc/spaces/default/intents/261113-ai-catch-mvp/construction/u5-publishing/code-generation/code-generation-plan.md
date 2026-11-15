# Code Generation Plan: u5-publishing

## Summary

- Builds: the publishing setup: `.node-version` (24), `public/_headers` (CSP and two headers), a dependency-free `npm run size` check under 1 MB, and the project `README.md` with how to play, run, release, and publish
- Touches: new `.node-version`, `public/_headers`, `scripts/check-size.mjs`, `scripts/check-size.d.mts`, `tests/tooling/check-size.test.ts`, `README.md`; `package.json` (one `size` script)
- Tests: about 6 new Vitest unit tests for the size check; headers, Pages settings, and play checked on the Cloudflare preview by the developer

Design inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u5-publishing/nfr-requirements/security-requirements.md`, `tech-stack-decisions.md`, `nfr-requirements-questions.md` (Q1 A, Q2 A, Q3 B); `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u5-publishing/nfr-design/security-design.md` (SD5-1 to SD5-7); `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u5-publishing/infrastructure-design/infrastructure-specification.md`, `monitoring-design.md`, `cicd-pipeline.md`; contract C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; U5 scope in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`; NFR1-NFR7 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; product story in `.kiro/steering/product.md`.

Brownfield: no game code (`src/`) changes. No dependency is added; `package.json` gains only the `size` script. Committing, pushing, making the repository public, and creating the Cloudflare Pages project are the developer's steps (git commits only when the developer asks).

## Testing Contract

```json
{
  "version": 1,
  "methodology": "tdd",
  "source": "team",
  "ordering": "Write a failing Vitest test for each game-logic behaviour, implement until it passes, then check rendering, sound, and input wiring by playing the game.",
  "scope": "mvp",
  "test_strategy": "standard",
  "project_type": "brownfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "- **Methodology**: tdd\n- **Methodology evidence**: The developer chose tests first for game logic. The repository already holds Vitest tests that mirror `src/game`, so the pattern fits the existing layout.\n- **Ordering**: Write a failing Vitest test for each game-logic behaviour, implement until it passes, then check rendering, sound, and input wiring by playing the game.\n- **Framework**: Vitest 5.1.0, `environment: node`, `tests/**/*.test.ts`, run with `npm test`.\n- **Type check**: `npm run typecheck` (`tsc --noEmit`, strict, `noUnusedLocals`, `noUnusedParameters`).\n- **Coverage**: No coverage floor and no coverage tool. The existing suite stays green and new game logic gets tests.\n- **Manual checklist**: Before each release, run a short manual checklist on desktop (keyboard) and smartphone (touch, portrait and landscape).\n- **Not unit-tested**: Rendering, sound, and input wiring (`src/main.ts`, `src/render/renderer.ts`) are checked by playing."
    }
  ],
  "obligations": {
    "strategy": "standard",
    "strategy_volume": [
      "Five to eight tests per component.",
      "Unit tests plus integration tests for key boundaries.",
      "Add E2E, performance, or security tests when requirements demand them."
    ],
    "scope_floor": [
      "Meet an 80% line-coverage floor.",
      "Run the selected tests in CI before merge."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "tdd",
    "runner_step": "Verify the existing test runner/configuration and record the exact unit-scoped command.",
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
      "Verify the existing test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - Red: write the failing tests and record the failing command output.",
      "Data model / database behavior - Green: implement only enough behavior to pass.",
      "Data model / database behavior - Refactor: improve the implementation while tests stay green.",
      "Repository / data access - Red: write the failing tests and record the failing command output.",
      "Repository / data access - Green: implement only enough behavior to pass.",
      "Repository / data access - Refactor: improve the implementation while tests stay green.",
      "Business logic - Red: write the failing tests and record the failing command output.",
      "Business logic - Green: implement only enough behavior to pass.",
      "Business logic - Refactor: improve the implementation while tests stay green.",
      "API / endpoint - Red: write the failing tests and record the failing command output.",
      "API / endpoint - Green: implement only enough behavior to pass.",
      "API / endpoint - Refactor: improve the implementation while tests stay green.",
      "Frontend behavior - Red: write the failing tests and record the failing command output.",
      "Frontend behavior - Green: implement only enough behavior to pass.",
      "Frontend behavior - Refactor: improve the implementation while tests stay green.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:1121fa0710da87e0ae3e845c90c8cbd1117233d864da88f97eff8857e8a72455",
  "contract_sha256": "sha256:02e7e246a2b608612b674a814efe6285e1d7bf6e14057cce5b00bb7e5962bdad"
}
```

Layer mapping for this unit: "Business logic" = the pure `checkTotal` size rule; "Environment/build configuration" = `.node-version`, `public/_headers`, the `size` script, and the Pages settings. There is no data model, repository, API, or frontend behaviour change in this unit.

## Steps

### Step 1 — Project structure (US7.1)
- [x] Work on a feature branch `feature/u5-publishing` created from the current branch with `git switch -c` (U1-U4 work is not yet committed; keep it). Confirm `git check-ignore` ignores none of the new paths.

### Step 2 — Test runner check (US7.1)
- [x] Run `npm test` on the unchanged tree and record that it passes (baseline, 193 tests).

### Step 3 — Business logic, Red: size rule (US7.1; NFR2.5, NFR8.25; SD5-3)
- [x] Create `tests/tooling/check-size.test.ts` importing `checkTotal` and `SIZE_LIMIT` from `../../scripts/check-size.mjs`: `SIZE_LIMIT` is 1,048,576; empty list gives total 0 and ok; several sizes under the limit give their sum and ok; one byte below the limit is ok; exactly the limit is not ok; over the limit is not ok; a custom limit is honoured. Run `npx vitest run tests/tooling` and record the failing output.

### Step 4 — Business logic, Green and Refactor (SD5-3)
- [x] Create `scripts/check-size.mjs` (built-in `node:fs`, `node:path`, `node:url` only): export `SIZE_LIMIT` and `checkTotal(sizes, limit = SIZE_LIMIT)` returning `{ total, ok }` with `ok = total < limit`. CLI part guarded by "this file is the entry point" (`process.argv[1]` resolved equals `fileURLToPath(import.meta.url)`): walk `dist/` with `readdirSync(dir, { recursive: true, withFileTypes: true })`, count only `isFile()` entries via `statSync`, print the total in bytes and KiB and the limit, exit 0 / 1 / 2 (2 when `dist/` is missing, with "run npm run build first"). Create `scripts/check-size.d.mts` declaring the two exports. Add `"size": "node scripts/check-size.mjs"` to `package.json` scripts (nothing else in `package.json` changes). Run green; refactor while green; run `npm run typecheck`.

### Step 5 — Environment/build configuration (NFR7.2, NFR5.15, NFR8.24, NFR8.26; SD5-1, SD5-2)
- [x] Create `.node-version` with the single line `24`.
- [x] Create `public/_headers` with one rule:
  ```
  /*
    Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
    X-Content-Type-Options: nosniff
    Referrer-Policy: no-referrer
  ```
  No change to `index.html` or `vite.config.ts`.

### Step 6 — Documentation: README (NFR7.3, NFR6.5, NFR1.5, NFR7.1; SD5-6, SD5-7)
- [x] Create `README.md` (English) with: title and tagline "SAVE THE AI. SAVE THE FUTURE."; About (2045 story and the four stages FORTRAN, COBOL, BASIC, LLM restoring AI 25% each, per `.kiro/steering/product.md`); How to Play (Left/Right arrows; START button, Enter, or Space; touch the left or right half on a phone; catch the stage items, avoid VIRUS, 3 lives); Run Locally (`npm ci`, `npm run dev`, `npm test`, `npm run typecheck`, `npm run build`, `npm run size`, Node 24 via `.node-version`); Release Checklist (typecheck, test, build, size, `git ls-files` secret check, preview: `curl -sI` headers, no console CSP error, only same-origin requests, load within 2 s on Fast 4G, play on desktop and phone in portrait and landscape at a smooth ~60 fps, sounds, VoiceOver announcements); Publishing (make `snow-note/aiCatch` public; Cloudflare Pages Git integration with build command `npm run build`, output `dist`, root `/`, production branch `main`, previews on, no environment variables, Web Analytics off; `NODE_VERSION=24` fallback only if the build log does not show Node 24; rollback by revert or earlier deployment); Play Online (placeholder line for the production URL, filled in by the developer); Assets and Originality (all art, sound, and UI original, no third-party assets, see `ASSETS.md`); Built With (TypeScript, HTML5 Canvas, Web Audio API, Vite, Vitest; developed with Kiro, `.kiro/` committed); Licence (MIT, see `LICENSE`).

### Step 7 — Build and full verification (US7.1; NFR2.5, C6)
- [x] Run `npm run typecheck && npm test && npm run build`, then `npm run size`; record the results, the JS bundle size, the `dist/` total, and that `dist/_headers` exists with the Step 5 content. The exit-2 branch (no `dist/`) is confirmed by code review, not by deleting the build.

### Step 8 — Developer publishing steps (NFR7.1, NFR7.2, NFR3.2, NFR5.14, NFR5.15, NFR1.5; not done by the agent)
- [ ] The developer commits and pushes the branches, makes the repository public, creates the Cloudflare Pages project with the README settings, runs the preview release checklist, merges to `main`, and writes the production URL into the README. This box is ticked when the developer reports it done.

### Step 9 — Documentation and traceability
- [x] Then `code-summary.md`, `source-manifest.json`, `traceability.json` (stage Step 5).

## Story Traceability

| Story | Plan steps |
|---|---|
| US7.1 | 1-9 |
