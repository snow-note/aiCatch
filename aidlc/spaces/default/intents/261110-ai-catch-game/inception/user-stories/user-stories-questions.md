# User Stories — Questions

## Sources

- [desc] Initial description: "昔の携帯電子ゲーム（Game & Watchのような電子ゲーム）のシンプルなゲーム体験を、AI時代の世界観で復活させる。モノクロLCD風のドット絵、単純な操作、短時間で楽しめるゲーム性を維持しながら、落下してくるオブジェクトを現代のAI・コンピューター関連のものに置き換える。具体的なイメージはoriginal_spec.mdに記載がある。"
- [scope] Workflow-selected scope: `poc`.
- Upstream artifact: requirements.md (Requirements Analysis)

## Story Plan

- **Personas**: drawn from the target audiences in the Intent Statement (Intent Capture Q2)
- **Format**: "As a [persona], I want [goal], so that [benefit]", checked against INVEST, with Given/When/Then acceptance criteria
- **IDs**: stories `US{group}.{seq}`, acceptance criteria `AC{group}.{seq}.{n}`
- **Priority**: MoSCoW on every story
- **Traceability**: every FR and NFR in requirements.md is mapped to a story, or marked with a reason

## Q1. Personas

Who should the stories be written for?

- A. Two personas: a hackathon judge (short, focused evaluation on PC) and a casual web player (plays on PC or smartphone in spare moments)
- B. One generic "player" persona for every story
- C. Three personas: a hackathon judge, a casual PC player and a casual smartphone player
- X. Other (please specify)

[Answer]: A

## Q2. How to break down the stories

How should the stories be grouped?

- A. By the player's journey: power-on and title → controls → falling objects and difficulty → catching and scoring → lives and game over → restart and high score → look and sound → devices and screens
- B. By feature area, following the FR groups in requirements.md (FR1 to FR9, then NFRs)
- C. By persona
- X. Other (please specify)

[Answer]: A

## Q3. Story size

How large should each story be?

- A. Small stories, roughly one player-visible behaviour each (about 12–16 stories)
- B. Larger stories, roughly one journey step each (about 6–8 stories)
- X. Other (please specify)

[Answer]: B

## Q4. Priorities

How should priorities be set? Everything below is already in scope for this version; the question is what matters most if time runs short before the Kiroween deadline.

- A. Must Have: the core play loop, controls, objects and difficulty, scoring, lives, game over and restart, the LCD look, sound, and PC plus smartphone play (the success criteria in Intent Capture Q3). Should Have: high-score saving and NEW HIGH SCORE, the extra effects (glitch, life-lost warning, score-gain display), screen rotation during play
- B. Everything in requirements.md is Must Have
- C. Must Have: the core play loop on PC only. Should Have: smartphone play. Could Have: high score, extra effects
- X. Other (please specify)

[Answer]: A

## Q5. Large stories that mix priorities (follow-up to Q3 and Q4)

With one story per journey step (Q2 A, Q3 B), three of the eight stories would mix Must Have and Should Have work from Q4 A:

- "restart and high score": restart is Must Have, high-score saving and NEW HIGH SCORE are Should Have
- "look and sound": the LCD look and sound are Must Have, the glitch, life-lost warning and score-gain effects are Should Have
- "devices and screens": PC and smartphone play are Must Have, rotation during play is Should Have

How should these be handled?

- A. Split each of the three into a Must Have story and a Should Have story (11 stories in total, slightly above the 6–8 range)
- B. Keep 8 stories; give each story its overall priority and mark each acceptance criterion as Must Have or Should Have
- C. Keep 8 stories and mark all of them Must Have, noting which parts could be cut first
- X. Other (please specify)

[Answer]: A

## Consolidated Summary Confirmation

Summary of the answers:

- Personas: two — a hackathon judge (short, focused evaluation on PC) and a casual web player (PC or smartphone, in spare moments) [Q1]
- Stories are grouped by the player's journey: power-on and title → controls → falling objects and difficulty → catching and scoring → lives and game over → restart and high score → look and sound → devices and screens [Q2]
- Larger stories, one per journey step [Q3]
- Must Have: core play loop, controls, objects and difficulty, scoring, lives, game over and restart, the LCD look, sound, PC and smartphone play. Should Have: high-score saving and NEW HIGH SCORE, the extra effects (glitch, life-lost warning, score-gain display), rotation during play [Q4]
- The three journey steps that mix priorities are each split into a Must Have story and a Should Have story, giving 11 stories in total [Q5]

- Looks correct
- Request changes

[Answer]: Looks correct
