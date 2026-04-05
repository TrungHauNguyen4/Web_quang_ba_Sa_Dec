namespace Sadec.Api.Services.Audit;

public interface IAuditLogService
{
    Task WriteAsync(
        string action,
        string targetType,
        string? targetId = null,
        string? metadata = null,
        Guid? userId = null,
        string? userName = null,
        CancellationToken cancellationToken = default);
}
