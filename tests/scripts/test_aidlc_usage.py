"""Tests for scripts/aidlc_usage.py.

Run: python3 -m unittest discover -s tests/scripts -v
Uses only the standard library and isolated temp directories, so real
.usage data and ~/.kiro/sessions are never touched.
"""

import contextlib
import csv
import importlib.util
import io
import json
import os
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[2] / "scripts" / "aidlc_usage.py"


def load_module():
    spec = importlib.util.spec_from_file_location("aidlc_usage_under_test", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def iso(dt):
    return dt.isoformat(timespec="seconds")


HOST = "thishost"


class UsageTestCase(unittest.TestCase):
    def setUp(self):
        # Pin the host name so tests do not depend on the machine they run on.
        self._saved_host = os.environ.get("AIDLC_USAGE_HOST")
        os.environ["AIDLC_USAGE_HOST"] = HOST
        self.tmp = tempfile.TemporaryDirectory()
        base = Path(self.tmp.name)
        self.root = base / "workspace"
        self.root.mkdir()
        self.sessions = base / "sessions"
        self.sessions.mkdir()

        self.u = load_module()
        self.u.ROOT = self.root
        self.u.USAGE_DIR = self.root / ".usage"
        self.u.CSV_FILE = self.u.USAGE_DIR / "aidlc-usage.csv"
        self.u.MD_FILE = self.u.USAGE_DIR / "aidlc-usage.md"
        self.u.STATE_FILE = self.u.USAGE_DIR / "current-stage.json"
        self.u.SESSIONS_DIR = self.sessions
        self._session_count = 0

    def tearDown(self):
        self.tmp.cleanup()
        if self._saved_host is None:
            os.environ.pop("AIDLC_USAGE_HOST", None)
        else:
            os.environ["AIDLC_USAGE_HOST"] = self._saved_host

    def add_session(self, turns, workspace=None, extra_lines=()):
        """Create a fake Kiro session. turns: list of (timestamp, usage, unit)."""
        self._session_count += 1
        sdir = self.sessions / "hash" / f"sess_{self._session_count}"
        sdir.mkdir(parents=True)
        meta = {"workspacePaths": [str(workspace or self.root)]}
        (sdir / "session.json").write_text(json.dumps(meta), encoding="utf-8")
        lines = list(extra_lines)
        for ts, usage, unit in turns:
            lines.append(json.dumps({
                "timestamp": ts,
                "payload": {"promptTurnSummaries": [{"unit": unit, "usage": usage}]},
            }))
        (sdir / "messages.jsonl").write_text("\n".join(lines) + "\n", encoding="utf-8")

    def run_quiet(self, func, *args):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            func(*args)
        return out.getvalue()

    def read_rows(self):
        with self.u.CSV_FILE.open(newline="", encoding="utf-8") as f:
            return list(csv.DictReader(f))

    def write_rows(self, rows, fields=None):
        fields = fields or self.u.FIELDS
        self.u.USAGE_DIR.mkdir(exist_ok=True)
        with self.u.CSV_FILE.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(rows)

    def read_header(self):
        with self.u.CSV_FILE.open(newline="", encoding="utf-8") as f:
            return next(csv.reader(f))


class ParseTsTest(UsageTestCase):
    def test_parses_trailing_z_as_utc(self):
        self.assertEqual(
            self.u.parse_ts("2026-11-10T06:46:17Z"),
            datetime(2026, 11, 10, 6, 46, 17, tzinfo=timezone.utc),
        )

    def test_parses_offset_and_compares_across_zones(self):
        jst = self.u.parse_ts("2026-11-10T15:46:17+09:00")
        utc = self.u.parse_ts("2026-11-10T06:46:17Z")
        self.assertEqual(jst, utc)

    def test_invalid_and_empty_return_none(self):
        self.assertIsNone(self.u.parse_ts("not-a-date"))
        self.assertIsNone(self.u.parse_ts(""))
        self.assertIsNone(self.u.parse_ts(None))


class FormatCreditsTest(UsageTestCase):
    def test_none_becomes_na(self):
        self.assertEqual(self.u.format_credits(None), "N/A")

    def test_numbers_pass_through_including_zero(self):
        self.assertEqual(self.u.format_credits(1.5), 1.5)
        self.assertEqual(self.u.format_credits(0), 0)


class SumCreditsTest(UsageTestCase):
    START = "2026-11-10T10:00:00Z"
    END = "2026-11-10T11:00:00Z"

    def test_sums_turns_inside_window(self):
        self.add_session([
            ("2026-11-10T10:10:00Z", 1.25, "credit"),
            ("2026-11-10T10:50:00Z", 0.5, "credit"),
        ])
        self.assertEqual(self.u.sum_credits(self.START, self.END), 1.75)

    def test_start_is_exclusive_and_end_is_inclusive(self):
        self.add_session([
            (self.START, 9.0, "credit"),
            (self.END, 2.0, "credit"),
        ])
        self.assertEqual(self.u.sum_credits(self.START, self.END), 2.0)

    def test_window_accepts_local_offsets(self):
        self.add_session([("2026-11-10T10:30:00Z", 3.0, "credit")])
        self.assertEqual(
            self.u.sum_credits("2026-11-10T19:00:00+09:00", "2026-11-10T20:00:00+09:00"),
            3.0,
        )

    def test_sums_across_multiple_sessions(self):
        self.add_session([("2026-11-10T10:10:00Z", 1.0, "credit")])
        self.add_session([("2026-11-10T10:20:00Z", 2.0, "credit")])
        self.assertEqual(self.u.sum_credits(self.START, self.END), 3.0)

    def test_ignores_other_workspaces(self):
        self.add_session([("2026-11-10T10:10:00Z", 5.0, "credit")],
                         workspace="/somewhere/else")
        self.assertIsNone(self.u.sum_credits(self.START, self.END))

    def test_ignores_non_credit_units_and_non_numeric_usage(self):
        self.add_session([
            ("2026-11-10T10:10:00Z", 5.0, "token"),
            ("2026-11-10T10:20:00Z", "abc", "credit"),
            ("2026-11-10T10:30:00Z", 0.75, "credit"),
        ])
        self.assertEqual(self.u.sum_credits(self.START, self.END), 0.75)

    def test_skips_malformed_lines(self):
        self.add_session(
            [("2026-11-10T10:10:00Z", 1.0, "credit")],
            extra_lines=[
                "{not json promptTurnSummaries",
                json.dumps({"timestamp": "bad", "payload": {"promptTurnSummaries": [
                    {"unit": "credit", "usage": 9}]}}),
                json.dumps({"timestamp": "2026-11-10T10:15:00Z",
                            "payload": "promptTurnSummaries"}),
            ],
        )
        self.assertEqual(self.u.sum_credits(self.START, self.END), 1.0)

    def test_skips_sessions_with_broken_metadata(self):
        sdir = self.sessions / "hash" / "sess_broken"
        sdir.mkdir(parents=True)
        (sdir / "session.json").write_text("{broken", encoding="utf-8")
        (sdir / "messages.jsonl").write_text("", encoding="utf-8")
        self.add_session([("2026-11-10T10:10:00Z", 1.0, "credit")])
        self.assertEqual(self.u.sum_credits(self.START, self.END), 1.0)

    def test_zero_usage_is_reported_as_zero_not_none(self):
        self.add_session([("2026-11-10T10:10:00Z", 0.0, "credit")])
        self.assertEqual(self.u.sum_credits(self.START, self.END), 0.0)

    def test_no_data_returns_none(self):
        self.assertIsNone(self.u.sum_credits(self.START, self.END))

    def test_missing_sessions_dir_returns_none(self):
        self.u.SESSIONS_DIR = Path(self.tmp.name) / "does-not-exist"
        self.assertIsNone(self.u.sum_credits(self.START, self.END))

    def test_invalid_window_returns_none(self):
        self.add_session([("2026-11-10T10:10:00Z", 1.0, "credit")])
        self.assertIsNone(self.u.sum_credits("bad", self.END))
        self.assertIsNone(self.u.sum_credits(self.START, None))


class StartTest(UsageTestCase):
    def test_creates_state_file(self):
        self.run_quiet(self.u.start, "inception", "requirements-analysis")
        state = json.loads(self.u.STATE_FILE.read_text(encoding="utf-8"))
        self.assertEqual(state["phase"], "inception")
        self.assertEqual(state["stage"], "requirements-analysis")
        self.assertIn("started_at", state)

    def test_refuses_second_start(self):
        self.run_quiet(self.u.start, "inception", "a")
        out = self.run_quiet(self.u.start, "inception", "b")
        self.assertIn("ERROR", out)
        state = json.loads(self.u.STATE_FILE.read_text(encoding="utf-8"))
        self.assertEqual(state["stage"], "a")


class EndTest(UsageTestCase):
    def begin(self, minutes_ago=30):
        started = datetime.now().astimezone() - timedelta(minutes=minutes_ago)
        self.u.USAGE_DIR.mkdir(exist_ok=True)
        self.u.STATE_FILE.write_text(json.dumps({
            "phase": "construction",
            "stage": "code-generation",
            "started_at": iso(started),
            "start_epoch": started.timestamp(),
        }), encoding="utf-8")
        return started

    def test_records_actual_credits_from_session_logs(self):
        started = self.begin()
        self.add_session([
            (iso(started + timedelta(minutes=5)), 1.5, "credit"),
            (iso(started + timedelta(minutes=10)), 0.25, "credit"),
            (iso(started - timedelta(minutes=5)), 9.0, "credit"),  # before stage
        ])
        self.run_quiet(self.u.end, None, "approved: code-generation")
        rows = self.read_rows()
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["credits"], "1.75")
        self.assertEqual(rows[0]["notes"], "approved: code-generation")
        self.assertEqual(rows[0]["host"], HOST)
        self.assertFalse(self.u.STATE_FILE.exists())

    def test_migrates_old_header_before_appending(self):
        legacy_fields = [f for f in self.u.FIELDS if f != "host"]
        self.write_rows([{f: "old" for f in legacy_fields}], fields=legacy_fields)
        self.begin()
        self.run_quiet(self.u.end, None, "")
        self.assertEqual(self.read_header(), self.u.FIELDS)
        rows = self.read_rows()
        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[0]["phase"], "old")
        self.assertEqual(rows[0]["host"], "")
        self.assertEqual(rows[1]["host"], HOST)

    def test_explicit_credits_override_logs(self):
        started = self.begin()
        self.add_session([(iso(started + timedelta(minutes=5)), 1.5, "credit")])
        self.run_quiet(self.u.end, 4.0, "")
        self.assertEqual(self.read_rows()[0]["credits"], "4.0")

    def test_records_na_when_no_turn_data(self):
        self.begin()
        self.run_quiet(self.u.end, None, "")
        self.assertEqual(self.read_rows()[0]["credits"], "N/A")

    def test_records_duration(self):
        self.begin(minutes_ago=10)
        self.run_quiet(self.u.end, None, "")
        duration = int(self.read_rows()[0]["duration_seconds"])
        self.assertGreaterEqual(duration, 599)
        self.assertLessEqual(duration, 660)

    def test_appends_to_existing_csv(self):
        self.write_rows([{f: "x" for f in self.u.FIELDS}])
        self.begin()
        self.run_quiet(self.u.end, None, "")
        self.assertEqual(len(self.read_rows()), 2)

    def test_errors_without_active_stage(self):
        out = self.run_quiet(self.u.end, None, "")
        self.assertIn("ERROR", out)
        self.assertFalse(self.u.CSV_FILE.exists())


