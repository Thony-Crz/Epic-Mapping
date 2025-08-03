namespace Domain.Entities;

public class Feature
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty; // Renommé de Name vers Title
    public string Description { get; set; } = string.Empty;
    public FeatureStatus Status { get; set; } = FeatureStatus.Draft;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    
    // Foreign key - Feature appartient à un Epic
    public int EpicId { get; set; }
    
    // Navigation properties
    public virtual Epic Epic { get; set; } = null!;
    public virtual ICollection<Scenario> Scenarios { get; set; } = new List<Scenario>();
}
