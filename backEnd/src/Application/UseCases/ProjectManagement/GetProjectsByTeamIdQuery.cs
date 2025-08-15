using Domain.Entities;
using MediatR;

namespace Application.UseCases.ProjectManagement
{
    public record GetProjectsByTeamIdQuery(int TeamOwnerId) : IRequest<List<Project>>;
}
