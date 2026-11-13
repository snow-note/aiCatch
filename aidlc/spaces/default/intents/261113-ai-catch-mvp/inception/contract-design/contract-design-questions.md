# Contract Design Questions

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work-dependency.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, and the existing `src/main.ts` / `src/game/state.ts`.

Boundaries from the dependency graph: U2 → U1, U3 → U1, U4 → U1 (in-process reads of GameState and its events), and U5 → U1-U4 (the build output). There is no network API and no external consumer: the game is a static web page.

## Q1. What form do the U1 contracts take?

A. TypeScript types exported by U1 and checked by `tsc`: (1) a read-only game view (what U2 and U4 may read from GameState), (2) the game event union (what U2 and U3 react to), (3) the stage definition shape. No runtime validation; the type check is the contract test.
B. TypeScript types plus runtime checks on every read.
X. Other (please specify)

[Answer]: A

## Q2. Who owns each contract?

A. U1 owns all three (game view, events, stage definition). Consumers (U2, U3, U4) never change them; they ask U1 for additions.
B. Shared ownership: any unit may change them.
X. Other (please specify)

[Answer]: A

## Q3. How are changes to a contract handled?

A. Additive changes (a new field, a new event type) are safe: consumers ignore event types they do not handle (`switch` with a default). A breaking change (renaming or removing a field or event) updates every consumer in the same change, and the type check must pass.
B. Version numbers on each contract.
X. Other (please specify)

[Answer]: A

## Q4. What happens when something goes wrong at a boundary?

A. Nothing throws across a boundary: GameState never throws on reads or input calls; Renderer, SoundPlayer, and the announcement writer swallow their own errors (canvas missing, audio blocked, DOM write failure) so the game keeps running, as today. Events are drained once per frame in order; there is no retry.
B. Errors are reported to the player.
X. Other (please specify)

[Answer]: A

## Q5. Shared wiring file `src/main.ts`

The Units Generation review noted that U1's phase changes break the existing `main.ts` and Renderer build, and that U2, U3, and U4 all edit `main.ts`.

A. Treat `main.ts` as shared integration wiring with a small contract: U1 also makes the minimal edits that keep `main.ts` and the Renderer compiling (remove the POWER path, show the new phases with placeholder drawing). U2, U3, and U4 each own a clearly separated section of `main.ts` (drawing and layout, sound mapping, announcement writing); if built in parallel, they are merged one at a time and the type check and tests must pass after each merge.
B. Leave this to Construction to sort out.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
