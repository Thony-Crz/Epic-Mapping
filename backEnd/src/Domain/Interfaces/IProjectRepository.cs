using Domain.Entities;

namespace Domain.Interfaces;

public interface IProjectRepository
{
    Task<Project> CreateAsync(Project project);
    Task<Project?> GetByIdAsync(int id);
    Task<IEnumerable<Project>> GetAllAsync();
    Task<Project> UpdateAsync(Project project);
    Task DeleteAsync(int id);
}
