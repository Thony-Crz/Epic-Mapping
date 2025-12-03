using Application.Common.Interfaces;
using Domain.Interfaces.Repositories;
using Infrastructure.Logging;
using Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
        {
            // Enregistrer le repository
            services.AddScoped<IProjectRepository, ProjectRepository>(); // ProjectRepository est votre implémentation
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddSingleton<IExportAuditLogger, ExportAuditLogger>();
            services.AddScoped<IExportAuditRepository, ExportAuditRepository>();

            return services;
        }
    }
}
