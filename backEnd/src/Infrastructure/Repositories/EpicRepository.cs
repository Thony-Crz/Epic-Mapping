using Application.Epics.Abstractions;
using Domain.Epics.ReadModel;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories;

public sealed class EpicRepository : IEpicRepository
{
    private readonly ILogger<EpicRepository> _logger;
    private readonly IReadOnlyDictionary<Guid, IReadyEpicProjection> _epics;

    public EpicRepository(ILogger<EpicRepository> logger)
    {
        _logger = logger;
        var sample = SampleReadyEpicProjection.Create();
        _epics = new Dictionary<Guid, IReadyEpicProjection>
        {
            [sample.Id] = sample
        };

        _logger.LogInformation(
            "Sample Ready epic {EpicKey} seeded with id {EpicId}",
            sample.Key,
            sample.Id);
    }

    public Task<IReadyEpicProjection?> GetReadyEpicAsync(Guid epicId, CancellationToken cancellationToken)
    {
        _epics.TryGetValue(epicId, out var epic);
        return Task.FromResult(epic);
    }
}

internal static class SampleReadyEpicProjection
{
    private static readonly Guid FixedEpicId = Guid.Parse("d2d4ac8a-8a43-4a4a-8f06-ef6400ed1d5d");

    public static IReadyEpicProjection Create()
    {
        var now = DateTimeOffset.UtcNow;

        return new InMemoryReadyEpicProjection
        {
            Id = FixedEpicId,
            Key = "EPIC-READY-001",
            Title = "Connecteur Azure DevOps",
            Summary = "Epic de démonstration prête à être exportée",
            Status = "Ready",
            Owner = "craft@epicmapping.dev",
            Tribe = "Enablement",
            TargetRelease = "2025-Q1",
            BusinessValue = 89,
            Estimate = 34,
            Confidence = "High",
            Tags = new[] { "export", "demo" },
            Dependencies = new[]
            {
                new DependencyProjection(Guid.NewGuid(), "IDP-42", "Identity Platform", "Epic", "Ready")
            },
            ReadinessChecklist = new[]
            {
                new ChecklistItemProjection("dor", "Definition of Ready", true, null),
                new ChecklistItemProjection("ux", "Design validé", true, "Mockups signés")
            },
            AcceptanceCriteria = new[]
            {
                "Tous les scénarios acceptent un export JSON",
                "Les dépendances critiques sont identifiées"
            },
            LinkedStories = new[]
            {
                new StoryProjection(Guid.NewGuid(), "US-480", "Configurer pipeline export", "Ready", "Story", 1)
            },
            Features = new[]
            {
                new FeatureProjection(
                    Guid.NewGuid(),
                    "FEAT-101",
                    "Exporter un epic prêt",
                    "Ready",
                    1,
                    "Permettre la génération JSON depuis Example Mapping",
                    new [] { "export", "api" },
                    new[]
                    {
                        new ScenarioProjection(
                            Guid.NewGuid(),
                            "Exporter depuis le bouton Ready",
                            "Ready",
                            1,
                            "L'utilisateur clique sur Export Ready depuis Epic Mapping",
                            new [] { "Fichier généré", "Checksum fourni" })
                    })
            },
            ReadyAt = now.AddDays(-3),
            UpdatedAt = now
        };
    }

    private sealed class InMemoryReadyEpicProjection : IReadyEpicProjection
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
}