class CurrentHostTest(UsageTestCase):
    def test_env_override(self):
        self.assertEqual(self.u.current_host(), HOST)

    def test_strips_domain_from_system_hostname(self):
        os.environ.pop("AIDLC_USAGE_HOST")
        original = self.u.socket.gethostname
        self.u.socket.gethostname = lambda: "hideMBP.local"
        try:
            self.assertEqual(self.u.current_host(), "hideMBP")
        finally:
            self.u.socket.gethostname = original

    def test_blank_override_falls_back_and_failure_is_unknown(self):
        os.environ["AIDLC_USAGE_HOST"] = "  "
        original = self.u.socket.gethostname

        def boom():
            raise OSError("no hostname")

        self.u.socket.gethostname = boom
        try:
            self.assertEqual(self.u.current_host(), "unknown")
        finally:
            self.u.socket.gethostname = original


class CsvMigrationTest(UsageTestCase):
    def test_read_header_without_csv(self):
        self.assertIsNone(self.u.read_header())

    def test_write_rows_fills_missing_columns(self):
        self.u.write_rows([{"phase": "p", "stage": "s"}])
        self.assertEqual(self.read_header(), self.u.FIELDS)
        row = self.read_rows()[0]
        self.assertEqual((row["phase"], row["host"], row["credits"]), ("p", "", ""))

    def test_ensure_csv_creates_header(self):
        self.u.ensure_csv()
        self.assertEqual(self.read_header(), self.u.FIELDS)
        self.assertEqual(self.read_rows(), [])

    def test_ensure_csv_keeps_current_file_untouched(self):
        self.write_rows([{f: "x" for f in self.u.FIELDS}])
        before = self.u.CSV_FILE.read_text(encoding="utf-8")
        self.u.ensure_csv()
        self.assertEqual(self.u.CSV_FILE.read_text(encoding="utf-8"), before)


