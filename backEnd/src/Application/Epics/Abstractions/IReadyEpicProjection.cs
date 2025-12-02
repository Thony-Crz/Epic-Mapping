namespace Application.Epics.Abstractions;

public interface IReadyEpicProjection
{
    Guid Id { get; }
    string Key { get; }
    string Title { get; }
    string Summary { get; }
    string Status { get; }
    string Owner { get; }
    DateTimeOffset ReadyAt { get; }
    DateTimeOffset UpdatedAt { get; }
    IReadOnlyList<FeatureProjection> Features { get; }
}

public sealed record FeatureProjection(
    Guid Id,
    string Key,
    string Title,
    string Status,
    IReadOnlyList<ScenarioProjection> Scenarios,
    int Order);

public sealed record ScenarioProjection(
    Guid Id,
    string Title,
    string Status,
    int Order);
