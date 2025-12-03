using System.Collections.Generic;

namespace Domain.Epics.Exceptions;

public sealed class ReadyEpicExportValidationException : Exception
{
    public ReadyEpicExportValidationException(
        string message,
        string? currentStatus = null,
        IReadOnlyList<string>? missingChecklistItems = null) : base(message)
    {
        CurrentStatus = currentStatus;
        MissingChecklistItems = missingChecklistItems ?? Array.Empty<string>();
    }

    public string? CurrentStatus { get; }

    public IReadOnlyList<string> MissingChecklistItems { get; }
}
