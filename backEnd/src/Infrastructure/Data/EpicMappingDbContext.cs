using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class EpicMappingDbContext : DbContext
{
    public EpicMappingDbContext(DbContextOptions<EpicMappingDbContext> options) : base(options)
    {
    }

    // DbSets pour nos entités


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

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
