using NUnit.Framework;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Application.Projects;
using Domain.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.UnitTests.DependencyInjection;

// Fake repository pour les tests
public class FakeProjectRepository : IProjectRepository
{
    public Task<Project> CreateAsync(Project project)
    {
        project.Id = 1; // Simuler un ID généré
        return Task.FromResult(project);
    }
    
    public Task<Project?> GetByIdAsync(int id) => Task.FromResult<Project?>(null);
    public Task<IEnumerable<Project>> GetAllAsync() => Task.FromResult(Enumerable.Empty<Project>());
    public Task<Project> UpdateAsync(Project project) => Task.FromResult(project);
    public Task DeleteAsync(int id) => Task.CompletedTask;
}

[TestFixture]
public class ServiceRegistrationTests
{
    [Test]
    public void ServiceCollection_ShouldRegisterMediatRAndRepositories()
    {
        // Arrange
        var serviceCollection = new ServiceCollection();
        serviceCollection.AddLogging(); // Ajout du logging pour MediatR
        serviceCollection.AddScoped<IProjectRepository, FakeProjectRepository>(); // Ajout du repository fake
        
        // Act
        serviceCollection.AddApplicationServices();
        var serviceProvider = serviceCollection.BuildServiceProvider();

        // Assert
        var mediator = serviceProvider.GetService<IMediator>();
        var projectRepository = serviceProvider.GetService<IProjectRepository>();
        
        Assert.That(mediator, Is.Not.Null);
        Assert.That(projectRepository, Is.Not.Null);
        Assert.That(projectRepository, Is.InstanceOf<FakeProjectRepository>());
    }
}
