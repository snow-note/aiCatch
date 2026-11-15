# Tech Stack Decisions: u4-accessibility

The unit keeps the existing stack in `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`. No dependency is added. Design: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u4-accessibility/functional-design/functional-spec.md`, `rules.md`; requirements: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; contracts: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`. The size requirement NFR2.4 is in `security-requirements.md`.

| ID | Area | Decision | Rationale | Check |
|---|---|---|---|---|
| NFR8.21 | Live region | The existing `<div id="announcer" role="status" aria-live="polite">` with the `.visually-hidden` class (added by U2) | Native ARIA; no library; polite does not interrupt the screen reader | `index.html` review |
| NFR8.22 | Builder | Plain TypeScript function `screenAnnouncement(view: GameView)` in `src/game/announcer.ts` returning `{ key, text }` | Functional design Q1, Q2; testable under node | Type check; unit tests |
| NFR8.23 | Tests | Vitest 5.1.0 with literal `GameView` objects built from `STAGES` | Existing framework; no DOM environment needed | `package.json` unchanged |

Rejected: an accessibility or i18n library (new dependency, not needed for six fixed English sentences), `aria-live="assertive"` (would interrupt), and a jsdom test environment (new dependency; the DOM write is a short play-checked wiring).
