using Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public sealed class ExportAuditEventConfiguration : IEntityTypeConfiguration<ExportAuditEvent>
{
    public void Configure(EntityTypeBuilder<ExportAuditEvent> builder)
    {
        builder.ToTable("export_audit_events");

        builder.HasKey(e => e.Id)
            .HasName("pk_export_audit_events");

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.EpicId)
            .HasColumnName("epic_id");

        builder.Property(e => e.ExportedBy)
            .HasMaxLength(256)
            .IsRequired()
            .HasColumnName("exported_by");

        builder.Property(e => e.ExportedAt)
            .HasColumnName("exported_at");

        builder.Property(e => e.Checksum)
            .HasMaxLength(128)
            .IsRequired()
            .HasColumnName("checksum");

        builder.Property(e => e.Payload)
            .HasColumnType("jsonb")
            .IsRequired()
            .HasColumnName("payload");

        builder.Property(e => e.DeliveryChannel)
            .HasMaxLength(64)
            .IsRequired()
            .HasColumnName("delivery_channel");

        builder.Property(e => e.Status)
            .HasMaxLength(32)
            .IsRequired()
            .HasColumnName("status");

        builder.Property(e => e.FailureReason)
            .HasColumnName("failure_reason");

        builder.Property(e => e.SchemaVersion)
            .HasMaxLength(32)
            .IsRequired()
            .HasColumnName("schema_version");

        builder.Property(e => e.FileName)
            .HasMaxLength(260)
            .IsRequired()
            .HasColumnName("file_name");

        builder.Property(e => e.CorrelationId)
            .HasMaxLength(64)
            .HasColumnName("correlation_id");

        builder.HasIndex(e => new { e.EpicId, e.ExportedAt })
            .HasDatabaseName("ix_export_audit_events_epic_id_exported_at");
    }
}
