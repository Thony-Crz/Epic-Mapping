namespace Domain.Entities;

public class Epic
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public EpicStatus Status { get; set; } = EpicStatus.InProgress;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    
    // Foreign key - Epic appartient à un Project
    public int ProjectId { get; set; }
    
    // Navigation properties
    public virtual Project Project { get; set; } = null!;
    public virtual ICollection<Feature> Features { get; set; } = new List<Feature>();
}
