using Application.DTOs.ProjectManagement;
using Application.UseCases.ProjectManagement;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Moq;

namespace Application.UnitTests.ProjectManagement
{
    public class CreateProjectUseCaseTests
    {
        [Test]
        public async Task Should_create_project_given_valid_data()
        {
            // Arrange
            var repositoryMock = new Mock<IProjectRepository>();

            var request = new CreateProjectRequest(Name: "Test Project", Description: "This is a test project.", Color: "#FF5733");

            var expectedProject = new Project
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                Color = request.Color
            };

            repositoryMock.Setup(repo => repo.CreateAsync(It.IsAny<Project>(), default))
                .ReturnsAsync(expectedProject);

            var useCase = new CreateProjectUseCase(repositoryMock.Object);

            // Act
            var result = await useCase.ExecuteAsync(request);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.Multiple(() =>
            {
                Assert.That(result.Id, Is.EqualTo(expectedProject.Id));
                Assert.That(result.Name, Is.EqualTo(expectedProject.Name));
                Assert.That(result.Description, Is.EqualTo(expectedProject.Description));
                Assert.That(result.Color, Is.EqualTo(expectedProject.Color));
            });
        }
    }
}
