using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Application.Epics.Abstractions;
using Application.Epics.Models;

namespace Application.Epics.Serialization;

public sealed class SystemTextJsonEpicExportSerializer : IEpicExportSerializer
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        WriteIndented = false
    };

    public EpicExportEnvelope Serialize(EpicExportDocument document, CancellationToken cancellationToken)
    {
        var json = JsonSerializer.Serialize(document, SerializerOptions);
        var checksum = ComputeChecksum(json);

        var fileName = $"epic-{document.Epic.Key.ToLowerInvariant()}-{document.Meta.ExportedAt:yyyyMMddHHmmss}.json";

        var updatedMeta = document.Meta with { Checksum = checksum };
        var enrichedDocument = document with { Meta = updatedMeta };
        json = JsonSerializer.Serialize(enrichedDocument, SerializerOptions);

        return new EpicExportEnvelope(
            json,
            fileName,
            "application/json",
            checksum,
            document.Meta.ExportChannel);
    }

    private static string ComputeChecksum(string payload)
    {
        var bytes = Encoding.UTF8.GetBytes(payload);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }
}
