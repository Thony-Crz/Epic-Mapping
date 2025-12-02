# Quickstart – Export JSON for Ready Epics

This guide summarizes how to implement and validate the Ready-epic export feature from the plan/spec.

## Prerequisites
- .NET SDK 9.0 with EF Core tools
- Node.js 20+ with `pnpm` (or npm) and Playwright browsers installed (`npx playwright install`)
- PostgreSQL instance reachable via `appsettings.Development.json`
- Access to Azure DevOps sandbox for validating import scripts (optional but recommended)

## Development Workflow

1. **Sync & Branch**
   ```pwsh
   git checkout 001-ready-epic-export
   git pull origin 001-ready-epic-export
   ```

2. **Backend – Domain & Application**
   - Add export policy + DTOs in `backEnd/src/Domain/Epics`.
   - Implement `ExportReadyEpicHandler` in `backEnd/src/Application/Epics` with Ready guard + serializer.
   - Wire controller action in `backEnd/EpicMapping.WebApi/Controllers/EpicsController.cs` using endpoint contract from `contracts/epic-export-api.yaml`.
   - Create EF migration for `ExportAuditEvents` table (if not already present) and update `EpicMappingDbContext`.

3. **Frontend – UI & Client**
   - Extend `frontEnd/src/infrastructure/api/epics.ts` with `exportReadyEpic(id)` returning a `Blob` + metadata.
   - Render export button/toast states inside `frontEnd/src/routes/epics/[id]/+page.svelte` and store gating logic.
   - Ensure keyboard/ARIA coverage in `frontEnd/src/ui` components; update toasts to announce success/failure.

4. **Documentation**
   - Reference `specs/001-ready-epic-export/data-model.md` and `contracts/` when updating `Docs/BACKEND-USE-CASES.md` or API docs.
   - Add Azure DevOps mapping instructions (FR-009) to developer handbook or runbook.

## Test Matrix

| Layer | Command | What to expect |
|-------|---------|----------------|
| Domain/Application | `dotnet test backEnd/Tests/Application.UnitTests --filter ExportReadyEpic` | New tests fail (RED) until handler implemented, then pass. |
| Web API | `dotnet test backEnd/Tests/Infrastructure.IntegrationTests --filter EpicsExport` | Verifies 200/404/409 responses and audit logging. |
| Frontend Unit | `pnpm vitest run src/features/epics/export/export-ready-epic.spec.ts` | Confirms eligibility gating, toast states, and download trigger. |
| Accessibility | `pnpm test:accessibility` | Ensures export control is keyboard accessible and announces status. |
| Azure DevOps Import (optional) | Run pilot script against sandbox using exported JSON | Confirms Features/Scenarios materialize correctly (SC-005). |

## Validation Checklist
- [ ] `epic-export.schema.json` validated against sample payload via `npx ajv validate -s contracts/epic-export.schema.json -d sample.json`.
- [ ] Audit log entry recorded per export attempt with checksum + correlation ID.
- [ ] Duplicate export within 30s reuses latest artifact or throttles with HTTP 429.
- [ ] UI displays disabled state + tooltip for non-Ready epics.
- [ ] Azure DevOps importer reads Features/Scenarios (type + order) without manual edits.

Follow the Red → Green → Refactor steps from `plan.md` for each implementation slice, capturing failing test output before writing production code.
