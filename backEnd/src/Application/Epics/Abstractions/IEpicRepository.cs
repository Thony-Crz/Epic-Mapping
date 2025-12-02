namespace Application.Epics.Abstractions;

public interface IEpicRepository
{
    Task<IReadyEpicProjection?> GetReadyEpicAsync(Guid epicId, CancellationToken cancellationToken);
}
