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
- `npm run build` prints `dist/assets/index-*.js` (28.52 kB in this run).
- `npm run size` prints `OK: under the limit`.
- Device check (NFR5): open the branch preview `https://feature-responsive-orientation.ai-catch.pages.dev/` on iPhone Safari and follow the checklist in `build-and-test-summary.md`.

## Troubleshooting

- Type errors after pulling: run `npm ci`.
- Casing off-centre on a device: check `#stage` computed padding (safe-area insets) in Safari Web Inspector.
