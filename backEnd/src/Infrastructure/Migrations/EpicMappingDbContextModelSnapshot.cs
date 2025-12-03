#nullable disable

using System;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Migrations;

[DbContext(typeof(EpicMappingDbContext))]
partial class EpicMappingDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "9.0.0")
            .HasAnnotation("Relational:MaxIdentifierLength", 63);

        NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

        modelBuilder.Entity("Infrastructure.Data.Entities.ExportAuditEvent", b =>
        {
            b.Property<Guid>("Id")
                .HasColumnType("uuid")
                .HasColumnName("id");

            b.Property<string>("Checksum")
                .IsRequired()
                .HasMaxLength(128)
                .HasColumnType("character varying(128)")
                .HasColumnName("checksum");

            b.Property<string>("DeliveryChannel")
                .IsRequired()
                .HasMaxLength(64)
                .HasColumnType("character varying(64)")
                .HasColumnName("delivery_channel");

            b.Property<Guid>("EpicId")
                .HasColumnType("uuid")
                .HasColumnName("epic_id");

            b.Property<DateTimeOffset>("ExportedAt")
                .HasColumnType("timestamp with time zone")
                .HasColumnName("exported_at");

            b.Property<string>("ExportedBy")
                .IsRequired()
                .HasMaxLength(256)
                .HasColumnType("character varying(256)")
                .HasColumnName("exported_by");

            b.Property<string>("FailureReason")
                .HasColumnType("text")
                .HasColumnName("failure_reason");

            b.Property<string>("FileName")
                .IsRequired()
                .HasMaxLength(260)
                .HasColumnType("character varying(260)")
                .HasColumnName("file_name");

            b.Property<string>("Payload")
                .IsRequired()
                .HasColumnType("jsonb")
                .HasColumnName("payload");

            b.Property<string>("SchemaVersion")
                .IsRequired()
                .HasMaxLength(32)
                .HasColumnType("character varying(32)")
                .HasColumnName("schema_version");

            b.Property<string>("Status")
                .IsRequired()
                .HasMaxLength(32)
                .HasColumnType("character varying(32)")
                .HasColumnName("status");

            b.Property<string>("CorrelationId")
                .HasMaxLength(64)
                .HasColumnType("character varying(64)")
                .HasColumnName("correlation_id");

            b.HasKey("Id")
                .HasName("pk_export_audit_events");

            b.HasIndex("EpicId", "ExportedAt")
                .HasDatabaseName("ix_export_audit_events_epic_id_exported_at");

            b.ToTable("export_audit_events", (string)null);
        });
#pragma warning restore 612, 618
    }
}
