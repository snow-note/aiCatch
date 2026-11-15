# Code Summary: u5-publishing

Built from the approved `code-generation-plan.md` (9 steps); Steps 1-7 done, Step 8 is the developer's, Step 9 is this summary with the manifest and traceability. Branch `feature/u5-publishing` (created with `git switch -c`, not committed).

## Files Changed

| File | Change |
|---|---|
| `.node-version` (new) | `24` (SD5-1) |
| `public/_headers` (new) | One `/*` rule: the NFR5.15 Content-Security-Policy, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` (SD5-2). Copied by Vite to `dist/_headers`. |
| `scripts/check-size.mjs` (new) | `SIZE_LIMIT = 1048576` and pure `checkTotal(sizes, limit)`; CLI part runs only as the entry point, walks `dist/` counting files only, prints totals, exits 0 / 1 / 2 (SD5-3). Built-in Node modules only. |
| `scripts/check-size.d.mts` (new) | Type declarations for the two exports so the strict TS test imports them without `@types/node`. |
| `tests/tooling/check-size.test.ts` (new) | 7 tests: `SIZE_LIMIT` value; empty list; sum under the limit; one byte below; exactly at the limit (not ok); over; custom limit. |
| `package.json` | Only `"size": "node scripts/check-size.mjs"` added. No dependency change. |
| `README.md` (new) | About, How to Play, Run Locally, Release Checklist, Publishing, Play Online (URL placeholder), Assets and Originality, Built With, Licence (SD5-6, SD5-7). States that the high score is local only and that there are no rankings, accounts, or online play. |

No file under `src/`, `index.html`, `vite.config.ts`, or `tsconfig.json` changed.

## TDD Evidence

- Step 2 baseline: `npm test` — 14 files, 193 tests passed.
- Step 3 Red: `npx vitest run tests/tooling` — suite failed with `Cannot find module '../../scripts/check-size.mjs'`.
- Green: 7 passed.

## Verification

- `npm run typecheck && npm test && npm run build`: pass; 15 test files, 200 tests. JS 26.32 kB (8.72 kB gzip), unchanged by this unit.
- `npm run size`: exit 0, `dist total: 29497 bytes (28.8 KiB)` against 1,048,576 bytes.
- `dist/_headers` present with the Step 5 content.
- Exit code 2 (no `dist/`) confirmed by code review only.
- Not verified (Step 8, developer): repository visibility, the Cloudflare Pages project, Node 24 in the Pages build log, headers on the live preview, network and load checks, desktop and phone play, and the production URL in the README.

## Deviations

- 7 tests instead of about 6 (`SIZE_LIMIT` got its own test).
