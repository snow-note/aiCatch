# Security Requirements: u4-accessibility

Security, safety, and testability requirements for the screen-announcement unit (`src/game/announcer.ts` and the announcement section of `src/main.ts`). Sources: NFR1, NFR5, NFR8 and FR13.2 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; contracts C1 and C5 and the no-throw rule in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u4-accessibility/functional-design/functional-spec.md` and `rules.md`; stack in `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`.

No stage questions were needed.

## Threat Context

The unit turns read-only game values (numbers and fixed stage names) into a short English sentence and writes it into one hidden element of the page. It reads no user text, loads nothing, and talks to no service. The only way to cause harm would be inserting markup into the page or breaking the game loop.

## Requirements

| ID | Requirement | Check |
|---|---|---|
| NFR5.11 | The live region is written with `textContent` only; no `innerHTML`, `insertAdjacentHTML`, or other markup insertion. Every value in the text is a number or a fixed stage name from `config.ts`. | Code review; search for `innerHTML` in `src/` |
| NFR5.12 | The announcement writer never throws: a missing `#announcer` or a failed write skips the announcement and the game keeps running. | Code review; play check |
| NFR5.13 | No network, storage, or external service is used for announcements. | Code review |
| NFR1.4 | Per frame the unit builds one short string and key with no DOM access, then compares the key; the live region (DOM) is written only when the key changes, i.e. at most once per screen change or life change, never on a score or progress change. | Unit tests that the key ignores score and caught (BR2.1); code review of the write-on-change guard in `main.ts` (BR2.2) |
| NFR2.4 | The unit adds no asset and no dependency; the JS bundle grows by at most 1 kB over the U3 build (25.26 kB). | `npm run build` output in Code Generation |
| NFR8.20 | `screenAnnouncement` lives in `src/game/` with no DOM access, reads `GameView` only, and gets failing Vitest tests before its implementation; `npm test` stays green. | Unit tests; type check; the code-generation plan orders the Red step before the Green step and records the failing output |

NFR5.13 refines NFR5 directly. NFR5.11 and NFR5.12 are unit-specific safety additions (contract C5 no-throw rule, BR2.3, BR2.4) grouped under NFR5 because, like it, they keep the page free of anything outside the game's own code at run time. NFR1.4 keeps the unit from affecting the 60 fps target and from flooding the screen reader (FR13.2).

## Not Applicable Here

| NFR | Reason |
|---|---|
| NFR3 | Load time is measured by U5 |
| NFR4, NFR9 | Layout and LCD readability are U2 |
| NFR6 | The unit adds no asset |
| NFR7 | Publishing is U5 |
