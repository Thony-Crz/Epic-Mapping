using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Data;
using Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly EpicMappingDbContext _context;

        public UserRepository(EpicMappingDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            var entity = await _context.Users.FindAsync(id);
            return entity?.ToDomain();
        }

        public async Task<User?> GetByGitHubIdAsync(string gitHubId)
        {
            var entity = await _context.Users
                .FirstOrDefaultAsync(u => u.GitHubId == gitHubId);
            return entity?.ToDomain();
        }

        public async Task<User> AddAsync(User user)
        {
            var entity = UserEntity.FromDomain(user);
            _context.Users.Add(entity);
            await _context.SaveChangesAsync();
            return entity.ToDomain();
        }

        public async Task<User> UpdateAsync(User user)
        {
            var entity = await _context.Users.FindAsync(user.Id);
            if (entity == null)
            {
                throw new InvalidOperationException($"User with ID {user.Id} not found");
            }

            entity.Name = user.Name;
            entity.Email = user.Email;
            entity.AvatarUrl = user.AvatarUrl;
            entity.Role = user.Role;
            entity.ApprovalStatus = user.ApprovalStatus;
            entity.ApprovedAt = user.ApprovedAt;
            entity.ApprovedBy = user.ApprovedBy;

            await _context.SaveChangesAsync();
            return entity.ToDomain();
        }

        public async Task<IEnumerable<User>> GetPendingUsersAsync()
        {
            var entities = await _context.Users
                .Where(u => u.ApprovalStatus == ApprovalStatus.Pending)
                .OrderBy(u => u.CreatedAt)
                .ToListAsync();
            return entities.Select(e => e.ToDomain());
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            var entities = await _context.Users
                .OrderBy(u => u.CreatedAt)
                .ToListAsync();
            return entities.Select(e => e.ToDomain());
        }

        public async Task<bool> HasAnyUsersAsync()
        {
            return await _context.Users.AnyAsync();
        }

        public async Task<User> CreateUserWithRoleAsync(User user, string? configuredAdminGitHubId)
        {
            // Use a transaction to ensure atomicity
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Check again within transaction to prevent race condition
                var hasAnyUsers = await _context.Users.AnyAsync();
                var isAdmin = !hasAnyUsers || user.GitHubId == configuredAdminGitHubId;

                if (isAdmin)
                {
                    user.Role = UserRole.Admin;
                    user.ApprovalStatus = ApprovalStatus.Approved;
                    user.ApprovedAt = DateTime.UtcNow;
                }
                else
                {
                    user.Role = UserRole.User;
                    user.ApprovalStatus = ApprovalStatus.Pending;
                }

                var entity = UserEntity.FromDomain(user);
                _context.Users.Add(entity);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return entity.ToDomain();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
