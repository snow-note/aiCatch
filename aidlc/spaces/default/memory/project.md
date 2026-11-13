# Project-Level Rules

> Project-specific specialisation and corrections. Loaded after `org.md` and
> `team.md` as strict-additive guidance; contradictions with broader policy
> are rejected. Populated by practices-discovery and the self-learning loop.
>
> Use sparingly: most teams don't need a project layer. Reach for it
> only when this specific project needs stable, durable guidance beyond the
> team practice (for example, package-specific release checks or an additional
> regression suite for a legacy component).

## Way of Working

<!-- Project-specific specialisation. Example: -->
<!-- This monorepo requires package-scoped branch names and a package owner -->
<!-- review in addition to the team's normal merge policy. -->

## Walking Skeleton

<!-- Project-specific specialisation. Example: -->
<!-- The walking skeleton must exercise the legacy service adapter as well -->
<!-- as the new service boundary. -->

## Testing Posture

<!-- Project-specific specialisation. -->

## Guard Policy

<!-- Project-specific. Mode: strict, relaxed, or off. Strict here holds for every intent, whatever one person asks in chat; relaxed or off here applies to every intent whose policy came from its scope, unless the person sets another; changing this line changes it. A section under the retired Change Control heading, written by an earlier release, is still read. -->

## Deployment

<!-- Project-specific specialisation. -->

## Code Style

<!-- Project-specific specialisation. -->

## Tech Stack

<!-- Technology choices locked for this project. -->

## Decided

<!-- Decisions made in earlier stages that should not be re-asked. -->
<!-- Format: DECIDED: [decision] (Stage [slug], [date]) -->

## Scope Overrides

<!-- Custom scope rules for this project. -->

## Forbidden

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: NEVER [behavior] (affirmed [date]) -->
<!-- Example: NEVER throw exceptions across service layer boundaries (affirmed 2026-05-17) -->

- NEVER use external AI APIs. (Source: `.kiro/steering/architecture.md`) (affirmed 2026-11-13)

- NEVER add a database or backend, or unnecessary external services. (Source: `.kiro/steering/scope-guardrails.md`, `architecture.md`) (affirmed 2026-11-13)

- NEVER add rankings, user authentication, or online multiplayer. (Source: `.kiro/steering/scope-guardrails.md`) (affirmed 2026-11-13)

- NEVER add features that were not requested. (Source: `.kiro/steering/scope-guardrails.md`) (affirmed 2026-11-13)

- NEVER reuse characters, images, audio, or logos from existing games, or recreate Nintendo or Game & Watch designs. (Source: `.kiro/steering/copyright-policy.md`) (affirmed 2026-11-13)

- NEVER use materials with unclear rights. (Source: `.kiro/steering/copyright-policy.md`) (affirmed 2026-11-13)

## Mandated

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: ALWAYS [behavior] (affirmed [date]) -->
<!-- Example: ALWAYS use Result<T,E> for fallible operations in service layer (affirmed 2026-05-17) -->

- ALWAYS keep game logic separate from rendering code. (Source: `.kiro/steering/coding-standards.md`) (affirmed 2026-11-13)

- ALWAYS keep game rules free of DOM and drawing code. (Source: interview Q9) (affirmed 2026-11-13)

- ALWAYS put tunable numbers in `src/game/config.ts`. (Source: interview Q9) (affirmed 2026-11-13)

- ALWAYS verify related behavior after making changes. (Source: `.kiro/steering/coding-standards.md`) (affirmed 2026-11-13)

- ALWAYS use HTML5 Canvas, JavaScript or TypeScript, and the Web Audio API for the game. (Source: `.kiro/steering/architecture.md`) (affirmed 2026-11-13)

- ALWAYS get approval before adding a dependency library. (Source: `.kiro/steering/scope-guardrails.md`, `coding-standards.md`) (affirmed 2026-11-13)

- ALWAYS propose and get approval first when a change outside the requirements is needed. (Source: `.kiro/steering/scope-guardrails.md`) (affirmed 2026-11-13)

- ALWAYS record the source and license of any external asset. (Source: `.kiro/steering/copyright-policy.md`) (affirmed 2026-11-13)

## Corrections

<!-- Project-specific corrections from human feedback. -->
<!-- Format: NEVER/ALWAYS [behavior] (learned [date]) -->
- Conversation language: Japanese for chat; write every artifact in English. Create a separate Japanese version with a `-ja` file suffix only when the person asks for one. (learned 2026-11-10) <!-- cid:261110-ai-catch-game:requirements-analysis:015ef959f5721878952c71e534535cb9cabdd62509753b57eecfe1d780bcaa9f -->
- ALWAYS treat .kiro/steering/product.md as the authoritative product definition when it differs from original_spec.md (learned 2026-11-13) <!-- cid:261113-ai-catch-mvp:intent-capture:1c80d475c27e99f34b9110b668f12e5d9b209656bec4eec265cb7d8eb7847ab9 -->
