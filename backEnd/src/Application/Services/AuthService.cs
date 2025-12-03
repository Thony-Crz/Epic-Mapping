using Application.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IConfiguration configuration, IHttpClientFactory httpClientFactory, ILogger<AuthService> logger)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public Task<string> GenerateTokenAsync(User user)
        {
            var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") 
                ?? _configuration["Jwt:Key"] 
                ?? throw new InvalidOperationException("JWT Key not configured");
            
            // Ensure key meets minimum security requirements (256 bits / 32 characters)
            if (jwtKey.Length < 32)
            {
                throw new InvalidOperationException("JWT Key must be at least 32 characters long for security");
            }
            
            var issuer = _configuration["Jwt:Issuer"] ?? "EpicMappingApi";
            var audience = _configuration["Jwt:Audience"] ?? "EpicMappingClient";
            var expirationHours = int.Parse(_configuration["Jwt:ExpirationHours"] ?? "24");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Name),
                new(ClaimTypes.Email, user.Email ?? ""),
                new("github_id", user.GitHubId),
                new(ClaimTypes.Role, user.Role.ToString()),
                new("approval_status", user.ApprovalStatus.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expirationHours),
                signingCredentials: credentials
            );

            return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
        }

        public string GetGitHubAuthorizationUrl(string state)
        {
            var clientId = Environment.GetEnvironmentVariable("GITHUB_CLIENT_ID") 
                ?? _configuration["OAuth:GitHub:ClientId"];
            var redirectUri = Environment.GetEnvironmentVariable("GITHUB_REDIRECT_URI") 
                ?? _configuration["OAuth:GitHub:RedirectUri"];

            if (string.IsNullOrEmpty(clientId))
                throw new InvalidOperationException("GitHub Client ID not configured");

            var encodedRedirectUri = Uri.EscapeDataString(redirectUri ?? "");
            var encodedState = Uri.EscapeDataString(state);

            return $"https://github.com/login/oauth/authorize?client_id={clientId}&redirect_uri={encodedRedirectUri}&scope=read:user%20user:email&state={encodedState}";
        }

        public async Task<GitHubUserInfo?> GetGitHubUserInfoAsync(string code)
        {
            var clientId = Environment.GetEnvironmentVariable("GITHUB_CLIENT_ID") 
                ?? _configuration["OAuth:GitHub:ClientId"];
            var clientSecret = Environment.GetEnvironmentVariable("GITHUB_CLIENT_SECRET") 
                ?? _configuration["OAuth:GitHub:ClientSecret"];
            var redirectUri = Environment.GetEnvironmentVariable("GITHUB_REDIRECT_URI") 
                ?? _configuration["OAuth:GitHub:RedirectUri"];

            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                throw new InvalidOperationException("GitHub OAuth not configured");

            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            client.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("EpicMapping", "1.0"));

            // Exchange code for access token
            var tokenRequest = new HttpRequestMessage(HttpMethod.Post, "https://github.com/login/oauth/access_token");
            tokenRequest.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
                ["code"] = code,
                ["redirect_uri"] = redirectUri ?? ""
            });
            tokenRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var tokenResponse = await client.SendAsync(tokenRequest);
            if (!tokenResponse.IsSuccessStatusCode)
            {
                var errorContent = await tokenResponse.Content.ReadAsStringAsync();
                _logger.LogWarning("GitHub token exchange failed. Status: {StatusCode}, Response: {Response}", 
                    tokenResponse.StatusCode, errorContent);
                return null;
            }

            var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
            var tokenData = JsonSerializer.Deserialize<JsonElement>(tokenContent);
            
            if (!tokenData.TryGetProperty("access_token", out var accessTokenElement))
            {
                _logger.LogWarning("GitHub token response did not contain access_token. Response: {Response}", tokenContent);
                return null;
            }

            var accessToken = accessTokenElement.GetString();
            if (string.IsNullOrEmpty(accessToken))
            {
                _logger.LogWarning("GitHub access_token was empty");
                return null;
            }

            // Get user info
            var userRequest = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user");
            userRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            userRequest.Headers.UserAgent.Add(new ProductInfoHeaderValue("EpicMapping", "1.0"));

            var userResponse = await client.SendAsync(userRequest);
            if (!userResponse.IsSuccessStatusCode)
            {
                var errorContent = await userResponse.Content.ReadAsStringAsync();
                _logger.LogWarning("GitHub user info request failed. Status: {StatusCode}, Response: {Response}", 
                    userResponse.StatusCode, errorContent);
                return null;
            }

            var userContent = await userResponse.Content.ReadAsStringAsync();
            var userData = JsonSerializer.Deserialize<JsonElement>(userContent);

            var id = userData.GetProperty("id").GetInt64().ToString();
            var login = userData.GetProperty("login").GetString() ?? "";
            var name = userData.TryGetProperty("name", out var nameElement) ? nameElement.GetString() : login;
            var avatarUrl = userData.TryGetProperty("avatar_url", out var avatarElement) ? avatarElement.GetString() : null;

            // Get user email
            string? email = null;
            if (userData.TryGetProperty("email", out var emailElement) && emailElement.ValueKind != JsonValueKind.Null)
            {
                email = emailElement.GetString();
            }

            // If email is not public, try to get from emails endpoint
            if (string.IsNullOrEmpty(email))
            {
                var emailRequest = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user/emails");
                emailRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                emailRequest.Headers.UserAgent.Add(new ProductInfoHeaderValue("EpicMapping", "1.0"));

                var emailResponse = await client.SendAsync(emailRequest);
                if (emailResponse.IsSuccessStatusCode)
                {
                    var emailContent = await emailResponse.Content.ReadAsStringAsync();
                    var emails = JsonSerializer.Deserialize<JsonElement>(emailContent);
                    
                    foreach (var emailEntry in emails.EnumerateArray())
                    {
                        if (emailEntry.TryGetProperty("primary", out var primaryElement) && primaryElement.GetBoolean())
                        {
                            email = emailEntry.GetProperty("email").GetString();
                            break;
                        }
                    }
                }
            }

            return new GitHubUserInfo(id, login, name, email, avatarUrl);
        }
    }
}
