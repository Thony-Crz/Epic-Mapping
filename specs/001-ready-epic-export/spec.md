# Feature Specification: Export JSON for Ready Epics

**Feature Branch**: `[001-ready-epic-export]`  
**Created**: 2025-12-02  
**Status**: Draft  
**Input**: User description: "je veux pouvoir exporter au format json une epic qui est au statut ready"

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

### User Story 1 - Export a ready epic snapshot (Priority: P1)

A product manager views the backlog, opens a specific epic already marked as Ready, and exports it to JSON to hand off to a partner team.

**Why this priority**: Unlocks the core value of the feature by allowing stakeholders to share an approved epic without waiting for custom reports.

**Independent Test**: Trigger the export from a Ready epic detail view and verify that a JSON file downloads with all mandatory epic fields populated.

**Acceptance Scenarios**:

1. **Given** a Ready epic with complete metadata, **When** the user selects "Export JSON", **Then** a downloadable JSON artifact is produced containing the epic identifier, descriptive fields, scope metrics, links, and audit timestamps.
2. **Given** a Ready epic, **When** the export completes, **Then** the UI confirms success and surfaces the file name that encodes epic key and export timestamp.

---

### User Story 2 - Enforce Ready-only exports (Priority: P2)

A delivery lead attempts to export an epic still in Draft or In Refinement status and is clearly notified that only Ready epics can be exported until their status is updated.

**Why this priority**: Prevents distribution of incomplete scopes and keeps downstream consumers aligned with the Definition of Ready.

**Independent Test**: Try exporting the same epic before and after switching it to Ready to confirm the guardrail works in isolation.

**Acceptance Scenarios**:

1. **Given** an epic whose status is not Ready, **When** a user clicks the export control, **Then** the system blocks the action with an explanatory message referencing the Ready requirement and no file is produced.
2. **Given** an epic that transitions from Draft to Ready, **When** the page refreshes, **Then** the export control becomes available without requiring a full sign-out.

---

### User Story 3 - Generate Azure-ready payload (Priority: P3)

An integration analyst downloads the JSON export of a Ready epic (including all of its child cards) and imports it into Azure DevOps to seed Features and Scenarios without manual re-entry.

**Why this priority**: Validates that the JSON schema is self-contained and portable, which is the broader business driver for the export capability.

**Independent Test**: Validate the JSON file against the documented schema and run the Azure DevOps import script to confirm Features/Scenarios are created with the expected hierarchy.

**Acceptance Scenarios**:

1. **Given** the published JSON schema, **When** the exported file is validated, **Then** it passes schema validation with no missing required attributes including child card definitions.
2. **Given** the exported file, **When** the Azure DevOps bulk-import script runs, **Then** Features and Scenarios are instantiated with the correct hierarchy, titles, IDs, and acceptance criteria copied from the epic and its children.

---

### Edge Cases

- Epic switches out of Ready after the export is requested but before the file is generated; export should either cancel or mark the artifact as stale.
- Epic lacks optional fields (e.g., no linked initiatives); JSON should include null or empty collections without failing the export.
- Export is triggered twice in rapid succession; system should throttle or reuse the latest artifact to avoid race conditions.
- User lacks permission to view sensitive fields; export must honor field-level security and omit unauthorized sections.
- Large epics with numerous linked stories must still export within the performance budget without truncating data.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The system MUST surface an explicit "Export JSON" action wherever a single epic in Ready status can be inspected (detail view or contextual menu).
- **FR-002**: The system MUST restrict the export action to epics whose workflow status equals Ready according to the canonical status field.
- **FR-003**: The exported JSON MUST include all mandatory epic attributes (ID, key, title, summary, status, owner, readiness timestamp, target release, tags, scope metrics, dependencies, acceptance criteria) and optional collections may be empty but present.
- **FR-004**: The export process MUST stamp metadata about who triggered the export and when, so downstream consumers can trace provenance.
- **FR-005**: The system MUST log every export attempt (success or failure) for auditability, including epic ID, user, timestamp, and outcome message.
- **FR-006**: The export delivery MUST be provided as both a downloadable file and a programmatic response body so automation scripts can consume it without UI interaction.
- **FR-007**: If validation fails (e.g., missing Ready fields), the system MUST stop the export, present actionable errors, and avoid producing a partial JSON file.
- **FR-008**: The exported JSON MUST include every child card (Features and their nested Scenarios/stories) associated with the epic, preserving ordering, parent linkage, and metadata needed to map them into Azure DevOps Features and Scenarios.
- **FR-009**: The system MUST provide a mapping guide (within developer documentation) that explains how each JSON field corresponds to Azure DevOps fields so import scripts can remain deterministic.

