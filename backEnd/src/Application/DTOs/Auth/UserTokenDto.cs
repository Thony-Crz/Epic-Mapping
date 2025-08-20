namespace Application.DTOs.Auth
{
    public record UserTokenDto(UserDto User, string Token);
}
