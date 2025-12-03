using System;
using Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Logging;

public sealed class ExportAuditLogger : IExportAuditLogger
{
    private readonly ILogger<ExportAuditLogger> _logger;

    public ExportAuditLogger(ILogger<ExportAuditLogger> logger)
    {
        _logger = logger;
    }

    public void Log(ExportAuditRecord record)
    {
        var level = record.Status switch
        {
            var status when status.Equals("Failed", StringComparison.OrdinalIgnoreCase) => LogLevel.Error,
            var status when status.Equals("Blocked", StringComparison.OrdinalIgnoreCase) => LogLevel.Warning,
            _ => LogLevel.Information
        };

        _logger.Log(level,
            "Export audit event {@Audit}",
            new
            {
                record.EpicId,
                record.ExportedBy,
                record.ExportedAt,
                record.DeliveryChannel,
                record.Status,
                record.FailureReason,
                record.Checksum,
                record.SchemaVersion,
                record.FileName,
                record.CorrelationId
            });
    }
}
