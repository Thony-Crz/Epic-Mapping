using System;
using System.Linq;
using Application.Common.Interfaces;
using Application.Epics.Abstractions;
using Application.Epics.Exceptions;
using Application.Epics.Models;
using Domain.Epics.Policies;
using Domain.Epics.ValueObjects;
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
        var snapshot = CreateSnapshot(document);

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
                    envelope.Checksum,
                    envelope.Json,
                    document.Meta.SchemaVersion,
                    envelope.FileName,
                    document.Meta.CorrelationId,
                    snapshot),
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
                    document.Meta.Checksum ?? string.Empty,
                    string.Empty,
                    document.Meta.SchemaVersion,
                    string.Empty,
                    document.Meta.CorrelationId,
                    snapshot),
                cancellationToken);

            throw;
        }
    }

    private static EpicExportSnapshot CreateSnapshot(EpicExportDocument document)
    {
        var meta = new EpicExportSnapshotMeta(
            document.Meta.SchemaVersion,
            document.Meta.ExportedAt,
            document.Meta.ExportedBy,
            document.Meta.ExportChannel,
            document.Meta.EpicId,
            document.Meta.Checksum ?? string.Empty,
            document.Meta.CorrelationId);

        var epic = new EpicExportSnapshotEpic(
            document.Epic.Id,
            document.Epic.Key,
            document.Epic.Title,
            document.Epic.Summary,
            document.Epic.Status,
            document.Epic.Owner,
            document.Epic.Tribe,
            document.Epic.TargetRelease,
            document.Epic.BusinessValue,
            document.Epic.Estimate,
            document.Epic.Confidence,
            document.Epic.Tags,
            document.Epic.Dependencies
                .Select(dependency => new EpicExportSnapshotDependency(
                    dependency.Id,
                    dependency.Key,
                    dependency.Title,
                    dependency.Type,
                    dependency.Status))
                .ToList(),
            document.Epic.ReadinessChecklist
                .Select(item => new EpicExportSnapshotChecklistItem(
                    item.Id,
                    item.Title,
                    item.Note,
                    item.IsComplete))
                .ToList(),
            document.Epic.AcceptanceCriteria,
            document.Epic.LinkedStories
                .Select(story => new EpicExportSnapshotStoryRef(
                    story.Id,
                    story.Key,
                    story.Title,
                    story.Status,
                    story.Type,
                    story.Order))
                .ToList(),
            document.Epic.UpdatedAt,
            document.Epic.ReadyAt);

        var features = document.Features
            .Select(feature => new EpicExportSnapshotFeature(
                feature.Id,
                feature.Key,
                feature.Title,
                feature.Summary,
                feature.Status,
                feature.Order,
                feature.Tags,
                feature.Scenarios
                    .Select(scenario => new EpicExportSnapshotScenario(
                        scenario.Id,
                        scenario.Title,
                        scenario.Status,
                        scenario.Order,
                        scenario.Description,
                        scenario.AcceptanceCriteria))
                    .ToList()))
            .ToList();

        var links = new EpicExportSnapshotLinks(
            document.Links.Attachments,
            document.Links.RoadmapItems,
            document.Links.Children
                .Select(child => new EpicExportSnapshotStoryRef(
                    child.Id,
                    child.Key,
                    child.Title,
                    child.Status,
                    child.Type,
                    child.Order))
                .ToList());

        return new EpicExportSnapshot(meta, epic, features, links);
    }
}
