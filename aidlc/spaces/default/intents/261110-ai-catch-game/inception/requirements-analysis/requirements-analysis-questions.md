# Requirements Analysis — Questions

## Sources

- [desc] Initial description: "昔の携帯電子ゲーム（Game & Watchのような電子ゲーム）のシンプルなゲーム体験を、AI時代の世界観で復活させる。モノクロLCD風のドット絵、単純な操作、短時間で楽しめるゲーム性を維持しながら、落下してくるオブジェクトを現代のAI・コンピューター関連のものに置き換える。具体的なイメージはoriginal_spec.mdに記載がある。"
- [scope] Workflow-selected scope: `poc`.
- Upstream artifact: intent-statement.md (Intent Capture & Framing)

## Q1. Starting lives

`original_spec.md` lists "starting lives" as undecided. How many lives does the player start with?

- A. 3 (the classic handheld-game standard)
- B. 5 (a little more forgiving)
- C. 1 (hardcore: one mistake ends the game)
- D. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q2. Game-over condition

`original_spec.md` says "the game is over when lives reach 0", but its undecided items also include "details of a time limit or a lives system". Please settle the game-over condition.

- A. Lives only — the game is over when lives reach 0 (no time limit)
- B. Lives plus a time limit — the game also ends when time runs out, and the remaining time is added to the score
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q3. Local high-score storage

`original_spec.md` lists "high-score saving" as a candidate additional feature, but also says "the initial version will consider local storage as the baseline". Should this poc version include high-score saving (localStorage or similar)?

- A. Include it — save and display the high score locally with localStorage or similar
- B. Exclude it — leave high-score saving as a later additional feature
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q4. Pause

`original_spec.md` does not mention pausing. Should the game have a pause feature?

- A. Yes — pause and resume with the Esc key on PC, and a screen tap or similar on smartphones
- B. No — keep the simplicity of a retro handheld game and leave pausing out
- C. Not yet defined
- X. Other (please specify)

[Answer]: B

## Q5. Sound on/off toggle

`original_spec.md` decides that sound effects are implemented, but says nothing about turning them on or off. Should there be a mute toggle for sound effects?

- A. Yes — place a mute button on screen to turn sound effects on and off
- B. No — sound effects are always on
- C. Not yet defined
- X. Other (please specify)

[Answer]: B

## Consolidated Summary Confirmation

Summary of the answers:

- Starting lives: 3 [Q1]
- Game-over condition: lives only — the game is over when lives reach 0 (no time limit) [Q2]
- High-score storage: save and display the high score locally with localStorage or similar [Q3]
- Pause: none — keep the simplicity of a retro handheld game [Q4]
- Sound mute toggle: none — sound effects are always on [Q5]
- Difficulty is checked against fixed numbers decided now [Q6]
- Starting fall times (full play-area height): LLM MODEL 4.0 s, ROBOT 3.5 s, VIRUS 3.0 s, GPU 2.5 s [Q20]
- Spawning: one object every 1.2 s at the start; every 15 s the interval shortens by 10% and fall speed rises by 10%; both stop changing at 2× the starting difficulty [Q21]
- VIRUS first appears after 10 seconds of play [Q7]
- VIRUS share of new objects: 20% at 10 s, +5 points every 15 s, up to 40% [Q22]
- A missed rescue object simply disappears, with no penalty [Q8]
- No invulnerability after a VIRUS hit; every VIRUS contact costs a life [Q9]
- Only one object is handled per moment; VIRUS takes priority and the other touched objects disappear with no effect [Q10][Q23]
- Restart from game over: any new key press or tap, immediately (a key still held from play does not count) [Q11]
- "NEW HIGH SCORE" is shown on the game-over screen when the high score is beaten [Q12]
- If localStorage is unavailable the game still works, keeping the high score for the current session only; an invalid stored value is treated as 0 [Q13]
- Smartphone controls: touch the left or right half of the screen [Q14]
- Smartphones: both portrait and landscape are supported [Q15]
- The game opens with the power off; a POWER button starts the startup sequence and its sound, and that touch unlocks sound [Q16]
- Performance: 60 fps on a mid-range smartphone from the last 3 years and on a typical laptop; total download under 1 MB [Q17]
- Licence: MIT [Q18]
- Deploying to Cloudflare is not part of this work; the developer deploys later [Q19]

- Looks correct
- Request changes

[Answer]: Looks correct

## Q6. How difficulty is checked

The review found that the difficulty increase (FR3.5) and the per-object speeds (FR3.1–FR3.4) have no pass/fail criterion. How should they be checked?

- A. Relative checks now, exact values tuned during implementation — e.g. "GPU falls faster than LLM MODEL", "falling speed and VIRUS frequency at 60 s are higher than at 0 s"
- B. Fixed numeric targets decided now (speeds in px/s, spawn rates per second)
- C. Leave it entirely to tuning, with no pass/fail criterion
- X. Other (please specify)

[Answer]: B

## Q7. When VIRUS first appears

`original_spec.md` says the early game is mostly LLM MODEL / GPU / ROBOT and that VIRUS "starts to appear" mid-game. When should VIRUS first appear?

- A. After 15 seconds of play
- B. After 30 seconds of play
- C. After the score reaches a threshold (e.g. 1,000 points)
- D. Leave the exact timing to tuning; only require "no VIRUS at the very start"
- X. Other (please specify)

[Answer]: X. After 10 seconds of play

## Q8. Missing a rescue object

What happens when an LLM MODEL, GPU or ROBOT reaches the bottom of the screen without being caught?

