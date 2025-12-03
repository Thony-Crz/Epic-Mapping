using System.Linq;
using Domain.Epics.Exceptions;
using Domain.Epics.Policies;
using Domain.Epics.ReadModel;

namespace Domain.Epics.Services;

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
            throw new ReadyEpicExportValidationException(
                $"Epic '{epic.Key}' must be Ready before export (current: {epic.Status}).");
        }

        var checklist = epic.ReadinessChecklist ?? Array.Empty<ChecklistItemProjection>();

        if (checklist.Count == 0)
        {
            throw new ReadyEpicExportValidationException(
                $"Epic '{epic.Key}' must provide a completed readiness checklist before export.");
        }

        var incompleteItems = checklist
            .Where(item => !item.IsComplete)
            .Select(item => item.Title)
            .ToList();

        if (incompleteItems.Count > 0)
        {
            throw new ReadyEpicExportValidationException(
                $"Epic '{epic.Key}' cannot be exported until checklist items are complete: " +
                string.Join(", ", incompleteItems));
        }

        var acceptanceCriteria = epic.AcceptanceCriteria ?? Array.Empty<string>();
        if (acceptanceCriteria.Count == 0)
        {
            throw new ReadyEpicExportValidationException(
                $"Epic '{epic.Key}' must define at least one acceptance criterion before export.");
        }

        var features = epic.Features ?? Array.Empty<FeatureProjection>();
        if (features.Count == 0)
        {
            throw new ReadyEpicExportValidationException(
                "Ready epic exports require at least one feature.");
        }

        var missingScenarioFeature = features.FirstOrDefault(feature =>
            feature.Scenarios is null || feature.Scenarios.Count == 0);

        if (missingScenarioFeature is not null)
        {
            throw new ReadyEpicExportValidationException(
                $"Feature '{missingScenarioFeature.Key}' must include at least one scenario before export.");
        }
    }
}
