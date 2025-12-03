using System;
using Application.Common.Interfaces;
using Infrastructure.Data;
using Infrastructure.Data.Entities;

namespace Infrastructure.Repositories;

public sealed class ExportAuditRepository : IExportAuditRepository
{
    private readonly EpicMappingDbContext _dbContext;
    private readonly IExportAuditLogger _auditLogger;

    public ExportAuditRepository(EpicMappingDbContext dbContext, IExportAuditLogger auditLogger)
    {
        _dbContext = dbContext;
        _auditLogger = auditLogger;
    }

    public async Task RecordAsync(ExportAuditRecord record, CancellationToken cancellationToken)
    {
        var entity = new ExportAuditEvent
        {
            Id = Guid.NewGuid(),
            EpicId = record.EpicId,
            ExportedBy = record.ExportedBy,
            ExportedAt = record.ExportedAt,
            DeliveryChannel = record.DeliveryChannel,
            Status = record.Status,
            FailureReason = record.FailureReason,
            Checksum = record.Checksum,
            Payload = record.Payload,
            SchemaVersion = record.SchemaVersion,
            FileName = record.FileName,
            CorrelationId = record.CorrelationId
        };

        await _dbContext.ExportAuditEvents.AddAsync(entity, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _auditLogger.Log(record);
    }
}