### Key Entities *(include if feature involves data)*

- **Epic**: Portfolio-level work item containing identifiers, descriptive metadata, readiness flags, scope measures, links to dependent epics/stories, governance fields (owner, tribe, target release), and ordered child card references required to recreate Features/Scenarios in Azure DevOps.
- **Feature (child card)**: First-level decomposition of an epic capturing a user-facing capability. Features own Scenario children and map 1:1 with Azure DevOps Features.
- **Scenario (child card)**: Concrete flow or acceptance path nested under a Feature. Scenarios are used to seed Azure DevOps Scenarios/Test Cases.
- **EpicExportArtifact**: Immutable snapshot capturing the epic payload, triggering user, export timestamp, schema version, and checksum used to verify that consumers received an untampered file.

## Assumptions

- Export is initiated from the existing epic detail UI and via the public API used by integrations; no batch export is required for this iteration.
- All Ready epics already satisfy Definition of Ready fields, so no additional data collection UI is necessary before the export.
- JSON schema versioning will align with current domain model versioning already documented in product onboarding materials.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users export a Ready epic and receive the JSON artifact in under 5 seconds for 95% of attempts measured at the client boundary.
- **SC-002**: 100% of export attempts for non-Ready epics are blocked with clear guidance, evidenced by audit logs with zero unauthorized deliveries.
- **SC-003**: At least 90% of exported files validate successfully against the documented schema on first attempt during beta testing with integration partners.
- **SC-004**: Support tickets requesting manual Ready-epic extracts drop by 75% within one quarter of release, indicating adoption of the self-service export.
- **SC-005**: Pilot Azure DevOps import scripts successfully create at least 95% of intended Features and Scenarios directly from the JSON export without manual remediation.

## Clean Architecture Alignment *(required)*

| Layer | Responsibilities Impacted | Files/Modules | Notes |
|-------|---------------------------|---------------|-------|
| Domain | Epic aggregate gains an export policy ensuring only Ready states are serializable; value objects define schema-compliant structures. | `backEnd/src/Domain/Epics/*`, `frontEnd/src/domain/epics/*` | Guard conditions must fail fast when status != Ready, preserving invariants for downstream layers. |
| Application | New use case orchestrates Epic retrieval, validation, serialization, and audit logging. | `backEnd/src/Application/Epics/ExportReadyEpicHandler.cs`, `frontEnd/src/features/epics/export/*` | Coordinates domain validation with infrastructure gateways while remaining tech-agnostic. |
| Infrastructure | API endpoints, repositories, and file delivery mechanisms surface the export and persist audit trails. | `backEnd/src/Infrastructure/WebApi/Controllers/EpicsController.cs`, `backEnd/src/Infrastructure/Persistence/*`, `frontEnd/src/infrastructure/api/epics.ts` | Handles transport (HTTP, file stream), authorization, and logging integrations without embedding business rules. |
| Interface/UI | Epic detail page, action menus, and notification toasts expose the export control and states. | `frontEnd/src/routes/epics/[id]/+page.svelte`, `frontEnd/src/ui/toasts/*`, `frontEnd/src/lib/stores/epics.ts` | Must reflect eligibility (Ready-only), provide accessible button labels, and announce success/failure for screen readers. |

