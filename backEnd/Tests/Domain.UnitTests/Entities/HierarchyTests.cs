using Domain.Entities;
using FluentAssertions;

namespace Domain.UnitTests.Entities;

[TestFixture]
public class HierarchyTests
{
    [Test]
    public void Epic_ShouldBelongToProject_NotTheOpposite()
    {
        // Arrange - Structure attendue : Project → Epic → Feature → Scenario
        var project = new Project
        {
            Id = 1,
            Name = "Application Web E-Commerce",
            Description = "Plateforme de vente en ligne",
            Color = "#3B82F6",
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "system"
        };

        var epic = new Epic
        {
            Id = 1,
            Title = "Authentification Utilisateur",
            Description = "Gestion de l'authentification",
            ProjectId = project.Id, // Epic appartient à un Project
            Project = project,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "system"
        };

        // Act
        project.Epics.Add(epic);

        // Assert - Project contient des Epics (et non Epic contient des Projects)
        project.Epics.Should().HaveCount(1);
        epic.ProjectId.Should().Be(project.Id);
        epic.Project.Should().Be(project);
    }

    [Test]
    public void CompleteHierarchy_ShouldMatch_ExampleMappingStructure()
    {
        // Arrange - Structure complète : Project → Epic → Feature → Scenario
        var project = new Project
        {
            Id = 1,
            Name = "Application Web E-Commerce",
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "system"
        };

        var epic = new Epic
        {
            Id = 1,
            Title = "Authentification Utilisateur",
            ProjectId = project.Id,
            Status = EpicStatus.Closed, // Enum manquant pour l'instant
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "system"
        };

        var feature = new Feature
        {
            Id = 1,
            Title = "Saisie login", // Doit être Title (pas Name)
            EpicId = epic.Id,
            Status = FeatureStatus.Ready, // Enum manquant pour l'instant
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "system"
        };

        var scenario = new Scenario
        {
            Id = 1,
            Title = "L'utilisateur entre un identifiant valide",
            FeatureId = feature.Id,
            Type = ScenarioType.Green, // Enum manquant pour l'instant
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "system"
        };

        // Act
        project.Epics.Add(epic);
        epic.Features.Add(feature);
        feature.Scenarios.Add(scenario);

        // Assert - Navigation complète possible
        project.Epics.Should().HaveCount(1);
        epic.Features.Should().HaveCount(1);
        feature.Scenarios.Should().HaveCount(1);
        
        // Vérification des relations FK
        epic.ProjectId.Should().Be(project.Id);
        feature.EpicId.Should().Be(epic.Id);
        scenario.FeatureId.Should().Be(feature.Id);
    }
}
