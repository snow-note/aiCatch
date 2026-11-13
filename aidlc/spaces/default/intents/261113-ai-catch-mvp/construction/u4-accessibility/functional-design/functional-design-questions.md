# Functional Design Questions: u4-accessibility

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`, `unit-of-work-story-map.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md` (AC6.1.9), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md` (FR13.2), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md` and `decisions.md` (ADR-004), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md` (C1, C5), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/refined-mockups/interaction-spec.md` (Screen Announcement) and `accessibility-checklist.md`, and the existing `src/main.ts`, `index.html` (empty `#announcer` added by U2).

Already settled and not asked again: a pure function builds the text from `GameView` (ADR-004); a hidden polite live region `#announcer` already exists; text per screen follows the interaction-spec examples; written on entering a screen and when lives change during play, never on every score change; written with `textContent`; failures are silent (C5 rules).

## Q1. Where does the announcement builder live?

A. `src/game/announcer.ts`, as domain design placed it "in the game layer" (ADR-004). Pure, reads `GameView` only, tested in `tests/game/announcer.test.ts`. The DOM write stays in the `main.ts` announcement section (C5).
B. `src/render/announcer.ts`, next to the other display code.
X. Other (please specify)

[Answer]: A

## Q2. How does Bootstrap know when to write, given the text contains the score?

A. The builder returns `{ key, text }`. The key is the phase plus the stage number, and during play also the lives. Bootstrap writes `text` only when `key` differs from the last written key. The score inside the text is a snapshot taken at that moment. Both parts are unit-tested.
B. Bootstrap listens to events (`stage-start`, `life-lost`, `stage-clear`, ...) and builds the text only then.
X. Other (please specify)

[Answer]: A

## Q3. Should game over and victory also announce when a key press can return to the title?

A. No. Keep exactly the interaction-spec texts, announced once on entering the screen.
B. Yes. When `canReturnToTitle` turns true, add "Press any key to return to the title." (the key gains this flag on those two screens).
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.
