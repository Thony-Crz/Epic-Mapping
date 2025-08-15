using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IAuthenticationService
    {
        Task<UserAuthInfo> AuthenticateWithOAuthAsync(string provider, string code);
    }
}
