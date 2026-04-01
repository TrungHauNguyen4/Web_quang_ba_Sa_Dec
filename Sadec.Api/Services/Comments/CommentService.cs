using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;
using Sadec.Api.Exceptions;

namespace Sadec.Api.Services.Comments;

public sealed class CommentService(ApplicationDbContext dbContext) : ICommentService
{
    private static readonly HashSet<string> AllowedTargets = new(StringComparer.OrdinalIgnoreCase)
    {
        "news",
        "destination"
    };

    public async Task<CommentDto> SubmitAsync(CommentCreateRequestDto request, CancellationToken cancellationToken = default)
    {
        var targetType = NormalizeTargetType(request.TargetType);
        var userName = request.UserName.Trim();
        var email = request.Email.Trim();
        var content = request.Content.Trim();

        if (request.TargetId == Guid.Empty)
        {
            throw new AppException("TargetId is required.");
        }

        if (string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(content))
        {
            throw new AppException("UserName, Email and Content are required.");
        }

        var targetExists = await IsPublishedTargetAsync(targetType, request.TargetId, cancellationToken);
        if (!targetExists)
        {
            throw new AppException("Target not found or not published.", StatusCodes.Status404NotFound);
        }

        var entity = new BinhLuan
        {
            TargetType = targetType,
            TargetId = request.TargetId,
            TenNguoiGui = userName,
            Email = email,
            NoiDung = content,
            TrangThai = CommentStatus.Pending,
            TaoLuc = DateTime.UtcNow
        };

        dbContext.BinhLuans.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return ToDto(entity);
    }

    public async Task<PagedResultDto<CommentDto>> GetApprovedByTargetAsync(string targetType, Guid targetId, int page = 1, int pageSize = 10, CancellationToken cancellationToken = default)
    {
        var normalizedTargetType = NormalizeTargetType(targetType);
        if (targetId == Guid.Empty)
        {
            throw new AppException("targetId is required.");
        }

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.BinhLuans
            .Where(x => x.TargetType == normalizedTargetType && x.TargetId == targetId && x.TrangThai == CommentStatus.Approved);

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => ToDto(x))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return new PagedResultDto<CommentDto>(items, page, pageSize, total, totalPages);
    }

    public async Task<PagedResultDto<CommentDto>> GetForModerationAsync(int page = 1, int pageSize = 20, CommentStatus? status = null, string? targetType = null, CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.BinhLuans.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(x => x.TrangThai == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(targetType))
        {
            var normalized = NormalizeTargetType(targetType);
            query = query.Where(x => x.TargetType == normalized);
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => ToDto(x))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return new PagedResultDto<CommentDto>(items, page, pageSize, total, totalPages);
    }

    public async Task<CommentDto> UpdateStatusAsync(Guid commentId, CommentStatus status, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.BinhLuans.FirstOrDefaultAsync(x => x.MaSo == commentId, cancellationToken);
        if (entity is null)
        {
            throw new AppException("Comment not found.", StatusCodes.Status404NotFound);
        }

        entity.TrangThai = status;
        await dbContext.SaveChangesAsync(cancellationToken);

        return ToDto(entity);
    }

    private async Task<bool> IsPublishedTargetAsync(string targetType, Guid targetId, CancellationToken cancellationToken)
    {
        return targetType switch
        {
            "news" => await dbContext.TinTucs.AnyAsync(x => x.MaSo == targetId && x.TrangThai == ContentStatus.Published, cancellationToken),
            "destination" => await dbContext.DiaDiems.AnyAsync(x => x.MaSo == targetId && x.TrangThai == ContentStatus.Published, cancellationToken),
            _ => false
        };
    }

    private static string NormalizeTargetType(string value)
    {
        var normalized = value.Trim().ToLowerInvariant();
        if (!AllowedTargets.Contains(normalized))
        {
            throw new AppException("Unsupported targetType. Allowed: news, destination.");
        }

        return normalized;
    }

    private static CommentDto ToDto(BinhLuan entity)
        => new(
            entity.MaSo,
            entity.TargetType,
            entity.TargetId,
            entity.TenNguoiGui,
            entity.Email,
            entity.NoiDung,
            entity.TrangThai,
            entity.TaoLuc
        );
}