class BackfillTest(UsageTestCase):
    def row(self, credits, start="2026-11-10T10:00:00Z", end="2026-11-10T11:00:00Z",
            host=HOST):
        return {
            "phase": "inception", "stage": "user-stories",
            "started_at": start, "ended_at": end,
            "duration_seconds": "3600", "credits": credits, "notes": "", "host": host,
        }

    def test_never_touches_other_hosts_even_with_overwrite(self):
        self.add_session([("2026-11-10T10:30:00Z", 2.5, "credit")])
        self.write_rows([self.row("", host="otherhost"), self.row("7.0", host="otherhost")])
        out = self.run_quiet(self.u.backfill, True, False)
        rows = self.read_rows()
        self.assertEqual([r["credits"] for r in rows], ["", "7.0"])
        self.assertEqual([r["host"] for r in rows], ["otherhost", "otherhost"])
        self.assertIn("Skipped 2 row(s)", out)

    def test_legacy_row_is_claimed_when_data_found(self):
        self.add_session([("2026-11-10T10:30:00Z", 2.5, "credit")])
        self.write_rows([self.row("", host="")])
        self.run_quiet(self.u.backfill, False, False)
        row = self.read_rows()[0]
        self.assertEqual((row["credits"], row["host"]), ("2.5", HOST))

    def test_legacy_row_is_unchanged_without_data(self):
        self.write_rows([self.row("", host="")])
        out = self.run_quiet(self.u.backfill, False, False)
        row = self.read_rows()[0]
        self.assertEqual((row["credits"], row["host"]), ("", ""))
        self.assertIn("no local data, unchanged", out)

    def test_migrates_legacy_header(self):
        legacy_fields = [f for f in self.u.FIELDS if f != "host"]
        self.write_rows([self.row("")], fields=legacy_fields)
        self.run_quiet(self.u.backfill, False, False)
        self.assertEqual(self.read_header(), self.u.FIELDS)

    def test_dry_run_does_not_migrate_header(self):
        legacy_fields = [f for f in self.u.FIELDS if f != "host"]
        self.write_rows([self.row("")], fields=legacy_fields)
        self.run_quiet(self.u.backfill, False, True)
        self.assertEqual(self.read_header(), legacy_fields)

    def test_fills_empty_and_na_rows(self):
        self.add_session([("2026-11-10T10:30:00Z", 2.5, "credit")])
        self.write_rows([self.row(""), self.row("N/A")])
        self.run_quiet(self.u.backfill, False, False)
        self.assertEqual([r["credits"] for r in self.read_rows()], ["2.5", "2.5"])

    def test_keeps_numeric_values_without_overwrite(self):
        self.add_session([("2026-11-10T10:30:00Z", 2.5, "credit")])
        self.write_rows([self.row("7.0")])
        self.run_quiet(self.u.backfill, False, False)
        self.assertEqual(self.read_rows()[0]["credits"], "7.0")

    def test_overwrite_recomputes_numeric_values(self):
        self.add_session([("2026-11-10T10:30:00Z", 2.5, "credit")])
        self.write_rows([self.row("7.0")])
        self.run_quiet(self.u.backfill, True, False)
        self.assertEqual(self.read_rows()[0]["credits"], "2.5")

    def test_marks_na_when_no_data(self):
        self.write_rows([self.row("")])
        self.run_quiet(self.u.backfill, False, False)
        self.assertEqual(self.read_rows()[0]["credits"], "N/A")

    def test_dry_run_does_not_write(self):
        self.add_session([("2026-11-10T10:30:00Z", 2.5, "credit")])
        self.write_rows([self.row("")])
        before = self.u.CSV_FILE.read_text(encoding="utf-8")
        out = self.run_quiet(self.u.backfill, False, True)
        self.assertIn("Dry run: 1 row(s) would change.", out)
        self.assertEqual(self.u.CSV_FILE.read_text(encoding="utf-8"), before)

    def test_errors_without_csv(self):
        out = self.run_quiet(self.u.backfill, False, False)
        self.assertIn("ERROR", out)


