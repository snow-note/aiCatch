# Performance Design: u2-screens-and-art

How the drawing layer meets `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/nfr-requirements/performance-requirements.md` with the stack in `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/nfr-requirements/tech-stack-decisions.md`. Screens are in `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/functional-design/functional-spec.md`; the frame loop is contract C5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

No stage questions were needed.

## Budget

The LCD is 240 × 160 logical pixels. A full frame clears the canvas once and draws at most: one HUD row, up to 6 falling objects, HUMAN, a few pop-ups and sparks, and either the glitch or the victory noise. That is a few hundred `fillRect` calls, far inside a 16.7 ms frame on current phones.

## Design Decisions

| ID | Requirement | Design |
|---|---|---|
| PD-1 | NFR1.1 | One canvas, one clear per frame, no layering canvases. Draw only the current screen; nothing off screen is drawn. |
| PD-2 | NFR1.2 | Bitmaps are drawn by scanning each row for runs of `#` and issuing one `fillRect` per run (existing). Bitmaps, glyphs, and the seven-segment table are module constants built once. HUD strings are built from at most four short template strings per frame. |
| PD-3 | NFR1.3 | Effect lists are pruned every `update` (existing). The glitch draws 6 slices and 3 noise lines per frame (existing `applyGlitch`). Victory noise draws at most 6 one-pixel lines per frame, their count falling linearly to 0 over the reboot step, and changes position at most 10 times per second (positions from the frame number divided by 6), so it never flashes the whole screen. |
| PD-4 | NFR2.1 | New art is string bitmaps in `sprites.ts`; no image or font files. Expected growth: a few kB of source, well under 10 kB gzip. |
| PD-5 | NFR3.1 | The Renderer is created synchronously in `main.ts` and draws the title on the first animation frame; no asset loading or awaits. |
| PD-6 | NFR4.1 | `fitCasing` and the resize, orientation, and visual-viewport listeners are kept unchanged. |
| PD-7 | NFR9.1 | The smallest text is the 3 × 5 font at scale 1; with the casing scale ≥ 1.17 at the smallest supported area, each font pixel is at least about 1.2 CSS px, and `image-rendering: pixelated` keeps it sharp. |

## Verification

- `npm run build` reports the JS bundle size; compare with the U1 build (20.65 kB, 6.87 kB gzip).
- Play check on the developer's desktop and phone, including the victory sequence and repeated glitches.
