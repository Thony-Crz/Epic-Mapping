using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Application.Common.Interfaces;
using Application.Epics.Abstractions;
using Domain.Epics.ReadModel;

namespace Infrastructure.IntegrationTests.WebApi;

internal sealed class TestEpicRepository : IEpicRepository
{
    private readonly Dictionary<Guid, IReadyEpicProjection> _projections = new();

    public void SetProjection(IReadyEpicProjection projection)
    {
        _projections[projection.Id] = projection;
    }

    public void Clear() => _projections.Clear();

    public Task<IReadyEpicProjection?> GetReadyEpicAsync(Guid epicId, CancellationToken cancellationToken)
    {
        _projections.TryGetValue(epicId, out var projection);
        return Task.FromResult(projection);
    }
}

internal sealed class TestExportAuditRepository : IExportAuditRepository
{
    private readonly List<ExportAuditRecord> _records = new();

    public IReadOnlyList<ExportAuditRecord> Records => _records;

    public ExportAuditRecord? LastRecord => _records.LastOrDefault();

    public Task RecordAsync(ExportAuditRecord record, CancellationToken cancellationToken)
    {
        _records.Add(record);
        return Task.CompletedTask;
    }

    public void Clear() => _records.Clear();
}

internal sealed class FakeReadyEpicProjection : IReadyEpicProjection
{
    public Guid Id { get; init; }
    public string Key { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Summary { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string Owner { get; init; } = string.Empty;
    public string? Tribe { get; init; }
    public string? TargetRelease { get; init; }
    public int BusinessValue { get; init; }
    public int Estimate { get; init; }
    public string Confidence { get; init; } = string.Empty;
    public IReadOnlyList<string> Tags { get; init; } = Array.Empty<string>();
    public IReadOnlyList<DependencyProjection> Dependencies { get; init; } = Array.Empty<DependencyProjection>();
    public IReadOnlyList<ChecklistItemProjection> ReadinessChecklist { get; init; } = Array.Empty<ChecklistItemProjection>();
    public IReadOnlyList<string> AcceptanceCriteria { get; init; } = Array.Empty<string>();
    public IReadOnlyList<StoryProjection> LinkedStories { get; init; } = Array.Empty<StoryProjection>();
    public DateTimeOffset ReadyAt { get; init; }
    public DateTimeOffset UpdatedAt { get; init; }
    public IReadOnlyList<FeatureProjection> Features { get; init; } = Array.Empty<FeatureProjection>();
}

internal static class ReadyEpicProjectionFactory
{
    public static IReadyEpicProjection CreateReady(Guid? epicId = null)
        => Create(epicId ?? Guid.NewGuid(), status: "Ready");

    public static IReadyEpicProjection CreateNotReady(Guid? epicId = null)
        => Create(epicId ?? Guid.NewGuid(), status: "Draft");

    private static IReadyEpicProjection Create(Guid id, string status)
    {
        var now = DateTimeOffset.UtcNow;
        var checklistItems = new List<ChecklistItemProjection>
        {
            new("dor-1", "Definition of Ready", true, null)
        };

        var acceptanceCriteria = new List<string>
        {
            "Given a Ready epic when exporting then payload is immutable"
        };

        var dependencies = new List<DependencyProjection>
        {
            new(Guid.NewGuid(), "DEP-1", "Identity service", "epic", "Ready")
        };

        var linkedStories = new List<StoryProjection>
        {
            new(Guid.NewGuid(), "FEAT-1", "Feature placeholder", "Ready", "feature", 0),
            new(Guid.NewGuid(), "SCN-1", "Scenario placeholder", "Ready", "scenario", 1)
        };

        var scenarios = new List<ScenarioProjection>
        {
            new(Guid.NewGuid(), "Scenario 1", "Ready", 0, "Validate JSON", new List<string> { "Scenario AC" })
        };

        var features = new List<FeatureProjection>
        {
            new(Guid.NewGuid(), "FEAT-1", "Feature 1", "Ready", 0, "Feature summary", new List<string> { "feature-tag" }, scenarios)
        };

        return new FakeReadyEpicProjection
        {
            Id = id,
            Key = "EPIC-READY",
            Title = "Ready epic for export",
            Summary = "Ensures export endpoint works",
            Status = status,
            Owner = "owner@tests",
            Tribe = "Exporters",
            TargetRelease = "2025Q1",
            BusinessValue = 55,
            Estimate = 13,
            Confidence = "High",
            Tags = new List<string> { "export", "ready" },
            Dependencies = dependencies,
            ReadinessChecklist = checklistItems,
            AcceptanceCriteria = acceptanceCriteria,
            LinkedStories = linkedStories,
            ReadyAt = now.AddDays(-2),
            UpdatedAt = now,
            Features = features
        };
    }
}
