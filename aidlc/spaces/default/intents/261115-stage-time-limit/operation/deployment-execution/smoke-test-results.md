# Smoke Test Results

Run after merge `882cfe1`, with `curl` from the developer machine.

| Check | Expected | Result |
|---|---|---|
| `https://aicatch.snow-note.com/` status | 200 | 200 |
| `https://ai-catch.pages.dev/` status | 200 | 200 |
| Bundle served on both | `assets/index-DXqRHI77.js` (local build hash) | Same hash on both |
| Bundle contains the new feature | String `TIME UP` present | Present |
| Security headers kept | CSP and `nosniff` present | `content-security-policy` (default-src 'self', connect-src 'none', ...) and `x-content-type-options: nosniff` present |
| Gameplay in a real browser | Timer, blink, beep, `TIME UP`, difficulty | Played by the developer on the preview before merge and confirmed live on production |

Verdict: PASS.
