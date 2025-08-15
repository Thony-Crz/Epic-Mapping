namespace Application.DTOs.ProjectManagement
{
    public record CreateProjectRequest(
        string Name,
        string? Description,
        string? Color
    );
}
