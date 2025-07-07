namespace Application.DTOs.GenerateToken
{
    public class GenerateTokenResult(string tokenString, DateTime expires, string username)
    {
        public string TokenString { get; set; } = tokenString;
        public DateTime ExpiresAt { get; set; } = expires;
        public string UserName { get; set; } = username;
        public string TokenType { get; set; } = "Bearer";
    }
}
