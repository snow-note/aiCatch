# Reverse Engineering Timestamp

## Run Record

- Date: 2026-11-15
- Commit: d4ba5fdf4053b8651b8b19244dc08839d0db16d7
- Kind: full rescan (all 9 artifacts replaced), Minimal depth, single repo `aiCatch`
- Not executed: tests, builds, programs (code reading only)

## Scope of Analysis

```yaml
scope_version: 1
kind: full
intent: 261115-early-heart-loss
fingerprint: 3fc40700a7393142e4fff9b7176f72376c92d46c
analyzed:
  paths:
    - ./
  components:
    - Config
    - Types
    - GameState
    - Objects
    - Collision
    - Spawner
    - Difficulty
    - Run
    - Input Tracker
    - Announcer
    - High Score Store
    - Bootstrap
    - Renderer
    - Sprites
    - Screen Timing
    - Layout
    - Sound
    - Usage Tracking Scripts
    - Build Size Gate
    - CI Pipeline
shallow:
  paths:
    - src/render/sprites.ts
    - src/style.css
    - scripts/aidlc_usage.py
    - scripts/aidlc_stage_usage_hook.py
    - scripts/aidlc_hook_event.py
    - tests/
    - .usage/
    - original_spec.md
```
