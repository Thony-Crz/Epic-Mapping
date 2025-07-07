using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IAuthenticationService
    {
        Task<AuthResult> AuthenticateWithOAuthAsync(string provider, string code);
    }
}
