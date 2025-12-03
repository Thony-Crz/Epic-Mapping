namespace Domain.Epics.Exceptions;

public sealed class ReadyEpicExportValidationException : Exception
{
    public ReadyEpicExportValidationException(string message) : base(message)
    {
    }
}
