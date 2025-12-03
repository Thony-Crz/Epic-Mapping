# Data Model – Export JSON for Ready Epics

## Entities

### Epic
| Field | Type | Description | Notes |
|-------|------|-------------|-------|
| `id` | UUID | Primary identifier inside Epic Mapping | Stable across systems |
| `key` | string | Human-friendly short code (e.g., `EPIC-42`) | Included in filenames |
| `title` | string | Epic headline displayed in backlog | Required, <= 140 chars |
| `summary` | string | Rich-text description of the problem/solution | Markdown supported |
| `status` | enum (`Draft`, `Refinement`, `Ready`, `InFlight`, `Done`) | Workflow state | Export allowed only when `Ready` |
| `owner` | string | Person responsible (UPN) | Must resolve to known user |
| `tribe` | string | Org grouping | Optional |
| `targetRelease` | string | Release train or PI identifier | Optional |
| `businessValue` | int | Relative scoring 1–100 | Required for Ready |
| `estimate` | int | High-level size in story points or T-shirt scale | Required for Ready |
| `confidence` | enum (`Low`, `Medium`, `High`) | Delivery confidence flag | Required for Ready |
| `readinessChecklist` | array<ChecklistItem> | Items showing Definition of Ready compliance | All `isComplete` must be true to enter Ready |
| `acceptanceCriteria` | array<string> | User-facing validation bullets | Must contain ≥ 1 entry |
| `dependencies` | array<DependencyRef> | Linked epics or external blockers | Optional |
| `linkedStories` | array<StoryRef> | Child backlog items (cards) exported to seed Azure DevOps Features/Scenarios | Optional but must be included if present |
| `tags` | array<string> | Classification labels | Optional |
| `updatedAt` | datetime | Last modified timestamp | Used to detect stale exports |
| `readyAt` | datetime | Timestamp when status switched to Ready | Mandatory for export |

### Feature
| Field | Type | Description | Notes |
|-------|------|-------------|-------|
| `id` | UUID | Identifier unique within Epic Mapping | references `StoryRef.id` |
| `key` | string | Local shorthand (e.g., `FEAT-12`) | surfaces in JSON |
| `title` | string | Capability statement | Required |
| `summary` | string | Detailed description | Optional |
| `status` | enum (`Ideation`, `Refinement`, `Ready`, `InFlight`, `Done`) | Mirrors Azure status mapping | Export uses latest value |
| `order` | int | Position within the epic | Maintains user ordering |
| `scenarios` | array<Scenario> | Children representing execution flows | May be empty |

### Scenario
| Field | Type | Description | Notes |
|-------|------|-------------|-------|
| `id` | UUID | Identifier unique within Epic Mapping | references `StoryRef.id` |
| `title` | string | Scenario heading or test title | Required |
| `description` | string | Steps/expected results | Optional |
| `status` | enum (`Draft`, `Ready`, `Accepted`) | Used for Azure mapping | Required |
| `order` | int | Position inside the parent Feature | Maintains sequence |
| `acceptanceCriteria` | array<string> | Criteria derived from the scenario | Optional |

### EpicExportArtifact
| Field | Type | Description | Notes |
|-------|------|-------------|-------|
| `id` | UUID | Unique export identifier | generated per export |
| `epicId` | UUID | FK to Epic | |
| `exportedBy` | string | User principal that triggered export | logged |
| `exportedAt` | datetime | UTC time of export | used for filename |
| `schemaVersion` | string | Version of `EpicExport` contract (e.g., `1.0.0`) | enables additive evolution |
| `checksum` | string | SHA-256 hash of payload | assures integrity |
| `payload` | jsonb | Serialized `EpicExport` document | stored for audit replay |
| `deliveryChannel` | enum (`Download`, `API`) | How export was consumed | helps metrics |
| `status` | enum (`Succeeded`, `Blocked`, `Failed`) | Outcome for attempt | ties to logs |
| `failureReason` | string | Error summary (nullable) | populated when status != Succeeded |

### Supporting Value Objects
- **ChecklistItem**: `{ id: string, title: string, isComplete: boolean, note?: string }`
- **DependencyRef**: `{ id: UUID, key: string, title: string, type: 'epic' | 'external', status: string }`
- **StoryRef**: `{ id: UUID, key: string, title: string, status: string, type: 'feature' | 'scenario' | 'story', order: number }` – the `type` flag enables downstream scripts to map cards to Azure Features vs. Scenarios.

## Relationships
- An `Epic` can have zero or more `EpicExportArtifact` records (one per export attempt).
- `EpicExportArtifact.epicId` references `Epic.id` (many-to-one).
- `Epic` aggregates ordered `Feature` records, and each `Feature` aggregates ordered `Scenario` records. These are embedded in the serialized export (via `linkedStories` + hierarchy metadata) to preserve parent-child structure for Azure DevOps imports.
- `Epic` aggregates `ChecklistItem`, `DependencyRef`, and `StoryRef` collections; they are embedded in the serialized export but not persisted as standalone tables in this scope.

## Validation & Business Rules
- `Epic.status` MUST equal `Ready` and `readinessChecklist` MUST contain no incomplete items before export is permitted.
- `EpicExportArtifact.checksum` MUST match the SHA-256 hash of the stored payload; verification occurs immediately after serialization.
- Exports MUST copy the current value of all Epic fields at the moment of execution; subsequent edits require a new export to ensure immutability.
- `exportedBy` MUST correspond to an authenticated user authorized to view the Epic; this value is used for compliance investigations.
- Optional collections (dependencies, linkedStories, tags) MUST be serialized as empty arrays rather than omitted, preserving schema stability.

## State Transitions
- `Epic` transitions: `Draft → Refinement → Ready → InFlight → Done`. This feature only reads epics already in `Ready`; no additional transitions are introduced.
- `EpicExportArtifact.status` transitions: starts at `Blocked` (pre-validation), moves to `Succeeded` once the JSON is delivered, or `Failed` with `failureReason` populated if serialization/auth checks fail.
