using Domain.Entities;

namespace Domain.Interfaces.Repositories
{
    public interface IProjectRepository
    {
        Task<Project> CreateAsync(Project project, CancellationToken cancellationToken = default);
        Task<Project> GetByIdAsync(Guid projectId, CancellationToken cancellationToken);
        Task<IEnumerable<Project>> GetByTeamOwnerIdAsync(int teamOwnerId, CancellationToken cancellationToken);
    }
}
