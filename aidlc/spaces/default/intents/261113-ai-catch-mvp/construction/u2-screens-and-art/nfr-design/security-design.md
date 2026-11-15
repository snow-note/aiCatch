# Security Design: u2-screens-and-art

How the drawing layer and console page meet `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/nfr-requirements/security-requirements.md`, using `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/nfr-requirements/tech-stack-decisions.md`. Screens: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/functional-design/functional-spec.md`. Boundaries: contracts C1, C2, C5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`. Related: `performance-requirements.md` (bounded effects).

No stage questions were needed.

## Approach

U2 handles no user data and no untrusted text, so its security design is about keeping it that way: static markup, canvas-only output, a read-only view of the game, no external resources, and drawing that cannot throw.

## Design Decisions

| ID | Requirement | Design | Verified by |
|---|---|---|---|
| SD2-1 | NFR5.3 | All art and text are drawn from in-code tables; the page links only the bundled script and stylesheet. No `fetch`, no `<img>`, no `@font-face`, no CDN link. | Network panel on the preview URL; code review |
| SD2-2 | NFR5.4 | The DOM is never written from strings. `index.html` holds the full static markup, including the empty `#announcer`. U2 code in `src/render` and the drawing section of `main.ts` uses no `innerHTML`, `outerHTML`, `insertAdjacentHTML`, or `document.write` (U4 later writes plain text with `textContent`). | `grep` in the PR |
| SD2-3 | NFR5.5 | `Renderer.draw(view: GameView, now: number)` and all screen-timing helpers take `GameView` or plain numbers. `main.ts` passes `state.view`. The type check makes it impossible to call `pressStart`, `update`, or other controls from U2. | `npm run typecheck` |
| SD2-4 | NFR5.6 | `draw` returns when there is no 2D context (existing). `spriteFor` has a `default` branch that returns a fixed placeholder bitmap (the LLM chip). `drawText` draws an unknown character as a space. Numbers are clamped (score to 0-999999, percent to 0-100, fill to the bar width). Pure helpers clamp their time input to ≥ 0 and treat non-finite input as 0. | Unit tests of `screen-timing.ts`; code review |
| SD2-5 | NFR6.2 | Every new bitmap is drawn by hand for this game; `ASSETS.md` at the repository root lists each sprite and glyph group, states it is original, and states no third-party asset is used. | Review of `ASSETS.md` |
| SD2-6 | NFR6.3 | `style.css` keeps the system `Courier New` / monospace stack; no font file. | Code review |

## Residual Risk

| Risk | Impact | Accepted because |
|---|---|---|
| A player edits the DOM in developer tools | Their own page only | No shared state |
