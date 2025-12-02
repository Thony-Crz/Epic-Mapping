using MediatR;

namespace Application.Epics;

public sealed record ExportReadyEpicQuery(Guid EpicId, string RequestedBy) : IRequest<ExportReadyEpicResult>;
