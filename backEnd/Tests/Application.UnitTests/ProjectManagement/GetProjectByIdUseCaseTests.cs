using Application.UseCases.ProjectManagement;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Moq;

namespace Application.UnitTests.ProjectManagement
{
    public class GetProjectByIdUseCaseTests
    {
        [Test]
        public async Task Should_return_project_given_valid_project_id()
        {
            // Arrange
            var repo = new Mock<IProjectRepository>();
            var projectId = Guid.NewGuid();

            var expected = new Project
            {
                Id = projectId,
                Name = "Epic Mapping Tool",
                Description = "Test project",
                Color = "#FFAA00",
                TeamOwnerId = 1
            };

            repo.Setup(r => r.GetByIdAsync(projectId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expected);

            var handler = new GetProjectByIdQueryHandler(repo.Object);
            var query = new GetProjectByIdQuery(projectId);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(expected.Id));
            Assert.That(result.Name, Is.EqualTo(expected.Name));
            Assert.That(result.Description, Is.EqualTo(expected.Description));
            Assert.That(result.Color, Is.EqualTo(expected.Color));

            repo.Verify(r => r.GetByIdAsync(projectId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
