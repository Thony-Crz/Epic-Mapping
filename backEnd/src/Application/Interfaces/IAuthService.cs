using Application.DTOs.Auth;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task<string> GenerateTokenAsync(User user);
        Task<GitHubUserInfo?> GetGitHubUserInfoAsync(string code);
        string GetGitHubAuthorizationUrl(string state);
    }

    public record GitHubUserInfo(
        string Id,
        string Login,
        string? Name,
        string? Email,
        string? AvatarUrl
    );
}
