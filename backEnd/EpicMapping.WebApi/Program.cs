using Application.Behaviors;
using Application.UseCases.AuthenticateUser;
using FluentValidation;
using MediatR;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<AuthenticateUserCommand>());
builder.Services.AddValidatorsFromAssemblyContaining<AuthenticateUserCommandValidator>();
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
