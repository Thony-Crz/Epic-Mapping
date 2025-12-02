namespace Application.Epics;

public sealed record ExportReadyEpicResult(string FileName, string ContentType, string Payload, string Checksum);
