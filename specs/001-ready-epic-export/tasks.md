# Tasks: Export JSON for Ready Epics

**Input**: Design documents from `/specs/001-ready-epic-export/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

## Format Reminder
`- [ ] T### [P] [US#] <step_size> Description (include file path)`

- `[P]` mark tasks that are parallel-safe
- `[US#]` only inside user story phases (Setup/Foundational omit)
- `step_size` ∈ {tiny, small, medium, large}; medium/large require reviewer approval noted in description

---

## Phase 1: Setup (Shared Infrastructure)

Purpose: ensure local environments and seed data support Ready-epic export work.

- [ ] T001 small Add export tooling prerequisites (.NET 9 SDK, pnpm, Playwright browsers) to `Docs/DEVELOPMENT-ENVIRONMENT.md` so every dev can run planned tests.
- [ ] T002 [P] small Create sample Ready epic + child Feature/Scenario seed data in `backEnd/init-scripts/01-init.sh` to exercise export manually.
- [ ] T003 [P] small Add `.env.example` entry in `frontEnd/.env.example` for `VITE_API_BASE_URL` pointing to the WebApi host used by export flows.

Checkpoint: local env + sample data ready.

---

## Phase 2: Foundational (Blocking Prerequisites)

Purpose: shared infrastructure that all user stories depend on; must finish before US1+.

- [ ] T004 medium Create EF Core migration `backEnd/src/Infrastructure/Migrations/<timestamp>_AddExportAuditEvents.cs` defining the `ExportAuditEvents` table (id, epic_id, exported_by, exported_at, checksum, payload, delivery_channel, status, failure_reason).
- [ ] T005 [P] small Register `DbSet<ExportAuditEvent>` and fluent configuration inside `backEnd/src/Infrastructure/Data/EpicMappingDbContext.cs` to expose the audit table.
- [ ] T006 small Introduce `IExportAuditRepository` and default implementation in `backEnd/src/Application/Common/Interfaces/IExportAuditRepository.cs` + `backEnd/src/Infrastructure/Repositories/ExportAuditRepository.cs` for persisting audit entries.
- [ ] T007 [P] small Define shared `EpicExportSnapshot` and value objects in `backEnd/src/Domain/Epics/ValueObjects/EpicExportSnapshot.cs` capturing Epic + Feature + Scenario hierarchies.
- [ ] T008 small Wire serializer/audit services into DI via `backEnd/src/Application/DependencyInjection.cs` and `backEnd/EpicMapping.WebApi/Program.cs` so downstream tasks can resolve them.

Checkpoint: storage + domain scaffolding complete; proceed to US1.

---

## Phase 3: User Story 1 – Export a ready epic snapshot (Priority P1)

Goal: deliver Ready-only export handler that serializes an epic (with children) to the contract.
Independent Test: invoke handler via application layer test to verify JSON fields + audit logging without UI/API layers.

### Tests (write first)
- [ ] T009 [P] [US1] small Author failing unit tests in `backEnd/Tests/Application.UnitTests/Epics/ExportReadyEpicHandlerTests.cs` covering Ready guard, child inclusion, and audit logging hooks.

### Implementation
- [ ] T010 [US1] small Implement `ReadyEpicExportPolicy` in `backEnd/src/Domain/Epics/Services/ReadyEpicExportPolicy.cs` enforcing Ready status + completeness checks.
- [ ] T011 [P] [US1] small Add DTOs + mapper in `backEnd/src/Application/Epics/Models/EpicExportDto.cs` and `.../Mappers/EpicExportMapper.cs` to shape domain data for serialization.
- [ ] T012 [P] [US1] small Create `IEpicExportSerializer` + `SystemTextJsonEpicExportSerializer` inside `backEnd/src/Application/Epics/Serialization/` honoring `epic-export.schema.json` (camelCase, schema_version).
- [ ] T013 [US1] medium Implement `ExportReadyEpicHandler` in `backEnd/src/Application/Epics/ExportReadyEpicHandler.cs` orchestrating repository fetch, policy validation, serialization, and audit repository writes. (Requires reviewer approval for medium size.)
- [ ] T014 [US1] small Register handler + serializer in `backEnd/src/Application/DependencyInjection.cs` and expose through MediatR pipeline if applicable.

Checkpoint: handler-level export works with unit tests.

---

## Phase 4: User Story 2 – Enforce Ready-only exports (Priority P2)

Goal: expose HTTP endpoint that only serves Ready epics, returns 409 otherwise, and records audit events.
Independent Test: run Web API integration tests hitting `/api/epics/{id}/export` for 200/404/409 cases.

### Tests (write first)
- [ ] T015 [P] [US2] small Add failing integration tests in `backEnd/Tests/Infrastructure.IntegrationTests/WebApi/EpicsExportEndpointTests.cs` covering Ready success, non-ready 409, not-found 404, and throttle 429.

