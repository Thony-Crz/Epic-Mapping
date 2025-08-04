using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class EpicMappingDbContext : DbContext
{
    public EpicMappingDbContext(DbContextOptions<EpicMappingDbContext> options) : base(options)
    {
    }

    // DbSets pour nos entités
    public DbSet<Epic> Epics { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Feature> Features { get; set; }
    public DbSet<Scenario> Scenarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuration des entités Epic
        modelBuilder.Entity<Epic>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Status).HasConversion<string>();
            
            entity.HasOne(e => e.Project)
                  .WithMany(p => p.Epics)
                  .HasForeignKey(e => e.ProjectId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuration des entités Project
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Description).HasMaxLength(1000);
            entity.Property(p => p.CreatedBy).IsRequired().HasMaxLength(100);
        });

        // Configuration des entités Feature
        modelBuilder.Entity<Feature>(entity =>
        {
            entity.HasKey(f => f.Id);
            entity.Property(f => f.Title).IsRequired().HasMaxLength(200);
            entity.Property(f => f.Description).HasMaxLength(1000);
            entity.Property(f => f.CreatedBy).IsRequired().HasMaxLength(100);
            entity.Property(f => f.Status).HasConversion<string>();
            
            entity.HasOne(f => f.Epic)
                  .WithMany(e => e.Features)
                  .HasForeignKey(f => f.EpicId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuration des entités Scenario
        modelBuilder.Entity<Scenario>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Title).IsRequired().HasMaxLength(200);
            entity.Property(s => s.Description).HasMaxLength(1000);
            entity.Property(s => s.AcceptanceCriteria).HasMaxLength(2000);
            entity.Property(s => s.CreatedBy).IsRequired().HasMaxLength(100);
            entity.Property(s => s.Type).HasConversion<string>();
            
            entity.HasOne(s => s.Feature)
                  .WithMany(f => f.Scenarios)
                  .HasForeignKey(s => s.FeatureId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Configuration par défaut si pas de configuration externe
            optionsBuilder.UseNpgsql();
        }
    }
}
