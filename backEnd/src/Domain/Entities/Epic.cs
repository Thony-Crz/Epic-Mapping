namespace Domain.Entities;

public class Epic
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    
    // Navigation properties
    public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
}
