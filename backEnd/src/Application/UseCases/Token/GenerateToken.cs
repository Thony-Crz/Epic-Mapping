using Application.DTOs.GenerateToken;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.UseCases.Token
{
    public record GenerateTokenCommand(string Username, string Password)
        : IRequest<GenerateTokenResult>;

    public class GenerateToken(IConfiguration config)
    : IRequestHandler<GenerateTokenCommand, GenerateTokenResult>
    {
        public Task<GenerateTokenResult> Handle(GenerateTokenCommand request, CancellationToken cancellationToken)
        {
            // Enhanced authentication logic - you should replace this with your actual authentication
            if (!IsValidUser(request.Username, request.Password))
                throw new UnauthorizedAccessException("Invalid credentials");

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, request.Username),
                new Claim(ClaimTypes.NameIdentifier, request.Username),
                new Claim("scope", "epic-mapping-api"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, 
                    new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(), 
                    ClaimValueTypes.Integer64)
            };

            var jwtKey = GetJwtKey();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var expirationHours = int.TryParse(config["Jwt:ExpirationHours"], out var hours) ? hours : 1;
            var expires = DateTime.UtcNow.AddHours(expirationHours);

            var token = new JwtSecurityToken(
                issuer: config["Jwt:Issuer"],
                audience: config["Jwt:Audience"] ?? config["Jwt:Issuer"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Task.FromResult(new GenerateTokenResult(tokenString, expires, request.Username));
        }

        private string GetJwtKey()
        {
            // Try environment variable first, then configuration
            var key = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? config["Jwt:Key"];
            
            if (string.IsNullOrEmpty(key) || key.Contains("REMPLACER") || key.Length < 32)
            {
                throw new InvalidOperationException(
                    "JWT Key is missing, invalid, or too short. " +
                    "Set JWT_SECRET_KEY environment variable or configure in appsettings.json. " +
                    "Key must be at least 32 characters long.");
            }

            return key;
        }

        private static bool IsValidUser(string username, string password)
        {
            // TODO: Replace with your actual authentication logic
            // This could be:
            // - Database lookup
            // - LDAP authentication
            // - External API call
            // - etc.

            // For now, keeping the simple demo authentication
            // but adding some basic security measures
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                return false;

            // Demo users - replace with real authentication
            var validUsers = new Dictionary<string, string>
            {
                { "admin", "password" },
                { "demo", "demo123" },
                { "test", "test123" }
            };

            return validUsers.TryGetValue(username, out var validPassword) && validPassword == password;
        }
    }
}
