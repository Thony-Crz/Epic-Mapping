using System;
using System.Collections.Generic;

namespace Domain.Epics.ValueObjects;

public sealed record EpicExportSnapshot(
    EpicExportSnapshotMeta Meta,
    EpicExportSnapshotEpic Epic,
    IReadOnlyList<EpicExportSnapshotFeature> Features,
    EpicExportSnapshotLinks Links);

public sealed record EpicExportSnapshotMeta(
    string SchemaVersion,
    DateTimeOffset ExportedAt,
    string ExportedBy,
    string DeliveryChannel,
    Guid EpicId,
    string Checksum,
    string? CorrelationId);

public sealed record EpicExportSnapshotEpic(
    Guid Id,
    string Key,
    string Title,
    string Summary,
    string Status,
    string Owner,
    string? Tribe,
    string? TargetRelease,
    int BusinessValue,
    int Estimate,
    string Confidence,
    IReadOnlyList<string> Tags,
    IReadOnlyList<EpicExportSnapshotDependency> Dependencies,
    IReadOnlyList<EpicExportSnapshotChecklistItem> ReadinessChecklist,
    IReadOnlyList<string> AcceptanceCriteria,
    IReadOnlyList<EpicExportSnapshotStoryRef> LinkedStories,
    DateTimeOffset UpdatedAt,
    DateTimeOffset ReadyAt);

public sealed record EpicExportSnapshotDependency(
    Guid Id,
    string Key,
    string Title,
    string Type,
    string Status);

public sealed record EpicExportSnapshotChecklistItem(
    string Id,
    string Title,
    string? Note,
    bool IsComplete);

public sealed record EpicExportSnapshotStoryRef(
    Guid Id,
    string Key,
    string Title,
    string Status,
    string Type,
    int Order);

public sealed record EpicExportSnapshotFeature(
    Guid Id,
    string Key,
    string Title,
    string? Summary,
    string Status,
    int Order,
    IReadOnlyList<string> Tags,
    IReadOnlyList<EpicExportSnapshotScenario> Scenarios);

public sealed record EpicExportSnapshotScenario(
    Guid Id,
    string Title,
    string Status,
    int Order,
    string? Description,
    IReadOnlyList<string> AcceptanceCriteria);

public sealed record EpicExportSnapshotLinks(
    IReadOnlyList<string> Attachments,
    IReadOnlyList<string> RoadmapItems,
    IReadOnlyList<EpicExportSnapshotStoryRef> Children);
