using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;
using Sadec.Api.Exceptions;

namespace Sadec.Api.Services.Comments;

public sealed class CommentService(ApplicationDbContext dbContext) : ICommentService
{
    private static readonly HashSet<string> AllowedTargetTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "news",
        "destination",
        "cuisine"
    };

    public async Task<CommentDto> SubmitAsync(CommentCreateRequestDto request, CancellationToken cancellationToken = default)
    {
        var targetType = NormalizeTargetType(request.TargetType);

        await EnsureTargetExistsAsync(targetType, request.TargetId, cancellationToken);

        var entity = new BinhLuan
        {
            TargetType = targetType,
            TargetId = request.TargetId,
            TenNguoiGui = request.UserName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            NoiDung = request.Content.Trim(),
            TrangThai = CommentStatus.Pending
        };

        dbContext.BinhLuans.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Map(entity);
    }

    public async Task<PagedResultDto<CommentDto>> GetForModerationAsync(
        int page,
        int pageSize,
        CommentStatus? status,
        string? targetType,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        IQueryable<BinhLuan> query = dbContext.BinhLuans.AsNoTracking();

        if (status.HasValue)
        {
            query = query.Where(x => x.TrangThai == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(targetType))
        {
            var normalizedTargetType = NormalizeTargetType(targetType);
            query = query.Where(x => x.TargetType == normalizedTargetType);
        }

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => Map(x))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return new PagedResultDto<CommentDto>(items, page, pageSize, total, totalPages);
    }

    public async Task<CommentDto> ApproveAsync(Guid commentId, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.BinhLuans.FirstOrDefaultAsync(x => x.MaSo == commentId, cancellationToken)
            ?? throw new ApiNotFoundException("Comment not found.");

        entity.TrangThai = CommentStatus.Approved;
        await dbContext.SaveChangesAsync(cancellationToken);

        return Map(entity);
    }

    public async Task<CommentDto> RejectAsync(Guid commentId, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.BinhLuans.FirstOrDefaultAsync(x => x.MaSo == commentId, cancellationToken)
            ?? throw new ApiNotFoundException("Comment not found.");

        entity.TrangThai = CommentStatus.Rejected;
        await dbContext.SaveChangesAsync(cancellationToken);

        return Map(entity);
    }

    public async Task<PagedResultDto<CommentDto>> GetApprovedByTargetAsync(
        string targetType,
        Guid targetId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var normalizedTargetType = NormalizeTargetType(targetType);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        IQueryable<BinhLuan> query = dbContext.BinhLuans.AsNoTracking()
            .Where(x => x.TargetType == normalizedTargetType
                && x.TargetId == targetId
                && x.TrangThai == CommentStatus.Approved);

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => Map(x))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return new PagedResultDto<CommentDto>(items, page, pageSize, total, totalPages);
    }

    private async Task EnsureTargetExistsAsync(string targetType, Guid targetId, CancellationToken cancellationToken)
    {
        var exists = targetType switch
        {
            "news" => await dbContext.TinTucs.AsNoTracking().AnyAsync(x => x.MaSo == targetId && x.TrangThai == ContentStatus.Published, cancellationToken),
            "destination" => await dbContext.DiaDiems.AsNoTracking().AnyAsync(x => x.MaSo == targetId && x.TrangThai == ContentStatus.Published, cancellationToken),
            "cuisine" => await dbContext.MonAns.AsNoTracking().AnyAsync(x => x.MaSo == targetId && x.TrangThai == ContentStatus.Published, cancellationToken),
            _ => false
        };

        if (!exists)
        {
            throw new ApiValidationException("Target item does not exist or is not published.");
        }
    }

    private static string NormalizeTargetType(string rawTargetType)
    {
        if (string.IsNullOrWhiteSpace(rawTargetType))
        {
            throw new ApiValidationException("TargetType is required.");
        }

        var normalized = rawTargetType.Trim().ToLowerInvariant();
        if (!AllowedTargetTypes.Contains(normalized))
        {
            throw new ApiValidationException("Unsupported targetType. Allowed values: news, destination, cuisine.");
        }

        return normalized;
    }

    private static CommentDto Map(BinhLuan entity)
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
