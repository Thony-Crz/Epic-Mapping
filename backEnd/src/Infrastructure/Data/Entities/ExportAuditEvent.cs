using System;

namespace Infrastructure.Data.Entities;

public sealed class ExportAuditEvent
{
    public Guid Id { get; set; }
    public Guid EpicId { get; set; }
    public string ExportedBy { get; set; } = string.Empty;
    public DateTimeOffset ExportedAt { get; set; }
    public string DeliveryChannel { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? FailureReason { get; set; }
    public string Checksum { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty;
    public string SchemaVersion { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string? CorrelationId { get; set; }
}
