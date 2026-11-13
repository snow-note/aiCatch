# Design System Mapping: AI CATCH (four-stage MVP)

There is no external design system or component library; the game's own look is the design system. This file maps every UI element in `mockups.md` to the existing implementation (`src/render/renderer.ts`, `src/render/sprites.ts`, `src/style.css`, `index.html`) and lists what is new. Inputs: `aidlc/spaces/default/intents/261113-ai-catch-mvp/ideation/rough-mockups/wireframes.md`, `user-flow.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/user-stories/stories.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/requirements-analysis/requirements.md`, `aidlc/spaces/default/intents/261113-ai-catch-mvp/inception/practices-discovery/team-practices.md`. All art and sound stay original (`product.md` §12).

## Design Tokens

### LCD (canvas)

| Token | Value | Use | Status |
|---|---|---|---|
| `lcd.bg` | `#b7c3a5` | LCD background | existing |
| `lcd.ink` | `#1f2a1c` | All lit pixels | existing |
| `lcd.ghost` | `rgba(31, 42, 28, 0.10)` | Unlit segments, lost hearts | existing |

### Casing (CSS)

| Token | Value | Use | Status |
|---|---|---|---|
| `page.bg` | `#1d2b3a` | Page background around the console | existing |
| `casing.bg` | silver-grey, starting value `#c4c7cc` | Casing body | **changed** from beige `#c9c3b0` (Q1) |
| `casing.edge` | starting value `#9fa3aa` | Inner edge shadow | **changed** |
| `casing.label` | starting value `#2f3540` | "AI CATCH" label | **changed** from dark red, for contrast on silver |
| `bezel.bg` | `#3e4452` | LCD bezel | existing |
| `hint.text` | starting value `#4a4f58` | "◀ ▶ MOVE" text | **changed** for contrast on silver |
| `start.bg` / `start.shadow` | `#2f5f8c` / `#1d3b57` | START button | existing |
| `start.text` | `#f2eedd` | START label | existing |

Exact silver-grey values are tuned by eye during build; the label and hint must stay clearly readable on the casing (see `accessibility-checklist.md`).

### Type and Numbers

| Token | Value | Status |
|---|---|---|
| `font.pixel` | Original 3 x 5 glyphs, 1 px gap; scales 1, 2, 3 | existing; **add** `%`, `.`, `:`, `—`, `/` if missing (FR11.3) |
| `digits.7seg` | 5 x 9 seven-segment, 6 digits, ghost "8" behind | existing |
| `font.casing` | Monospace, bold, letter-spaced | existing |

### Layout

| Token | Value | Status |
|---|---|---|
| `lcd.size` | 240 x 160 logical px | existing |
| `console.size` | 320 x 240 logical px, 4:3 | existing |
| `hud.height` | 14 px + 1 px rule | existing |
| `sprite.size` | 16 x 16 (objects), 20 x 20 (HUMAN), 24 x 24 (AI face, new) | existing / new |
| `bar.ai` | 160 x 6 px outline with fill | **new** |

## Component Mapping

| UI element | Existing piece | Change |
|---|---|---|
| Console casing | `#console` in `index.html` / `style.css` | Recolour to silver-grey; remove POWER button; keep hint text and START (Q1) |
| Title screen | `drawTitle` | New sprites row and three story lines; keep HI and PRESS START |
| Startup screen | `drawStartup` | **Removed** (no power-on step) |
| Stage intro | — | **New** screen |
| Playing HUD | `drawPlaying` HUD: score + lives | **Extended**: stage name, AI %, progress |
| Falling objects | `OBJECT_SPRITES` | **Add** mainframe, magnetic tape, floppy disk |
| Catch / VIRUS / life effects | popups, sparks, glitch, warning | Keep |
| Stage clear | — | **New** screen with AI bar animation |
| Game over | `drawGameOver` | **Extended**: AI bar, REACHED STAGE line, NEW! marker |
| Victory ending | — | **New** sequence and screen with AI face |
| AI restoration bar | — | **New** shared part (intro, clear, game over, victory) |
| Screen announcement | canvas `aria-label` | **New** hidden live text element |

## Sound Mapping

| Event | Existing sound | Change |
|---|---|---|
| Run start | game-start | Keep |
| Catch LLM / GPU / ROBOT | per-kind catch | Keep |
| Catch mainframe / tape / disk | — | **Add** three short tones |
| VIRUS hit | virus | Keep |
| Stage clear | — | **Add** |
| Victory | — | **Add** |
| Game over | game-over | Keep |
| Power-on startup | startup | **Removed** with the POWER button |

## Consistency Rules

- Everything on the LCD uses only `lcd.bg`, `lcd.ink`, and `lcd.ghost`: two tones plus faint unlit pixels.
- Every object, including new ones, is recognisable by outline alone (FR11.2).
- Text on the LCD uses the pixel font only; numbers that score uses seven-segment digits.
- Blinking prompts use the same 1 Hz rhythm.
