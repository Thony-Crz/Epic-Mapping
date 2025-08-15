using Application.DTOs.ProjectManagement;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using MediatR;

namespace Application.UseCases.ProjectManagement
{
    public class CreateProjectCommandHandler(IProjectRepository projectRepository) : IRequestHandler<CreateProjectCommand, CreateProjectResult>
    {
        public async Task<CreateProjectResult> Handle(CreateProjectCommand command, CancellationToken cancellationToken)
        {
            var project = new Project
            {
                Id = Guid.NewGuid(),
                Name = command.Name,
                Description = command.Description,
                Color = command.Color
            };

            var created = await projectRepository.CreateAsync(project, cancellationToken);

            return new CreateProjectResult
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description,
                Color = created.Color
            };
        }
    }
}
