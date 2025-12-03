using Domain.Epics.ReadModel;

namespace Domain.Epics.Policies;

public interface IReadyEpicExportPolicy
{
    void EnsureCanExport(IReadyEpicProjection epic);
}
