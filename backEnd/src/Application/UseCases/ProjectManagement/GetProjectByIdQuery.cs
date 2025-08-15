using Domain.Entities;
using MediatR;

namespace Application.UseCases.ProjectManagement
{
    public record GetProjectByIdQuery(Guid ProjectId) : IRequest<Project>;
}