### Implementation
- [ ] T016 [US2] medium Add `GET /api/epics/{id}/export` action to `backEnd/EpicMapping.WebApi/Controllers/EpicsController.cs` wiring to the new handler, setting `Content-Disposition`, and streaming JSON. (Requires reviewer approval.)
- [ ] T017 [P] [US2] small Register endpoint + auth policies + rate limiting middleware in `backEnd/EpicMapping.WebApi/Program.cs` and `backEnd/EpicMapping.WebApi/Middleware/SecurityExtensions.cs`.
- [ ] T018 [US2] small Emit structured audit logs in `backEnd/src/Infrastructure/Logging/ExportAuditLogger.cs` (or similar) to mirror database entries for observability.
- [ ] T019 [US2] small Document and exercise the endpoint via `backEnd/EpicMapping.WebApi/WebApi.http` sample request referencing a Ready epic.

Checkpoint: API returns exports only when Ready, with full logging.

---

## Phase 5: User Story 3 – Generate Azure-ready payload (Priority P3)

Goal: allow UI users + automation to download the export and use it for Azure DevOps Feature/Scenario creation, with accessibility guarantees and mapping docs.
Independent Test: run Vitest + Playwright suites plus an Azure import dry-run using exported JSON from the new UI button.

### Tests (write first)
- [ ] T020 [P] [US3] small Create failing Vitest specs in `frontEnd/src/features/epics/export/export-ready-epic.spec.ts` covering button states, blob download, and error toasts.
- [ ] T021 [P] [US3] tiny Extend `frontEnd/accessibility/comprehensive-accessibility.spec.ts` to verify keyboard focus, aria-label, and live-region announcements for the export control.

### Implementation
- [ ] T022 [US3] small Extend API client in `frontEnd/src/infrastructure/api/epics.ts` with `exportReadyEpic(id: string)` returning a `Blob` + filename metadata.
- [ ] T023 [P] [US3] small Create store/hook in `frontEnd/src/features/epics/export/exportReadyEpicStore.ts` to manage loading, eligibility, and toast dispatch.
- [ ] T024 [US3] small Update epic detail page `frontEnd/src/routes/epics/[id]/+page.svelte` to render the export button, gating on status === Ready, and triggering download via hidden anchor.
- [ ] T025 [US3] small Add success/error toast components in `frontEnd/src/ui/toasts/export-ready-epic-toast.svelte` (or existing toast registry) with localization strings.
- [ ] T026 [US3] small Document Azure DevOps field mapping + import script reference in `Docs/BACKEND-USE-CASES.md` and `specs/001-ready-epic-export/quickstart.md` per FR-009.

Checkpoint: UI + documentation enable Azure import flows end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

Purpose: final hardening, docs, and validation across stories.

- [ ] T027 small Capture sample export payload (sanitized) in `Docs/ARCHITECTURE.md` appendix for consumers.
- [ ] T028 [P] small Add CI lint/test entries (dotnet, vitest, accessibility) to `scripts/start-dev.sh` or pipeline config to ensure export suites run automatically.
- [ ] T029 small Execute `specs/001-ready-epic-export/quickstart.md` end-to-end, updating the doc with actual commands/output evidence.
- [ ] T030 [P] small Perform security review notes in `Docs/SECURITY.md` covering data exposure, throttling, and audit storage.

---

## Dependencies & Execution Order

1. **Phase 1 → Phase 2**: Setup must finish before foundational DB/services work.
2. **Phase 2 → Phases 3-5**: Export audit tables + serializer scaffolding unblock all stories.
3. **User Stories**: US1 (export handler) should complete before US2 (API) to reuse handler; US3 (UI) depends on US2 being callable.
4. **Polish**: Runs after desired user stories; can overlap partially once US3 code stabilizes.

### Story Completion Graph
- US1 → US2 → US3 (US2 cannot start before US1 handler exists; US3 depends on API).

### Parallel Opportunities
- Setup tasks T002/T003 can run in parallel after T001.
- Foundational tasks T005 and T007 can run once T004 migration structure is defined (different files).
- Within US1, T011 and T012 can proceed in parallel after T010 establishes policy requirements.
- In US3, T022-T025 touch separate front-end layers and can divide across developers once tests (T020/T021) exist.

## Implementation Strategy

- **MVP (US1)**: complete Setup → Foundational → US1 tasks to unlock a handler-level export suitable for CLI consumers.
- **Incremental Delivery**: after MVP, layer US2 to publish the API, then US3 for UI/Azure integration; deploy after each story if desired.
- **Evidence**: every task should log Red/Green/Refactor commands (dotnet/vitest/playwright) plus schema validation steps noted in quickstart.
