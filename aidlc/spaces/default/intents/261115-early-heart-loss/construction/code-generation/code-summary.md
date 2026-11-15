# Code Summary: early-heart-loss

Built from `code-generation-plan.md` (Steps 1-7 done; Step 8's developer play check FR1.4 pending; Step 9 is this summary). Branch `feature/early-heart-loss` from `origin/main` (not committed).

## Files Changed

| File | Change |
|---|---|
| `src/game/config.ts` | New tunables `FIRST_SPAWN_DELAY = 0.5`, `VIRUS_AIM_SHARE = 1/3`, `VIRUS_AIM_SPREAD = HUMAN_W` (20). `FALL_TIME.virus` 3.0 → 2.2 s (all stages). VIRUS share start/cap: Stage 1 0.10/0.15 → 0.40/0.45; Stage 2 0.15/0.22 → 0.45/0.50; Stage 3 0.20/0.28 → 0.50/0.55; Stage 4 0.25/0.35 → 0.55/0.60. Other values unchanged. |
| `src/game/spawner.ts` | `spawnObject` takes an optional aim x. For a VIRUS only, one extra random draw decides aiming (`< VIRUS_AIM_SHARE`) and, when aimed, x = clamp(aimX - OBJECT_W/2 + (random()*2-1) * VIRUS_AIM_SPREAD). Collectibles keep today's draw order. |
| `src/game/state.ts` | The spawn timer at each stage start is set so the first object appears `FIRST_SPAWN_DELAY` into play; HUMAN's centre x at the spawn moment is passed to `spawnObject`. No other rule changes (no invulnerability, 3 lives). |
| `tests/game/first-heart.test.ts` (new) | Beginner model (FR1.2) and the 200-seed simulation (FR1.3): median START-to-first-life-lost in [5.0, 10.0] s; a no-VIRUS run reports 60 s; runtime check. |
| `tests/game/spawner.test.ts` | Aimed VIRUS within spread and clamped at both edges; zero spread; failed aim draw and collectibles keep random x; no aim x as before. |
| `tests/game/state.test.ts` | First object at `FIRST_SPAWN_DELAY`, then each spawn interval, also at Stage 2; each VIRUS contact costs one life with no invulnerability; runs start with 3 lives. |
| `tests/game/config.test.ts` | Stage 1 pins updated; stage-ordering tests kept; new NFR2 test (VIRUS ≥ 1.5 s from spawn to first contact at Stage 1 start, and HUMAN can leave the overlap zone in that time). |
| `tests/game/difficulty.test.ts` | One pinned interpolated VIRUS share updated (0.125 → 0.425), intent unchanged. |

## TDD Evidence

- Baseline `npm test`: 16 files, 230 tests passed. Baseline simulation median 35.47 s (P25 15.12 s, P75 49.90 s).
- Red: `first-heart.test.ts` failed on the median (35.47 s > 10 s); 4 aimed-spawn tests and 2 first-spawn-delay tests failed.

## Tuning Log (median START-to-first-life-lost, 200 seeds)

| Run | Values | Median |
|---|---|---|
| 0 | new tunables only, shares 0.10/0.15 | 30.43 s |
| 1 | Stage 1 shares 0.28/0.33 | 12.59 s |
| 2 | + VIRUS fall 2.2 s | 13.62 s |
| 3 | shares 0.40/0.45, fall 2.2 s | **9.00 s** (kept) |
| 4 | run 3 with fall 2.0 s | 9.13 s |
| 5 | shares 0.45/0.50, fall 2.2 s | 9.00 s |
| 6 | run 3 with spread 10 | 9.00 s |
| 7 | shares 0.35/0.40 | 10.97 s (out of range) |
| 8 | run 3 with Stage 1 spawn interval 1.1 s | 8.92 s (not kept) |

The median stays near 9.0 s across runs 3-6 because hits land on discrete spawn slots (2.0 s intro + 0.5 s first delay + n × 1.2 s interval + fall), so the 7 s preferred in the plan was not reached with these levers.

## Verification

- Final: median 9.00 s (P25 5.53 s, P75 15.92 s); about 14% of runs lose the first heart within 3 s of play (5 s from START). Simulation runtime about 36 ms.
- `npm run typecheck && npm run coverage && npm run build && npm run size`: pass; 17 files, 244 tests; lines 86.58%; JS 26.41 kB (8.76 kB gzip); `dist/` 29,584 bytes.
- Re-checked by the orchestrator: typecheck pass, 17 files / 244 tests pass.

## Deviations and Risks

1. Step 1: local `main` was stale, so the branch was created with `git switch -c feature/early-heart-loss origin/main` (same tree as the merged PR) instead of `git switch main && git pull`.
2. Stages 2-4 VIRUS shares had to rise a lot (to 0.45-0.60) to keep the "each later stage is equal or harder" rule (FR2.4), and the shorter VIRUS fall time applies to every stage. Later stages are therefore much harder than before, and fewer collectibles fall per minute there. Not verified: whether Stages 2-4 remain completable for an average player. This is the largest risk of this change.
3. The median sits at 9.0 s, inside the target but near its upper edge; P75 is 15.9 s.
4. Not verified: the developer play check (FR1.4).
