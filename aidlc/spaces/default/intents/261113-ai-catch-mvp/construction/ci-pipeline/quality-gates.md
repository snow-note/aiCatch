# Quality Gates: AI CATCH

Gates that a change must pass before it reaches `main`. Sources: Target Verification Matrix in `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/build-and-test/build-and-test-summary.md`; `test-results.md`; every `construction/*/code-generation/code-summary.md`; `ci-config.md`; `ci-pipeline-questions.md`.

## Automated (GitHub Actions, blocks merge once the ruleset is active)

| Gate | Command | Threshold | Build and Test target |
|---|---|---|---|
| Install | `npm ci` | exit 0 | — |
| Types | `npm run typecheck` | 0 errors | U1-NFR8.7, U2-NFR5.5 |
| Tests | `npm run coverage` | 230/230 today; any failure fails | TC-VOL, TC-TDD, every unit-test target |
| Coverage | `npm run coverage` | lines ≥ 80% of `src/**/*.ts` (today 86.5%) | TC-COV80 |
| Build | `npm run build` | exit 0 | C6 |
| Size | `npm run size` | `dist/` < 1,048,576 bytes (today 29,428) | U5-NFR2.5, NFR2 |
| CI before merge | the workflow on `pull_request` to `main` + ruleset | required check passes | TC-CI |

## Manual (release checklist in `README.md`, self-review)

| Gate | How | Build and Test target |
|---|---|---|
| Preview headers | `curl -sI <preview-url>` shows the three headers | U5-NFR5.15 |
| Network and load | Browser network panel on the preview: same-origin only; load ≤ 2 s on Fast 4G | U5-NFR5.14, U5-NFR3.2 |
| Play check | Desktop and phone: smooth play, sound after START, VoiceOver, portrait and landscape | U2-NFR1.1, 3.1, 4.1, 9.1, U3-NFR5.9, U5-NFR1.5 |
| Review | No `innerHTML`, no external URL, no secret, `main.ts` sections kept (C5) | U2-NFR5.4, U4-NFR5.11, U5-NFR5.16 |

## Not Automated, and Why

- The U4 bundle-growth note (≤ 26,260 bytes) is a unit-level design target, not a project gate; the project budget is the 1 MB size gate. It is recorded in `build-and-test-summary.md` and has a 1-byte margin today.
- No linter or formatter exists (team practice: strict `tsc` only).
- No automated browser test exists; browser behaviour stays a manual gate.
