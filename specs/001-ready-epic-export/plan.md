# Implementation Plan: Export JSON for Ready Epics

**Branch**: `[001-ready-epic-export]` | **Date**: 2025-12-02 | **Spec**: [`specs/001-ready-epic-export/spec.md`](specs/001-ready-epic-export/spec.md)
**Input**: Feature specification from `/specs/001-ready-epic-export/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deliver a Ready-only JSON export for individual epics (including every child card) so stakeholders can hand off an immutable payload to downstream tooling, specifically Azure DevOps imports that create Features and Scenarios. The plan enforces the Ready guardrail inside the domain layer, adds an application handler plus `GET /api/epics/{id}/export` endpoint that serializes the epic aggregate to the published `EpicExport` schema, logs every attempt, and exposes an accessible control in the SvelteKit UI (and corresponding API consumption hook) to download or programmatically consume the artifact.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Backend C# 13 on .NET 9.0; Frontend TypeScript 5.6 with Svelte 5 / SvelteKit 2.16.  
**Primary Dependencies**: ASP.NET Core minimal APIs, Entity Framework Core 9, System.Text.Json, SvelteKit + Vite runtime, Tailwind UI stack.  
**Storage**: PostgreSQL 15 via EF Core for epics plus new `ExportAuditEvents` table for export attempts (nightly rollups feed observability stack).  
**Testing**: `dotnet test` for Domain/Application/Infrastructure suites; `pnpm vitest` for feature state; `pnpm test:accessibility` (Playwright + axe) for AA compliance.  
**Target Platform**: Linux containers (backend API) and modern evergreen browsers for the SvelteKit SPA.  
**Project Type**: Full-stack web split across `backEnd` and `frontEnd` workspaces.  
**Performance Goals**: Server export pipeline <3s p95 and UI download <5s p95, even for epics with ~200 linked items.  
**Constraints**: Export only available for Ready epics, JSON artifact <=5 MB, response must honor existing authz/field masking, throttle duplicate requests to avoid race conditions.  
**Scale/Scope**: Single-epic export flows, moderate concurrency (dozens per minute) with dataset covering <500 epics total in initial rollout.

## Clean Architecture Commitments

- **Domain Layer**: Extend `backEnd/src/Domain/Epics` aggregates/value objects with `ExportPolicy` ensuring Ready-only serialization; mirror DTO value objects under `frontEnd/src/domain/epics`. No infrastructure types leak into these models.
- **Application Layer**: Introduce `ExportReadyEpicHandler` within `backEnd/src/Application/Epics` orchestrating repository access, domain validation, serialization, and audit logging. Frontend `frontEnd/src/features/epics/export` store handles UI orchestration without embedding IO logic.
- **Infrastructure & Interfaces**: `backEnd/src/Infrastructure/WebApi/Controllers/EpicsController.cs` exposes `GET /api/epics/{id}/export`; persistence relies on EF repositories while telemetry/logging adapters capture audit events. UI routes under `frontEnd/src/routes/epics/[id]/+page.svelte` plus `frontEnd/src/infrastructure/api/epics.ts` call the backend and manage downloads/toasts.
- **Rules**: Domain remains framework-agnostic; any serialization helpers wrap System.Text.Json via interface boundaries so DTOs stay pure. No exceptions currently anticipated.

## Step Strategy & TDD Gates

| Step | Description | Target Tests | Step Size (`tiny/small/medium/large`) | Approval Needed |
|------|-------------|--------------|--------------------------------------|-----------------|
| S1 | Define failing Application unit tests for `ExportReadyEpicHandler` (Ready-only guard + payload completeness) before coding domain policy. | `backEnd/Tests/Application.UnitTests/Epics/ExportReadyEpicHandlerTests.cs` | small | Reviewer auto |
| S2 | Add failing integration tests for `GET /api/epics/{id}/export` covering 200/409 responses and audit logging. | `backEnd/Tests/Infrastructure.IntegrationTests/WebApi/EpicsExportEndpointTests.cs` | medium | Reviewer approval (due to cross-layer scope) |
| S3 | Create failing Vitest suite for export UI store/component (eligibility states, download success/failure) before implementing UI. | `frontEnd/src/features/epics/export/export-ready-epic.spec.ts` | small | Reviewer auto |
| S4 | Extend Playwright accessibility tests to cover keyboard + aria announcements for the new export control, capture failures first. | `frontEnd/accessibility/comprehensive-accessibility.spec.ts` | tiny | Reviewer auto |
| S5 | Document observability expectations and schema updates; add tests or scripts ensuring audit log entries exist. | `Docs/README` refs + log verification script (manual) | tiny | Reviewer auto |

- Default cadence: propose → wait for approval → implement via Red/Green/Refactor.
- Steps larger than `small` need explicit reviewer sign-off and updated risk notes.
- Evidence for Red (failing test command) must be recorded before implementation begins.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean Architecture & Bounded Contexts** – PASS: Plan isolates domain, application, infrastructure, and UI responsibilities per Docs/ARCHITECTURE.md.
- **Technical Specification First** – PASS: `specs/001-ready-epic-export/spec.md` is complete and referenced above.
- **Strict TDD (Red → Green → Refactor)** – PASS: Step table enumerates failing-test-first workflow for every layer.
- **Step Negotiation & Size Control** – PASS: All steps sized, `S2` flagged for reviewer approval.
- **Traceability & Evidence** – PASS: Plan captures documentation touchpoints (spec, schema, logs) ensuring future tasks link to Markdown artifacts.

**Post-Design Re-Check (2025-12-02)**
- Research (`research.md`), data map (`data-model.md`), contracts (`contracts/*.json|yaml`), and quickstart guide are now in place, still honoring Clean Architecture and TDD mandates. No constitution violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backEnd/
├── EpicMapping.WebApi/
│   ├── Controllers/
│   ├── Configuration/
│   ├── Middleware/
│   └── Program.cs
├── src/
│   ├── Domain/
│   ├── Application/
│   └── Infrastructure/
└── Tests/
    ├── Application.UnitTests/
    └── Infrastructure.IntegrationTests/

frontEnd/
├── src/
│   ├── routes/
│   ├── features/
│   ├── domain/
│   ├── infrastructure/
│   └── ui/
├── accessibility/
└── e2e/
```

**Structure Decision**: Option 2 (web application) applies—separate `backEnd` and `frontEnd` workspaces with aligned Domain/Application/Infrastructure layering and dedicated unit/integration/accessibility test harnesses.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| _None_ | – | – |
