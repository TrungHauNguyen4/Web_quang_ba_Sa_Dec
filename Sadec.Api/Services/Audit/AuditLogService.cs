using Sadec.Api.Data;
using Sadec.Api.Entities;

namespace Sadec.Api.Services.Audit;

public sealed class AuditLogService(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor) : IAuditLogService
{
    public async Task WriteAsync(
        string action,
        string targetType,
        string? targetId = null,
        string? metadata = null,
        Guid? userId = null,
        string? userName = null,
        CancellationToken cancellationToken = default)
    {
        var context = httpContextAccessor.HttpContext;
        var log = new AuditLog
        {
            Action = action,
            TargetType = targetType,
            TargetId = targetId,
            Metadata = metadata,
            UserId = userId,
            UserName = userName,
            IpAddress = context?.Connection.RemoteIpAddress?.ToString(),
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Set<AuditLog>().Add(log);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
