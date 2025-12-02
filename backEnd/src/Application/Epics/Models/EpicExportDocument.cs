using System.Text.Json.Serialization;

namespace Application.Epics.Models;

public sealed record EpicExportDocument(
    EpicExportMeta Meta,
    EpicExportEpic Epic,
    IReadOnlyList<EpicExportFeature> Features,
    EpicExportLinks Links);

public sealed record EpicExportMeta(
    [property: JsonPropertyName("schema_version")] string SchemaVersion,
    [property: JsonPropertyName("exported_at")] DateTimeOffset ExportedAt,
    [property: JsonPropertyName("exported_by")] string ExportedBy,
    [property: JsonPropertyName("export_channel")] string ExportChannel,
    [property: JsonPropertyName("epic_id")] Guid EpicId,
    [property: JsonPropertyName("checksum")] string? Checksum,
    [property: JsonPropertyName("correlation_id")] string? CorrelationId);

public sealed record EpicExportEpic(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("key")] string Key,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("summary")] string Summary,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("owner")] string Owner,
    [property: JsonPropertyName("ready_at")] DateTimeOffset ReadyAt,
    [property: JsonPropertyName("updated_at")] DateTimeOffset UpdatedAt,
    [property: JsonPropertyName("acceptance_criteria")] IReadOnlyList<string> AcceptanceCriteria,
    [property: JsonPropertyName("tags")] IReadOnlyList<string> Tags,
    [property: JsonPropertyName("dependencies")] IReadOnlyList<string> Dependencies,
    [property: JsonPropertyName("readiness_checklist")] IReadOnlyList<string> ReadinessChecklist);

public sealed record EpicExportFeature(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("key")] string Key,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("order")] int Order,
    [property: JsonPropertyName("scenarios")] IReadOnlyList<EpicExportScenario> Scenarios);

public sealed record EpicExportScenario(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("order")] int Order);

public sealed record EpicExportLinks(
    [property: JsonPropertyName("attachments")] IReadOnlyList<string> Attachments,
    [property: JsonPropertyName("roadmap_items")] IReadOnlyList<string> RoadmapItems,
    [property: JsonPropertyName("children")] IReadOnlyList<string> Children);
