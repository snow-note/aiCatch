# Logical Components: u4-accessibility

Where the U4 NFR patterns apply. Sources: `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u4-accessibility/nfr-requirements/security-requirements.md`, `tech-stack-decisions.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/construction/u4-accessibility/functional-design/functional-spec.md`; `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/contract-design/contract-summary.md`.

All components run in the player's browser tab inside the single static build.

| Component | File | Role | NFR patterns | Failure domain |
|---|---|---|---|---|
| screenAnnouncement | `src/game/announcer.ts` (new) | Pure text and key builder | Reads `GameView` only, tested first (SD4-3, SD4-5) | Pure |
| Announcement section of Bootstrap | `src/main.ts` | Look up `#announcer`; write on key change | Null-safe lookup, `try/catch`, `textContent` only, write-on-change (SD4-1, SD4-2, SD4-4) | Announcements only |
| Live region | `index.html` (from U2, unchanged) | Hidden polite `role="status"` element | Native ARIA (NFR8.21) | Static markup |

## Isolation and Blast Radius

- A missing region or failed write silences announcements only; drawing, rules, and sound continue.
- The unit reads the view and never changes game state.
- Shared resource: `src/main.ts`; U4 edits only its announcement section (C5).
