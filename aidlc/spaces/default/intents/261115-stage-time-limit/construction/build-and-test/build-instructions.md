# Build Instructions

## Dependencies

- Node version from `.node-version` (Node 24 on Cloudflare Pages).
- `npm ci` installs the locked dev dependencies (TypeScript, Vite, Vitest, coverage provider). This work adds no dependency.

## Environment

- No environment variables, secrets, config files, or local services are needed.

## Build Commands

```bash
npm run typecheck   # tsc --noEmit (strict)
npm run build       # vite build -> dist/
npm run size        # dist/ total must stay under 1,048,576 bytes
```

## Verification

- `npm run typecheck` exits 0 with no output after the script line.
- `npm run build` prints `dist/assets/index-*.js` (27.45 kB in this run) and `built in`.
- `npm run size` prints `OK: under the limit`.
- Play check: `npm run dev` (run it yourself in a terminal) or the Cloudflare Pages preview for the branch, then play a stage to see the timer, the last-10-second blink and beep, and a `TIME UP` game over.

## Troubleshooting

- Type errors after pulling: run `npm ci` to match the lockfile.
- `npm run size` fails: check for unexpected files in `dist/` (it is git-ignored and rebuilt each time).
