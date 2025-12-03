using System.Security.Claims;
using System.Text.Encodings.Web;
using Application.Common.Interfaces;
using Application.Epics.Abstractions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.IntegrationTests.WebApi;

internal sealed class ReadyEpicApiFactory : WebApplicationFactory<Program>
{
    private const string TestJwtKey = "0123456789abcdef0123456789abcdef";
    private readonly Dictionary<string, string?> _configurationOverrides = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Security:RequireHttps"] = "false",
        ["Security:RateLimiting:RequestsPerMinute"] = "1000",
        ["Security:RateLimiting:TokenRequestsPerMinute"] = "1000",
        ["Security:RateLimiting:ExportRequestsPerMinute"] = "1000",
        ["Jwt:Key"] = TestJwtKey,
        ["Jwt:Issuer"] = "integration-tests",
        ["Jwt:Audience"] = "integration-tests"
    };

    public TestEpicRepository EpicRepository { get; } = new();
    public TestExportAuditRepository AuditRepository { get; } = new();

    public ReadyEpicApiFactory()
    {
        Environment.SetEnvironmentVariable("JWT_SECRET_KEY", TestJwtKey);
    }

    public void SetTokenRateLimit(int permitsPerMinute)
    {
        _configurationOverrides["Security:RateLimiting:TokenRequestsPerMinute"] = permitsPerMinute.ToString();
    }

    public void SetExportRateLimit(int permitsPerMinute)
    {
        _configurationOverrides["Security:RateLimiting:ExportRequestsPerMinute"] = permitsPerMinute.ToString();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, configurationBuilder) =>
        {
            configurationBuilder.AddInMemoryCollection(_configurationOverrides);
        });

        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll(typeof(IEpicRepository));
            services.AddSingleton<IEpicRepository>(EpicRepository);

            services.RemoveAll(typeof(IExportAuditRepository));
            services.AddSingleton<IExportAuditRepository>(AuditRepository);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = TestAuthHandler.AuthenticationScheme;
                options.DefaultChallengeScheme = TestAuthHandler.AuthenticationScheme;
            }).AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.AuthenticationScheme, _ => { });
        });
    }
}

internal sealed class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string AuthenticationScheme = "Test";

    public TestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "integration-user"),
            new Claim(ClaimTypes.Name, "integration.user@tests")
        };

        var identity = new ClaimsIdentity(claims, AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, AuthenticationScheme);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
