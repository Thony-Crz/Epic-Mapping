using Domain.Entities;

namespace Domain.Interfaces;

public interface IProjectRepository
{
    Task<Project> CreateAsync(Project project, CancellationToken cancellationToken = default);
    Task<Project?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Project>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Project> UpdateAsync(Project project, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default);
}