class FormattingHelpersTest(UsageTestCase):
    def test_to_float(self):
        self.assertEqual(self.u.to_float("1.5"), 1.5)
        self.assertEqual(self.u.to_float(2), 2.0)
        self.assertIsNone(self.u.to_float(""))
        self.assertIsNone(self.u.to_float("N/A"))
        self.assertIsNone(self.u.to_float(None))

    def test_format_duration(self):
        self.assertEqual(self.u.format_duration(11036), "3h 3m 56s")
        self.assertEqual(self.u.format_duration("1655"), "27m 35s")
        self.assertEqual(self.u.format_duration(34), "34s")
        self.assertEqual(self.u.format_duration(0), "0s")
        self.assertEqual(self.u.format_duration(3600), "1h 0m 0s")

    def test_format_duration_invalid(self):
        self.assertEqual(self.u.format_duration(""), "-")
        self.assertEqual(self.u.format_duration(None), "-")
        self.assertEqual(self.u.format_duration(-5), "-")

    def test_format_timestamp_keeps_recorded_offset(self):
        self.assertEqual(self.u.format_timestamp("2026-11-10T15:46:17+09:00"),
                         "2026-11-10 15:46:17")

    def test_format_timestamp_invalid(self):
        self.assertEqual(self.u.format_timestamp("garbage"), "garbage")
        self.assertEqual(self.u.format_timestamp(""), "-")
        self.assertEqual(self.u.format_timestamp(None), "-")

    def test_format_credit_total(self):
        self.assertEqual(self.u.format_credit_total(["1.5", "0.25"]), "1.75")
        self.assertEqual(self.u.format_credit_total(["1.5", "N/A", ""]), "1.5 (2 N/A)")
        self.assertEqual(self.u.format_credit_total(["N/A", ""]), "N/A")
        self.assertEqual(self.u.format_credit_total([]), "N/A")
        self.assertEqual(self.u.format_credit_total(["0"]), "0")

    def test_md_cell_escapes_table_and_html(self):
        self.assertEqual(self.u.md_cell("a|b"), "a\\|b")
        self.assertEqual(self.u.md_cell("<script>x</script>"),
                         "&lt;script&gt;x&lt;/script&gt;")
        self.assertEqual(self.u.md_cell("a & b"), "a &amp; b")
        self.assertEqual(self.u.md_cell("line1\nline2"), "line1 line2")
        self.assertEqual(self.u.md_cell(""), "-")
        self.assertEqual(self.u.md_cell(None), "-")


