# Unit Test Instructions: u5-publishing

## Framework and Configuration

- Vitest 5.1.0 with the existing `vitest.config.ts` (`environment: node`, `include: tests/**/*.test.ts`). No configuration change and no new dependency.
- The test imports only the pure `checkTotal` and `SIZE_LIMIT` from `scripts/check-size.mjs`; types come from the hand-written `scripts/check-size.d.mts`. Importing the module does no file access (the CLI part runs only when the file is executed directly).
- The test lives in `tests/tooling/`, not `tests/build/`, because `.gitignore` ignores `build/`.

## How to Run This Unit's Tests

Run from the project root. Commands are scoped to this unit's test files.

```bash
npx vitest run tests/tooling
```

Baseline before the first Red step (plan Step 2):

```bash
npm test
```

Type check (whole project; it also proves the `.d.mts` declarations resolve):

```bash
npm run typecheck
```

The size gate itself, after a build:

```bash
npm run build
npm run size
```

## Test Scope (Standard strategy)

| File | Component | Tests (approx.) |
|---|---|---|
| `tests/tooling/check-size.test.ts` (new) | `checkTotal`, `SIZE_LIMIT` | 5-6 |

Cases: empty list (total 0, ok); several files under the limit; total exactly at the limit (not ok, since the rule is "under 1 MB"); one byte below the limit (ok); over the limit; `SIZE_LIMIT` equals 1,048,576; a custom limit argument. The CLI file walk, exit codes, headers, README, and Cloudflare settings are checked by running `npm run size`, inspecting `dist/`, and the preview release checklist.

## Expected Coverage Targets

The `mvp` scope floor is 80% line coverage, measured by Build and Test on the full suite. No coverage tool is installed (team practice; adding one needs the developer's approval), so this unit does not measure it. `checkTotal` is fully tested; the CLI wrapper is checked by running it.

## Mocking and Stubbing

- No mocks. `checkTotal` takes a plain array of byte sizes.

## Test Data

- Sizes are literal numbers around the 1,048,576-byte limit.
