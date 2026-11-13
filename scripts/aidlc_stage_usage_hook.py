#!/usr/bin/env python3
"""PostToolUse hook: Track AI-DLC stage usage when orchestration commands run.

Reads the PostToolUse JSON from stdin, detects AI-DLC stage transitions
(stage start via run-stage directive, stage end via report --result approved/skipped),
and calls aidlc_usage.py start/end accordingly.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
USAGE_SCRIPT = SCRIPT_DIR / "aidlc_usage.py"
USAGE_DIR = SCRIPT_DIR.parent / ".usage"
STATE_FILE = USAGE_DIR / "current-stage.json"


def run_usage(*args):
    """Run aidlc_usage.py with the given arguments, suppressing output."""
    try:
        subprocess.run(
            ["python3", str(USAGE_SCRIPT)] + list(args),
            capture_output=True,
            text=True,
            timeout=10,
        )
    except Exception:
        pass


def end_current_stage(note=""):
    """End the current stage if one is running."""
    if STATE_FILE.exists():
        run_usage("end", "--notes", note)


def extract_directive(output):
    """Try to extract a JSON directive from the command output."""
    # Try parsing the entire output as JSON
    try:
        return json.loads(output)
    except (json.JSONDecodeError, TypeError):
        pass
    # Try finding a JSON line in the output
    for line in output.splitlines():
        line = line.strip()
        if line.startswith("{") and '"kind"' in line:
            try:
                return json.loads(line)
            except json.JSONDecodeError:
                continue
    return None


def main():
    try:
        raw = sys.stdin.read()
        data = json.loads(raw)
    except (json.JSONDecodeError, ValueError):
        return

    # Extract command from the hook payload
    tool_input = data.get("tool_input", {})
    command = tool_input.get("command", "")
    if not command:
        return

    # Only process AI-DLC orchestration commands
    if "aidlc engine orchestrate" not in command:
        return

    # Extract output from the tool response
    tool_response = data.get("tool_response", {})
    output = ""
    if isinstance(tool_response, dict):
        output = tool_response.get("output", "")
    elif isinstance(tool_response, str):
        output = tool_response

    # Detect stage start: next or continue returning run-stage directive
    if "orchestrate next" in command or "orchestrate continue" in command:
        directive = extract_directive(output)
        if directive and directive.get("kind") == "run-stage":
            stage = directive.get("stage", "")
            phase = directive.get("phase", "")
            if stage and phase:
                # End any previous stage first
                end_current_stage("auto-ended by stage transition")
                # Start the new stage
                run_usage("start", phase, stage)

    # Detect stage end: report with --result approved or --result skipped
    if "orchestrate report" in command:
        result_match = re.search(r"--result\s+(\S+)", command)
        if result_match:
            result = result_match.group(1).strip("'\"")
            if result in ("approved", "skipped"):
                stage_match = re.search(
                    r"--stage\s+[\"']?([^\"'\s]+)[\"']?", command
                )
                stage_name = stage_match.group(1) if stage_match else "unknown"
                end_current_stage(f"{result}: {stage_name}")


if __name__ == "__main__":
    main()
