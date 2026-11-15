# Smoke Test Results

Run after merge `6203e85`, with `curl` from the developer machine. Upstream: `construction/build-and-test/test-results.md`.

| Check | Expected | Result |
|---|---|---|
| `https://aicatch.snow-note.com/` status | 200 | 200 |
| `https://ai-catch.pages.dev/` status | 200 | 200 |
| Bundle served on both | `assets/index-CTciFs-7.js` (local build hash) | Same hash on both |
| New CSS live | `safe-area-inset-top` in the served stylesheet | Present |
| Security headers kept | CSP and `nosniff` | Both present, unchanged |
| iPhone Safari play (NFR5) | Portrait, landscape, rotation during play | Checked by the developer on the preview and production |

Verdict: PASS.
