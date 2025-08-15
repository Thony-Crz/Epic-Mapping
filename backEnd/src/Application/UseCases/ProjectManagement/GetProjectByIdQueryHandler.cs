using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.UseCases.ProjectManagement
{
    public class GetProjectByIdQueryHandler(IProjectRepository repository) : IRequestHandler<GetProjectByIdQuery, Project>
    {
        public async Task<Project> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
        {
            return await repository.GetByIdAsync(request.ProjectId, cancellationToken);
        }
    }
}
