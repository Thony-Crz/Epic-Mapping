namespace Application.Epics.Abstractions;

public sealed record ReadyEpicExportContext(
    IReadyEpicProjection Epic,
    string ExportedBy,
    DateTimeOffset ExportedAt,
    string SchemaVersion = "1.0.0",
    string DeliveryChannel = "Download",
    string? CorrelationId = null);
