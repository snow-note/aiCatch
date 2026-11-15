## Review

**Verdict:** NOT-READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-11-13T11:41:40Z
**Iteration:** 1
**Verdict Dictated:** no

### Findings

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | High | aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/traceability.json > coverage and reverse | Rule BR6.3 (spawn position and fall speed, source FR3 and FR6.1) appears in neither a `coverage` target nor a `reverse` entry. The traceability sensor fails with `{"pass":false,"gaps":[],"orphans":["BR6.3"],...}`. | Map BR6.3 to an acceptance criterion it implements (for example add it to the AC2.1.2 or AC2.1.8 targets), or add a `reverse` entry that explains why it has no criterion. Re-run the sensor until it passes. | New |
| R-02 | High | aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/rules.md > BR1.6 and BR1.2; functional-spec.md > W7 and Input by phase | The return-to-title rules cover `pressStart` and `inputDown` separately. They do not say what happens when both fire for one key press. The current `src/main.ts` keydown handler (lines 76-80) calls `state.inputDown(id, ...)` and then `state.pressStart()` for the same Enter or Space event. On game-over or victory after `canReturnToTitle`, `inputDown` returns to the title (W7). The following `pressStart` then sees phase = title and starts a run at once. The title never appears, which contradicts AC5.1.3 ("then the title shows") and the BR1.6 text "returns to title". The contract only says a START button click is not also sent as a key press (C4). The key path is not covered. | Add a rule and a test that one physical press yields one transition. Options: let a single press change phase at most once per input event, or require the U1 wiring in `main.ts` to send an action key as only one call. Update W7 and the Edge Cases table to match. | New |
| R-03 | Low | aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u1-game-rules/functional-design/rules.md > BR1.4, BR1.5, BR1.6, BR5.1 | The timed transitions are written as `phaseTime >= DURATION` and the steps as `floor(stageTime / 8)`. The existing code compares with a tolerance (`>= DURATION - EPS`, `EPS = 1e-9` in `src/game/state.ts`) because `main.ts` steps at `1/60` and the sums are inexact. Dropping the tolerance can delay a transition by one frame, and exact-boundary tests (for example 120 steps of 1/60 for the 2.0 s intro) can fail. | Keep an explicit comparison tolerance in the timed-transition and difficulty-step rules, or say in the rules that a one-frame delay is accepted and tests must allow it. | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| aidlc engine sensor-traceability --stage functional-design (no --write-upstream) | `{"pass":false,"gaps":[],"orphans":["BR6.3"],"missing_from_table":[],"missing_from_upstream_ids":[],"invalid_entries":[],"invalid_targets":[],"findings_count":1}` | Fails on one orphan rule, BR6.3. All coverage targets and statuses are otherwise valid. |

Checks that held up:
- **Stage table arithmetic:** the Stage 1 example at 17 s is correct (1.1, 1.1 s, 0.125, max 3). BR5.3 holds for stages 1 to 4 on both start and cap values. Stage 3 equals Stage 2 only on max objects (4 and 5), and the other three values are strictly harder.
- **Phase machine, durations and events:** durations match C1 (2.0, 2.5, 3.5, 2.0). The event order matches C2, including `virus-hit`, `life-lost {0}`, `game-over`. The W3 order matches the existing code order. A catch that clears or a last-life VIRUS stops the update before the below-area removal, and the objects are already emptied.
- **Spawn cap:** the skip at max objects is consistent with Q3 and BR6.1.

### Summary

The state machine, event order, durations, difficulty arithmetic and monotonicity are consistent with the contracts and requirements. The design is NOT-READY because the traceability sensor fails on orphan rule BR6.3 and because the return-to-title behaviour is undefined for the Enter and Space double dispatch in `main.ts`. As written, that dispatch skips the title screen.
