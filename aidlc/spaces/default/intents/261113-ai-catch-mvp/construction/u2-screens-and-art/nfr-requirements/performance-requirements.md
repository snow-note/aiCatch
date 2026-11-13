# Performance Requirements: u2-screens-and-art

Performance targets for the drawing layer. Sources: NFR1-NFR4 and NFR9 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; screens in `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/functional-design/functional-spec.md`; frame loop and build contract C6 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; stack in `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`.

No stage questions were needed: the targets are fixed by the inception NFRs.

| ID | Requirement | Target | Check |
|---|---|---|---|
| NFR1.1 | One `draw` call plus one `update` call of the Renderer fits inside a 60 fps frame alongside the game update | Draw work well under 16.7 ms on a recent phone; no visible stutter | Play check on the developer's phone and desktop (browser performance panel when in doubt) |
| NFR1.2 | Drawing does no per-frame allocation-heavy work: no canvas creation, no image decoding, no string building beyond the few HUD strings | Bitmaps are drawn as `fillRect` runs from constant tables | Code review |
| NFR1.3 | Effects are bounded: pop-ups and sparks are removed when they expire; glitch and victory noise draw a fixed small number of slices and lines per frame | At most 6 glitch slices and 3 noise lines per frame (existing); victory noise at most 6 lines per frame | Code review |
| NFR2.1 | U2 adds no image, font, or audio files and no dependency; all art is code-defined bitmaps | Bundle growth from U2 under 10 kB gzip | `npm run build` size output |
| NFR3.1 | Nothing in U2 delays the first screen: no network fetch, no async asset load | Title drawn on the first frame | Play check |
| NFR4.1 | The console (320 × 240) scales to the largest fit, keeps 4:3, stays centred, and shows the whole play area and HUD without scrolling, in portrait and landscape | `fitCasing` unchanged; re-fit on resize and rotation | Existing layout tests plus play check |
| NFR9.1 | Scale-1 LCD text stays legible at the smallest supported visible areas (about 375 × 520 and 667 × 320 CSS px) | Effective scale ≥ about 1.17 | Play check at those sizes |

## Not Applicable Here

| NFR | Reason |
|---|---|
| NFR5 | No network use in U2 (see `security-requirements.md`) |
| NFR6 | Originality of art is in `security-requirements.md` |
| NFR7 | Publishing is U5 |
| NFR8 | Game-rule testability is U1; U2's pure helpers are tested under node (see `tech-stack-decisions.md`) |
