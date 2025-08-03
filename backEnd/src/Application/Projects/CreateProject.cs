using MediatR;
using Domain.Entities;

namespace Application.Projects;

public class CreateProject : IRequest<CreateProjectResult>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Color { get; set; }
}

public class CreateProjectResult
{
    public Project Project { get; set; } = null!;
}
