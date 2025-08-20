namespace Application.DTOs.Auth
{
    public record OAuthUserInfoDto(string ProviderUserId, string Email, string Name);
}
