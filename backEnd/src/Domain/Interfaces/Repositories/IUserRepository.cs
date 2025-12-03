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
        
        /// <summary>
        /// Atomically creates a user as admin if no users exist, otherwise as regular user.
        /// This prevents race conditions when multiple users register simultaneously.
        /// </summary>
        Task<User> CreateUserWithRoleAsync(User user, string? configuredAdminGitHubId);
    }
}
