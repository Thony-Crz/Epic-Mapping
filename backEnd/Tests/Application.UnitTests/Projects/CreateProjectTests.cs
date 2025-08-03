using NUnit.Framework;
using Application.Projects;
using Domain.Entities;
using MediatR;

namespace Application.UnitTests.Projects;

[TestFixture] 
public class CreateProjectTests
{
    [Test]
    public void CreateProject_ShouldHaveCorrectProperties()
    {
        // Arrange
        var name = "Application Web E-Commerce";
        var description = "Plateforme de vente en ligne avec gestion des utilisateurs et commandes";
        var color = "#3B82F6";

        // Act
        var request = new CreateProject
        {
            Name = name,
            Description = description,
            Color = color
        };

        // Assert
        Assert.That(request, Is.Not.Null);
        Assert.That(request.Name, Is.EqualTo(name));
        Assert.That(request.Description, Is.EqualTo(description));
        Assert.That(request.Color, Is.EqualTo(color));
        Assert.That(request, Is.InstanceOf<IRequest<CreateProjectResult>>());
    }
}
