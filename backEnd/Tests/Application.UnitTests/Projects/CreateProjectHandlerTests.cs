using NUnit.Framework;
using Application.Projects;
using MediatR;

namespace Application.UnitTests.Projects;

[TestFixture]
public class CreateProjectHandlerTests
{
    [Test]
    public async Task Handle_ShouldCreateProject_WithValidData()
    {
        // Arrange
        var handler = new CreateProjectHandler();
        var request = new CreateProject
        {
            Name = "Application Web E-Commerce",
            Description = "Plateforme de vente en ligne avec gestion des utilisateurs et commandes",
            Color = "#3B82F6"
        };

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Project, Is.Not.Null);
        Assert.That(result.Project.Name, Is.EqualTo("Application Web E-Commerce"));
        Assert.That(result.Project.Description, Is.EqualTo("Plateforme de vente en ligne avec gestion des utilisateurs et commandes"));
        Assert.That(result.Project.Color, Is.EqualTo("#3B82F6"));
        Assert.That(result.Project.Id, Is.GreaterThan(0));
    }
}
