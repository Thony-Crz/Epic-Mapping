# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`  
**Created**: [DATE]  
**Status**: Draft  
**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]  
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

*Example of marking unclear requirements:*

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

## Clean Architecture Alignment *(required)*

| Layer | Responsibilities Impacted | Files/Modules | Notes |
|-------|---------------------------|---------------|-------|
| Domain | [Entities, aggregates, value objects updated/created] | `frontEnd/src/domain/...`, `backEnd/src/Domain/...` | [Explain invariants, aggregates, or policies touched] |
| Application | [Use cases/services orchestrated] | `frontEnd/src/features/...`, `backEnd/src/Application/...` | [Reference input/output models, orchestrations] |
| Infrastructure | [Adapters, repositories, gateways, UI glue] | `frontEnd/src/infrastructure/...`, `backEnd/src/Infrastructure/...` | [Explain tech selections, frameworks, I/O formats] |
| Interface/UI | [Routes/components/stores/assets] | `frontEnd/src/routes/...`, `frontEnd/src/lib/stores/...` | [Describe UX impact + accessibility expectations] |

> **Rule**: Each row must describe how the feature respects Clean Architecture boundaries. If a layer is unaffected, explicitly state "No change".

## Technical Specification Details *(required)*

- **Data Contracts**: [DTO schemas, validation rules, serialization expectations]
- **APIs / Endpoints**: [HTTP verbs, URLs, request/response models, error codes]
- **Infrastructure Concerns**: [Event buses, DB migrations, caching, logging]
- **Security & Compliance**: [AuthN/AuthZ strategy, secrets handling, threat mitigations]
- **Performance Budgets**: [Latency, throughput, memory, render budgets]
- **Accessibility**: [WCAG targets, testing scripts to run]

## TDD Strategy & Step Sizing *(required)*

1. **Planned Tests**: enumerate the unit, integration, contract, and accessibility tests that will be authored before implementation. Include precise file paths.
2. **Red → Green → Refactor Evidence**: describe how failure will be demonstrated (command + expected failure signature) before writing production code.
3. **Step Envelope**: list the ordered implementation steps with `step_name`, `step_size (tiny/small/medium/large)`, targeted tests, and acceptance hooks. Each step must remain independently reviewable.
4. **Approval Checkpoint**: specify which decisions require explicit reviewer approval (e.g., `step_size` upgrades, cross-layer impacts).

> **Reminder**: Implementation cannot begin until every planned step has been acknowledged by the reviewer.
