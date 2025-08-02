namespace Application.DTOs.Authentication
{
    public class AuthenticateUserResult
    {
        public required string JwtToken { get; set; }
        public required string UserName { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
