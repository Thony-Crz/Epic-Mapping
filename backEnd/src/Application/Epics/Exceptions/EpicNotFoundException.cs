namespace Application.Epics.Exceptions;

public sealed class EpicNotFoundException : Exception
{
    public EpicNotFoundException(Guid epicId)
        : base($"Epic '{epicId}' was not found or cannot be exported.")
    {
        EpicId = epicId;
    }

    public Guid EpicId { get; }
}
