# Logical Components: u2-screens-and-art

Where the U2 NFR patterns apply. Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/nfr-requirements/performance-requirements.md`, `security-requirements.md`, `tech-stack-decisions.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/functional-design/functional-spec.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

All components run in one browser tab inside the single static build; there is no service or infrastructure boundary.

| Component | File | Role | NFR patterns | Failure domain |
|---|---|---|---|---|
| ConsoleShell | `index.html`, `src/style.css` | Static page, casing, controls, empty announcer | Static markup only (SD2-2), no external resources (SD2-1, SD2-6) | Page load |
| Layout | `src/render/layout.ts` | Console fit | Unchanged pure function (PD-6) | Pure |
| Renderer | `src/render/renderer.ts` | Effects and screen drawing | Single canvas, bounded effects (PD-1, PD-3), read-only view (SD2-3), no-throw drawing (SD2-4) | One frame |
| screen-timing | `src/render/screen-timing.ts` | Pure timing and text helpers | Clamped inputs (SD2-4), unit-tested | Pure |
| Sprites | `src/render/sprites.ts` | Original bitmaps and glyphs | Constant tables (PD-2), originality record (SD2-5) | Compile time |
| Drawing section of Bootstrap | `src/main.ts` | Creates Renderer, calls `update` and `draw`, forwards events | Passes `state.view` only (SD2-3) | One frame |

## Isolation and Blast Radius

- A drawing bug affects only what is shown in the current tab; it cannot change game state (read-only `GameView`).
- A missing canvas context leaves a blank LCD while the game logic, sound, and announcements keep running.
- Shared resource: `src/main.ts`; U2 edits only its drawing and layout section (C5).
