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

            var command = new CreateProjectCommand(
                Name: "Test Project",
                Description: "This is a test project.",
                Color: "#FF5733",
                TeamOwnerId: 1);

            var expectedProject = new Project
            {
                Id = Guid.NewGuid(),
                Name = command.Name,
                Description = command.Description,
                Color = command.Color,
                TeamOwnerId = 1 // Assuming a default owner ID for the test
            };

            repositoryMock.Setup(repo => repo.CreateAsync(It.IsAny<Project>(), default))
                .ReturnsAsync(expectedProject);

            var handler = new CreateProjectCommandHandler(repositoryMock.Object);

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.Multiple(() =>
            {
                Assert.That(result.Id, Is.EqualTo(expectedProject.Id));
                Assert.That(result.Name, Is.EqualTo(expectedProject.Name));
                Assert.That(result.Description, Is.EqualTo(expectedProject.Description));
                Assert.That(result.Color, Is.EqualTo(expectedProject.Color));
                Assert.That(result.TeamOwnerId, Is.EqualTo(expectedProject.TeamOwnerId));
            });
        }
    }
}
