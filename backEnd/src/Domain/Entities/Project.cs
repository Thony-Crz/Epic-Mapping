namespace Domain.Entities;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    
    // Foreign key
    public int EpicId { get; set; }
    
    // Navigation properties
    public virtual Epic Epic { get; set; } = null!;
    public virtual ICollection<Feature> Features { get; set; } = new List<Feature>();
}
