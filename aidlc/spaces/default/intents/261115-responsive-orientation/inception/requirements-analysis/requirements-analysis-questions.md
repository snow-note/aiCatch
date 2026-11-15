# Requirements Analysis Questions

Intent: 261115-responsive-orientation (bugfix). Request: fix layout and scaling issues during orientation changes, keep game coordinates and UI positioning consistent, verify portrait and landscape play, keep gameplay unchanged, add no features.

Facts from the code scan (`inception/reverse-engineering/developer-scan.md`, not reproduced in a browser yet):

- The whole 320 x 240 casing is scaled by a CSS transform computed in `refit` (`src/main.ts:37-49`) from `visualViewport` width and height.
- `refit` runs synchronously on `resize` and `orientationchange`; no delayed re-fit after rotation.
- A zero or invalid viewport size gives scale 0, so the casing can vanish until the next event.
- The `visualViewport` offset is not applied, and safe-area insets are not used although `viewport-fit=cover` is set.
- The touch left/right split uses `window.innerWidth / 2`, a different measure from the layout.
- A held touch keeps its direction after rotation.
- Scale and offsets are not rounded.
- In portrait, the 4:3 casing uses about 42% of a 375 x 667 screen height.

## Question 1
Which problems have you actually seen? (Several letters allowed, for example "A, C".)

A. After rotating, the casing stays at the old size or position, or is off-centre
B. After rotating, the game disappears or goes blank until I touch or rotate again
C. Touch left/right moves HUMAN the wrong way or feels off after rotating
D. Edges are cut off (notch, rounded corners, or browser bars)
E. Nothing specific; fix the risks the scan found
X. Other (please specify)

[Answer]: X. Other: "今再度実機でテストしたら再現しなかったので内容としては5で" (retested on a real device and the problem did not reproduce; treat it as E: fix the risks the scan found)

## Question 2
Which devices and browsers must the fix be checked on?

A. iPhone Safari only
B. Android Chrome only
C. iPhone Safari and Android Chrome, plus desktop window resize
X. Other (please specify)

[Answer]: A

## Question 3
How should portrait mode look?

A. Keep today's layout: the whole casing scaled to fit and centred (fix the bugs only)
B. Use a different portrait layout that makes the game screen larger (a layout change, beyond a bug fix)
X. Other (please specify)

[Answer]: A

## Question 4
How should the casing scale?

A. Keep the largest scale that fits (may be fractional, fills the most space)
B. Snap to whole-number scales when the scale is 2 or more, so pixels are even (casing can be a little smaller)
X. Other (please specify)

[Answer]: A

## Question 5
Where should the touch left/right split be?

A. The centre of the visible screen (same measure the layout uses)
B. The centre of the game screen inside the casing
X. Other (please specify)

[Answer]: A

## Question 6
What should happen to a finger that is held down while the device rotates?

A. Release all held touches when the orientation changes (HUMAN stops until the next touch)
B. Keep the held direction as it is today
X. Other (please specify)

[Answer]: A

## Question 7
Should the casing stay inside the safe area (away from notches and rounded corners)?

A. Yes, fit the casing inside the safe-area insets
B. No, keep using the full screen
X. Other (please specify)

[Answer]: A

## Question 8
How should the fix be checked?

A. Unit tests for the pure layout and touch-split math (Node, no new dependency), plus manual play on the devices from Q2 in portrait and landscape
B. Also add a DOM test environment (new dev dependency such as jsdom, needs your approval)
X. Other (please specify)

[Answer]: A
