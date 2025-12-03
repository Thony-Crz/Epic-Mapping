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
    [property: JsonPropertyName("tribe")] string? Tribe,
    [property: JsonPropertyName("target_release")] string? TargetRelease,
    [property: JsonPropertyName("business_value")] int BusinessValue,
    [property: JsonPropertyName("estimate")] int Estimate,
    [property: JsonPropertyName("confidence")] string Confidence,
    [property: JsonPropertyName("tags")] IReadOnlyList<string> Tags,
    [property: JsonPropertyName("dependencies")] IReadOnlyList<EpicExportDependency> Dependencies,
    [property: JsonPropertyName("readiness_checklist")] IReadOnlyList<EpicExportChecklistItem> ReadinessChecklist,
    [property: JsonPropertyName("acceptance_criteria")] IReadOnlyList<string> AcceptanceCriteria,
    [property: JsonPropertyName("linked_stories")] IReadOnlyList<EpicExportStoryRef> LinkedStories,
    [property: JsonPropertyName("updated_at")] DateTimeOffset UpdatedAt,
    [property: JsonPropertyName("ready_at")] DateTimeOffset ReadyAt);

public sealed record EpicExportDependency(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("key")] string Key,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("status")] string Status);

public sealed record EpicExportChecklistItem(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("note")] string? Note,
    [property: JsonPropertyName("is_complete")] bool IsComplete);

public sealed record EpicExportStoryRef(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("key")] string Key,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("order")] int Order);

public sealed record EpicExportFeature(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("key")] string Key,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("summary")] string? Summary,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("order")] int Order,
    [property: JsonPropertyName("tags")] IReadOnlyList<string> Tags,
    [property: JsonPropertyName("scenarios")] IReadOnlyList<EpicExportScenario> Scenarios);

public sealed record EpicExportScenario(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("order")] int Order,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("acceptance_criteria")] IReadOnlyList<string> AcceptanceCriteria);

public sealed record EpicExportLinks(
    [property: JsonPropertyName("attachments")] IReadOnlyList<string> Attachments,
    [property: JsonPropertyName("roadmap_items")] IReadOnlyList<string> RoadmapItems,
    [property: JsonPropertyName("children")] IReadOnlyList<EpicExportStoryRef> Children);
