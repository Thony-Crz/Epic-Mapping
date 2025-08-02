using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

namespace EpicMapping.WebApi.Middleware
{
    public static class SecurityExtensions
    {
        public static IServiceCollection AddCustomSecurity(this IServiceCollection services, IConfiguration configuration)
        {
            // Rate Limiting Configuration
            var rateLimitSettings = configuration.GetSection("Security:RateLimiting");
            var requestsPerMinute = rateLimitSettings.GetValue("RequestsPerMinute", 60);
            var tokenRequestsPerMinute = rateLimitSettings.GetValue("TokenRequestsPerMinute", 10);

            services.AddRateLimiter(options =>
            {
                // Global rate limit
                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                        factory: partition => new FixedWindowRateLimiterOptions
                        {
                            AutoReplenishment = true,
                            PermitLimit = requestsPerMinute,
                            Window = TimeSpan.FromMinutes(1)
                        }));

                // Specific rate limit for authentication endpoints
                options.AddFixedWindowLimiter("AuthPolicy", options =>
                {
                    options.PermitLimit = tokenRequestsPerMinute;
                    options.Window = TimeSpan.FromMinutes(1);
                    options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    options.QueueLimit = 5;
                });
            });

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

            // Rate Limiting
            app.UseRateLimiter();

            if (requireHttps)
            {
                app.UseHttpsRedirection();
            }

            return app;
        }
    }
}
