using Application.Behaviors;
using Application.UseCases.AuthenticateUser;
using Domain.Interfaces;
using EpicMapping.WebApi.Configuration;
using EpicMapping.WebApi.Middleware;
using FluentValidation;
using Infrastructure.Data;
using Infrastructure.Extensions;
using Infrastructure.Services;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Secure configuration loading
var jwtSettings = builder.Configuration.GetJwtSettings();
var azureAdSettings = builder.Configuration.GetAzureAdSettings();
var securitySettings = builder.Configuration.GetSecuritySettings();

// Add services to the container.
builder.Services.AddControllers();

// Configure Infrastructure services (Entity Framework, Repositories, etc.)
builder.Services.AddInfrastructure(builder.Configuration);

// Custom Security Services
builder.Services.AddCustomSecurity(builder.Configuration);

// Configuration for JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Key)
            ),
            ClockSkew = TimeSpan.FromMinutes(5) // Reduce clock skew tolerance
        };

        // Enhanced security for JWT
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                // Log authentication failures (consider using ILogger)
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                // Additional token validation logic can be added here
                return Task.CompletedTask;
            }
        };
    });

// Add Swagger/OpenAPI support with security
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Epic Mapping API", 
        Version = "v1",
        Description = "API sécurisée pour Epic Mapping avec authentification JWT"
    });

    // JWT Bearer security definition
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Entrez 'Bearer' suivi d'un espace et de votre token JWT."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add MediatR and FluentValidation
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<AuthorizeExternalProviderCommand>());
builder.Services.AddValidatorsFromAssemblyContaining<AuthorizeExternalProviderValidator>();
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

// Register configuration objects
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));
builder.Services.Configure<AzureAdSettings>(builder.Configuration.GetSection(AzureAdSettings.SectionName));
builder.Services.Configure<SecuritySettings>(builder.Configuration.GetSection(SecuritySettings.SectionName));

// Register the authentication service
builder.Services.AddScoped<IAuthenticationService, OAuthAuthenticationService>();

// Configure authorization policies with global authentication requirement
builder.Services.AddControllers(config =>
{
    var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
    config.Filters.Add(new AuthorizeFilter(policy));
});

var app = builder.Build();

// Configure the HTTP request pipeline with security
app.UseCustomSecurity(builder.Configuration);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Epic Mapping API V1");
        c.RoutePrefix = "swagger"; // Swagger disponible sur /swagger
    });
}

// Security middleware order is important
app.UseAuthentication();
app.UseAuthorization();

// Apply rate limiting to specific endpoints
app.MapControllers()
   .RequireRateLimiting("AuthPolicy"); // Apply to all controllers

app.Run();
