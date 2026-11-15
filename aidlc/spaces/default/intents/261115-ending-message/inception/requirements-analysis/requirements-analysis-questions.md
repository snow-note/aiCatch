# Requirements Analysis Questions

Intent: 261115-ending-message (express). Request: replace the completion message with the new narrative ("AI RESTORED!" ... "The future is yours to code."), in a readable retro ending screen, with scrolling or progressive text if needed, readable on desktop and mobile in portrait and landscape; keep gameplay and completion logic.

Facts from the code scan (`inception/reverse-engineering/developer-scan.md`):

- Today the victory screen shows a reboot animation (0-2.5 s), then three lines ("AI RESTORED — 100%", "HUMANS SAVED AI.", "SAVE THE AI. SAVE THE FUTURE."), then SCORE, HI-SCORE and a blinking PRESS ANY KEY.
- From 3.5 s any new key or touch returns to the title (pinned by tests).
- The new message is 19 lines (13 text lines, 6 blank). It does not fit on one 240 x 160 screen together with the face, bar and score rows.
- The pixel font is 3 x 5, upper case only (lower case is drawn as capitals). It has no `,` `?` `'` glyphs.
- At scale 1 the longest line (51 characters) fits; at scale 2 a line holds only 29 characters.
- `.kiro/steering/product.md` section 7 currently names the three old ending lines.

## Question 1
How should the message be presented?

A. Pages: a few lines at a time, each page shown for some seconds, then the next page
B. Slow vertical scroll from bottom to top (credits style)
C. Typewriter: lines appear one by one, and the text scrolls up when the screen is full
X. Other (please specify)

[Answer]: C

## Question 2
What should happen if the player presses a key or taps while the message is still showing?

A. Keep today's rule: from 3.5 s a press returns to the title, even mid-message
B. Ignore presses until the whole message has been shown, then allow return to the title (small change to when return is allowed)
C. First press skips to the end of the message; the next press returns to the title
X. Other (please specify)

[Answer]: B

## Question 3
What should happen to the old ending lines and screen parts?

A. Replace the three old lines completely with the new message; keep the reboot animation, then show SCORE / HI-SCORE / PRESS ANY KEY after the message
B. Keep "AI RESTORED — 100%" and the AI bar as a header, show the new message below it, then SCORE / HI-SCORE / PRESS ANY KEY
C. Replace the old lines, and keep "SAVE THE AI. SAVE THE FUTURE." as the last line after the new message
X. Other (please specify)

[Answer]: A

## Question 4
`product.md` (section 7) still lists the old ending lines. How should that be handled?

A. I will update `product.md` myself; build to the new message
B. Update `product.md` section 7 as part of this work
C. Leave `product.md` as it is
X. Other (please specify)

[Answer]: B

## Question 5
Text size: scale 1 keeps the given line breaks but the letters are small on phones (about 3.5 x 6 CSS px in portrait). Scale 2 is twice as large but needs new line breaks (29 characters per line).

A. Scale 1, keep the given line breaks
B. Scale 2, re-wrap long lines (wording unchanged, line breaks changed)
C. Scale 2 for "AI RESTORED!" and the last line, scale 1 for the rest
X. Other (please specify)

[Answer]: A

## Question 6
The pixel font has capitals only. How should lower-case text appear?

A. All capitals (current font), add only the missing `,` `?` `'` glyphs
B. Add a new lower-case pixel font so the text keeps its upper/lower case
X. Other (please specify)

[Answer]: A

## Question 7
What should the screen reader announce at the ending?

A. The full new message, then the score
B. A short version ("AI restored. You brought me back to life. The future is yours to code.") and the score
X. Other (please specify)

[Answer]: B

## Question 8
About how long should the whole message take to show?

A. About 20 seconds
B. About 30 seconds
C. About 40 seconds
X. Other (please specify)

[Answer]: A
