#!/usr/bin/env python3
"""Record AI-DLC stage duration and actual Kiro credit usage.

Credits are read from Kiro's local session logs
(~/.kiro/sessions/<hash>/<session>/messages.jsonl). Each completed prompt
turn writes a ``promptTurnSummaries`` entry with ``unit: "credit"`` and a
``usage`` value. A stage's credits are the sum of turns in sessions bound to
this workspace whose record timestamp falls inside the stage window
(started_at, ended_at].

If no turn data is found for a window, ``N/A`` is recorded instead of a guess.

Session logs are machine-local, so every row records the ``host`` it was
written on. ``backfill`` only touches rows of the current host (plus legacy
rows with an empty host when data is found), never rows of another machine.
"""

import argparse
import csv
import json
import os
import socket
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
USAGE_DIR = ROOT / ".usage"
CSV_FILE = USAGE_DIR / "aidlc-usage.csv"
# Human-readable view regenerated from the CSV; the CSV stays the source of truth.
MD_FILE = USAGE_DIR / "aidlc-usage.md"
STATE_FILE = USAGE_DIR / "current-stage.json"

# Override with KIRO_SESSIONS_DIR when Kiro stores sessions elsewhere.
SESSIONS_DIR = Path(
    os.environ.get("KIRO_SESSIONS_DIR", str(Path.home() / ".kiro" / "sessions"))
)

NA = "N/A"

FIELDS = [
    "phase",
    "stage",
    "started_at",
    "ended_at",
    "duration_seconds",
    "credits",
    "notes",
    "host",
]


def current_host():
    """Short host name of this machine (e.g. 'hideMBP'). Override: AIDLC_USAGE_HOST."""
    override = os.environ.get("AIDLC_USAGE_HOST", "").strip()
    if override:
        return override
    try:
        name = socket.gethostname()
    except OSError:
        name = ""
    return name.split(".")[0] or "unknown"


def now():
    return datetime.now().astimezone().isoformat(timespec="seconds")


def parse_ts(value):
    """Parse an ISO 8601 timestamp (with offset or trailing Z) to aware datetime."""
    if not value:
        return None
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None


