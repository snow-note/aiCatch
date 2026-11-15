# Code Quality Assessment

## Ratings
| Aspect | Rating | Evidence |
|---|---|---|
| Naming clarity | good | descriptive names, requirement IDs in comments |
| Function size | good | rules functions are short; `renderer.ts` (486 lines) is the largest file |
| Error handling | good | game methods never throw (`types.ts:75`); storage and audio errors swallowed (`highscore.ts:32-38`) |
| Test presence | good | one test file per source module under `tests/`; 80% line threshold (`vitest.config.ts`); not run in this scan |
| Duplication | fair | `startRun` and `returnToTitle` repeat the reset block (`state.ts:169-177,233-242`) |
| Dead code | good | `noUnusedLocals/Parameters` enforced (`tsconfig.json`) |

## Tooling and Process
- Linting/formatting: none configured; strict `tsc` only.
- CI: typecheck, coverage, build, size on PR and push to main (`.github/workflows/ci.yml`).
- Documentation: README (play, run, release checklist), `ASSETS.md` (asset origins), `original_spec.md` (Japanese spec).
- TODO/FIXME: none seen in files read.

## Technical Debt
- Magic numbers in `renderer.ts` (effect lives `:92-97`, HUD x `:75`) and in `objects.ts:76` (jitter frequencies 5.1, 11.7). Low impact.
- Tests pin tunables: Stage 1 start/cap values (`tests/game/config.test.ts:79-94`), stage monotonic ordering (`:63-78`), intro 2.0 s (`tests/game/state.test.ts:108`).

## Intent Findings: first heart loss timing (current behavior; derived from code reading, not measured)
Intent: first heart loss about 5-10 s into a typical first-time playthrough.

1. **First spawn is late.** Play starts 2.0 s after START (`config.ts:40`); Stage 1 first spawn at +1.2 s of play (`state.ts:255-261`, `config.ts:74`). Spawns then every 1.2 s for the first 8 s.
2. **VIRUS is rare at first.** Share 0.10 per spawn in Stage 1 (`config.ts:74`), so the expected VIRUS rate is one per 12 s of play. Only spawns up to about 7.7 s of play can reach HUMAN by 10 s (spawns at 1.2, 2.4, 3.6, 4.8, 6.0, 7.2 s: 6 spawns). P(at least one VIRUS among them) = 1 - 0.9^6, about 47%.
3. **VIRUS travel is slow relative to the window.** 53.3 px/s; first overlap with HUMAN 2.33 s after spawn (`objects.ts:58`, `config.ts:23`). Earliest possible first hit is about 3.5 s of play (5.5 s after START press).
4. **A hit needs alignment.** HUMAN is 20 px wide at the bottom, speed 130 px/s; VIRUS spawn x is uniform over 224 px (`spawner.ts:31`). A stationary HUMAN is overlapped by about 36 of 224 px, about 16% per VIRUS. A player who moves toward collectibles changes this; not measured.
5. **Combined estimate** for a Stage 1 first-time player: P(first life lost within 10 s of play) is about 47% x 16%, roughly 8% for a stationary player (analytic; an actively moving player is likely somewhat higher). The Stage 1 difficulty steps do not apply until 8 s (`difficulty.ts:15`), and by 8 s the values barely change (interval 1.15, share 0.1125, max objects 3).
6. **Spawn cap may silently skip spawns.** Collectibles live 4.0 s (`config.ts:18`) and spawn every 1.2 s, about 3.3 in flight, so `maxObjects: 3` (`config.ts:74`, `state.ts:258`) can drop spawns, lowering VIRUS presence further.
7. **No invulnerability and no scripted damage.** `handle` decrements lives immediately and removes only touched objects (`state.ts:267-268,287-294`). So no i-frame tuning is needed for first-hit timing; multiple VIRUS touching in one update still cost one life (`collision.ts:25-42`).
8. **Lives and hearts.** START_LIVES = 3 (`config.ts:37`); HUD draws `START_LIVES` slots (`renderer.ts:354`), so changing the count needs a HUD check. Lives carry between stages (`tests/game/state.test.ts:236`).
9. **Fairness signals.** VIRUS has a visible 16x12 sprite in a 16x16 box, so contact starts 2 px before the sprite touches (`sprites.ts:79-92`, `renderer.ts:401-404`); movement is 130 px/s, enough to cross the field in 1.69 s, and a VIRUS is within reach for only 0.68 s in Stage 1 (36 px at 53.3 px/s).
10. **Levers available in `config.ts` only** (no logic change): Stage 1 `difficultyStart` spawnInterval / virusShare / fallSpeedMultiplier / maxObjects and VIRUS `FALL_TIME` (3.0 s, also used by every stage). Tests that pin Stage 1 values would need updates (see Technical Debt).
