# Build Instructions — AI CATCH

Inputs: [code-generation-plan.md](../code-generation/code-generation-plan.md), [unit-test-instructions.md](../code-generation/unit-test-instructions.md), [code-summary.md](../code-generation/code-summary.md).

## Prerequisites

- Node.js 20.19 or later (22.12 or later recommended; checked here with Node 26.0.0 and npm 11.12.1)
- No environment variables, config files or local services are needed. The game has no server side, no API keys and no secrets.

## Dependency Installation

From the project root, install exactly what `package-lock.json` pins (dev tools only: `vite` 8.3.7, `vitest` 5.1.0, `typescript` 7.0.2; the game itself has no runtime dependencies):

```bash
npm ci
```

Use `npm install` only when you mean to change dependencies.

## Build Commands

```bash
npm run typecheck   # tsc --noEmit: TypeScript check, no output files
npm run build       # vite build: production bundle into dist/
```

`dist/` is a plain static site with relative paths (`base: './'`). It can be served from any static host or sub-folder, such as Cloudflare Pages. Deploying it is not part of this work.

## Running Locally

```bash
npm run dev       # Vite dev server with hot reload
npm run preview   # serve the built dist/ (default http://localhost:4173/)
```

Open the printed URL in a browser. Press POWER, then START (or Enter/Space). The game must be served over HTTP: opening `dist/index.html` straight from the file system does not work, because browsers block module scripts on `file://`.

## Build Verification

1. `npm run typecheck` exits 0 with no errors.
2. `npm run build` exits 0 and writes `dist/index.html`, one CSS file and one JS file under `dist/assets/`.
3. The total size of `dist/` is under 1,048,576 bytes (NFR4). List the files with `find dist -type f -exec ls -l {} +` and add up the sizes.
4. `npx vitest run tests/` reports every test passed.

## Troubleshooting

- **`npm ci` fails with a lockfile mismatch**: `package.json` and `package-lock.json` disagree. Run `npm install` once to resync, and commit both files.
- **Unsupported engine warning or Vite refuses to start**: Node is older than 20.19. Upgrade Node.
- **Blank page when opening `dist/index.html` directly**: serve it over HTTP with `npm run preview` (see Running Locally).
- **No sound**: browsers only allow sound after a user gesture. The game unlocks sound on the POWER press; press POWER rather than START first.
- **Port 4173 or 5173 already in use**: pass another port, for example `npx vite preview --port 4174`.
