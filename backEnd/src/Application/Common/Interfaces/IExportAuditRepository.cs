using Domain.Epics.ValueObjects;

namespace Application.Common.Interfaces;

public interface IExportAuditRepository
{
    Task RecordAsync(ExportAuditRecord record, CancellationToken cancellationToken);
}

public sealed record ExportAuditRecord(
    Guid EpicId,
    string ExportedBy,
    DateTimeOffset ExportedAt,
    string DeliveryChannel,
    string Status,
    string? FailureReason,
    string Checksum,
    string Payload,
    string SchemaVersion,
    string FileName,
    string? CorrelationId,
    EpicExportSnapshot Snapshot);
