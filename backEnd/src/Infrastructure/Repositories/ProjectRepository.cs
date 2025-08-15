using Domain.Entities;
using Domain.Interfaces.Repositories;

namespace Infrastructure.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        public Task<Project> CreateAsync(Project project, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<Project> GetByIdAsync(Guid projectId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Project>> GetByTeamOwnerIdAsync(int teamOwnerId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}