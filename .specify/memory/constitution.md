# Epic Mapping Specify Constitution

## Core Principles

### I. Clean Architecture & Bounded Contexts
All work must reinforce the layered separation already captured in `Docs/ARCHITECTURE.md` and the `frontEnd/src` + `backEnd/src` structure: Domain rules live in Domain, Application orchestrates use-cases, Infrastructure handles adapters. No feature work may merge layers or leak framework concerns into the Domain.

### II. Technical Specification First
Every increment starts with a written spec derived from `.specify/templates/spec-template.md`. Specs capture user journeys, measurable outcomes, data contracts, and the intended Clean Architecture touchpoints before any task enters implementation.

### III. Strict TDD (Red → Green → Refactor)
Tests precede production code. For each approved step we require: draft/approve test, ensure it fails (RED), implement the smallest code to pass (GREEN), then refactor under green tests. Skipping or reordering these sub-steps is prohibited.

### IV. Step Negotiation & Size Control
The AI must announce the exact step it plans to implement, including the expected test delta, and wait for human validation. Steps must declare a `step_size` parameter: `tiny`, `small`, `medium`, `large`. Default is `small`; anything larger requires explicit approval with rationale.

### V. Traceability & Evidence
Every decision, test artifact, and architectural change needs a Markdown trace (README updates, ADRs, specs). CI logs and test outputs must be linkable from the spec or task notes so any reviewer can replay the reasoning.

## Specify Implementation Directives

1. **Step Proposal Block** (mandatory before coding):
	- `step_name`: short, imperative label.
	- `goal`: concise outcome.
	- `touched_layers`: Domain | Application | Infrastructure | UI.
	- `tests`: list of new/updated tests and target files.
	- `step_size`: `tiny/small/medium/large` with justification if not tiny/small.
	- `acceptance_hook`: command(s) or manual checks to prove success.

2. **User Validation Gate**: implementation starts only after the user (or reviewer) acknowledges the step proposal. If requirements change mid-step, abort and renegotiate.

3. **Technical Specs Enforcement**:
	- Every feature spec must cite the impacted domain entities/use-cases (see `frontEnd/src/features`, `backEnd/src/Application`).
	- Data contracts and DTOs must be mirrored in both `Docs/BACKEND-USE-CASES.md` and `frontEnd/src/domain` notes when relevant.
	- Non-functional requirements (performance, security, accessibility) live in the spec under “Requirements → Constraints”.

4. **Automated Evidence**:
	- Front-end: `pnpm test`, `pnpm vitest`, `pnpm lint`, `pnpm check`.
	- Back-end: `dotnet test`, `dotnet format`, `dotnet ef migrations add --dry-run` when schema changes.
	- Accessibility: `frontEnd/run-accessibility-tests.ps1` for UI-affecting steps.
	- Observability: mention logging/metrics updates for API changes.

5. **TDD Rituals**:
	- Write/commit failing test with reference to spec + step id.
	- Smallest code to pass only the targeted test.
	- Refactor with guardrails: no functional deltas, keep tests green, update documentation.

## Development Workflow & Quality Gates

1. **Discovery**: confirm user problem, align on spec template, capture constraints.
2. **Specification**: fill spec template, mark priorities, link to Clean Architecture layers.
3. **Planning**: break spec into ordered steps, size them, ensure each fits inside TDD loops.
4. **Implementation**: follow Red/Green/Refactor for each validated step, documenting outcomes.
5. **Review**: reviewer checks spec compliance, test evidence, and doc updates before merge.
6. **Release**: update release notes, ensure `.specify` artifacts reference commit/tag.

Quality gates are blocking: no merge if any checklist fails (missing spec, missing failing test proof, unapproved step size, or missing README/Docs references).

## Governance

- This constitution overrides ad-hoc habits. Changes require an ADR that explains the motivation, risks, and migration plan.
- Pull Requests must link the active spec, list executed steps with their sizes, and attach test command outputs.
- Automated bots must abide by the same step proposal/validation ritual.
- Use `.specify/templates/plan-template.md` for roadmap-level planning and `.specify/templates/tasks-template.md` for daily execution logs.

**Version**: 1.0.0 | **Ratified**: 2025-12-02 | **Last Amended**: 2025-12-02
