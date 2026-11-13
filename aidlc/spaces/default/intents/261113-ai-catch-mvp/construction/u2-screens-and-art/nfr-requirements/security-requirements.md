# Security Requirements: u2-screens-and-art

Security, safety, and originality requirements for the drawing layer and the console page. Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md` (NFR5, NFR6, FR13), contracts C1, C2, C5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`, and `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/functional-design/functional-spec.md`. Stack: `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`.

No stage questions were needed.

## Threat Context

U2 draws on a canvas and owns static HTML and CSS. It reads only the `GameView` and the event queue. It renders no user-supplied text: every string it draws is a constant, a number, or a stage name from the catalogue. There is no account, server, or personal data.

## Requirements

| ID | Requirement | Check |
|---|---|---|
| NFR5.3 | U2 makes no network request and loads no external resource (no web fonts, images, or scripts from another origin). | Code review; browser network panel shows only same-origin build files |
| NFR5.4 | U2 never writes HTML from strings: no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, or `document.write`. The markup is static in `index.html`. | Code review (`grep` for those names in `src/render` and the U2 section of `main.ts`) |
| NFR5.5 | The Renderer reads `GameView` only and cannot call game controls (type check through the `GameView` parameter type). | `npm run typecheck` |
| NFR5.6 | Drawing never throws: a missing 2D context, an unknown object kind, a missing glyph, or out-of-range numbers are handled by returning, falling back, or clamping. | Code review; unit tests of the pure helpers |
| NFR6.2 | Every bitmap and glyph is original, made for this game, and not modelled on Nintendo or Game & Watch designs; `ASSETS.md` records each one as original. | Review of `ASSETS.md` and sprites |
| NFR6.3 | The page uses only the system monospace font stack already in `style.css`; no third-party font. | Code review |

## Not Applicable Here

Authentication, authorization, encryption, and secrets do not apply: U2 holds no data and talks to no service.
