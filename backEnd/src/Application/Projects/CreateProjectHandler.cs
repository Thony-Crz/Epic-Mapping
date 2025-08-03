using MediatR;
using Domain.Entities;
using Domain.Interfaces;

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
