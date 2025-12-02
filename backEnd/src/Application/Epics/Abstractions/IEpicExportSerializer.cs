using Application.Epics.Models;

namespace Application.Epics.Abstractions;

public interface IEpicExportSerializer
{
    EpicExportEnvelope Serialize(EpicExportDocument document, CancellationToken cancellationToken);
}

public sealed record EpicExportEnvelope(
    string Json,
    string FileName,
    string ContentType,
    string Checksum,
    string DeliveryChannel = "Download");
