using Application.DTOs.ProjectManagement;
using MediatR;

namespace Application.UseCases.ProjectManagement
{
    public record CreateProjectCommand(
        string Name,
        string? Description,
        string? Color
    ) : IRequest<CreateProjectResult>;
}
