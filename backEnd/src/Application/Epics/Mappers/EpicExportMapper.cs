using System;
using System.Collections.Generic;
using System.Linq;
using Application.Epics.Abstractions;
using Application.Epics.Models;
using Domain.Epics.ReadModel;

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

        var dependencies = (epic.Dependencies ?? Array.Empty<DependencyProjection>())
            .Select(dependency => new EpicExportDependency(
                dependency.Id,
                dependency.Key,
                dependency.Title,
                dependency.Type,
                dependency.Status))
            .ToList();

        var readinessChecklist = (epic.ReadinessChecklist ?? Array.Empty<ChecklistItemProjection>())
            .Select(item => new EpicExportChecklistItem(item.Id, item.Title, item.Note, item.IsComplete))
            .ToList();

        var linkedStories = (epic.LinkedStories ?? Array.Empty<StoryProjection>())
            .Select(story => new EpicExportStoryRef(
                story.Id,
                story.Key,
                story.Title,
                story.Status,
                story.Type,
                story.Order))
            .ToList();

        var features = (epic.Features ?? Array.Empty<FeatureProjection>())
            .OrderBy(feature => feature.Order)
            .Select(feature => new EpicExportFeature(
                feature.Id,
                feature.Key,
                feature.Title,
                feature.Summary,
                feature.Status,
                feature.Order,
                feature.Tags ?? Array.Empty<string>(),
                (feature.Scenarios ?? Array.Empty<ScenarioProjection>())
                    .OrderBy(scenario => scenario.Order)
                    .Select(scenario => new EpicExportScenario(
                        scenario.Id,
                        scenario.Title,
                        scenario.Status,
                        scenario.Order,
                        scenario.Description,
                        scenario.AcceptanceCriteria ?? Array.Empty<string>()))
                    .ToList()))
            .ToList();

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
                epic.Tribe,
                epic.TargetRelease,
                epic.BusinessValue,
                epic.Estimate,
                epic.Confidence,
                epic.Tags ?? Array.Empty<string>(),
                dependencies,
                readinessChecklist,
                epic.AcceptanceCriteria ?? Array.Empty<string>(),
                linkedStories,
                epic.UpdatedAt,
                epic.ReadyAt),
            features,
            new EpicExportLinks(Array.Empty<string>(), Array.Empty<string>(), linkedStories));
    }
}
