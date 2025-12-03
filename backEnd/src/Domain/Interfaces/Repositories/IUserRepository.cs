using Domain.Entities;

namespace Domain.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByGitHubIdAsync(string gitHubId);
        Task<User> AddAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<IEnumerable<User>> GetPendingUsersAsync();
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<bool> HasAnyUsersAsync();
    }
}
