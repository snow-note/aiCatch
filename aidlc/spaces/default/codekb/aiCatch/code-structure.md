# Code Structure

## Layout

```
./
  index.html                 entry page, console casing, canvas 240x160
  package.json, tsconfig.json, vite.config.ts, vitest.config.ts
  original_spec.md, LICENSE
  src/
    main.ts                  composition root (DOM events, loop)
    style.css                casing and button styles
    vite-env.d.ts
    game/                    pure rules (no DOM)
      config.ts state.ts objects.ts spawner.ts difficulty.ts
      collision.ts input.ts highscore.ts
    render/                  Canvas drawing
      renderer.ts sprites.ts layout.ts
    audio/
      sound.ts
  tests/
    audio/ game/ render/     Vitest, mirrors src/
    scripts/                 Python unittest for usage tracking
  scripts/                   Python usage-tracking helpers
```

Excluded from this scan: `node_modules/`, `dist/`, caches, AI-DLC install and workspace.

## File Classification
| Category | Files |
|---|---|
| Entry / wiring | `index.html`, `src/main.ts` |
| Model / state | `src/game/state.ts`, `src/game/objects.ts` |
| Rules / logic | `src/game/spawner.ts`, `difficulty.ts`, `collision.ts`, `input.ts`, `highscore.ts` |
| Config / constants | `src/game/config.ts`, `src/render/layout.ts` (casing constants) |
| View / rendering | `src/render/renderer.ts`, `src/render/sprites.ts`, `src/style.css` |
| Audio | `src/audio/sound.ts` |
| Build config | `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts` |
| Tests | `tests/**/*.test.ts`, `tests/scripts/test_aidlc_usage.py` |
| Dev tooling | `scripts/*.py` |
| Docs | `original_spec.md` |

## Patterns
- Named exports, small functions, no default exports.
- Requirement ids in comments (FR1.., NFR.., A#) trace code to the earlier intent's requirements.
- Dependency injection through interfaces (`StorageLike`, `HighScoreLike`, `Random`).
- Mutable object records (`FallingObject`) updated in place by `stepObject`.
- Data tables as `Record`/`as const` maps keyed by object kind (`FALL_TIME`, `POINTS`, `OBJECT_SPRITES`, `SOUNDS`).
- Event queue drained once per step (`drainEvents`).
- Test layout mirrors `src/`; files named `<module>.test.ts`.
- Strict TS: `strict`, `noUnusedLocals`, `noUnusedParameters`, `isolatedModules`.

## Sizes (lines)
`renderer.ts` 368, `state.ts` 191, `sprites.ts` 176, `main.ts` 166, `sound.ts` 122, `objects.ts` 89; the rest under 60. Python: `aidlc_usage.py` 480, test 560.
