---
inclusion: always
---

# AI-DLC Usage Tracking

## Purpose
Track AI-DLC phase/stage execution time and actual Kiro credit usage
for the AI CATCH project.

## How It Works
Tracking is automatic. No manual step is needed during the AI-DLC workflow.

1. The `AI-DLC Stage Usage Tracker` hook (`.kiro/hooks/aidlc-stage-usage-tracker.json`)
   runs `scripts/aidlc_stage_usage_hook.py` after every `execute_bash` call.
2. When an `aidlc engine orchestrate next|continue` command returns a `run-stage`
   directive, the hook ends the previous stage and starts the new one.
3. When an `aidlc engine orchestrate report --result approved|skipped` command runs,
   the hook ends the current stage.
4. On stage end, `scripts/aidlc_usage.py` reads the actual credit usage from Kiro's
   local session logs and appends one row to the CSV, then regenerates the
   Markdown report.

## Files
| File | Role |
|---|---|
| `.usage/aidlc-usage.csv` | Source of truth. One row per stage run. Read and written by the scripts |
| `.usage/aidlc-usage.md` | Human-readable report generated from the CSV. Do not edit by hand |
| `.usage/current-stage.json` | Temporary state for the running stage. Removed on stage end |

Usage data may be committed to Git and published with the repository.

## Credit Measurement
- Credits come from `~/.kiro/sessions/<hash>/<session>/messages.jsonl`.
  Each completed prompt turn records `promptTurnSummaries[].usage` with `unit: "credit"`.
- A stage's credits are the sum of turns in sessions bound to this workspace whose
  record timestamp falls in the window `(started_at, ended_at]`.
- If no turn data is found for a window, record `N/A`. Never guess a value.
- Never report elapsed time as credit usage.
- Credits are machine-local. Each row records the `host` it was written on
  (short host name, e.g. `hideMBP`; override with `AIDLC_USAGE_HOST`).
  Run `backfill` on the host shown for a row to fill its credits.

### Multiple Machines
- `backfill` only updates rows of the current host. Rows of another host are never
  touched, even with `--overwrite`.
- Rows with an empty `host` (recorded before the column existed, shown as `unknown`
  in the report) are filled and claimed for the current host only when its session
  logs have data for that window. Otherwise they are left unchanged.
- Start and end a stage on the same machine. `current-stage.json` is machine-local.
- Sync `.usage/aidlc-usage.csv` through Git. When both machines append rows,
  resolve merge conflicts by keeping both sets of rows, then run `report`.

### Known Limitations
- A turn is counted in the window where it finished. A gate-approval turn usually
  also starts the next stage, so it is counted in the next stage.
- Other chats in this workspace during a stage window are included in the total.
- Whether sub-agent usage is included in the parent turn's value is not verified.

## Commands
Run these from the project root.

```bash
# Regenerate the Markdown report from the CSV (no data change)
python3 scripts/aidlc_usage.py report

# Preview credit backfill for rows with empty or N/A credits
python3 scripts/aidlc_usage.py backfill --dry-run

# Fill empty or N/A credits of this host's rows (also regenerates the report)
python3 scripts/aidlc_usage.py backfill

# Recompute this host's rows, including rows that already have a value
python3 scripts/aidlc_usage.py backfill --overwrite
```

Manual tracking (only when the hook is not available):

```bash
python3 scripts/aidlc_usage.py start <phase> <stage>
python3 scripts/aidlc_usage.py end --notes "<note>"            # credits read from session logs
python3 scripts/aidlc_usage.py end --credits <value> --notes "<note>"  # explicit value overrides logs
```

## Tests
```bash
python3 -m unittest discover -s tests/scripts -v
```

## Scope
- Tracking must not interrupt the AI-DLC workflow.
- Tracking failures must not block game development. A report write failure
  prints a warning and does not stop the stage record.
- Do not add external services or databases for tracking.
- Do not introduce additional architectural components.
