namespace Application.Epics.Abstractions;

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
    string Checksum);