- A. Nothing — it simply disappears, with no penalty
- B. The player loses 1 life
- C. Points are deducted
- X. Other (please specify)

[Answer]: A

## Q9. Protection after a VIRUS hit

After touching a VIRUS, should HUMAN be briefly protected from further hits?

- A. Yes — about 1–2 seconds of invulnerability, with HUMAN blinking
- B. No — every VIRUS contact always costs a life
- X. Other (please specify)

[Answer]: B

## Q10. Touching several objects at once

How are several objects touched in the same moment handled?

- A. Each object is handled on its own — every rescue object adds its points, every VIRUS removes a life (subject to Q9)
- B. Only one object is handled per moment
- X. Other (please specify)

[Answer]: B

## Q11. Restarting after game over

How does the player start again from the game-over screen?

- A. Press START (key or tap) after a short delay (about 1 second, so a stray press does not skip the GAME OVER screen)
- B. Press any key or tap anywhere, immediately
- X. Other (please specify)

[Answer]: B

## Q12. A new high score

How should a new high score be shown?

- A. Show "NEW HIGH SCORE" on the game-over screen when the high score is beaten
- B. Just update the high-score display, with no special indication
- X. Other (please specify)

[Answer]: A

## Q13. When the high score cannot be saved

localStorage may be unavailable (private browsing, storage disabled) or hold an invalid value. What should happen?

- A. The game still works; the high score is kept only for the current session, and an invalid stored value is treated as 0
- B. Show a warning message, then behave as in A
- X. Other (please specify)

[Answer]: A

## Q14. Smartphone controls

`original_spec.md` says "touch the left/right side of the screen, or left/right buttons". Which should the smartphone version have?

- A. On-screen left/right buttons only
- B. Touching the left/right half of the screen only
- C. Both
- X. Other (please specify)

[Answer]: B

## Q15. Screen orientation on smartphones

Which orientation should be supported on smartphones?

- A. Portrait only (like a handheld game console held upright)
- B. Landscape only
- C. Both
- X. Other (please specify)

[Answer]: C

## Q16. Power-on and sound on smartphones

Mobile browsers do not play sound until the user has touched the screen, so the startup sound (FR8.1) cannot play before a first touch. How should power-on work?

- A. The game opens with the power off; pressing a POWER button starts the startup sequence and its sound (this touch also unlocks sound)
- B. The startup sequence plays silently when the page opens; sound starts from the START press
- X. Other (please specify)

[Answer]: A

## Q17. Performance targets

The review found that NFR3 (60 fps) and NFR4 (lightweight loading) cannot be measured. Which targets should be used?

- A. 60 fps on a mid-range smartphone from the last 3 years and on a typical laptop; total download under 1 MB
- B. 60 fps on a typical laptop, 30 fps or more on smartphones; total download under 2 MB
- C. No fixed numbers; check by playing it
- X. Other (please specify)

[Answer]: A

## Q18. Open-source licence

The Kiroween rules require an open-source licence file in the repository. Which licence?

- A. MIT
- B. Apache-2.0
- C. Not yet defined
- X. Other (please specify)

[Answer]: A

## Q19. Deploying to Cloudflare

`original_spec.md` names Cloudflare for hosting, and the submission needs a working app URL. Is deploying to Cloudflare part of this piece of work?

- A. Yes — include deploying to Cloudflare (e.g. Cloudflare Pages)
- B. No — this work builds the game only; I will deploy it myself later
- X. Other (please specify)

[Answer]: B

## Q20. Starting fall speeds (follow-up to Q6)

Q6 chose fixed numbers decided now. Speeds are given as the time an object takes to fall the full height of the play area, so they hold at any screen size. Which starting speeds?

- A. LLM MODEL 4.0 s, ROBOT 3.5 s, VIRUS 3.0 s, GPU 2.5 s
- B. LLM MODEL 5.0 s, ROBOT 4.5 s, VIRUS 4.0 s, GPU 3.0 s (gentler start)
- C. LLM MODEL 3.0 s, ROBOT 2.5 s, VIRUS 2.2 s, GPU 1.8 s (faster start)
- X. Other (please specify)

[Answer]: A

## Q21. Spawn rate and how it ramps up (follow-up to Q6)

How often do objects appear, and how does the game get harder over time?

- A. One object every 1.2 s at the start; every 15 s the interval shortens by 10% and fall speed rises by 10%; both stop changing at 2× the starting difficulty
- B. One object every 1.5 s at the start; every 20 s the interval shortens by 10% and fall speed rises by 10%; both stop changing at 2× the starting difficulty
- C. One object every 1.0 s at the start; every 10 s the interval shortens by 10% and fall speed rises by 10%; no upper limit
- X. Other (please specify)

[Answer]: A

## Q22. Share of VIRUS among spawned objects (follow-up to Q6 and Q7)

From 10 s onward (Q7), what share of new objects should be VIRUS?

- A. 20% at 10 s, rising by 5 points every 15 s, up to 40%
- B. 15% at 10 s, rising by 5 points every 20 s, up to 35%
- C. A fixed 25% from 10 s onward
- X. Other (please specify)

[Answer]: A

## Q23. Which object counts when several are touched at once (follow-up to Q10)

Q10 chose to handle only one object per moment. Which one, and what happens to the others?

- A. VIRUS takes priority; the other touched objects disappear with no effect
- B. Rescue objects take priority (the highest-scoring one counts); the others disappear with no effect
- C. The object lowest on the screen counts; the others keep falling and can be handled in a later moment
- X. Other (please specify)

[Answer]: A
