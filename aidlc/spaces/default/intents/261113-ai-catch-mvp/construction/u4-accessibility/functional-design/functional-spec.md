# Functional Specification: u4-accessibility

Behaviour of the screen-announcement unit: what the hidden live region says on each screen, when it is written, and how failures stay silent. Data shapes are in `entities.md`, rules in `rules.md`.

Inputs: U4 scope in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md` and `unit-of-work-story-map.md`; AC6.1.9 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`; FR13.2 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`; ScreenAnnouncer and ADR-004 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/`; C1 and C5 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`; Screen Announcement in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/refined-mockups/interaction-spec.md`; `functional-design-questions.md` (Q1 A, Q2 A, Q3 A).

## Stories Implemented

US6.1, the screen-reader part only (AC6.1.9, Should Have), per the story map.

## Module Placement

| File | Change |
|---|---|
| `src/game/announcer.ts` (new) | Pure `screenAnnouncement(view: GameView): Announcement` (BR1.1-BR2.1) |
| `src/main.ts` (announcement section only, C5) | Look up `#announcer` once; after each draw, write `text` when `key` changed (BR2.2-BR2.4) |
| `tests/game/announcer.test.ts` (new) | Text and key tests |
| `index.html` | No change: U2 already added the empty `#announcer` (`role="status"`, `aria-live="polite"`, visually hidden) |

## Workflows

### W1 — Build

1. Bootstrap calls `screenAnnouncement(state.view)` once per frame, after drawing.
2. The function picks the text shape for `view.phase` (BR1.2-BR1.5) and the key (BR2.1).

### W2 — Write on change

1. If `key` equals the last written key, nothing happens.
2. Otherwise Bootstrap sets `region.textContent = text` and stores the key (BR2.2, BR2.3).
3. The screen reader reads the new text politely, after what it is currently saying.

### Example run

| Moment | Key | Text written |
|---|---|---|
| Page load | `title:1` | AI CATCH. Press Start. Arrow keys to move. High score 1200. |
| START | `stage-intro:1` | Stage 1, FORTRAN. Collect 10 mainframes. Avoid virus. AI 0%. |
| Play starts | `playing:1:3` | Stage 1 FORTRAN, AI 0%, score 0, 0 of 10, 3 lives |
| Catches (score 300) | `playing:1:3` | (nothing; key unchanged) |
| VIRUS hit | `playing:1:2` | Stage 1 FORTRAN, AI 0%, score 300, 3 of 10, 2 lives |
| Stage clear | `stage-clear:1` | FORTRAN recovered. AI 25%. |
| Stage 4 intro | `stage-intro:4` | Stage 4, LLM. Collect 16 LLM, GPU, and robot parts. Avoid virus. AI 75%. |
| Victory | `victory:4` | AI restored, 100%. Humans saved AI. Save the AI, save the future. Score 4800. New high score. |
| Any key | `title:1` | AI CATCH. Press Start. Arrow keys to move. High score 4800. |

## Edge Cases

| Case | Behaviour |
|---|---|
| Lives reach 0 | Phase becomes `game-over`; the game-over text is written, not a "0 lives" play text |
| One life left | "1 life" (BR1.4) |
| No high score yet | "High score 0." |
| `newHighScore` false | No "New high score." (BR1.5) |
| `canReturnToTitle` turns true | No new announcement (BR1.6) |
| `#announcer` missing or the write throws | Nothing is announced; the game keeps running (BR2.4) |
| Same screen entered twice in a row | Cannot happen: every phase change also changes the key |

## Checked Dependencies on U1 and U2 (review iteration 1)

Checked in the current code, not only assumed:

- `src/game/state.ts` `enterGameOver` and `enterVictory` set `phase`, submit the high score, and set `newHighScore` in the same update, so the first frame of those screens already holds the final `best` and `newHighScore`. The entry-frame text is therefore final.
- `src/game/state.ts` `handle` switches to `game-over` in the same update in which `lives` reaches 0, so no frame shows `playing` with 0 lives. The builder still produces "0 lives" for such a view, and a test covers it.
- `src/render/renderer.ts` draws the blinking NEW! on both the game-over and the victory screens when `newHighScore` is true. BR1.5 only puts that on-screen fact into words; it adds no feature.

## Test Plan

- Entry-frame views for game over and victory with `newHighScore` true and `best` equal to `score` give the final text (BR1.5).
- A `playing` view with `lives` 0 gives "0 lives" and the key `playing:n:0` (defensive; not reachable today).

- Each of the six phases gives its exact text for a literal `GameView` built from `STAGES` (BR1.2).
- Item names for all four stages (BR1.3); "1 life" and "3 lives" (BR1.4).
- "New high score." present only when `newHighScore` is true, on game over and victory (BR1.5).
- Key: equal for two playing views that differ only in score and caught; different when lives differ; different between phases and stages; equal when only `canReturnToTitle` or `phaseTime` differ (BR2.1, BR1.6).
- Purity: two calls with the same view give equal results (BR1.1).
- Play check: with VoiceOver (macOS or iOS) the title, each stage intro, a lost life, stage clear, game over, and victory are announced; nothing is read on each catch.

## Story Mapping

| Story | Parts |
|---|---|
| US6.1 (AC6.1.9) | W1, W2, all rules |
