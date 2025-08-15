namespace Domain.Entities
{
    public class UserAuthInfo
    {
        public required string AccessToken { get; set; }
        public required string JwtToken { get; set; }
        public DateTime ExpiresAt { get; set; }
        public required string UserName { get; set; }
    }
}