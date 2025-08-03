namespace Domain.Entities;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Color { get; set; } // Ajout de la propriété Color
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    
    // Navigation properties - Project est maintenant l'entité racine
    public virtual ICollection<Epic> Epics { get; set; } = new List<Epic>();
    public virtual ICollection<Feature> Features { get; set; } = new List<Feature>();
}
