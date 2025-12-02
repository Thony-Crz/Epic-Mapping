using System;
using System.Collections.Generic;
using System.Linq;
using Application.Epics.Abstractions;
using Application.Epics.Models;

namespace Application.Epics.Mappers;

public sealed class EpicExportMapper : IEpicExportMapper
{
    public EpicExportDocument Map(ReadyEpicExportContext context)
    {
        if (context is null)
        {
            throw new ArgumentNullException(nameof(context));
        }

        var epic = context.Epic;
        var features = epic.Features?
            .Select(feature => new EpicExportFeature(
                feature.Id,
                feature.Key,
                feature.Title,
                feature.Status,
                feature.Order,
                feature.Scenarios?.Select(s => new EpicExportScenario(s.Id, s.Title, s.Status, s.Order)).ToList() ?? new List<EpicExportScenario>()))
            .ToList() ?? new List<EpicExportFeature>();

        return new EpicExportDocument(
            new EpicExportMeta(
                context.SchemaVersion,
                context.ExportedAt,
                context.ExportedBy,
                context.DeliveryChannel,
                epic.Id,
                null,
                context.CorrelationId),
            new EpicExportEpic(
                epic.Id,
                epic.Key,
                epic.Title,
                epic.Summary,
                epic.Status,
                epic.Owner,
                epic.ReadyAt,
                epic.UpdatedAt,
                Array.Empty<string>(),
                Array.Empty<string>(),
                Array.Empty<string>(),
                Array.Empty<string>()),
            features,
            new EpicExportLinks(Array.Empty<string>(), Array.Empty<string>(), Array.Empty<string>()));
    }
}
