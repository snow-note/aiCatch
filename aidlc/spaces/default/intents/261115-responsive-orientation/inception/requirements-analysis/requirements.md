# Requirements: Responsive Gameplay Fixes (Orientation and Scaling)

Intent: `261115-responsive-orientation` (bugfix scope, Minimal depth).

## Intent Analysis

Original request (verbatim): "Responsive Gameplay Fixes - Fix layout and scaling issues during orientation changes - Ensure consistent game coordinates and UI positioning - Verify portrait and landscape gameplay - Preserve existing gameplay mechanics - Avoid introducing new features or unnecessary refactoring"

The developer retested on a real device and could not reproduce a visible problem (Q1). This work therefore hardens the layout against the risks the code scan found, without changing how the game looks or plays. The target is iPhone Safari in portrait and landscape, including rotation during play (Q2).

Upstream inputs:

- Code scan: `inception/reverse-engineering/developer-scan.md`.
- Code knowledge base: `aidlc/spaces/default/codekb/aiCatch/business-overview.md` (product and controls), `aidlc/spaces/default/codekb/aiCatch/architecture.md` (Bootstrap `refit` drives the pure `fitCasing` and a CSS transform on the 320 x 240 casing), and `aidlc/spaces/default/codekb/aiCatch/code-structure.md` (`src/main.ts`, `src/render/layout.ts`, `src/style.css`, `index.html`).
- Answers: `requirements-analysis-questions.md` (Q1 Other: not reproduced, treat as E; Q2 A; Q3 A; Q4 A; Q5 A; Q6 A; Q7 A; Q8 A).

## Functional Requirements

### FR1 Re-fit after the viewport settles

- **FR1.1** After every `resize`, `orientationchange`, and `visualViewport` `resize` event, the casing is fitted again immediately and once more after the viewport has settled: on the next animation frame and after a short delay (a tunable, about 300 ms). This catches iOS Safari reporting the old size right after rotation.
- **FR1.2** Repeated events during one rotation do not stack up pending re-fits: only the latest delayed re-fit runs.

### FR2 Never hide the casing on a bad size

- **FR2.1** When the visible size is zero, negative, or not a finite number, the last valid fit stays applied. The casing is never set to scale 0.
- **FR2.2** The pure fit function keeps returning a zero-size fit for an invalid size (as `tests/render/layout.test.ts:43-49` pins today); the decision to keep the previous fit is a separate pure helper that tests can cover.

### FR3 Fit the visible, safe area

- **FR3.1** The casing is placed using the visible viewport's position (`visualViewport.offsetLeft` and `offsetTop`) as well as its size, so it stays centred when the visible viewport is shifted.
- **FR3.2** The area used for fitting is the visible viewport minus the safe-area insets (`env(safe-area-inset-top/right/bottom/left)`, Q7). The casing is centred inside that area.
- **FR3.3** The fit keeps today's rule: the largest scale at which the whole 320 x 240 casing fits, keeping its aspect ratio, fractional scales allowed (Q4), the same layout in portrait and landscape (Q3).

### FR4 Touch split matches the layout

- **FR4.1** A touch is "left" when its `clientX` is left of the centre of the visible viewport (`visualViewport.offsetLeft + visualViewport.width / 2`, falling back to `window.innerWidth / 2` when `visualViewport` is missing), and "right" otherwise (Q5).

### FR5 Release held input on rotation

- **FR5.1** When the orientation changes, every held touch and key is released (the same `releaseAll` used on window blur), so HUMAN stops until the next press (Q6).

## Non-Functional Requirements

- **NFR1 Gameplay unchanged:** No change to game rules, timing, difficulty, scoring, the 240 x 160 play area, the canvas bitmap size, or any file under `src/game/` or `src/audio/`. Keyboard controls are unchanged.
- **NFR2 Look unchanged where it already worked:** On a viewport with no safe-area insets and no offset, the casing size and position equal today's `fitCasing` result (desktop window resize keeps working as before).
- **NFR3 Testability:** The fit-area calculation (viewport size, offset, insets), the keep-last-valid-fit decision, and the touch-side decision are pure functions with Vitest tests in Node (Q8). No new dependency and no DOM test environment.
- **NFR4 Quality gates:** `npm run typecheck`, `npm run coverage` (lines at least 80%), `npm run build`, and `npm run size` pass; the existing suite stays green.
- **NFR5 Manual check:** On iPhone Safari, play in portrait and landscape and rotate during play both ways. The casing is fully visible, centred, inside the safe area, never blank, and left/right touch moves HUMAN the expected way after rotation.
- **NFR6 Tunables:** The settle delay lives with the layout constants (render layer), not in `src/game/config.ts`, because it is presentation only.

## Constraints

- Browser HTML5 Canvas game in TypeScript; no backend, no external services, no new dependencies.
- Game logic stays separate from rendering; game rules stay free of DOM code.
- Only `src/main.ts`, `src/render/layout.ts`, `src/style.css`, `index.html` (only if needed), and their tests change.

## Assumptions

- Safe-area insets are read from CSS: `#stage` exposes `env(safe-area-inset-*)` (for example as CSS custom properties or padding) and the script reads the computed values. On browsers without insets they read as 0, which keeps NFR2.
- A delayed re-fit of about 300 ms is enough for iOS Safari to report the final size; the rAF re-fit covers faster cases.
- Because the problem could not be reproduced, success is judged by the manual check in NFR5 and the unit tests, not by a before/after reproduction.

## Out of Scope

- A different portrait layout or larger portrait game screen (Q3 A).
- Integer scale snapping and `devicePixelRatio` canvas sizing (Q4 A).
- Android Chrome verification (Q2 A); it is not required, though nothing here is iPhone-only code.
- A DOM test environment such as jsdom (Q8 A).
- Any gameplay, sound, or HUD change.

## Open Questions

- None.
