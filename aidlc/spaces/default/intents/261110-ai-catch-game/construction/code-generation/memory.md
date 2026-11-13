<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->

- 2026-11-10T12:50:00Z — Zero-Unit poc build, no design stages, so the technical choices are made in the plan: Vite 8.3.7, Vitest 5.1.0, TypeScript 7.0.2 (latest on npm today, pinned), no runtime dependencies. Sprites as code bitmaps and sounds synthesised with Web Audio, which keeps every asset original (NFR5) and the download tiny (NFR4).
- 2026-11-10T12:50:00Z — One casing layout (320×240 logical, scaled to fit) for both orientations instead of a portrait-specific layout; the requirements leave per-orientation layout to design and a single fixed ratio fits both target viewports. Repository and API layers of the test-after profile are omitted as not applicable (no database, no server).
- 2026-11-10T12:50:00Z — LICENSE copyright holder written as "2026 AI CATCH authors" because no name was given; flagged in the plan so the developer can replace it.

- 2026-11-10T13:20:00Z — Build finished: 86 tests pass, typecheck clean, dist/ 19,819 bytes; I re-ran all three myself. Developer chose the values the requirements left to design (ROBOT sway ±22 px / 1.6 s, VIRUS jitter ±16 px, HUMAN 130 px/s, 2.0 s startup, 1.62 s game-over sound); recorded in code-summary.md. Traceability: AC8.1.3 and AC8.1.4 deferred to build-and-test (need real browsers and devices); AC9.1.1 deferred in the person's own words (they check after the GitHub push).

- 2026-11-10T13:35:00Z — Request Changes at the gate: "R-02 クリックでも再スタート". Added it as plan Step 11 and built only that step; 89 tests pass, typecheck and build clean, dist/ 19,906 bytes (re-run myself). This widens FR1.5 ("key press or tap") to include a mouse click on PC; recorded in code-summary.md rather than editing the approved requirements.
