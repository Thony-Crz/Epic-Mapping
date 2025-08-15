using Application.UseCases.ProjectManagement;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Enregistrer MediatR avec tous les handlers de l'assembly Application
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        // Enregistrer les Use Cases
        services.AddScoped<CreateProjectUseCase>();

        return services;
    }
}
