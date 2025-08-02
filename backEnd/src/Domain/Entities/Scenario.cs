namespace Domain.Entities;

public class Scenario
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string AcceptanceCriteria { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    
    // Foreign key
    public int FeatureId { get; set; }
    
    // Navigation properties
    public virtual Feature Feature { get; set; } = null!;
}
