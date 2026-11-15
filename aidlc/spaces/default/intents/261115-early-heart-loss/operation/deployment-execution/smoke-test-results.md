# Smoke Test Results: early-heart-loss

## Automated (agent, 2026-11-15, after the merge)

| Check | Command | Result |
|---|---|---|
| Production responds | `curl -sI https://aicatch.snow-note.com/` | HTTP/2 200 |
| Security headers kept | same | `content-security-policy` unchanged (`default-src 'self'; ... connect-src 'none'; ... frame-ancestors 'none'`) |
| Tested build is served | `curl -s https://aicatch.snow-note.com/` | page loads `assets/index-dNGOlSx_.js`, the same file name (content hash) as the local Build and Test build |
| CI on the merge commit | GitHub check runs for `a1bc3d7` | `typecheck, test with coverage, build, size`: success; Cloudflare Pages: success |

## Manual (developer, on the pull request preview)

| Check | Result |
|---|---|
| FR1.4: Stage 1 played at least 3 times as a beginner | The developer reports the result is good and the game "got much better"; the first heart is lost earlier than before. The exact seconds per run were not recorded. |
| Stages 2-4 difficulty risk | The developer reports it does not yet feel too hard. |

The developer's check was done in a real browser on the preview of the same commit that was merged.
