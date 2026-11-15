# Tech Stack Decisions: u2-screens-and-art

U2 keeps the existing stack in `aidlc/spaces/default/codekb/aiCatch/technology-stack.md`. No dependency is added. Design: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u2-screens-and-art/functional-design/functional-spec.md`; requirements: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; contracts: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

| ID | Area | Decision | Rationale |
|---|---|---|---|
| NFR8.12 | Drawing | HTML5 Canvas 2D, `fillRect` runs for bitmaps, `imageSmoothingEnabled = false`, CSS `image-rendering: pixelated` | Existing approach; sharp pixels at any scale |
| NFR8.13 | Art format | Bitmaps as arrays of `'#'`/`'.'` strings in `sprites.ts` | Existing; diff-friendly, original, no asset files |
| NFR8.14 | Testable parts | Pure helpers in `src/render/screen-timing.ts`, tested with Vitest under node; sprite shape tests extended | Functional design Q1; no canvas needed in tests |
| NFR8.15 | Page | Static `index.html` and `style.css`; no UI framework | Single small page |
| NFR2.2 | Size | No new runtime dependency, no asset files | Keeps the build far under 1 MB |

Rejected: a canvas test library or headless browser for screen tests (new dependency; screens are checked by playing), and an image-based sprite sheet (needs asset loading and a licence record per file).
