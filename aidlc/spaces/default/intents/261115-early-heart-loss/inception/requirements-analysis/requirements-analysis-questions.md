# Requirements Analysis Questions: early-heart-loss

Sources: the initial request (`aidlc engine workspace project-description`); code knowledge base `aidlc/spaces/default/codekb/aiCatch/` and the scan handoff `aidlc/spaces/default/intents/261115-early-heart-loss/inception/reverse-engineering/developer-scan.md`; product definition `.kiro/steering/product.md` (§5: "All stages contain VIRUS enemies", difficulty rises by stage); team practice (`aidlc/spaces/default/memory/team.md`: TDD for game logic, tunables in `src/game/config.ts`).

Facts from the scan (code reading and analytic estimates, nothing measured yet):

- Play starts after a 2.0 s stage intro. The first Stage 1 spawn comes 1.2 s into play.
- Stage 1 VIRUS share is 10% per spawn; a VIRUS falls the screen in 3.0 s and can first touch HUMAN about 2.3 s after it spawns, so the earliest possible hit is about 3.5 s into play.
- About 6 spawns can reach HUMAN in the first 10 s of play; P(at least one VIRUS among them) is about 47%. A stationary player is hit by roughly 16% of VIRUS; P(first hit within 10 s) for a stationary player is about 8%.
- A hit costs one life, removes the VIRUS, and has no invulnerability window. Lives start at 3.
- Difficulty is flat for the first 8 s of a stage (first step at 8 s).
- `product.md` requires each later stage to be harder; tests pin Stage 1 values and the stage ordering.

## Q1. From when are the "5-10 seconds" counted?

A. From the start of play, after the 2.0 s stage intro (the moment objects can start falling)
B. From the START press (includes the 2.0 s intro, so 3-8 s of actual play)
X. Other (please specify)

[Answer]: B

## Q2. How is "a typical first-time playthrough" measured, so the target is testable?

A. A deterministic Vitest simulation: a simple "beginner" input model that walks toward the nearest falling collectible and ignores VIRUS (no avoidance), run over a fixed set of seeds (for example 200). Pass when the median time to the first life lost is between 5 and 10 s, plus a manual playtest check by the developer.
B. A beginner model that tries to catch collectibles AND makes a simple avoidance attempt when a VIRUS is close (more forgiving; needs stronger tuning to reach the target).
C. Manual playtesting only (no simulation test).
X. Other (please specify)

[Answer]: A

## Q3. Which existing levers may be tuned? (The smallest effective change is preferred.)

A. Stage 1 numbers only in `src/game/config.ts`: a higher Stage 1 VIRUS share (around 0.25-0.30), and Stage 2-4 VIRUS shares raised only as far as needed to keep "each later stage is harder" true. No new mechanics.
B. As A, plus the first spawn arrives earlier in play (for example after 0.5 s instead of 1.2 s), so the first VIRUS can reach HUMAN sooner.
C. As B, plus a slightly faster VIRUS fall in Stage 1 (fall speed or VIRUS fall time).
D. A new mechanic: some VIRUS spawns are biased toward HUMAN's current x (aimed hazards).
X. Other (please specify)

[Answer]: X. Other: all levers combined: A, B (earlier first spawn), C (faster Stage 1 VIRUS fall) and D (VIRUS spawns biased toward HUMAN x) ("2,3,4を追加")

## Q4. Should a short invulnerability window follow each lost heart, for fairness?

A. Yes: about 1.0 s of invulnerability after a hit, with HUMAN blinking, so a harder opening cannot take two hearts almost at once. VIRUS touched during the window passes through without damage.
B. No: keep the current behaviour (no invulnerability).
X. Other (please specify)

[Answer]: B

## Q5. Should the number of hearts change?

A. No: keep 3 hearts. Only the moment of the first loss moves earlier.
B. Yes: change the starting hearts (please specify the number).
X. Other (please specify)

[Answer]: A

## Follow-up Q6. How strong and where is the VIRUS aiming (Q3 D), given "smallest effective change" and no scripted damage?

Aiming means: when a VIRUS spawns, its x is drawn near HUMAN's x at that moment (with random spread), instead of anywhere across the width. It does not track HUMAN afterwards, so the player can still step aside.

A. Part of the VIRUS spawns aim (for example 1 in 3), in every stage, with a random spread of about one HUMAN width. Tuned together with the other levers so the median lands in 5-10 s.
B. Same as A, but only in Stage 1 (the first-play window); Stages 2-4 keep random x.
C. Apply levers A-C first; add aiming only if the simulation median is still above 10 s.
X. Other (please specify)

[Answer]: A

## Follow-up Q7. With no invulnerability (Q4 B) and a harder opening, two hearts can be lost close together. Is a bound on that needed?

A. No bound; accept it as part of the challenge.
B. Add a fairness check to the simulation: the median time from the first to the second life lost must stay at or above 3 s (tuning only, no invulnerability).
X. Other (please specify)

[Answer]: A

## Assumptions & Open Questions

None.
