using Domain.Entities;

namespace Domain.Interfaces.Repositories
{
    public interface IProjectRepository
    {
        Task<Project> CreateAsync(Project project, CancellationToken cancellationToken = default);
    }
}
