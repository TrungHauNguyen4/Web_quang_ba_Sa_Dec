using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;

namespace Sadec.Api.Services.Auth;

public sealed class RefreshTokenCleanupService(IServiceProvider serviceProvider, ILogger<RefreshTokenCleanupService> logger) : BackgroundService
{
    private static readonly TimeSpan CleanupInterval = TimeSpan.FromDays(7);
    private static readonly TimeSpan RevokeRetention = TimeSpan.FromDays(7);

    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly ILogger<RefreshTokenCleanupService> _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await CleanupOnceAsync(stoppingToken);

        using var timer = new PeriodicTimer(CleanupInterval);
        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            await CleanupOnceAsync(stoppingToken);
        }
    }

    private async Task CleanupOnceAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var now = DateTime.UtcNow;
            var revokedBefore = now.Subtract(RevokeRetention);

            var staleTokens = await dbContext.RefreshTokens
                .Where(x => x.ExpiresAt <= now || (x.RevokedAt != null && x.RevokedAt <= revokedBefore))
                .ToListAsync(cancellationToken);

            if (staleTokens.Count == 0)
            {
                return;
            }

            dbContext.RefreshTokens.RemoveRange(staleTokens);
            await dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Refresh token cleanup deleted {Count} stale tokens.", staleTokens.Count);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            // App is shutting down.
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to cleanup refresh tokens.");
        }
    }
}
