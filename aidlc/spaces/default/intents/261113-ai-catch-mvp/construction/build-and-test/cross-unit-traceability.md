# Cross-Unit Traceability: AI CATCH

Generated from `aidlc engine sensor-traceability --stage build-and-test` on 2026-11-13 (run 1; re-run in run 2 with the same result: pass, 0 uncovered, 110 IDs). It traces every requirement and acceptance criterion in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md` and `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md` to the units and files that build them, from each unit's `construction/*/code-generation/traceability.json` (which in turn follow each `code-generation-plan.md` and `code-summary.md`).

## Verdict

**Pass**: every traced ID is covered (built, or marked `N/A` with a reason by the units that do not own it). Uncovered IDs: none.

This is a traceability verdict only. Whether the built behaviour meets its quality targets is in `build-and-test-summary.md` (after loop-back 1 the coverage floor and the U4 size target are Met; the live-site targets wait for publishing). Browser-dependent acceptance criteria (marked *play check* in `stories.md`) are traced to the files that implement them but were checked in Node only, not in a real browser.

## Per-ID Coverage

Owning stage for every row: code-generation (per unit). "Through" rows are requirements covered via their acceptance criteria or sub-requirements; "Built in" rows list `unit: file`.

Engine result: `pass: true`, uncovered IDs: 0, IDs traced: 110.

| ID | Covered | Through (requirements) / Built in (unit: file or N/A reason) |
|---|---|---|
| FR1.1 | yes | AC1.1.1, AC1.1.2, AC1.1.3 (+2 more) |
| FR1.2 | yes | AC1.1.1, AC1.1.2, AC1.1.3 (+2 more) |
| FR1.3 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR1.4 | yes | AC3.1.1, AC3.1.2, AC3.1.3 (+6 more) |
| FR1.5 | yes | AC3.1.1, AC3.1.2, AC3.1.3 (+2 more) |
| FR1.6 | yes | AC5.1.1, AC5.1.2, AC5.1.3 (+3 more) |
| FR1.7 | yes | AC5.1.1, AC5.1.2, AC5.1.3 (+3 more) |
| FR1.8 | yes | AC5.1.1, AC5.1.2, AC5.1.3 (+3 more) |
| FR2.1 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR2.2 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR2.3 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR2.4 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR2.5 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| FR3.1 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR3.2 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR3.3 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR3.4 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR3.5 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR3.6 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR3.7 | yes | AC3.1.1, AC3.1.2, AC3.1.3 (+2 more) |
| FR4.1 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR4.2 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR4.3 | yes | AC3.1.1, AC3.1.2, AC3.1.3 (+2 more) |
| FR4.4 | yes | AC3.1.1, AC3.1.2, AC3.1.3 (+2 more) |
| FR4.5 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR5.1 | yes | AC1.1.1, AC1.1.2, AC1.1.3 (+8 more) |
| FR5.2 | yes | AC3.1.1, AC3.1.2, AC3.1.3 (+2 more) |
| FR5.3 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR5.4 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR6.1 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR6.2 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR6.3 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR7.1 | yes | AC3.1.1, AC3.1.2, AC3.1.3 (+2 more) |
| FR7.2 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+14 more) |
| FR8.1 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR8.2 | yes | AC2.1.1, AC2.1.2, AC2.1.3 (+8 more) |
| FR9.1 | yes | AC4.1.1, AC4.1.2, AC4.1.3 (+1 more) |
| FR9.2 | yes | AC4.1.1, AC4.1.2, AC4.1.3 (+1 more) |
| FR9.3 | yes | AC4.1.1, AC4.1.2, AC4.1.3 (+1 more) |
| FR10.1 | yes | AC4.1.1, AC4.1.2, AC4.1.3 (+7 more) |
| FR10.2 | yes | AC1.1.1, AC1.1.2, AC1.1.3 (+12 more) |
| FR10.3 | yes | AC5.1.1, AC5.1.2, AC5.1.3 (+3 more) |
| FR11.1 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| FR11.2 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| FR11.3 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| FR11.4 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| FR11.5 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| FR12.1 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| FR12.2 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| FR12.3 | yes | AC1.1.1, AC1.1.2, AC1.1.3 (+2 more) |
| FR12.4 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| FR13.1 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| FR13.2 | yes | AC6.1.1, AC6.1.2, AC6.1.3 (+7 more) |
| NFR1 | yes | u2-screens-and-art: NFR1.1, u2-screens-and-art: NFR1.2, u2-screens-and-art: NFR1.3 (+2 more) |
| NFR2 | yes | u2-screens-and-art: NFR2.1, u4-accessibility: NFR2.4, u5-publishing: NFR2.5 |
| NFR3 | yes | u2-screens-and-art: NFR3.1, u5-publishing: NFR3.2 |
| NFR4 | yes | u2-screens-and-art: NFR4.1 |
| NFR5 | yes | u1-game-rules: NFR5.1, u2-screens-and-art: NFR5.3, u2-screens-and-art: NFR5.4 (+12 more) |
| NFR6 | yes | u1-game-rules: NFR6.1, u2-screens-and-art: NFR6.2, u2-screens-and-art: NFR6.3 (+2 more) |
| NFR7 | yes | u5-publishing: NFR7.1, u5-publishing: NFR7.2, u5-publishing: NFR7.3 |
| NFR8 | yes | u1-game-rules: NFR8.1, u1-game-rules: NFR8.2, u1-game-rules: NFR8.3 (+7 more) |
| NFR9 | yes | u2-screens-and-art: NFR9.1 |
| AC1.1.1 | yes | u1-game-rules: tests/game/state.test.ts; u2-screens-and-art: index.html |
| AC1.1.2 | yes | u2-screens-and-art: src/render/renderer.ts |
| AC1.1.3 | yes | u1-game-rules: tests/game/state.test.ts |
| AC1.1.4 | yes | u1-game-rules: tests/game/state.test.ts |
| AC1.1.5 | yes | u3-sound: src/main.ts |
| AC2.1.1 | yes | u1-game-rules: tests/game/state.test.ts; u2-screens-and-art: src/render/renderer.ts |
| AC2.1.2 | yes | u1-game-rules: tests/game/config.test.ts; u2-screens-and-art: tests/render/sprites.test.ts |
| AC2.1.3 | yes | u1-game-rules: tests/game/run.test.ts; u2-screens-and-art: tests/render/screen-timing.test.ts |
| AC2.1.4 | yes | u1-game-rules: tests/game/input.test.ts |
| AC2.1.5 | yes | u1-game-rules: tests/game/state.test.ts |
| AC2.1.6 | yes | u1-game-rules: tests/game/state.test.ts |
| AC2.1.7 | yes | u1-game-rules: tests/game/state.test.ts |
| AC2.1.8 | yes | u1-game-rules: tests/game/config.test.ts |
| AC2.1.9 | yes | u1-game-rules: tests/game/difficulty.test.ts |
| AC2.1.10 | yes | u2-screens-and-art: tests/render/screen-timing.test.ts |
| AC2.1.11 | yes | u1-game-rules: src/game/config.ts |
| AC3.1.1 | yes | u1-game-rules: tests/game/state.test.ts |
| AC3.1.2 | yes | u1-game-rules: tests/game/state.test.ts; u2-screens-and-art: tests/render/screen-timing.test.ts |
| AC3.1.3 | yes | u1-game-rules: tests/game/state.test.ts; u2-screens-and-art: src/render/renderer.ts |
| AC3.1.4 | yes | u1-game-rules: tests/game/state.test.ts |
| AC3.1.5 | yes | u1-game-rules: tests/game/state.test.ts; u2-screens-and-art: src/render/renderer.ts |
| AC4.1.1 | yes | u1-game-rules: tests/game/state.test.ts; u2-screens-and-art: src/render/renderer.ts |
| AC4.1.2 | yes | u2-screens-and-art: tests/render/screen-timing.test.ts |
| AC4.1.3 | yes | u1-game-rules: tests/game/state.test.ts; u2-screens-and-art: src/render/renderer.ts |
| AC4.1.4 | yes | u2-screens-and-art: tests/render/sprites.test.ts |
| AC5.1.1 | yes | u1-game-rules: tests/game/state.test.ts; u2-screens-and-art: src/render/renderer.ts |
| AC5.1.2 | yes | u1-game-rules: tests/game/state.test.ts; u2-screens-and-art: src/render/renderer.ts |
| AC5.1.3 | yes | u1-game-rules: tests/game/state.test.ts; u2-screens-and-art: src/render/renderer.ts |
| AC5.1.4 | yes | u1-game-rules: tests/game/state.test.ts |
| AC5.1.5 | yes | u1-game-rules: tests/game/highscore.test.ts |
| AC5.1.6 | yes | u1-game-rules: src/game/state.ts |
| AC6.1.1 | yes | u2-screens-and-art: src/style.css |
| AC6.1.2 | yes | u2-screens-and-art: tests/render/sprites.test.ts |
| AC6.1.3 | yes | u2-screens-and-art: tests/render/sprites.test.ts |
| AC6.1.4 | yes | u2-screens-and-art: src/render/renderer.ts |
| AC6.1.5 | yes | u3-sound: src/audio/sound.ts |
| AC6.1.6 | yes | u3-sound: tests/audio/sound.test.ts |
| AC6.1.7 | yes | u2-screens-and-art: src/render/layout.ts |
| AC6.1.8 | yes | u2-screens-and-art: index.html |
| AC6.1.9 | yes | u4-accessibility: src/game/announcer.ts |
| AC6.1.10 | yes | u2-screens-and-art: ASSETS.md; u3-sound: ASSETS.md |
| AC7.1.1 | yes | u5-publishing: README.md |
| AC7.1.2 | yes | u5-publishing: scripts/check-size.mjs |
| AC7.1.3 | yes | u5-publishing: README.md |
| AC7.1.4 | yes | u5-publishing: README.md |
| AC7.1.5 | yes | u5-publishing: public/_headers |
| AC7.1.6 | yes | u5-publishing: README.md |
| AC7.1.7 | yes | u1-game-rules: tests/game/state.test.ts |
