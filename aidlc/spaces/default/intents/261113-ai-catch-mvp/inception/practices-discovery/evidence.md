# Practices Discovery Evidence

Lead: aidlc-pipeline-deploy-agent, working alone (Collaborators: off). No support reviews exist.

## Inspected

- `git log`: one commit, `53a3be8` "chore: initial commit (PoC result)", 2026-11-13. No branches, merges, or PR history to infer from.
- `package.json`: scripts `dev`, `build`, `preview`, `typecheck`, `test`; dev dependencies only (typescript 7.0.2, vite 8.3.7, vitest 5.1.0); no runtime dependencies.
- `tsconfig.json`: strict, ES2022, Bundler resolution, `noUnusedLocals`, `noUnusedParameters`, `isolatedModules`; includes `src`, `tests`.
- `vitest.config.ts`: node environment, `tests/**/*.test.ts`; no coverage config.
- `.gitignore`: ignores `node_modules/`, `dist/`, `coverage/`, `.vscode/`, env files.
- Absent: `.github/`, any CI file, ESLint, Prettier, EditorConfig, Cloudflare config (`wrangler`), README.
- Reverse-engineering artifacts: `code-structure.md`, `code-quality-assessment.md` (read). `technology-stack.md`, `dependencies.md`, `architecture.md`, `business-overview.md` were not read in this pass.
- Steering: `.kiro/steering/coding-standards.md`, `scope-guardrails.md`, `architecture.md`, `copyright-policy.md` (as injected rules; the files themselves were not reopened).
- `aidlc/spaces/default/memory/org.md` and `team.md` (team sections are empty templates).
- `aidlc-state.md`: Brownfield, scope mvp, Standard depth and test strategy, Collaborators off, deployment-phase stages 4.x skipped.

## Not run

Tests, typecheck, and build were not executed in this stage. Pass state is unknown.

## Inferred (not evidenced)

- Trunk-based branching and squash merges: org default, no history to confirm.
- Test-after methodology: org default; no history to show ordering.
- Cloudflare Pages Git-based deploy of `main`: follows from the brief; no config in repo.
- Naming conventions: taken from the code structure report, not from a style rule.
- Self-review as the only review: follows from the solo-developer statement.
- Conventional Commits: one commit only.

## Interview Decisions (human-confirmed; `practices-discovery-questions.md` is authoritative)

- Q1 B: short-lived feature branches merged into `main` through pull requests.
- Q2 A: no separate walking-skeleton slice; the existing game already runs end to end.
- Q3 B: tests first (TDD) for game logic; rendering, sound, and input wiring checked by playing.
- Q4 B: no coverage floor and no coverage tool; the existing suite stays green and new logic gets tests.
- Q5 A: before each release, a short manual checklist on desktop (keyboard) and smartphone (touch, portrait and landscape).
- Q6 A: Cloudflare Pages connected to GitHub; push to `main` deploys to production; PRs and other branches get preview URLs; no staging; rollback by revert or redeploying an earlier build.
- Q7 C: CI not yet defined; to be decided in the CI Pipeline stage.
- Q8 A: no formatter or linter; rely on strict `tsc` and the existing code style.
- Q9 A: camelCase; one module per concern under `src/game`, `src/render`, `src/audio`; game rules free of DOM and drawing code; all tunable numbers in `src/game/config.ts`; requirement ids may appear in comments.
- Q10 B: leave the tracked `__pycache__/*.pyc` files as they are.

## Departure from Org Default

The org default for the mvp scope is an 80% line-coverage floor. The developer affirmed no floor and no coverage tool (Q4 B). This is a conscious departure and the team's affirmed choice. Adding a coverage tool later would also need dependency approval.

## Unresolved

- CI: no policy is defined (Q7 C). Deferred to the CI Pipeline stage. No CI policy is recorded here.

## Open Questions for the Interview (historical, from the lead draft; all resolved above except CI)

### Way of Working
1. Do you work directly on `main`, or on short-lived branches merged into `main`? Squash or plain merge?
2. Should the commit message format be fixed (for example Conventional Commits)?
3. Should AI-DLC commit for you, or will you commit yourself?

### Walking Skeleton
4. Build a thin end-to-end slice first, given the game already runs? If yes, which slice (for example Stage 1 playable to the 25% restoration screen)?
5. Which command or check proves the slice works (build plus manual play, or something else)?

### Testing Posture
6. Methodology: test-after, tests-first (TDD), or mixed? Which ordering sentence should be recorded?
7. Adopt the 80% line-coverage floor? On which files (game logic only, or everything)? This needs a coverage tool, which is a new dependency and needs approval.
8. Are renderer and `main.ts` covered by tests, or by manual play only? Is a manual mobile and desktop checklist required before release?

### Deployment
9. Is a GitHub Actions CI job (`npm ci`, typecheck, test, build) wanted before merge? It adds a config file.
10. Does Cloudflare Pages deploy `main` automatically via Git integration? Is the Pages project already created?
11. Is a preview or staging step wanted, or production only?
12. What is the rollback method (redeploy previous Pages build, or git revert)?
13. Any build-time checks to block deploy (bundle size, asset license record)?

### Code Style
14. Add Prettier or ESLint, or rely on `tsc` strict only? Either is a new dependency and needs approval.
15. Keep FR/NFR requirement ids in code comments for new code?
16. Confirm naming: camelCase functions, PascalCase types, lowercase file names.
17. Should the tracked `.pyc` caches in `scripts/__pycache__` and `tests/scripts/__pycache__` be cleaned up and ignored?
