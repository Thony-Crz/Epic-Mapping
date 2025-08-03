using Domain.Entities;
using FluentAssertions;

namespace Domain.UnitTests.Entities;

[TestFixture]
public class ProjectTests
{
    [Test]
    public void Project_ShouldBeCreated_WithValidData()
    {
        // Arrange
        var name = "Application Web E-Commerce";
        var description = "Plateforme de vente en ligne avec gestion des utilisateurs et commandes";
        var color = "#3B82F6";

        // Act
        var project = new Project
        {
            Name = name,
            Description = description,
            Color = color,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "system"
        };

        // Assert
        project.Name.Should().Be(name);
        project.Description.Should().Be(description);
        project.Color.Should().Be(color);
        project.CreatedBy.Should().Be("system");
    }
}
