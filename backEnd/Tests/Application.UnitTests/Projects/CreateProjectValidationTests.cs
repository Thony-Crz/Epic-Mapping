using NUnit.Framework;
using Application.Projects;
using Domain.Interfaces;
using Domain.Entities;
using Moq;

namespace Application.UnitTests.Projects;

[TestFixture]
public class CreateProjectValidationTests
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
    public void Handle_ShouldThrowException_WhenNameIsEmpty()
    {
        // Arrange
        var request = new CreateProject
        {
            Name = "", // Nom vide
            Description = "Test description",
            Color = "#FF0000"
        };

        // Act & Assert
        var exception = Assert.ThrowsAsync<ArgumentException>(
            () => _handler.Handle(request, CancellationToken.None)
        );
        
        Assert.That(exception.Message, Does.Contain("Name"));
        Assert.That(exception.Message, Does.Contain("required"));
    }

    [Test]
    public void Handle_ShouldThrowException_WhenNameIsNull()
    {
        // Arrange
        var request = new CreateProject
        {
            Name = null!, // Nom null
            Description = "Test description",
            Color = "#FF0000"
        };

        // Act & Assert
        var exception = Assert.ThrowsAsync<ArgumentException>(
            () => _handler.Handle(request, CancellationToken.None)
        );
        
        Assert.That(exception.Message, Does.Contain("Name"));
        Assert.That(exception.Message, Does.Contain("required"));
    }
}
