<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is kept up to date automatically while the stage runs. Add observations at the review step, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->

## Deviations

- 2026-11-13T12:30:29Z — [unit u1-game-rules] (1) Old global difficulty constants and STARTUP_DURATION were removed in Step 4 (config rewrite) instead of after Step 8; the old difficulty/spawner/state code was rewritten in Steps 8-12 so tests/game config/run/highscore ran green meanwhile. (2) objects.ts `isRescue`/`RescueKind` renamed to `isCollectible`/`CollectibleKind` (from types.ts). (3) main.ts also calls `sound.unlock()` on Enter/Space keydown (the POWER path used to unlock audio), not only on the START button. (4) Step 14 manual play in `npm run dev` not performed by the agent; left to the developer.
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
