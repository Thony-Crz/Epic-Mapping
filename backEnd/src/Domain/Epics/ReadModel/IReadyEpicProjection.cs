using System.Collections.Generic;

namespace Domain.Epics.ReadModel;

public interface IReadyEpicProjection
{
    Guid Id { get; }
    string Key { get; }
    string Title { get; }
    string Summary { get; }
    string Status { get; }
    string Owner { get; }
    string? Tribe { get; }
    string? TargetRelease { get; }
    int BusinessValue { get; }
    int Estimate { get; }
    string Confidence { get; }
    IReadOnlyList<string> Tags { get; }
    IReadOnlyList<DependencyProjection> Dependencies { get; }
    IReadOnlyList<ChecklistItemProjection> ReadinessChecklist { get; }
    IReadOnlyList<string> AcceptanceCriteria { get; }
    IReadOnlyList<StoryProjection> LinkedStories { get; }
    DateTimeOffset ReadyAt { get; }
    DateTimeOffset UpdatedAt { get; }
    IReadOnlyList<FeatureProjection> Features { get; }
}

public sealed record FeatureProjection(
    Guid Id,
    string Key,
    string Title,
    string Status,
    int Order,
    string? Summary,
    IReadOnlyList<string> Tags,
    IReadOnlyList<ScenarioProjection> Scenarios);

public sealed record ScenarioProjection(
    Guid Id,
    string Title,
    string Status,
    int Order,
    string? Description,
    IReadOnlyList<string> AcceptanceCriteria);

public sealed record ChecklistItemProjection(
    string Id,
    string Title,
    bool IsComplete,
    string? Note);

public sealed record DependencyProjection(
    Guid Id,
    string Key,
    string Title,
    string Type,
    string Status);

public sealed record StoryProjection(
    Guid Id,
    string Key,
    string Title,
    string Status,
    string Type,
    int Order);
