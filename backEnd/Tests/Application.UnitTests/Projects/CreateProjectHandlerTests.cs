using NUnit.Framework;
using Application.Projects;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;
using Moq;

namespace Application.UnitTests.Projects;

[TestFixture]
public class CreateProjectHandlerTests
{
    private Mock<IProjectRepository> _projectRepositoryMock;
    private CreateProjectHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _projectRepositoryMock = new Mock<IProjectRepository>();
        _handler = new CreateProjectHandler(_projectRepositoryMock.Object);
    }

    [Test]
    public async Task Handle_ShouldCreateProject_WithValidData()
    {
        // Arrange
        var request = new CreateProject
        {
            Name = "Application Web E-Commerce",
            Description = "Plateforme de vente en ligne avec gestion des utilisateurs et commandes",
            Color = "#3B82F6"
        };

        var savedProject = new Project
        {
            Id = 1,
            Name = request.Name,
            Description = request.Description ?? string.Empty,
            Color = request.Color,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "system"
        };

        _projectRepositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Project>()))
            .ReturnsAsync(savedProject);

        // Act
        var result = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Project, Is.Not.Null);
        Assert.That(result.Project.Name, Is.EqualTo("Application Web E-Commerce"));
        Assert.That(result.Project.Description, Is.EqualTo("Plateforme de vente en ligne avec gestion des utilisateurs et commandes"));
        Assert.That(result.Project.Color, Is.EqualTo("#3B82F6"));
        Assert.That(result.Project.Id, Is.EqualTo(1));

        _projectRepositoryMock.Verify(r => r.CreateAsync(It.IsAny<Project>()), Times.Once);
    }
}
