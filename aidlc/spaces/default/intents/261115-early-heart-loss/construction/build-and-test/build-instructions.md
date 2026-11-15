# Build Instructions: early-heart-loss

Sources: `aidlc/spaces/default/intents/261115-early-heart-loss/construction/code-generation/code-generation-plan.md`, `unit-test-instructions.md`, `code-summary.md`.

## Prerequisites

- Node.js 24 (`.node-version`); npm. No environment variables, secrets, or services.

## Install

```bash
npm ci
```

No dependency was added by this work.

## Build and Checks (same as CI)

```bash
npm run typecheck   # tsc --noEmit
npm run coverage    # all Vitest tests + v8 coverage, fails below 80% lines
npm run build       # vite build -> dist/
npm run size        # dist/ must be under 1,048,576 bytes
```

Focused run for this work:

```bash
npx vitest run tests/game/first-heart.test.ts tests/game/spawner.test.ts tests/game/state.test.ts tests/game/config.test.ts
```

## Verification

- All four commands exit 0.
- `tests/game/first-heart.test.ts` passes (median START-to-first-life-lost in [5.0, 10.0] s over 200 seeds).

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `first-heart.test.ts` fails on the median | A tunable in `src/game/config.ts` changed | Re-tune the values; never change the target, seeds, step, or beginner model |
| `config.test.ts` ordering test fails | A Stage 1 value now exceeds Stage 2 | Raise the later stage's value or lower Stage 1 |
| `npm run size` exits 2 | No `dist/` | Run `npm run build` first |
