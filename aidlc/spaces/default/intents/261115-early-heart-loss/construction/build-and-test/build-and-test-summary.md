# Build and Test Summary: early-heart-loss

Run 1, 2026-11-15. Sources: `aidlc/spaces/default/intents/261115-early-heart-loss/construction/code-generation/code-generation-plan.md` (Testing Contract `sha256:3233a458…9a52`, Minimal strategy), `unit-test-instructions.md`, `code-summary.md`; requirements FR1-FR6 and NFR1-NFR6 in `aidlc/spaces/default/intents/261115-early-heart-loss/inception/requirements-analysis/requirements.md` (this express workflow has no NFR stages). Results: `test-results.md`.

## Overall Status

- Build: **success** (typecheck, build, size).
- Tests: **244 / 244 passed** (17 files); line coverage 86.58%.
- Every automated target is Met. The developer play check (FR1.4) needs a real browser and is open at the gate.

## Test Type Inventory

| Type | File | Generated |
|---|---|---|
| Build | `build-instructions.md` | yes |
| Unit and simulation | `unit-test-instructions.md` (Code Generation) | yes |
| Integration, performance, security | — | not generated: Minimal strategy |

## Coverage Expectations

Project: the existing 80% line threshold in `vitest.config.ts` stays enforced by `npm run coverage` (express adds no floor of its own). This work: every new branch in `spawner.ts` and `state.ts` tested.

## Target Verification Matrix

| Target ID | Source | Expected | Actual | Evidence | Owning Stage | Verdict |
|---|---|---|---|---|---|---|
| FR1.1 | requirements | Median START-to-first-life-lost in [5.0, 10.0] s (beginner model, 200 seeds) | 9.00 s (P25 5.53 s, P75 15.92 s); baseline 35.47 s | `tests/game/first-heart.test.ts` pass; values from `code-summary.md` | build-and-test | Met |
| FR1.2 | requirements | Beginner model: walks to soonest-reachable collectible, ignores VIRUS, uses only controls and view | As specified | `tests/game/first-heart.test.ts` (Node) | build-and-test | Met |
| FR1.3 | requirements | 200 seeds, 1/60 s, from `pressStart`, stop at first `life-lost` or 60 s | As specified | `tests/game/first-heart.test.ts` (Node) | build-and-test | Met |
| FR1.4 | requirements | Developer plays Stage 1 ≥ 3 times; first heart usually lost ~5-10 s after START | Not yet played | Needs a real browser and the developer | build-and-test | Unverified (browser) |
| FR2.1 | requirements | Stage 1 VIRUS share raised | 0.10/0.15 → 0.40/0.45 | `tests/game/config.test.ts` | build-and-test | Met |
| FR2.2 | requirements | First object earlier than one spawn interval | 0.5 s into play, every stage | `tests/game/state.test.ts` | build-and-test | Met |
| FR2.3 | requirements | Stage 1 VIRUS falls faster | `FALL_TIME.virus` 3.0 → 2.2 s | `tests/game/config.test.ts` | build-and-test | Met |
| FR2.4 | requirements | Later stages equal or harder, strictly harder on one value | Ordering tests pass (Stage 2-4 shares raised to 0.45-0.60) | `tests/game/config.test.ts` | build-and-test | Met |
| FR3.1 | requirements | 1 in 3 VIRUS aimed at HUMAN x ± spread, clamped | `VIRUS_AIM_SHARE` 1/3, spread 20 px | `tests/game/spawner.test.ts` | build-and-test | Met |
| FR3.2 | requirements | Aimed VIRUS moves like any VIRUS | No tracking code | `tests/game/spawner.test.ts`; code review | build-and-test | Met |
| FR3.3 | requirements | Aim decision and offset from injected random; tunables in config | As specified | `tests/game/spawner.test.ts` | build-and-test | Met |
| FR4.1 | requirements | One life per contact, no invulnerability | As before | `tests/game/state.test.ts` | build-and-test | Met |
| FR5.1 | requirements | 3 lives | `START_LIVES` 3 | `tests/game/state.test.ts` | build-and-test | Met |
| FR6.1 | requirements | Everything else unchanged | Full existing suite green (244); diff limited to `config.ts`, `spawner.ts`, `state.ts` | `npm run coverage`; `git diff --stat` | build-and-test | Met |
| NFR1 | requirements | No scripted damage | Lives change only on VIRUS overlap | Code review; simulation stops only on `life-lost` | build-and-test | Met |
| NFR2 | requirements | VIRUS ≥ 1.5 s from spawn to first contact at Stage 1 start; HUMAN can step out in time | Test passes | `tests/game/config.test.ts` | build-and-test | Met |
| NFR3 | requirements | Logic in `src/game/`, injected random, tests first | Red outputs recorded | `code-summary.md` | build-and-test | Met |
| NFR4 | requirements | Simulation under 5 s | 35-72 ms | Vitest timing | build-and-test | Met |
| NFR5 | requirements | No new dependency; typecheck, coverage (80%), build, size green | All exit 0; `package.json` unchanged | `test-results.md` | build-and-test | Met |
| NFR6 | requirements | New tunables in `config.ts` | `FIRST_SPAWN_DELAY`, `VIRUS_AIM_SHARE`, `VIRUS_AIM_SPREAD` | `src/game/config.ts` | build-and-test | Met |
| TC-SUITE | Testing Contract `scope_floor` | Existing suite stays green | 244/244 | `npm run coverage` | build-and-test | Met |
| TC-REQ | Testing Contract `strategy_volume` | One test per requirement; one happy path per component | See rows above | `unit-test-instructions.md` | build-and-test | Met |

All automated checks ran in Node; none is browser evidence.

## Readiness Assessment

| Readiness | Status |
|---|---|
| Build-ready | Yes |
| Test-ready | Yes (automated); FR1.4 play check open |
| Deployment-ready | After the developer's play check and a review of the Stage 2-4 difficulty risk below |

## Known Limitations and Outstanding Items

- **Stage 2-4 difficulty (not a requirement target, but a risk):** to keep the stage ordering, VIRUS shares rose to 0.45/0.50, 0.50/0.55 and 0.55/0.60, and the shorter VIRUS fall (2.2 s) applies to every stage. Whether Stages 2-4 stay completable for an average player was not measured.
- The median (9.0 s) is near the upper edge of the 5-10 s target; P75 is 15.9 s.
- FR1.4 play check not yet done.
