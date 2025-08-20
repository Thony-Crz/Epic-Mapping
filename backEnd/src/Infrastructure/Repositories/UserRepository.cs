using Domain.Entities;
using Domain.Interfaces.Repositories;

namespace Infrastructure.Repositories
{
    internal class UserRepository : IUserRepository
    {
        public Task<User> AddAsync(User user)
        {
            throw new NotImplementedException();
        }

        public Task<User> FindByProviderIdAsync(string providerUserId)
        {
            throw new NotImplementedException();
        }
    }
}
