namespace EpicMapping.WebApi.Configuration
{
    public class JwtSettings
    {
        public const string SectionName = "Jwt";
        
        public string Key { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public string Audience { get; set; } = string.Empty;
        public int ExpirationHours { get; set; } = 1;
    }

    public class AzureAdSettings
    {
        public const string SectionName = "OAuth:AzureAd";
        
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string TenantId { get; set; } = string.Empty;
        public string Authority { get; set; } = string.Empty;
    }

    public class GitHubSettings
    {
        public const string SectionName = "OAuth:GitHub";
        
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string RedirectUri { get; set; } = string.Empty;
    }

    public class AdminSettings
    {
        public const string SectionName = "Admin";
        
        public string GitHubId { get; set; } = string.Empty;
        public string NotificationEmail { get; set; } = string.Empty;
    }

    public class SecuritySettings
    {
        public const string SectionName = "Security";
        
        public bool RequireHttps { get; set; } = true;
        public string[] AllowedOrigins { get; set; } = Array.Empty<string>();
        public RateLimitingSettings RateLimiting { get; set; } = new();
    }

    public class RateLimitingSettings
    {
        public int RequestsPerMinute { get; set; } = 60;
        public int TokenRequestsPerMinute { get; set; } = 10;
        public int ExportRequestsPerMinute { get; set; } = 30;
    }

    public static class ConfigurationExtensions
    {
        public static JwtSettings GetJwtSettings(this IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>();
            
            if (jwtSettings == null)
                throw new InvalidOperationException("JWT configuration section is missing.");

            // Try to get from environment variables first
            var key = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? jwtSettings.Key;
            if (string.IsNullOrEmpty(key) || key.Contains("REMPLACER") || key.Length < 32)
            {
                throw new InvalidOperationException(
                    "JWT Key is missing, invalid, or too short. " +
                    "Set JWT_SECRET_KEY environment variable or configure in appsettings.json. " +
                    "Key must be at least 32 characters long.");
            }

            jwtSettings.Key = key;
            return jwtSettings;
        }

        public static AzureAdSettings GetAzureAdSettings(this IConfiguration configuration)
        {
            var settings = configuration.GetSection(AzureAdSettings.SectionName).Get<AzureAdSettings>();
            
            if (settings == null)
                return new AzureAdSettings(); // Return empty settings if not configured

            // Try to get from environment variables first
            settings.ClientId = Environment.GetEnvironmentVariable("AZURE_CLIENT_ID") ?? settings.ClientId;
            settings.ClientSecret = Environment.GetEnvironmentVariable("AZURE_CLIENT_SECRET") ?? settings.ClientSecret;
            settings.TenantId = Environment.GetEnvironmentVariable("AZURE_TENANT_ID") ?? settings.TenantId;

            if (!string.IsNullOrEmpty(settings.TenantId) && settings.Authority.Contains("{TenantId}"))
            {
                settings.Authority = settings.Authority.Replace("{TenantId}", settings.TenantId);
            }

            return settings;
        }

        public static GitHubSettings GetGitHubSettings(this IConfiguration configuration)
        {
            var settings = configuration.GetSection(GitHubSettings.SectionName).Get<GitHubSettings>();
            
            if (settings == null)
                return new GitHubSettings();

            // Try to get from environment variables first
            settings.ClientId = Environment.GetEnvironmentVariable("GITHUB_CLIENT_ID") ?? settings.ClientId;
            settings.ClientSecret = Environment.GetEnvironmentVariable("GITHUB_CLIENT_SECRET") ?? settings.ClientSecret;
            settings.RedirectUri = Environment.GetEnvironmentVariable("GITHUB_REDIRECT_URI") ?? settings.RedirectUri;

            return settings;
        }

        public static AdminSettings GetAdminSettings(this IConfiguration configuration)
        {
            var settings = configuration.GetSection(AdminSettings.SectionName).Get<AdminSettings>();
            
            if (settings == null)
                return new AdminSettings();

            // Try to get from environment variables first
            settings.GitHubId = Environment.GetEnvironmentVariable("ADMIN_GITHUB_ID") ?? settings.GitHubId;
            settings.NotificationEmail = Environment.GetEnvironmentVariable("ADMIN_NOTIFICATION_EMAIL") ?? settings.NotificationEmail;

            return settings;
        }

        public static SecuritySettings GetSecuritySettings(this IConfiguration configuration)
        {
            return configuration.GetSection(SecuritySettings.SectionName).Get<SecuritySettings>() ?? new SecuritySettings();
        }
    }
}
