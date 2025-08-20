using Application.DTOs.Auth;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services
{
    public class AuthService : IAuthService
    {
        public Task<string> GenerateTokenAsync(User user)
        {
            throw new NotImplementedException();
        }

        public Task<OAuthUserInfoDto> GetUserInfoFromProviderAsync(string provider, string authCode)
        {
            throw new NotImplementedException();
        }
    }
}
