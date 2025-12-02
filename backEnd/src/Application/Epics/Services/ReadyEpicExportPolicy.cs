using System;
using System.Linq;
using Application.Epics.Abstractions;
using Application.Epics.Exceptions;

namespace Application.Epics.Services;

public sealed class ReadyEpicExportPolicy : IReadyEpicExportPolicy
{
    public void EnsureCanExport(IReadyEpicProjection epic)
    {
        if (epic is null)
        {
            throw new ArgumentNullException(nameof(epic));
        }

        if (!string.Equals(epic.Status, "Ready", StringComparison.OrdinalIgnoreCase))
        {
            throw new ReadyEpicExportValidationException($"Epic '{epic.Key}' must be Ready before export (current: {epic.Status}).");
        }

        if (epic.Features is null || epic.Features.Count == 0)
        {
            throw new ReadyEpicExportValidationException("Ready epic exports require at least one feature.");
        }

        var featureWithoutScenario = epic.Features.FirstOrDefault(feature => feature.Scenarios is null || feature.Scenarios.Count == 0);
        if (featureWithoutScenario is not null)
        {
            throw new ReadyEpicExportValidationException($"Feature '{featureWithoutScenario.Key}' is missing scenarios and cannot be exported.");
        }
    }
}
