# Security Requirements: u1-game-rules

Security and safety requirements for the game-rules unit (a `library` unit: pure TypeScript in `src/game/`, no DOM, no network). Sources: the inception NFRs in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, the boundary rules in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md` (C1-C4, "no contract throws across a boundary"), the functional design in `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/functional-spec.md` and `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/rules.md`, and the existing stack in `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`.

No stage questions were needed: every target below is already fixed by the inception NFRs, the contracts, or the functional rules.

## Threat Context

| Item | Value |
|---|---|
| Users | Anonymous players in a browser; no accounts (product scope) |
| Data held | One integer high score in `localStorage` (key `ai-catch:high-score`); no personal data |
| Trust boundaries | Browser input events and `localStorage` contents enter U1 through Bootstrap (C4) and `HighScoreStore` |
| Network | None. U1 makes no request of any kind |
| Attacker model | A player editing `localStorage` or sending odd input events; the only impact is on their own device |

Authentication, authorization, encryption, and compliance controls do not apply: there is no account, server, shared data, or personal data.

## Requirements

| ID | Requirement | Check | Rule / source |
|---|---|---|---|
| NFR5.1 | U1 code makes no network call and uses no external service or AI API. `src/game/` imports only other `src/game/` modules. | Code review of imports; `npm run build` output has no request code from U1 | NFR5; project Forbidden rules |
| NFR8.1 | U1 code has no DOM, window, canvas, audio, or `localStorage` global access. Storage reaches it only through the injected `StorageLike` interface; randomness only through the injected `Random`. | Vitest runs under `environment: node` with no DOM; type check with `types: []` | NFR8; BR9.1 |
| NFR8.2 | Stored high-score text is untrusted. Anything that is not a non-negative safe whole number (after trimming) counts as 0; a stored value is never executed or evaluated. | Unit tests with `"abc"`, `"-5"`, `"1e3"`, `"9999999999999999999"`, empty, `null` | BR8.2; FR10.3 |
| NFR8.3 | Storage read or write failures are caught inside `HighScoreStore`; the game keeps a session-only best and shows no error. | Unit tests with a throwing storage | BR8.2; FR10.3 |
| NFR8.4 | No `GameControls` method or `GameView` read throws. Unknown input ids, releasing an id that is not held, a duplicate press, and non-finite or non-positive `dt` are ignored. | Unit tests for each case | BR9.2; BR1.7; C4 |
| NFR8.5 | Values exposed by the view stay finite and in range: score ≥ 0 and a safe integer, 0 ≤ lives ≤ `START_LIVES`, `aiRestoration` in {0, 25, 50, 75, 100}, `caught` ≤ `requiredCount`, positions inside the play area. | Unit tests after long simulated runs with an injected random | C1 behaviour; BR2.4 |
| NFR8.6 | Per-update work is bounded: at most 100 spawns per update and at most `maxObjects` objects on screen, so a huge `dt` cannot hang the page. | Unit test with a large `dt` | BR6.1 |
| NFR6.1 | U1 adds no asset files and no third-party code. | Code review | NFR6 |

## Not Applicable Here

| NFR | Reason |
|---|---|
| NFR1, NFR3, NFR4, NFR9 | Frame rate, load time, layout, and readability are delivered and checked by U2 and U5 |
| NFR2 | Bundle size is checked by U5; U1 adds no dependency |
| NFR7 | Publishing is U5 |
