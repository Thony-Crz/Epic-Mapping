namespace Application.DTOs.ProjectManagement
{
    public class CreateProjectResult
    {
        public Guid Id { get; init; }
        public string Name { get; init; } = default!;
        public string? Description { get; init; }
        public string? Color { get; init; }
    }
}
