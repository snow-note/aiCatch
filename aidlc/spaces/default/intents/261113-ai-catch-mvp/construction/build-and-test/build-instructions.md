# Build Instructions: AI CATCH

Sources: every `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/*/code-generation/code-generation-plan.md`, `unit-test-instructions.md`, and `code-summary.md` (U1-U5); C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; answers in `build-and-test-questions.md`.

## Prerequisites

- Node.js 24 (pinned in `.node-version`; Vite 8.3.7 needs `^20.19.0 || >=22.12.0`, Vitest 5.1.0 needs `^22.12.0 || ^24.0.0 || >=26.0.0`). Local checks so far ran on Node 26.12.0.
- npm (ships with Node). No other tool, service, or environment variable.

## Install

```bash
npm ci
```

Dev dependencies, all pinned exactly: `typescript` 7.0.2, `vite` 8.3.7, `vitest` 5.1.0, `@vitest/coverage-v8` 5.1.0 (added in this stage after approval, Q1). There are no runtime dependencies.

## Environment

None. No `.env` file, no secrets, no local services. `localStorage` and Web Audio are browser features used at run time only.

## Build

```bash
npm run typecheck   # tsc --noEmit, strict
npm test            # vitest run, node environment
npm run build       # vite build -> dist/ (relative base './'), copies public/_headers
npm run size        # dist/ total must be under 1,048,576 bytes
npm run coverage    # vitest run --coverage (v8, src/**/*.ts) -> coverage/
```

The recorded Construction Verification Command is `npm run typecheck && npm test && npm run build`.

## Build Verification

- `dist/index.html`, one `dist/assets/index-*.js`, one `dist/assets/index-*.css`, and `dist/_headers` exist.
- `npm run size` prints `OK: under the limit` and exits 0.
- `npm run preview` serves `dist/` locally for a manual look (it does not apply `_headers`; headers are checked on Cloudflare Pages).

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `npm ci` engine warning or Vitest refuses to start | Node older than 22.12 | Use Node 24 (`.node-version`) |
| `npm run size` exits 2 | No `dist/` | Run `npm run build` first |
| Type errors in `tests/tooling/check-size.test.ts` | `scripts/check-size.d.mts` missing | Restore the declaration file |
| `coverage/` appears in `git status` | Should not happen | `coverage/` is already in `.gitignore` |
| npm warns that `fsevents` has install scripts not covered by `allowScripts` | macOS optional dependency of the toolchain | Not needed for the build; leave it unapproved |
