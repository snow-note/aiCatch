# Functional Design Questions: u2-screens-and-art

Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/units-generation/unit-of-work.md`, `unit-of-work-story-map.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/domain-design/components.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`, the refined mockups (`mockups.md`, `interaction-spec.md`, `design-system-mapping.md`, `accessibility-checklist.md`), and the existing `src/render/*.ts`, `index.html`, `src/style.css`.

Already settled and not asked again: every screen layout and text in `mockups.md`, the silver-grey casing with the POWER button removed, the HUD order, the new sprites and AI face looks, the NEW!/REACHED STAGE/intro AI bar extras, durations from contract C1, and that U2 reads only `GameView` and events.

## Q1. How is the drawing code organised?

`src/render/renderer.ts` is 385 lines and will roughly double with six screens.

A. Keep the `Renderer` class (effects, primitives, `draw` switch) in `renderer.ts`, and put the small pure helpers that decide what a screen shows at a given time (victory sub-step, AI bar fill amount, blink on/off, HUD text strings) in a new `src/render/screen-timing.ts`, so they can be unit-tested without a canvas.
B. Keep everything in `renderer.ts`; test nothing new beyond sprites and layout.
X. Other (please specify)

[Answer]: A

## Q2. Victory sequence timing inside `VICTORY_DURATION` (3.5 s)

A. As in the mockup: reboot 0-1.5 s (broken face, noise fading, AI bar 75% → 100%), restore 1.5-2.5 s (restored face), messages from 2.5 s one after another every 0.33 s, hold from 3.5 s with score, high score, NEW!, and PRESS ANY KEY once `canReturnToTitle` is true. Sub-step times are constants in `config.ts`.
B. Show everything at once with only a short fade-in.
X. Other (please specify)

[Answer]: A

## Q3. Stage-clear AI bar animation

A. The bar fills linearly from `aiRestoration - 25` to `aiRestoration` over the first 1.0 s of the 2.5 s screen (constant in `config.ts`), then holds; "+25%" shows once the fill ends.
B. The bar jumps straight to the new value.
X. Other (please specify)

[Answer]: A

## Q4. The hidden live-region element

The announcement text is U4's, but the page markup (ConsoleShell) is U2's.

A. U2 adds the empty element now: `<div id="announcer" class="visually-hidden" aria-live="polite" role="status"></div>` inside a new `<main>` around the console, marks the canvas `aria-hidden="true"`, turns the "AI CATCH" label into the page's only `h1`, and removes the POWER button. U4 later only writes text into `#announcer`.
B. Leave all accessibility markup to U4.
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.
