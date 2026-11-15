# Accessibility Checklist: AI CATCH (four-stage MVP)

Level: no formal WCAG conformance target; practical basics only (refined-mockups Q7, earlier rough-mockups Q6, and requirements FR2.5, FR11.2, FR13, NFR9 in `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`). WCAG 2.1 success criteria are cited where a check matches one, for reference only. Full accessibility validation needs manual testing with assistive technologies; this checklist does not replace that. Related inputs: `mockups.md`, `interaction-spec.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/rough-mockups/wireframes.md`, `user-flow.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md` (US6.1), `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md`.

## Per-Screen Notes

| Screen | Heading | Landmark | Keyboard entry point |
|---|---|---|---|
| Page / console | "AI CATCH" casing label is the only `h1` | `main` around the console | Enter / Space anywhere on the page |
| Title | `h2`-level "Title" via the announcement | `main` | Enter / Space / START starts |
| Stage intro | `h2`-level "Stage n — NAME" via the announcement | `main` | No input needed; advances on its own |
| Playing | `h2`-level "Stage n — NAME" via the announcement | `main` | Left / Right arrow keys |
| Stage clear | `h2`-level "NAME recovered" via the announcement | `main` | No input needed; advances on its own |
| Game over | `h2`-level "Game over" via the announcement | `main` | Any new key returns to the title |
| Victory | `h2`-level "AI restored — 100%" via the announcement | `main` | Any new key returns to the title |

## Checklist

| # | Check | How it is verified | Ref |
|---|---|---|---|
| 1 | The whole game, from title to ending and restart, can be played with the keyboard alone | Play check with keyboard only | FR2.5; WCAG 2.1.1 |
| 2 | No keyboard trap: focus can leave the START button and the page normally | Play check with Tab | WCAG 2.1.2 |
| 3 | START has a visible focus indicator | Play check with Tab | WCAG 2.4.7 |
| 4 | The page has exactly one top-level heading, "AI CATCH" | Inspect the DOM | FR13.1 |
| 5 | The page has a `main` landmark around the console | Inspect the DOM | WCAG 1.3.1 |
| 6 | Each collectible and the VIRUS can be told apart by outline in a greyscale screenshot | Visual check | FR11.2; WCAG 1.4.1 |
| 7 | LCD text at scale 1 is legible at about 375 x 520 (portrait) and 667 x 320 (landscape) CSS px | Play check on those viewport sizes | NFR9 |
| 8 | Casing label, hint text, and START label are clearly readable on their backgrounds | Visual check; aim for strong contrast | WCAG 1.4.3 (reference) |
| 9 | A hidden polite live region announces each screen and its key values; the text comes from a unit-tested pure function | Unit test for the text; play check with a screen reader | FR13.2 (Should Have); WCAG 4.1.3 |
| 10 | The live region is not updated on every score change | Unit test / code review | FR13.2 |
| 11 | Blinking prompts blink at about 1 Hz, well under 3 flashes per second | Code review of timing values | WCAG 2.3.1 |
| 12 | The glitch effect is short (about 0.45 s) and does not flash the whole screen more than 3 times per second | Code review of effect timings | WCAG 2.3.1 |
| 13 | Game information is not given by sound alone: every sound has a matching visual effect | Play check with sound off | WCAG 1.3.3 |
| 14 | Touch targets: movement uses whole screen halves; START is at least 24 x 24 logical px | Inspect layout | WCAG 2.5.8 (reference) |
| 15 | The page works in portrait and landscape | Play check rotating a phone | WCAG 1.3.4 |

## Known Limits (accepted)

- Timed play cannot be extended or paused; there is no pause by product decision (FR1.8). WCAG 2.2.1 (Timing Adjustable) is not met, which is inherent to an action game and is accepted.
- The play area itself is a canvas; its moment-to-moment contents are not exposed to screen readers. Only screen-level announcements are provided.
- Exact contrast ratios for the silver-grey casing are confirmed during build when the final colours are chosen.
