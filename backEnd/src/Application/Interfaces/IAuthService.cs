using Application.DTOs.Auth;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task<string> GenerateTokenAsync(User user);
        Task<OAuthUserInfoDto> GetUserInfoFromProviderAsync(string provider, string authCode);
    }
}
