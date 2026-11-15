# AI CATCH

**SAVE THE AI. SAVE THE FUTURE.**

A retro handheld-style catching game that runs in the browser. Humans created AI. Now it's our turn to save it.

## About

The year is 2045. Artificial intelligence supports everyday life, until a catastrophic VIRUS attack corrupts it and the system collapses. You play HUMAN, and you recover the legacy of computing to restore the AI.

The game has four stages, each one a generation of computing history. Completing a stage restores 25% of the AI.

| Stage | Theme | Collectible | AI restored |
|---|---|---|---|
| 1. FORTRAN | Early scientific and mainframe computing | Mainframe computers | 0% to 25% |
| 2. COBOL | Business computing and information systems | Magnetic tapes | 25% to 50% |
| 3. BASIC | Personal computing | Floppy disks | 50% to 75% |
| 4. LLM | Modern artificial intelligence | LLM, GPU, ROBOT | 75% to 100% |

Finish Stage 4 to restore the AI to 100%. Your high score is stored locally in your browser only. There are no rankings, accounts, or online play.

## How to Play

- Move HUMAN left and right with the Left and Right arrow keys.
- Start the game with the START button, Enter, or Space.
- On a phone, touch the left or right half of the screen to move.
- Catch the items for the current stage and avoid VIRUS.
- You have 3 lives. Touching a VIRUS costs one life.
- After game over or victory, press any key or tap to return to the title screen.

## Run Locally

Node 24 is required (see `.node-version`).

```bash
npm ci
npm run dev        # start the dev server
npm test           # run the unit tests
npm run typecheck  # strict TypeScript check
npm run build      # production build into dist/
npm run size       # check that dist/ is under 1 MiB (run after build)
```

## Release Checklist

1. `npm run typecheck`, `npm test`, `npm run build`, and `npm run size` all pass.
2. `git ls-files` shows no secrets or credential files.
3. On the Cloudflare preview deployment:
   - `curl -sI <preview-url>` shows the Content-Security-Policy, `X-Content-Type-Options`, and `Referrer-Policy` headers.
   - The browser console shows no CSP errors.
   - Only same-origin requests appear in the network panel.
   - The page loads within 2 seconds on Fast 4G.
   - The game plays smoothly at about 60 fps on desktop (keyboard) and on a phone (touch), in portrait and landscape.
   - Sound effects play.
   - VoiceOver announcements work.

## Publishing

1. Make the `snow-note/aiCatch` repository public.
2. Create a Cloudflare Pages project with Git integration:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
   - Production branch: `main`
   - Preview deployments: on
   - Environment variables: none
   - Web Analytics: off
3. If the build log does not show Node 24, set `NODE_VERSION=24` as a fallback.
4. To roll back, revert the commit on `main` or promote an earlier deployment.

Security headers are served from `public/_headers`, which Vite copies to `dist/_headers`.

## Play Online

Play AI CATCH at <https://aicatch.snow-note.com>.

## Documentation
- [Architecture and screen flow](docs/architecture.md)
- [Tech stack](docs/tech-stack.md)

## Assets and Originality

All art, sound, and UI are original. No third-party assets are used. See `ASSETS.md`.

## Built With

TypeScript, HTML5 Canvas, Web Audio API, Vite, and Vitest. Developed with Kiro; the `.kiro/` folder is committed.

## Licence

MIT. See `LICENSE`.
