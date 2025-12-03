using System;
using System.Threading.RateLimiting;
using EpicMapping.WebApi.Configuration;
using Microsoft.Extensions.Options;

namespace EpicMapping.WebApi.RateLimiting;

public interface IReadyEpicExportLimiter
{
    bool TryAcquire(string partitionKey, out TimeSpan retryAfter);
}

public sealed class ReadyEpicExportLimiter : IReadyEpicExportLimiter, IDisposable
{
    private readonly PartitionedRateLimiter<string> _limiter;

    public ReadyEpicExportLimiter(IOptions<SecuritySettings> securityOptions)
    {
        var exportLimit = Math.Max(1, securityOptions.Value.RateLimiting.ExportRequestsPerMinute);

        _limiter = PartitionedRateLimiter.Create<string, string>(partitionKey =>
            RateLimitPartition.GetFixedWindowLimiter(partitionKey, _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = exportLimit,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0,
                AutoReplenishment = true
            }));
    }

    public bool TryAcquire(string partitionKey, out TimeSpan retryAfter)
    {
        using var lease = _limiter.AttemptAcquire(partitionKey, 1);

        if (lease.IsAcquired)
        {
            retryAfter = TimeSpan.Zero;
            return true;
        }

        retryAfter = lease.TryGetMetadata(MetadataName.RetryAfter, out var metadata) && metadata is TimeSpan retry
            ? retry
            : TimeSpan.FromSeconds(60);
        return false;
    }

    public void Dispose()
    {
        _limiter.Dispose();
    }
}
