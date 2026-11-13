# Discovered Rules

Only hard constraints stated by the human or by the project steering files. Inferred practices are not listed here.

## Mandated

- ALWAYS keep game logic separate from rendering code. (Source: `.kiro/steering/coding-standards.md`)
- ALWAYS keep game rules free of DOM and drawing code. (Source: interview Q9)
- ALWAYS put tunable numbers in `src/game/config.ts`. (Source: interview Q9)
- ALWAYS verify related behavior after making changes. (Source: `.kiro/steering/coding-standards.md`)
- ALWAYS use HTML5 Canvas, JavaScript or TypeScript, and the Web Audio API for the game. (Source: `.kiro/steering/architecture.md`)
- ALWAYS get approval before adding a dependency library. (Source: `.kiro/steering/scope-guardrails.md`, `coding-standards.md`)
- ALWAYS propose and get approval first when a change outside the requirements is needed. (Source: `.kiro/steering/scope-guardrails.md`)
- ALWAYS record the source and license of any external asset. (Source: `.kiro/steering/copyright-policy.md`)

## Forbidden

- NEVER use external AI APIs. (Source: `.kiro/steering/architecture.md`)
- NEVER add a database or backend, or unnecessary external services. (Source: `.kiro/steering/scope-guardrails.md`, `architecture.md`)
- NEVER add rankings, user authentication, or online multiplayer. (Source: `.kiro/steering/scope-guardrails.md`)
- NEVER add features that were not requested. (Source: `.kiro/steering/scope-guardrails.md`)
- NEVER reuse characters, images, audio, or logos from existing games, or recreate Nintendo or Game & Watch designs. (Source: `.kiro/steering/copyright-policy.md`)
- NEVER use materials with unclear rights. (Source: `.kiro/steering/copyright-policy.md`)
