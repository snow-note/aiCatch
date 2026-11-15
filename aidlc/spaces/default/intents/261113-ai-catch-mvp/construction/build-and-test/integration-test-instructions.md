# Integration Test Instructions: AI CATCH

Standard strategy: key boundaries and cross-unit interaction. Sources: contracts C1-C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; every unit's `code-generation-plan.md`, `unit-test-instructions.md`, and `code-summary.md` under `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/*/code-generation/`.

All checks below run in Node (Vitest `environment: node`) or as static or build checks. None of them is browser evidence; browser behaviour is in the play checks of the README release checklist.

## Boundaries and How They Are Covered

| Boundary | Contract | Check | Where it runs |
|---|---|---|---|
| GameState → Renderer / Announcer (read-only view) | C1 | `npm run typecheck`: Renderer and `screenAnnouncement` take `GameView`, so they cannot call controls; `tests/game/state.test.ts` asserts view values per phase; `tests/game/announcer.test.ts` builds texts from `STAGES` views | Node |
| GameState → events → Renderer effects and SoundPlayer | C2 | `tests/game/state.test.ts` asserts event order per phase; `tests/audio/sound.test.ts` maps every event type and catch kind with `soundForEvent` | Node |
| Stage catalogue → Difficulty / Spawner | C3 | `tests/game/difficulty.test.ts`, `spawner.test.ts`, `state.test.ts` (stage parameters drive spawns) | Node |
| Bootstrap → GameControls | C4 | Type check of `src/main.ts`; `tests/game/state.test.ts` for input rules | Node (type check); wiring itself by play |
| `main.ts` sections (drawing, sound, announcements) | C5 | Type check; code review of section boundaries | Static |
| Build output → Cloudflare Pages | C6 | `npm run build`, `npm run size`, `dist/_headers` present; live headers by `curl -sI` on the preview URL | Node / static; live check on Pages |

## How to Run

```bash
npm run typecheck && npm test && npm run build && npm run size
```

Filters for one boundary:

```bash
npx vitest run tests/game/state.test.ts
npx vitest run tests/audio
npx vitest run tests/game/announcer.test.ts
```

## Coverage Expectations

The `mvp` floor is 80% line coverage of `src/**/*.ts` on the full suite (`npm run coverage`). Integration checks add no separate coverage target.

## Test Data and Environment

- No services, no network, no fixtures on disk. Views and events are built literally in the tests from `STAGES`.
- Live-site checks need the Cloudflare Pages preview URL (U5 Step 8, done by the developer).