class ReportTest(UsageTestCase):
    ROWS = [
        {"phase": "inception", "stage": "requirements-analysis",
         "started_at": "2026-11-10T15:46:17+09:00", "ended_at": "2026-11-10T18:50:13+09:00",
         "duration_seconds": "11036", "credits": "2.5", "notes": "approved: requirements-analysis",
         "host": "hostA"},
        {"phase": "construction", "stage": "code-generation",
         "started_at": "2026-11-10T21:55:57+09:00", "ended_at": "2026-11-10T21:58:59+09:00",
         "duration_seconds": "182", "credits": "", "notes": "auto-ended | by transition",
         "host": ""},
        {"phase": "construction", "stage": "code-generation",
         "started_at": "2026-11-10T21:58:59+09:00", "ended_at": "2026-11-10T22:26:34+09:00",
         "duration_seconds": "1655", "credits": "1.25", "notes": "", "host": "hostA"},
    ]

    def test_report_escapes_host(self):
        rows = [dict(self.ROWS[0], host="<b>x</b>")]
        text = self.u.render_report(rows)
        self.assertIn("&lt;b&gt;x&lt;/b&gt;", text)
        self.assertNotIn("<b>", text)

    def test_read_rows_without_csv_is_empty(self):
        self.assertEqual(self.u.read_rows(), [])

    def test_render_report_contents(self):
        text = self.u.render_report(self.ROWS)
        self.assertIn("# AI-DLC Usage Report", text)
        self.assertIn("- Stage runs: 3", text)
        self.assertIn("- Total duration: 3h 34m 33s", text)
        self.assertIn("- Total credits: 3.75 (1 N/A)", text)
        self.assertIn("- Time zone: UTC+09:00", text)
        self.assertIn(
            "| 1 | inception | requirements-analysis | 2026-11-10 15:46:17 | "
            "2026-11-10 18:50:13 | 3h 3m 56s | 2.5 | hostA | approved: requirements-analysis |",
            text)
        # Empty credits show N/A, missing host shows unknown, pipes in notes are escaped.
        self.assertIn("| 3m 2s | N/A | unknown | auto-ended \\| by transition |", text)
        self.assertIn("- Hosts: hostA (2), unknown (1)", text)
        # Totals group repeated stages together.
        self.assertIn("| construction | code-generation | 2 | 30m 37s | 1.25 (1 N/A) |", text)

    def test_render_report_with_no_rows(self):
        text = self.u.render_report([])
        self.assertIn("- Stage runs: 0", text)
        self.assertIn("- Total credits: N/A", text)
        self.assertIn("- Time zone: n/a", text)

    def test_report_command_writes_markdown(self):
        self.write_rows(self.ROWS)
        out = self.run_quiet(self.u.report)
        self.assertIn("Report:", out)
        self.assertIn("- Stage runs: 3", self.u.MD_FILE.read_text(encoding="utf-8"))

    def test_report_command_without_csv(self):
        out = self.run_quiet(self.u.report)
        self.assertIn("ERROR", out)
        self.assertFalse(self.u.MD_FILE.exists())

    def test_write_report_never_raises(self):
        self.write_rows(self.ROWS)
        self.u.MD_FILE.mkdir()  # a directory in place of the file forces a write error
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            self.assertFalse(self.u.write_report())
        self.assertIn("WARNING", out.getvalue())

    def test_end_regenerates_report(self):
        started = datetime.now().astimezone() - timedelta(minutes=5)
        self.u.USAGE_DIR.mkdir(exist_ok=True)
        self.u.STATE_FILE.write_text(json.dumps({
            "phase": "construction", "stage": "build-and-test",
            "started_at": iso(started), "start_epoch": started.timestamp(),
        }), encoding="utf-8")
        self.add_session([(iso(started + timedelta(minutes=1)), 0.5, "credit")])
        self.run_quiet(self.u.end, None, "approved: build-and-test")
        text = self.u.MD_FILE.read_text(encoding="utf-8")
        self.assertIn("build-and-test", text)
        self.assertIn("- Total credits: 0.5", text)

    def test_backfill_regenerates_report_but_dry_run_does_not(self):
        self.add_session([("2026-11-10T07:00:00Z", 2.0, "credit")])
        row = dict(self.ROWS[0], credits="", host=HOST)
        self.write_rows([row])
        self.run_quiet(self.u.backfill, False, True)
        self.assertFalse(self.u.MD_FILE.exists())
        self.run_quiet(self.u.backfill, False, False)
        self.assertIn("- Total credits: 2", self.u.MD_FILE.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