def iter_turn_usages():
    """Yield (timestamp, credits) for every credit-unit turn in this workspace."""
    if not SESSIONS_DIR.is_dir():
        return
    root = str(ROOT)
    for meta_file in SESSIONS_DIR.glob("*/*/session.json"):
        try:
            meta = json.loads(meta_file.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        if root not in (meta.get("workspacePaths") or []):
            continue
        messages = meta_file.parent / "messages.jsonl"
        if not messages.is_file():
            continue
        try:
            handle = messages.open(encoding="utf-8")
        except OSError:
            continue
        with handle:
            for line in handle:
                # Cheap filter before JSON parsing; the file can be large.
                if "promptTurnSummaries" not in line:
                    continue
                try:
                    record = json.loads(line)
                except json.JSONDecodeError:
                    continue
                ts = parse_ts(record.get("timestamp"))
                payload = record.get("payload") or {}
                if ts is None or not isinstance(payload, dict):
                    continue
                for turn in payload.get("promptTurnSummaries") or []:
                    usage = turn.get("usage") if isinstance(turn, dict) else None
                    if turn.get("unit") == "credit" and isinstance(usage, (int, float)):
                        yield ts, float(usage)


def sum_credits(started_at, ended_at):
    """Return the credit total for (started_at, ended_at], or None if no data."""
    start = parse_ts(started_at)
    end = parse_ts(ended_at)
    if start is None or end is None:
        return None
    total = 0.0
    found = False
    for ts, usage in iter_turn_usages():
        if start < ts <= end:
            total += usage
            found = True
    return round(total, 4) if found else None


def format_credits(value):
    return NA if value is None else value


def to_float(value):
    """Return a float for numeric credit cells, None for empty / N/A / invalid."""
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def format_duration(seconds):
    """Format seconds as e.g. '3h 4m 0s', '27m 36s', '34s'."""
    try:
        total = int(round(float(seconds)))
    except (TypeError, ValueError):
        return "-"
    if total < 0:
        return "-"
    hours, rest = divmod(total, 3600)
    minutes, secs = divmod(rest, 60)
    if hours:
        return f"{hours}h {minutes}m {secs}s"
    if minutes:
        return f"{minutes}m {secs}s"
    return f"{secs}s"


def format_timestamp(value):
    """Show an ISO timestamp as 'YYYY-MM-DD HH:MM:SS' in its recorded offset."""
    ts = parse_ts(value)
    return ts.strftime("%Y-%m-%d %H:%M:%S") if ts else (value or "-")


def format_credit_total(values):
    """Sum credit cells. Mark partial totals so missing data is never hidden."""
    numbers = [to_float(v) for v in values]
    known = [n for n in numbers if n is not None]
    if not known:
        return NA
    total = f"{round(sum(known), 4):g}"
    missing = len(numbers) - len(known)
    return f"{total} ({missing} N/A)" if missing else total


def md_cell(value):
    """Escape a value for a Markdown table cell."""
    text = "" if value is None else str(value)
    text = text.replace("\\", "\\\\").replace("|", "\\|")
    # Neutralise raw HTML so Markdown viewers that render HTML cannot run it.
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return " ".join(text.splitlines()) or "-"


def read_rows():
    if not CSV_FILE.exists():
        return []
    with CSV_FILE.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def read_header():
    if not CSV_FILE.exists():
        return None
    with CSV_FILE.open(newline="", encoding="utf-8") as f:
        return next(csv.reader(f), [])


def write_rows(rows):
    """Rewrite the CSV with the current FIELDS. Missing columns become empty."""
    USAGE_DIR.mkdir(exist_ok=True)
    with CSV_FILE.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows({k: (r.get(k) if r.get(k) is not None else "") for k in FIELDS}
                         for r in rows)


def render_report(rows):
    """Build the Markdown report text from CSV rows."""
    offsets = sorted({ts.strftime("%z") for ts in
                      (parse_ts(r.get("started_at")) for r in rows) if ts})
    tz_note = ", ".join(f"UTC{o[:3]}:{o[3:]}" for o in offsets) or "n/a"
    host_counts = {}
    for r in rows:
        name = (r.get("host") or "").strip() or "unknown"
        host_counts[name] = host_counts.get(name, 0) + 1
    host_note = ", ".join(f"{md_cell(h)} ({n})" for h, n in host_counts.items()) or "n/a"

    lines = [
        "# AI-DLC Usage Report",
        "",
        f"Generated from `{CSV_FILE.name}` at {now()}. "
        "Do not edit by hand; it is regenerated after each stage.",
        "",
        f"- Stage runs: {len(rows)}",
        f"- Total duration: {format_duration(sum(to_float(r.get('duration_seconds')) or 0 for r in rows))}",
        f"- Total credits: {format_credit_total([r.get('credits') for r in rows])}",
        f"- Time zone: {tz_note}",
        f"- Hosts: {host_note}",
        "",
        "## Stage Log",
        "",
        "| # | Phase | Stage | Started | Ended | Duration | Credits | Host | Notes |",
        "|---:|---|---|---|---|---:|---:|---|---|",
    ]
    for index, r in enumerate(rows, start=1):
        credits = (r.get("credits") or "").strip() or NA
        lines.append("| " + " | ".join([
            str(index),
            md_cell(r.get("phase")),
            md_cell(r.get("stage")),
            md_cell(format_timestamp(r.get("started_at"))),
            md_cell(format_timestamp(r.get("ended_at"))),
            md_cell(format_duration(r.get("duration_seconds"))),
            md_cell(credits),
            md_cell((r.get("host") or "").strip() or "unknown"),
            md_cell(r.get("notes")),
        ]) + " |")

    # Totals per (phase, stage) in first-seen order.
    groups = {}
    for r in rows:
        groups.setdefault((r.get("phase"), r.get("stage")), []).append(r)

    lines += [
        "",
        "## Totals by Stage",
        "",
        "| Phase | Stage | Runs | Duration | Credits |",
        "|---|---|---:|---:|---:|",
    ]
    for (phase, stage), items in groups.items():
        lines.append("| " + " | ".join([
            md_cell(phase),
            md_cell(stage),
            str(len(items)),
            md_cell(format_duration(sum(to_float(i.get("duration_seconds")) or 0 for i in items))),
            md_cell(format_credit_total([i.get("credits") for i in items])),
        ]) + " |")

    lines += [
        "",
        "## Notes",
        "",
        "- Credits are actual Kiro usage read from local session logs "
        "(`~/.kiro/sessions`). `N/A` means no log data was found for that window.",
        "- A turn is counted in the stage window where it finished, so a gate-approval "
        "turn is usually counted in the next stage.",
        "- Other chats in this workspace during a stage window are included.",
        "- Session logs are machine-local. Run `backfill` on the host shown for a row; "
        "`unknown` rows were recorded before the host column existed.",
        "",
    ]
    return "\n".join(lines)


def write_report():
    """Regenerate the Markdown report. Never raises: tracking must not block work."""
    try:
        USAGE_DIR.mkdir(exist_ok=True)
        MD_FILE.write_text(render_report(read_rows()), encoding="utf-8")
        return True
    except Exception as exc:  # noqa: BLE001 - report is best effort
        print(f"WARNING: Could not write report: {exc}")
        return False


def ensure_csv():
    """Create the CSV, or migrate an older header (e.g. without 'host') in place."""
    USAGE_DIR.mkdir(exist_ok=True)
    if not CSV_FILE.exists():
        with CSV_FILE.open("w", newline="", encoding="utf-8") as f:
            csv.DictWriter(f, fieldnames=FIELDS).writeheader()
        return
    if read_header() != FIELDS:
        write_rows(read_rows())


def start(phase, stage):
    USAGE_DIR.mkdir(exist_ok=True)

    if STATE_FILE.exists():
        print("ERROR: Another stage is already running.")
        print("Run 'end' first.")
        return

    state = {
        "phase": phase,
        "stage": stage,
        "started_at": now(),
        "start_epoch": datetime.now().timestamp(),
    }

    STATE_FILE.write_text(
        json.dumps(state, indent=2),
        encoding="utf-8",
    )

    print(f"Started: {phase}/{stage}")
    print(f"Time: {state['started_at']}")


def end(credits, notes):
    if not STATE_FILE.exists():
        print("ERROR: No active stage.")
        return

    state = json.loads(
        STATE_FILE.read_text(encoding="utf-8")
    )

    ended = datetime.now().astimezone()
    started_epoch = state["start_epoch"]
    duration = round(ended.timestamp() - started_epoch)
    ended_at = ended.isoformat(timespec="seconds")

    # Explicit --credits wins; otherwise read actual usage from session logs.
    if credits is None:
        credits = sum_credits(state["started_at"], ended_at)

    ensure_csv()

    row = {
        "phase": state["phase"],
        "stage": state["stage"],
        "started_at": state["started_at"],
        "ended_at": ended_at,
        "duration_seconds": duration,
        "credits": format_credits(credits),
        "notes": notes,
        "host": current_host(),
    }

    with CSV_FILE.open("a", newline="", encoding="utf-8") as f:
        csv.DictWriter(f, fieldnames=FIELDS).writerow(row)

    STATE_FILE.unlink()
    write_report()

    print("Completed:", state["phase"], state["stage"])
    print(f"Duration: {duration} seconds")
    print(f"Credits: {format_credits(credits)}")
    print(f"Saved: {CSV_FILE}")
    print(f"Report: {MD_FILE}")


def backfill(overwrite, dry_run):
    """Fill credits for existing rows from this machine's session logs.

    - Rows of this host: fill empty / N/A credits (all rows with --overwrite).
      No data found -> N/A.
    - Rows with an empty host (recorded before the host column): filled and
      claimed for this host only when data is found; otherwise left unchanged.
    - Rows of another host: never touched, even with --overwrite.
    """
    if not CSV_FILE.exists():
        print("ERROR: No usage CSV found.")
        return

    host = current_host()
    rows = read_rows()

    changed = 0
    skipped = 0
    for row in rows:
        row_host = (row.get("host") or "").strip()
        if row_host and row_host != host:
            skipped += 1
            continue
        current = (row.get("credits") or "").strip()
        if current and current != NA and not overwrite:
            continue

        total = sum_credits(row.get("started_at"), row.get("ended_at"))
        label = f"{row.get('phase')}/{row.get('stage')} {row.get('started_at')}"
        if not row_host:
            if total is None:
                print(f"{label}: no local data, unchanged (host unknown)")
                continue
            print(f"{label}: {current or '(empty)'} -> {total} (host -> {host})")
            row["credits"] = total
            row["host"] = host
            changed += 1
            continue

        value = format_credits(total)
        print(f"{label}: {current or '(empty)'} -> {value}")
        if str(value) != current:
            row["credits"] = value
            changed += 1

    print(f"Host: {host}. Skipped {skipped} row(s) recorded on other hosts.")

    if dry_run:
        print(f"Dry run: {changed} row(s) would change.")
        return

    # Always rewrite so an older header is migrated to the current FIELDS.
    write_rows(rows)
    write_report()
    print(f"Updated {changed} row(s): {CSV_FILE}")
    print(f"Report: {MD_FILE}")


def report():
    """Regenerate the Markdown report from the CSV without changing data."""
    if not CSV_FILE.exists():
        print("ERROR: No usage CSV found.")
        return
    if write_report():
        print(f"Report: {MD_FILE}")


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)

    s = sub.add_parser("start")
    s.add_argument("phase")
    s.add_argument("stage")

    e = sub.add_parser("end")
    e.add_argument("--credits", type=float,
                   help="Explicit credits. Omit to read actual usage from Kiro session logs.")
    e.add_argument("--notes", default="")

    b = sub.add_parser("backfill", help="Fill credits for existing rows from session logs.")
    b.add_argument("--overwrite", action="store_true",
                   help="Recompute rows that already have a numeric value.")
    b.add_argument("--dry-run", action="store_true",
                   help="Show changes without writing the CSV.")

    sub.add_parser("report", help="Regenerate the Markdown report from the CSV.")

    args = parser.parse_args()

    if args.command == "start":
        start(args.phase, args.stage)
    elif args.command == "end":
        end(args.credits, args.notes)
    elif args.command == "backfill":
        backfill(args.overwrite, args.dry_run)
    elif args.command == "report":
        report()


if __name__ == "__main__":
    main()
