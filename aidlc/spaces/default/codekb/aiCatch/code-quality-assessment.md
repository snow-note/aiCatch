# Code Quality Assessment

## Tests
- Vitest: about 75 `it`/`test` calls across 9 files (audio 5, collision 6, difficulty 11, highscore 8, input 9, spawner 6, state 22, layout 4, sprites 4); `it.each` adds more at run time. Counts are from pattern search; tests were not run.
- Python `unittest`: 60 `test_` methods in `tests/scripts/test_aidlc_usage.py` (usage tracker).
- Not covered: `src/main.ts`, `src/render/renderer.ts`, `src/style.css`, `index.html` (no DOM or canvas tests, no E2E).
- Coverage tooling: none configured.
- I did not execute any tests, so pass state is unknown from this scan.

## Static Checks
- TypeScript strict mode with unused locals and parameters errors.
- No ESLint, Prettier, or EditorConfig.

## CI/CD
None in the repo.

## Documentation
- No README.
- Most functions carry short doc comments with requirement references (FR/NFR/A ids).
- `original_spec.md` documents the original product intent in Japanese.

## Strengths
- Logic is separated from DOM and rendering and is injectable (random, storage), so it is unit-testable.
- Defensive handling of non-finite input, storage failure, and audio failure.
- Small modules with single purposes; low coupling; no cycles.
- No third-party runtime code or assets; sprites and sounds are original data.

## Technical Debt
| Item | Location | Impact for the MVP evolution |
|---|---|---|
| No stage or objective model | `state.ts`, `config.ts` | Core change required |
| Fixed four object kinds spread over several parallel tables | `objects.ts`, `config.ts`, `sprites.ts`, `sound.ts`, `main.ts` | Adding mainframe, tape, floppy touches each |
| Time-based difficulty only | `difficulty.ts` | Needs per-stage parameters |
| Font lacks `%`, `.`, `:` and punctuation | `sprites.ts` | Needed for "AI RESTORED - 100%" |
| `renderer.ts` large and untested | `renderer.ts` | Risk when adding screens |
| `main.ts` wiring is one closure and untested | `main.ts` | Moderate |
| Mouse cannot steer; touch uses window half | `main.ts` | Desktop mouse is restart-only by design |
| `.pyc` caches tracked in git | `scripts/__pycache__`, `tests/scripts/__pycache__` | Repo hygiene |
| Canvas is 240x160 only | `index.html`, `config.ts` | Tight space for story text |
| Exact pins of very recent major versions not verified | `package.json` | Install risk if a pin does not exist |
