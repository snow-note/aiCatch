# Code Generation Plan Approval

AI-DLC built this plan without asking because plan approval is off for this
piece of work. This file is the record and asks nothing; to look at a plan
before it is built, ask in chat.

## Plan Approval

Built without asking: plan approval is off for this piece of work (from scope express).

- Builds: an earlier, fairer first heart loss through the existing hazard rules: higher Stage 1 VIRUS share, an earlier first spawn per stage, a faster Stage 1 VIRUS fall, and aimed VIRUS spawns (1 i...
- Touches: `src/game/config.ts`, `src/game/spawner.ts`, `src/game/state.ts`; tests `tests/game/spawner.test.ts`, `tests/game/state.test.ts`, `tests/game/config.test.ts`, new `tests/game/first-heart.t...
- Tests: about 10 new or updated Vitest tests, including the 200-seed simulation; the developer plays Stage 1 at least 3 times before release
- Design input: `aidlc/spaces/default/intents/261115-early-heart-loss/inception/requirements-analysis/requirements.md` (FR1-FR6, NFR1-NFR6) and its questions file; code facts in `aidlc/spaces/default...
- Brownfield: files are changed in place. No dependency, no asset. No change to rendering, sound, announcements, `src/main.ts`, `index.html`, or the number of lives. All tunables go in `src/game/conf...

Full plan: aidlc/spaces/default/intents/261115-early-heart-loss/construction/code-generation/code-generation-plan.md
Test instructions: aidlc/spaces/default/intents/261115-early-heart-loss/construction/code-generation/unit-test-instructions.md

[Approval Fingerprint]: sha256:v3:44e60cb1d9f63b5b6d30ddd77fb4079088f4f40786ddaf8650d505043a8d2563
[Planned Source]: 0a8d6f5964312d2210654be63ad27c1784fa7ea92d88dea826c5ba87929328b0


[Answer]: Plan approval off
