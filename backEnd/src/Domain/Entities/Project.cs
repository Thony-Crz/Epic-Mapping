namespace Domain.Entities
{
    public class Project
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = "Unknown";
        public string? Description { get; set; }
        public string? Color { get; set; }
        public int TeamOwnerId { get; set; }
    }
}
