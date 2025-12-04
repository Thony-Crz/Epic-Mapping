using Application.Epics.Abstractions;
using Application.Epics.Mappers;
using Application.Epics.Serialization;
using Application.Interfaces;
using Application.Services;
using Domain.Epics.Policies;
using Domain.Epics.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Enregistrer MediatR avec tous les handlers de l'assembly Application
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        
        // Add HttpClient for external API calls
        services.AddHttpClient();
        
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IReadyEpicExportPolicy, ReadyEpicExportPolicy>();
        services.AddScoped<IEpicExportMapper, EpicExportMapper>();
        services.AddSingleton<IEpicExportSerializer, SystemTextJsonEpicExportSerializer>();

        return services;
    }
}
