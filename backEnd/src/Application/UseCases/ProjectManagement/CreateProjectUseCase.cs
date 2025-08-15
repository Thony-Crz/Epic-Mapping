using Application.DTOs.ProjectManagement;
using Domain.Interfaces.Repositories;

namespace Application.UseCases.ProjectManagement
{
    public class CreateProjectUseCase(IProjectRepository projectRepository)
    {
        public async Task<CreateProjectResult> ExecuteAsync(CreateProjectRequest request)
        {
            var project = new Domain.Entities.Project
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                Color = request.Color
            };

            var createdProject = await projectRepository.CreateAsync(project);

            return new CreateProjectResult
            {
                Id = createdProject.Id,
                Name = createdProject.Name,
                Description = createdProject.Description,
                Color = createdProject.Color
            };

        }
    }
}
