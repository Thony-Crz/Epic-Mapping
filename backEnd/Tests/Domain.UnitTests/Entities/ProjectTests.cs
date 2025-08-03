using Domain.Entities;
using Xunit;

namespace Domain.UnitTests.Entities;

public class ProjectTests
{
    [Fact]
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
        Assert.Equal(name, project.Name);
        Assert.Equal(description, project.Description);
        Assert.Equal(color, project.Color);
        Assert.Equal("system", project.CreatedBy);
    }
}
