namespace Application.Epics.Abstractions;

public interface IReadyEpicExportPolicy
{
    void EnsureCanExport(IReadyEpicProjection epic);
}
