using System;
using Application.Epics.Abstractions;
using Application.Epics.Exceptions;
using Domain.Epics.Policies;
using MediatR;

namespace Application.Epics;

public sealed class ExportReadyEpicHandler : IRequestHandler<ExportReadyEpicQuery, ExportReadyEpicResult>
{
    private readonly IEpicRepository _epicRepository;
    private readonly IReadyEpicExportPolicy _exportPolicy;
    private readonly IEpicExportMapper _mapper;
    private readonly IEpicExportSerializer _serializer;
    private readonly IExportAuditRepository _auditRepository;

    public ExportReadyEpicHandler(
        IEpicRepository epicRepository,
        IReadyEpicExportPolicy exportPolicy,
        IEpicExportMapper mapper,
        IEpicExportSerializer serializer,
        IExportAuditRepository auditRepository)
    {
        _epicRepository = epicRepository;
        _exportPolicy = exportPolicy;
        _mapper = mapper;
        _serializer = serializer;
        _auditRepository = auditRepository;
    }

    public async Task<ExportReadyEpicResult> Handle(ExportReadyEpicQuery request, CancellationToken cancellationToken)
    {
        var epic = await _epicRepository.GetReadyEpicAsync(request.EpicId, cancellationToken);
        if (epic is null)
        {
            throw new EpicNotFoundException(request.EpicId);
        }

        _exportPolicy.EnsureCanExport(epic);

        var exportedAt = DateTimeOffset.UtcNow;
        var context = new ReadyEpicExportContext(epic, request.RequestedBy, exportedAt);
        var document = _mapper.Map(context);

        try
        {
            var envelope = _serializer.Serialize(document, cancellationToken);

            await _auditRepository.RecordAsync(
                new ExportAuditRecord(
                    epic.Id,
                    request.RequestedBy,
                    exportedAt,
                    envelope.DeliveryChannel,
                    "Succeeded",
                    null,
                    envelope.Checksum),
                cancellationToken);

            return new ExportReadyEpicResult(
                envelope.FileName,
                envelope.ContentType,
                envelope.Json,
                envelope.Checksum);
        }
        catch (Exception ex)
        {
            await _auditRepository.RecordAsync(
                new ExportAuditRecord(
                    epic.Id,
                    request.RequestedBy,
                    exportedAt,
                    document.Meta.ExportChannel,
                    "Failed",
                    ex.Message,
                    document.Meta.Checksum ?? string.Empty),
                cancellationToken);

            throw;
        }
    }
}
