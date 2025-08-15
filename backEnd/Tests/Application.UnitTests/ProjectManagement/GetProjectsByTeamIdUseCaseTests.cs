using Application.UseCases.ProjectManagement;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Moq;

namespace Application.UnitTests.ProjectManagement
{
    public class GetProjectsByTeamIdUseCaseTests
    {

        [Test]
        public async Task Should_get_projects_by_team_owner_id()
        {
            // Arrange
            var repositoryMock = new Mock<IProjectRepository>();
            var teamOwnerId = 1;

            var projects = new List<Project>
            {
                new() { Id = Guid.NewGuid(), Name = "Project 1", TeamOwnerId = teamOwnerId },
                new() { Id = Guid.NewGuid(), Name = "Project 2", TeamOwnerId = teamOwnerId }
            };

            repositoryMock
                .Setup(r => r.GetByTeamOwnerIdAsync(teamOwnerId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(projects);

            var handler = new GetProjectsByTeamIdQueryHandler(repositoryMock.Object);
            var query = new GetProjectsByTeamIdQuery(teamOwnerId);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.ToList(), Has.Count.EqualTo(2));
            Assert.That(result.All(p => p.TeamOwnerId == teamOwnerId), Is.True);

            repositoryMock.Verify(r => r.GetByTeamOwnerIdAsync(teamOwnerId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
