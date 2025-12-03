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

- [x] T001 small Add export tooling prerequisites (.NET 9 SDK, pnpm, Playwright browsers) to `Docs/DEVELOPMENT-ENVIRONMENT.md` so every dev can run planned tests.
- [x] T002 [P] small Create sample Ready epic + child Feature/Scenario seed data in `backEnd/init-scripts/01-init.sh` to exercise export manually.
- [x] T003 [P] small Add `.env.example` entry in `frontEnd/.env.example` for `VITE_API_BASE_URL` pointing to the WebApi host used by export flows.

Checkpoint: local env + sample data ready.

---

## Phase 2: User Story 1 – Red (tests first)

Goal: drive the export behavior with failing unit tests before touching domain or persistence code.
Independent Test: invoke handler via application layer test to verify JSON fields + audit logging hooks (using fakes for persistence).

- [x] T009 [P] [US1] small Author failing unit tests in `backEnd/Tests/Application.UnitTests/Epics/ExportReadyEpicHandlerTests.cs` covering Ready guard, child inclusion, serializer contract, and audit repository interactions (stubbed).

Checkpoint: RED state captured for core export flows.

---

## Phase 3: User Story 1 – Green + Refactor (domain + handler)

Goal: satisfy the failing tests by implementing domain policy, DTO mapping, serializer, and handler orchestration while still using in-memory fakes for persistence.

- [x] T010 [US1] small Implement `ReadyEpicExportPolicy` in `backEnd/src/Domain/Epics/Services/ReadyEpicExportPolicy.cs` enforcing Ready status + completeness checks.
- [x] T011 [P] [US1] small Add DTOs + mapper in `backEnd/src/Application/Epics/Models/EpicExportDto.cs` and `.../Mappers/EpicExportMapper.cs` to shape domain data for serialization.
- [x] T012 [P] [US1] small Create `IEpicExportSerializer` + `SystemTextJsonEpicExportSerializer` inside `backEnd/src/Application/Epics/Serialization/` honoring `epic-export.schema.json` (camelCase, schema_version).
- [x] T013 [US1] medium Implement `ExportReadyEpicHandler` in `backEnd/src/Application/Epics/ExportReadyEpicHandler.cs` orchestrating repository fetch, policy validation, serialization, and audit repository writes (still targeting interfaces). (Requires reviewer approval for medium size.)
- [ ] T014 [US1] small Register handler + serializer in `backEnd/src/Application/DependencyInjection.cs` and expose through MediatR pipeline if applicable.

Checkpoint: handler-level export works with unit tests using fake persistence.

---

## Phase 4: Audit persistence & infrastructure (Blocking for US2+)

Purpose: back-fill the storage concerns once US1 logic is validated so the handler can persist audit events for API layers.

- [x] T004 medium Create EF Core migration `backEnd/src/Infrastructure/Migrations/<timestamp>_AddExportAuditEvents.cs` defining the `ExportAuditEvents` table (id, epic_id, exported_by, exported_at, checksum, payload, delivery_channel, status, failure_reason).
- [x] T005 [P] small Register `DbSet<ExportAuditEvent>` and fluent configuration inside `backEnd/src/Infrastructure/Data/EpicMappingDbContext.cs` to expose the audit table.
- [x] T006 small Introduce `IExportAuditRepository` and default implementation in `backEnd/src/Application/Common/Interfaces/IExportAuditRepository.cs` + `backEnd/src/Infrastructure/Repositories/ExportAuditRepository.cs` for persisting audit entries.
- [x] T007 [P] small Define shared `EpicExportSnapshot` and value objects in `backEnd/src/Domain/Epics/ValueObjects/EpicExportSnapshot.cs` capturing Epic + Feature + Scenario hierarchies.
- [x] T008 small Wire serializer/audit services into DI via `backEnd/src/Application/DependencyInjection.cs` and `backEnd/EpicMapping.WebApi/Program.cs` so downstream tasks can resolve them.

Checkpoint: storage + domain scaffolding complete; API layers can depend on concrete persistence.

---

## Phase 5: User Story 2 – Enforce Ready-only exports (Priority P2)

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

## Phase 6: User Story 3 – Generate Azure-ready payload (Priority P3)

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

## Phase 7: Polish & Cross-Cutting Concerns

Purpose: final hardening, docs, and validation across stories.

- [ ] T027 small Capture sample export payload (sanitized) in `Docs/ARCHITECTURE.md` appendix for consumers.
- [ ] T028 [P] small Add CI lint/test entries (dotnet, vitest, accessibility) to `scripts/start-dev.sh` or pipeline config to ensure export suites run automatically.
- [ ] T029 small Execute `specs/001-ready-epic-export/quickstart.md` end-to-end, updating the doc with actual commands/output evidence.
- [ ] T030 [P] small Perform security review notes in `Docs/SECURITY.md` covering data exposure, throttling, and audit storage.

---

## Dependencies & Execution Order

1. **Phase 1 → Phase 2**: Setup (seed data, env files) must be ready before capturing RED tests.
2. **Phase 2 → Phase 3**: TDD flow requires tests (RED) before implementing policy/handler (GREEN).
3. **Phase 3 → Phase 4**: Only once the handler passes tests with fakes do we introduce concrete persistence/audit infrastructure.
4. **Phase 4 → Phase 5**: API work (US2) requires the audit persistence pieces to exist.
5. **Phase 5 → Phase 6**: UI (US3) depends on the API endpoint.
6. **Phase 7**: Polish runs last, optionally overlapping after US3 is stable.

### Story Completion Graph
- US1 → US2 → US3 (US2 cannot start before US1 handler exists; US3 depends on API).

### Parallel Opportunities
- Setup tasks T002/T003 can run in parallel after T001 (already completed).
- Within US1, T011 and T012 can proceed in parallel after T010 defines the policy contract, while T013 waits for both to finish.
- Phase 4 persistence tasks split naturally: T005 and T007 touch separate files once T004 (migration) lands; T006 follows after DbContext wiring.
- In US3, T022-T025 span different front-end layers and can divide across developers once tests (T020/T021) exist.

## Implementation Strategy

- **MVP (US1)**: follow strict RED → GREEN flow (Phase 2 then Phase 3) using fakes; add persistence (Phase 4) only after tests pass to keep concerns isolated.
- **Incremental Delivery**: after MVP, layer US2 (Phase 5) to publish the API, then US3 (Phase 6) for UI/Azure integration; deploy after each story if desired.
- **Evidence**: every task should log Red/Green/Refactor commands (dotnet/vitest/playwright) plus schema validation steps noted in quickstart.
