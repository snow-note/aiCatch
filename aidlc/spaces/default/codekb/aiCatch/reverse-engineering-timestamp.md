# Reverse Engineering Timestamp
## Run Record
- Date: 2026-11-15
- Commit: c41d9198e9a7eafde81f47f19748936e97bc42df
- Kind: focused partial rescan merged into a stale store (intent 261115-stage-time-limit), Minimal depth, single repo `aiCatch`
- Analyzed this run: `src/game`, `src/render`, `tests/game`, `tests/render`. Sections updated: business-overview (scoring, run end), architecture (values, phase flow, HUD), code-structure (sizes, tests), api-documentation (contracts, announcer), component-inventory (game and render components), code-quality-assessment (intent findings). technology-stack and dependencies carried over (import lists re-verified for the snapshot paths).
- Not executed: tests, builds, programs (code reading only)
## Scope of Analysis
```yaml
scope_version: 1
kind: partial
intent: 261115-stage-time-limit
fingerprint: e9d7e9bfd5d14c5e89abb2c549921c5352a94821
analyzed:
  paths:
    - src/game
    - src/render
    - tests/game
    - tests/render
  components:
    - Config
    - Types
    - GameState
    - Objects
    - Spawner
    - Difficulty
    - Run
    - Announcer
    - Renderer
    - Screen Timing
    - Layout
shallow:
  paths:
    - ./
    - src/render/sprites.ts
    - src/style.css
    - scripts/aidlc_usage.py
    - scripts/aidlc_stage_usage_hook.py
    - scripts/aidlc_hook_event.py
    - tests/
    - .usage/
    - original_spec.md
```
