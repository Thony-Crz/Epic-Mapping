namespace Domain.Entities;

public class Feature
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    
    // Foreign key
    public int ProjectId { get; set; }
    
    // Navigation properties
    public virtual Project Project { get; set; } = null!;
    public virtual ICollection<Scenario> Scenarios { get; set; } = new List<Scenario>();
}
