# Tech Stack Decisions: u1-game-rules

The unit keeps the existing stack recorded in `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`. No new dependency is added (team rule: adding a library needs prior approval). Requirements come from `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; the design being implemented is `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/functional-spec.md` and `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/rules.md`; type contracts are in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

| ID | Area | Decision | Rationale |
|---|---|---|---|
| NFR8.7 | Language | TypeScript 7.0.2, ES2022, ES modules, `strict`, `noUnusedLocals`, `noUnusedParameters`, named exports only | Existing setup; the type check is the contract test for C1-C4 |
| NFR8.8 | Tests | Vitest 5.1.0, `environment: node`, files under `tests/game/*.test.ts`, tests written first | Existing setup and affirmed TDD practice; proves the rules run without a browser |
| NFR8.9 | Shared types | One type-only module `src/game/types.ts` for `ObjectKind`, `Phase`, `GameView`, `GameEvent`, `DifficultyValues`, `StageDefinition`, `GameControls` | Functional design Q1; removes the `config.ts` / `objects.ts` import loop |
| NFR8.10 | Tunables | Every number (durations, points, fall times, stage catalogue, difficulty steps) in `src/game/config.ts` | Project Mandated rule |
| NFR8.11 | Randomness | Injected `Random = () => number`; default `Math.random` | Deterministic tests; no seeded-RNG library needed |
| NFR5.2 | Runtime services | None: no network, no storage other than the injected `StorageLike` | NFR5 |
| NFR2.1 | Size | U1 adds no runtime dependency and no assets | Keeps the build within the 1 MB budget checked by U5 |

Rejected: a state-machine library (the six-phase switch is small), a seeded random library (an injected function suffices), and a schema-validation library for stored values (one regular expression suffices).
