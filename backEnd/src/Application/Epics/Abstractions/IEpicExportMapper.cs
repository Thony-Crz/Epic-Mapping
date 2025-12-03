using Application.Epics.Models;

namespace Application.Epics.Abstractions;

public interface IEpicExportMapper
{
    EpicExportDocument Map(ReadyEpicExportContext context);
}