> **Rule**: Each row must describe how the feature respects Clean Architecture boundaries. If a layer is unaffected, explicitly state "No change".

## Technical Specification Details *(required)*

- **Data Contracts**: Define `EpicExport` schema with sections for `meta` (schema_version, exported_at, exported_by), `epic` (id, key, title, summary, status, owner, business_value, estimate, confidence, readiness_checklist, acceptance_criteria, dependencies), and `links` (children, attachments, roadmap items). All enums must align with current taxonomy documents.
- **APIs / Endpoints**: Provide a `GET /api/epics/{id}/export` endpoint returning `application/json` when the epic is Ready and `409` when it is not; UI leverages the same endpoint for download. Include `Retry-After` header if throttling occurs.
- **Infrastructure Concerns**: Persist export audit entries in existing telemetry store, include correlation IDs, and ensure CDN/file streaming is configured for files up to 5 MB without chunking.
- **Security & Compliance**: Reuse existing epic permissions; export inherits same scope so users cannot leak epics they cannot view. Mask confidential fields if the viewer lacks clearance, and record each export in compliance logs for quarterly reviews.
- **Performance Budgets**: Export pipeline (domain fetch + serialization + delivery) must stay under 3 seconds server-side for 95th percentile epics (<200 linked work items) and under 10 seconds for worst-case 99th percentile loads.
- **Accessibility**: Export control must be keyboard reachable, include `aria-label` indicating Ready requirement, and toast confirmations must be announced via `aria-live`. Automated checks: `frontEnd/accessibility/comprehensive-accessibility.spec.ts` updated to cover the new control.

## TDD Strategy & Step Sizing *(required)*

1. **Planned Tests**
  - `backEnd/Tests/Application.UnitTests/Epics/ExportReadyEpicHandlerTests.cs`: verifies Ready-only guard clauses and payload completeness.
  - `backEnd/Tests/Infrastructure.IntegrationTests/WebApi/EpicsExportEndpointTests.cs`: exercises HTTP endpoint responses (200 vs 409) and audit logging side effects.
  - `frontEnd/src/features/epics/export/export-ready-epic.spec.ts`: UI/unit test confirming button states, success toasts, and file download trigger.
  - `frontEnd/accessibility/comprehensive-accessibility.spec.ts`: ensures the export control meets keyboard and announcement expectations.

2. **Red → Green → Refactor Evidence**
  - Run `dotnet test backEnd/Tests/Application.UnitTests` before implementation to capture failing tests referencing the new handler.
  - Run `dotnet test backEnd/Tests/Infrastructure.IntegrationTests` to show the API export endpoint is missing and fails with 404 assertions.
  - Run `pnpm test frontEnd --filter export-ready-epic` (or targeted vitest command) to demonstrate UI/tests fail because the control is absent.
  - Capture accessibility suite failure by executing `pnpm test:accessibility` which should flag the missing control references.

3. **Step Envelope**
  - `define-domain-export-policy` (small): Add Ready-only export guard and serialization structure in domain layer; target Application unit tests.
  - `implement-backend-endpoint` (medium): Wire application handler to Web API controller with audit logging; target integration tests.
  - `expose-ui-control` (small): Render export button, gating logic, and success/failure toasts; target front-end unit tests.
  - `accessibility-hardening` (tiny): Add aria labels, keyboard focus tests, and update accessibility suite.
  - `observability-and-docs` (tiny): Ensure logging/metrics are emitted and spec/schema docs updated; verify via log inspection scripts.

4. **Approval Checkpoint**
  - Escalate to reviewers if export schema changes remove or rename fields consumed by downstream systems.
  - Seek approval before increasing any step to `large` or adding batch export scope beyond this feature.
  - Confirm compliance sign-off if new audit data requires retention policy updates.

> **Reminder**: Implementation cannot begin until every planned step has been acknowledged by the reviewer.
