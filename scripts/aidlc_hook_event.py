
#!/usr/bin/env python3

import json
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOG_FILE = ROOT / ".usage" / "hook-events.jsonl"

event_data = sys.stdin.read()

record = {
    "event": sys.argv[1] if len(sys.argv) > 1 else "unknown",
    "timestamp": datetime.now().astimezone().isoformat(),
    "payload": None
}

if event_data:
    try:
        record["payload"] = json.loads(event_data)
    except json.JSONDecodeError:
        record["payload"] = event_data

LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

with LOG_FILE.open("a", encoding="utf-8") as f:
    f.write(json.dumps(record, ensure_ascii=False) + "\n")

print(f"[Usage Tracking] Logged: {record['event']}")
