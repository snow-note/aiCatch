# AI-DLC Usage Report

Generated from `aidlc-usage.csv` at 2026-11-12T13:28:51+09:00. Do not edit by hand; it is regenerated after each stage.

- Stage runs: 7
- Total duration: 6h 55m 49s
- Total credits: N/A
- Time zone: UTC+09:00
- Hosts: unknown (7)

## Stage Log

| # | Phase | Stage | Started | Ended | Duration | Credits | Host | Notes |
|---:|---|---|---|---|---:|---:|---|---|
| 1 | inception | requirements-analysis | 2026-11-10 15:46:17 | 2026-11-10 18:50:13 | 3h 3m 56s | N/A | unknown | approved: requirements-analysis |
| 2 | inception | user-stories | 2026-11-10 18:50:30 | 2026-11-10 21:55:51 | 3h 5m 21s | N/A | unknown | approved: user-stories |
| 3 | construction | code-generation | 2026-11-10 21:55:57 | 2026-11-10 21:58:59 | 3m 2s | N/A | unknown | auto-ended by stage transition |
| 4 | construction | code-generation | 2026-11-10 21:58:59 | 2026-11-10 22:26:34 | 27m 35s | N/A | unknown | auto-ended by stage transition |
| 5 | construction | code-generation | 2026-11-10 22:26:34 | 2026-11-10 22:27:08 | 34s | N/A | unknown | auto-ended by stage transition |
| 6 | construction | code-generation | 2026-11-10 22:27:08 | 2026-11-10 22:33:06 | 5m 57s | N/A | unknown | approved: code-generation |
| 7 | construction | build-and-test | 2026-11-10 22:33:23 | 2026-11-10 22:42:47 | 9m 24s | N/A | unknown | approved: build-and-test |

## Totals by Stage

| Phase | Stage | Runs | Duration | Credits |
|---|---|---:|---:|---:|
| inception | requirements-analysis | 1 | 3h 3m 56s | N/A |
| inception | user-stories | 1 | 3h 5m 21s | N/A |
| construction | code-generation | 4 | 37m 8s | N/A |
| construction | build-and-test | 1 | 9m 24s | N/A |

## Notes

- Credits are actual Kiro usage read from local session logs (`~/.kiro/sessions`). `N/A` means no log data was found for that window.
- A turn is counted in the stage window where it finished, so a gate-approval turn is usually counted in the next stage.
- Other chats in this workspace during a stage window are included.
- Session logs are machine-local. Run `backfill` on the host shown for a row; `unknown` rows were recorded before the host column existed.
