using System;
using EpicMapping.WebApi.Configuration;
using EpicMapping.WebApi.RateLimiting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;
using System.Threading.RateLimiting;

namespace EpicMapping.WebApi.Middleware
{
    public static class SecurityPolicies
    {
        public const string AuthenticatedRequests = "AuthPolicy";
    }

    public static class SecurityExtensions
    {
        public static IServiceCollection AddCustomSecurity(this IServiceCollection services, IConfiguration configuration)
        {
            // Rate Limiting Configuration
            var rateLimitSettings = configuration.GetSection("Security:RateLimiting").Get<RateLimitingSettings>() ?? new RateLimitingSettings();
            var requestsPerMinute = rateLimitSettings.RequestsPerMinute;
            var tokenRequestsPerMinute = rateLimitSettings.TokenRequestsPerMinute;

            services.AddRateLimiter(options =>
            {
                options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                {
                    var partitionKey = $"global:{ResolvePartitionKey(httpContext)}";
                    return RateLimitPartition.GetFixedWindowLimiter(partitionKey, _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = requestsPerMinute,
                        Window = TimeSpan.FromMinutes(1),
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 5,
                        AutoReplenishment = true
                    });
                });

                // Specific rate limit for authentication endpoints when needed
                options.AddFixedWindowLimiter(SecurityPolicies.AuthenticatedRequests, options =>
                {
                    options.PermitLimit = tokenRequestsPerMinute;
                    options.Window = TimeSpan.FromMinutes(1);
                    options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    options.QueueLimit = 5;
                });
            });

            services.AddSingleton<IReadyEpicExportLimiter, ReadyEpicExportLimiter>();

            // CORS Configuration
            var allowedOrigins = configuration.GetSection("Security:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
            
            services.AddCors(options =>
            {
                options.AddPolicy("SecurePolicy", builder =>
                {
                    builder
                        .WithOrigins(allowedOrigins)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .SetPreflightMaxAge(TimeSpan.FromMinutes(5));
                });
            });

            return services;
        }

        public static IApplicationBuilder UseCustomSecurity(this IApplicationBuilder app, IConfiguration configuration)
        {
            var requireHttps = configuration.GetValue("Security:RequireHttps", true);

            // Security Headers
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Append("X-Frame-Options", "DENY");
                context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
                context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
                
                if (requireHttps)
                {
                    context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
                }

                await next();
            });

            // CORS
            app.UseCors("SecurePolicy");

            return app;
        }

        private static string ResolvePartitionKey(HttpContext context)
        {
            return context.User?.Identity?.Name
                ?? context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? context.Connection.RemoteIpAddress?.ToString()
                ?? "anonymous";
        }

    }
}
