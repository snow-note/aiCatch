# Unit-of-Work Story Map: AI CATCH (four-stage MVP)

Maps every story in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md` to the units in `unit-of-work.md`. Requirements are in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; components in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md` and `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/decisions.md`. A unit is named on a row only when it implements part of that story.

## Story Map

| Story | Unit IDs | Directories | What each unit contributes |
|---|---|---|---|
| US1.1 | U1; U2; U3 | u1-game-rules; u2-screens-and-art; u3-sound | U1: title phase, START starts a run at Stage 1 with AI 0%, score 0, 3 lives, arrow keys do not start. U2: title screen and console without POWER. U3: sound unlock on first START. |
| US2.1 | U1; U2 | u1-game-rules; u2-screens-and-art | U1: stage intro timing, collectibles and counts per stage, Stage 4 combined count, movement, scoring, VIRUS, per-stage and in-stage difficulty. U2: intro screens, extended HUD, playing screen, new object art. |
| US3.1 | U1; U2 | u1-game-rules; u2-screens-and-art | U1: target reached, objects cleared, +25% AI, +500 bonus, lives carried, next stage. U2: stage-clear screen and AI bar fill. |
| US4.1 | U1; U2 | u1-game-rules; u2-screens-and-art | U1: Stage 4 clear to victory, high-score update at victory. U2: LLM RECOVERED screen, victory sequence, AI face, messages. |
| US5.1 | U1; U2 | u1-game-rules; u2-screens-and-art | U1: game over at 0 lives, high-score update and fallback, restart rules with held keys, no pause. U2: game-over screen with AI bar, REACHED STAGE, NEW!. |
| US6.1 | U2; U3; U4 | u2-screens-and-art; u3-sound; u4-accessibility | U2: LCD look, shape-distinct art, extended font, effects, layout and rotation, single h1, keyboard-only play, asset records. U3: new and kept sounds, silent fallback. U4: screen announcements. |
| US7.1 | U1; U5 | u1-game-rules; u5-publishing | U1: rules testable without a browser, tests first, existing suite green (AC7.1.7). U5: performance and load checks, size budget, no external calls, public repository and Cloudflare Pages URL. |

## Cross-Cutting Rows

- **US1.1** spans U1, U2, and U3: starting a run touches rules, the title screen, and sound unlocking.
- **US6.1** spans U2, U3, and U4: look, sound, and accessibility are separate units by design.
- **US7.1** spans U1 and U5: testability lives in the rules; publishing checks live in U5.

## Implementation Order Within Each Unit

- **U1**: stage definitions and RunProgress → Difficulty and Spawner with stage parameters → new object kinds → GameState phases (title, stage-intro, playing, stage-clear, victory, game-over) → high score at victory → InputTracker focus-loss clearing. Each step test first.
- **U2**: font glyphs → new bitmaps and AI face → shared AI bar → HUD → stage intro and stage clear screens → title and game over updates → victory sequence → console casing and controls row.
- **U3**: new sound table entries → event mapping → first-START unlock → remove startup sound.
- **U4**: announcement text builder → live region element → write-on-change wiring.
- **U5**: build and size check → README and licence notes → Cloudflare Pages and GitHub publishing setup.

## Coverage Verification

- Every story US1.1-US7.1 is assigned to at least one unit.
- Every unit has at least one row: U1 (US1.1, US2.1, US3.1, US4.1, US5.1, US7.1), U2 (US1.1, US2.1, US3.1, US4.1, US5.1, US6.1), U3 (US1.1, US6.1), U4 (US6.1), U5 (US7.1).
