# Asset Record

Every visual asset in AI CATCH is original work made for this game (NFR6, BR4.2).
No third-party images, sprites, fonts, icons, or audio files are used.
Nothing is modelled on any existing game, character, or handheld device.

## Pixel art (`src/render/sprites.ts`)

All sprites are bitmaps written as text rows (`#` = lit pixel, `.` = off pixel) and drawn with canvas rectangles.

| Asset | Size | Origin | License |
|---|---|---|---|
| HUMAN (player) | 20 x 20 | Original, made for AI CATCH | Project license |
| MAINFRAME (FORTRAN collectible) | 16 x 16 | Original, made for AI CATCH | Project license |
| TAPE (COBOL collectible, magnetic tape reel) | 16 x 14 | Original, made for AI CATCH | Project license |
| FLOPPY (BASIC collectible, floppy disk) | 16 x 16 | Original, made for AI CATCH | Project license |
| LLM_MODEL (LLM collectible, brain-like chip) | 16 x 13 | Original, made for AI CATCH | Project license |
| GPU (LLM stage collectible) | 16 x 9 | Original, made for AI CATCH | Project license |
| ROBOT (LLM stage collectible) | 16 x 13 | Original, made for AI CATCH | Project license |
| VIRUS (enemy) | 16 x 12 | Original, made for AI CATCH | Project license |
| LIFE (HUD heart) | 7 x 6 | Original, made for AI CATCH | Project license |
| AI_FACE_BROKEN / AI_FACE_RESTORED (victory ending) | 24 x 24 | Original, made for AI CATCH | Project license |

## Fonts and glyphs (`src/render/sprites.ts`)

| Asset | Origin | License |
|---|---|---|
| 3 x 5 pixel font (letters, digits, `+ ! - — % . : /`) | Original, drawn for AI CATCH as bitmap rows | Project license |
| Seven-segment digit table (score display) | Original segment table; the seven-segment layout is a generic way to draw digits | Project license |

The page uses only the system monospace font stack (`'Courier New', Courier, monospace`). No font file is bundled or downloaded.

## Page and screen design

| Asset | Origin | License |
|---|---|---|
| Silver-grey console casing, bezel, START button (`index.html`, `src/style.css`) | Original CSS drawing; no image files | Project license |
| LCD screens (title, stage intro, playing, stage clear, game over, victory) | Original layouts drawn on canvas in code | Project license |

## Sounds (`src/audio/sound.ts`)

Every cue is an original square-wave note list written for this game and generated at run time with the Web Audio API. No audio files are bundled or downloaded, and no third-party sounds are used (SD3-5). License: project license.

## External assets

None. If one is added later, record its source and license here before it is used.
