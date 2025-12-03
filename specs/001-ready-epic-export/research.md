# Research Log – Export JSON for Ready Epics

## Task: Research audit logging sink for Ready-epic export attempts
- **Decision**: Persist every export attempt inside PostgreSQL via a dedicated `ExportAuditEvents` table managed by `EpicMappingDbContext`, with a nightly job forwarding summarized metrics to the broader observability stack.
- **Rationale**: PostgreSQL already backs the rest of the Epic data, so adding a normalized table keeps traceability queries ("who exported what?") close to transactional data, benefits from existing migrations, and simplifies joining against epics without duplicating storage. Forwarding aggregates downstream satisfies compliance reporting without coupling export logic to a third-party telemetry SDK.
- **Alternatives considered**: Writing directly to Application Insights or another SaaS log sink (adds cross-cutting dependency inside the handler and complicates local dev parity); appending structured lines to existing file-based logs (cheap but hard to query and keep for compliance retention windows).

## Task: Find best practices for ASP.NET Core minimal APIs + EF Core powering JSON exports
- **Decision**: Implement the export path as a controller action (or minimal API endpoint) that executes an `AsNoTracking` EF Core query, maps the aggregate to a domain snapshot, and returns `Results.File` with a UTF-8 JSON stream plus `Content-Disposition` headers while enforcing Ready status inside the domain.
- **Rationale**: `AsNoTracking` avoids change tracking overhead for read-only snapshots, and streaming the serialized payload prevents buffering large epics in memory. Using typed commands/handlers keeps Clean Architecture separation while leveraging ASP.NET Core's built-in results for proper caching headers and content negotiation.
- **Alternatives considered**: Materializing the JSON from SQL via `FOR JSON`/`jsonb` server-side (harder to reuse domain validation and reduces portability); pre-generating exports with background jobs (adds latency and storage while the use case requires on-demand delivery).

## Task: Find best practices for System.Text.Json schema versioning and serialization
- **Decision**: Define a dedicated `EpicExport` DTO layer annotated with `JsonPropertyName`, enforce camelCase naming at the serializer level, include `schema_version` inside the `meta` block, and lock serializer options (null handling, enum conversion) inside a reusable `IEpicExportSerializer` service.
- **Rationale**: Explicit DTOs decouple the external schema from internal aggregates, `schema_version` enables additive evolution, and centralizing options guarantees parity between API responses and any background generators. Using System.Text.Json maintains consistency with the existing stack and avoids extra dependencies.
- **Alternatives considered**: Switching to Newtonsoft.Json for attribute richness (not needed and would create dual serializers); emitting raw `JObject`s without DTOs (error-prone, no compile-time safety, and fragile when renaming fields).

## Task: Find best practices for SvelteKit + Vite download triggers and accessibility (Tailwind-powered UI)
- **Decision**: Call the export endpoint through the existing `frontEnd/src/infrastructure/api/epics.ts` client, convert the `Response` to a `Blob`, create an object URL, and trigger a hidden `<a download>` click so browsers handle the file save while simultaneously showing toast states. Tailwind utility classes will style the control, but ARIA labels and `aria-live` regions will be managed directly in Svelte to remain accessible.
- **Rationale**: Using the Fetch API keeps SSR-friendly behavior, object URLs avoid storing large strings in memory, and hidden anchor triggers ensure consistent downloads across Chromium/Firefox/Safari. Separating Tailwind styling from semantics allows us to meet WCAG requirements without relying on CSS-only cues.
- **Alternatives considered**: Relying on `window.open` or `location.href` for file downloads (breaks auth headers and makes error handling harder); using a third-party download library (unnecessary dependency) or forcing Tailwind components that don't expose proper aria hooks.
