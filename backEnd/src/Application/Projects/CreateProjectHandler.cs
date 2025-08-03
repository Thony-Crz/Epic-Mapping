using MediatR;
using Domain.Entities;
using Domain.Interfaces;
using Application.Common.Validators;

namespace Application.Projects;

public class CreateProjectHandler : IRequestHandler<CreateProject, CreateProjectResult>
{
    private readonly IProjectRepository _projectRepository;

    public CreateProjectHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<CreateProjectResult> Handle(CreateProject request, CancellationToken cancellationToken)
    {
        // Validation du nom
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException("Name is required", nameof(request.Name));
        }

        // Validation de la couleur hexadécimale
        HexColorValidator.Validate(request.Color, nameof(request.Color));

        // Validation contre les injections malveillantes
        SecurityValidator.Validate(request.Description, nameof(request.Description));

        var project = new Project
        {
            Name = request.Name,
            Description = request.Description ?? string.Empty,
            Color = request.Color,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "system"
        };

        var savedProject = await _projectRepository.CreateAsync(project);
        return new CreateProjectResult { Project = savedProject };
    }
}
