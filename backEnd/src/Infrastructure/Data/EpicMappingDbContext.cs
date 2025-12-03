using Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class EpicMappingDbContext : DbContext
{
    public EpicMappingDbContext(DbContextOptions<EpicMappingDbContext> options) : base(options)
    {
    }

    public DbSet<ExportAuditEvent> ExportAuditEvents => Set<ExportAuditEvent>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EpicMappingDbContext).Assembly);
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
