# Smoke Test Results

Run after merge `0dd1196`, with `curl` from the developer machine. Upstream: `construction/build-and-test/test-results.md`.

| Check | Expected | Result |
|---|---|---|
| `https://aicatch.snow-note.com/` status | 200 | 200 |
| `https://ai-catch.pages.dev/` status | 200 | 200 |
| Bundle served on both | `assets/index-D-nhIpvU.js` (local build hash) | Same hash on both |
| New message in the bundle | String `yours to code` present | Present |
| Security headers kept | CSP and `nosniff` | Both present |
| Ending play (NFR2) | Message readable on desktop and iPhone | Checked by the developer on the preview and production |

Verdict: PASS.
