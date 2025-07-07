namespace Application.DTOs.Authentication
{
    public class AuthenticateUserResult
    {
        public string JwtToken { get; set; }
        public string UserName { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
