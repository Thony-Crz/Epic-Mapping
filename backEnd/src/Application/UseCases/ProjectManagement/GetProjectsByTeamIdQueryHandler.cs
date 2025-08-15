using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.UseCases.ProjectManagement
{
    public class GetProjectsByTeamIdQueryHandler(IProjectRepository projectRepository) : IRequestHandler<GetProjectsByTeamIdQuery, IEnumerable<Project>>
    {
        public async Task<IEnumerable<Project>> Handle(GetProjectsByTeamIdQuery request, CancellationToken cancellationToken)
        {
            return await projectRepository.GetByTeamOwnerIdAsync(request.TeamOwnerId, cancellationToken);
        }
    }
}
