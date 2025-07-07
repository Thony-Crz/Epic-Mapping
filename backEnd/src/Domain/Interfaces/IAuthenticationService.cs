using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IAuthenticationService
    {
        Task<AuthResult> AuthenticateAsync(string username, string password);
        Task<AuthResult> AuthenticateWithOAuthAsync(string provider, string code);
    }
}
