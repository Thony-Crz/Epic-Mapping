#nullable disable

using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations;

public partial class AddExportAuditEvents : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "export_audit_events",
            columns: table => new
            {
                id = table.Column<Guid>(type: "uuid", nullable: false),
                epic_id = table.Column<Guid>(type: "uuid", nullable: false),
                exported_by = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                exported_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                checksum = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                payload = table.Column<string>(type: "jsonb", nullable: false),
                delivery_channel = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                failure_reason = table.Column<string>(type: "text", nullable: true),
                schema_version = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                file_name = table.Column<string>(type: "character varying(260)", maxLength: 260, nullable: false),
                correlation_id = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("pk_export_audit_events", x => x.id);
            });

        migrationBuilder.CreateIndex(
            name: "ix_export_audit_events_epic_id_exported_at",
            table: "export_audit_events",
            columns: new[] { "epic_id", "exported_at" });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "export_audit_events");
    }
}
