# Build Instructions

Inputs: `construction/code-generation/code-generation-plan.md` (what was built), `construction/code-generation/unit-test-instructions.md` (the unit test command run here), and `construction/code-generation/code-summary.md` (files changed and deviations).

## Dependencies

- Node version from `.node-version`; `npm ci` installs the locked dev dependencies. This work adds no dependency.

## Environment

- No environment variables, secrets, or local services.

## Build Commands

```bash
npm run typecheck   # tsc --noEmit (strict)
npm run build       # vite build -> dist/
npm run size        # dist/ total must stay under 1,048,576 bytes
```

## Verification

- `npm run typecheck` exits 0.
- `npm run build` prints `dist/assets/index-*.js` (29.27 kB in this run).
- `npm run size` prints `OK: under the limit`.
- Play check (NFR2): open the branch preview (Cloudflare Pages truncates the alias to 28 characters, so `https://feature-ending-message.ai-catch.pages.dev/`) on desktop and iPhone Safari and follow the checklist in `build-and-test-summary.md`.

## Troubleshooting

- Type errors after pulling: run `npm ci`.
- Reaching the ending quickly for a check needs a full four-stage clear; there is no debug shortcut, by design.
