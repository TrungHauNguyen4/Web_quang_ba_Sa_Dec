using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;
using Sadec.Api.Exceptions;

namespace Sadec.Api.Services.Comments;

public sealed class CommentService(ApplicationDbContext dbContext) : ICommentService
{
    private const string AutoApproveSettingKey = "comments.autoApprove";
    private static readonly Dictionary<string, string> TargetAliases = new(StringComparer.OrdinalIgnoreCase)
    {
        ["news"] = "news",
        ["tin-tuc"] = "news",
        ["tintuc"] = "news",
        ["destination"] = "destination",
        ["dia-danh"] = "destination",
        ["diadiem"] = "destination"
    };

    public async Task<CommentDto> SubmitAsync(CommentCreateRequestDto request, CancellationToken cancellationToken = default)
    {
        var targetType = NormalizeTargetType(request.TargetType);
        var userName = string.IsNullOrWhiteSpace(request.UserName) ? "Nguoi dung" : request.UserName.Trim();
        var email = string.IsNullOrWhiteSpace(request.Email) ? "anonymous@sadec.local" : request.Email.Trim();
        var content = request.Content.Trim();

        if (request.TargetId == Guid.Empty)
        {
            throw new AppException("TargetId is required.");
        }

        if (string.IsNullOrWhiteSpace(content))
        {
            throw new AppException("Content is required.");
        }

        var targetExists = await IsPublishedTargetAsync(targetType, request.TargetId, cancellationToken);
        if (!targetExists)
        {
            throw new AppException("Target not found or not published.", StatusCodes.Status404NotFound);
        }

        var autoApproveEnabled = await GetAutoApproveEnabledAsync(cancellationToken);

        var entity = new BinhLuan
        {
            TargetType = targetType,
            TargetId = request.TargetId,
            TenNguoiGui = userName,
            Email = email,
            NoiDung = content,
            TrangThai = autoApproveEnabled ? CommentStatus.Approved : CommentStatus.Pending,
            TaoLuc = DateTime.UtcNow
        };

        dbContext.BinhLuans.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return ToDto(entity, null, null);
    }

    public async Task<bool> GetAutoApproveEnabledAsync(CancellationToken cancellationToken = default)
    {
        var raw = await dbContext.CaiDatHeThongs
            .Where(x => x.Khoa == AutoApproveSettingKey)
            .Select(x => x.GiaTri)
            .FirstOrDefaultAsync(cancellationToken);

        return string.Equals(raw, "true", StringComparison.OrdinalIgnoreCase);
    }

    public async Task SetAutoApproveEnabledAsync(bool enabled, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.CaiDatHeThongs.FirstOrDefaultAsync(x => x.Khoa == AutoApproveSettingKey, cancellationToken);
        if (entity is null)
        {
            entity = new CaiDatHeThong
            {
                Khoa = AutoApproveSettingKey,
                GiaTri = enabled ? "true" : "false",
                CapNhatLuc = DateTime.UtcNow
            };
            dbContext.CaiDatHeThongs.Add(entity);
        }
        else
        {
            entity.GiaTri = enabled ? "true" : "false";
            entity.CapNhatLuc = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
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
        var acceptedTargetTypes = GetTargetAliases(normalizedTargetType);

        var query = dbContext.BinhLuans
            .Where(x => acceptedTargetTypes.Contains(x.TargetType.ToLower()) && x.TargetId == targetId && x.TrangThai == CommentStatus.Approved);

        var total = await query.CountAsync(cancellationToken);
        var entities = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        var items = await ToDtosWithTargetInfoAsync(entities, cancellationToken);

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
            var acceptedTargetTypes = GetTargetAliases(normalized);
            query = query.Where(x => acceptedTargetTypes.Contains(x.TargetType.ToLower()));
        }

        var total = await query.CountAsync(cancellationToken);
        var entities = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        var items = await ToDtosWithTargetInfoAsync(entities, cancellationToken);

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

        return ToDto(entity, null, null);
    }

    public async Task DeleteAsync(Guid commentId, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.BinhLuans.FirstOrDefaultAsync(x => x.MaSo == commentId, cancellationToken);
        if (entity is null)
        {
            throw new AppException("Comment not found.", StatusCodes.Status404NotFound);
        }

        dbContext.BinhLuans.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<int> DeleteReviewedHistoryAsync(bool includePending = false, CancellationToken cancellationToken = default)
    {
        var query = dbContext.BinhLuans.AsQueryable();

        if (!includePending)
        {
            query = query.Where(x => x.TrangThai == CommentStatus.Approved || x.TrangThai == CommentStatus.Rejected);
        }

        var entities = await query.ToListAsync(cancellationToken);
        if (entities.Count == 0)
        {
            return 0;
        }

        dbContext.BinhLuans.RemoveRange(entities);
        await dbContext.SaveChangesAsync(cancellationToken);
        return entities.Count;
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
        if (!TargetAliases.TryGetValue(normalized, out var canonical))
        {
            throw new AppException("Unsupported targetType. Allowed: news, destination.");
        }

        return canonical;
    }

    private static string[] GetTargetAliases(string canonicalTargetType)
    {
        return TargetAliases
            .Where(x => string.Equals(x.Value, canonicalTargetType, StringComparison.OrdinalIgnoreCase))
            .Select(x => x.Key.ToLowerInvariant())
            .Distinct()
            .ToArray();
    }

    private async Task<List<CommentDto>> ToDtosWithTargetInfoAsync(List<BinhLuan> entities, CancellationToken cancellationToken)
    {
        if (entities.Count == 0)
        {
            return [];
        }

        var newsIds = entities
            .Where(x => x.TargetType.Equals("news", StringComparison.OrdinalIgnoreCase) || x.TargetType.Equals("tin-tuc", StringComparison.OrdinalIgnoreCase) || x.TargetType.Equals("tintuc", StringComparison.OrdinalIgnoreCase))
            .Select(x => x.TargetId)
            .Distinct()
            .ToList();

        var destinationIds = entities
            .Where(x => x.TargetType.Equals("destination", StringComparison.OrdinalIgnoreCase) || x.TargetType.Equals("dia-danh", StringComparison.OrdinalIgnoreCase) || x.TargetType.Equals("diadiem", StringComparison.OrdinalIgnoreCase))
            .Select(x => x.TargetId)
            .Distinct()
            .ToList();

        var newsMap = newsIds.Count == 0
            ? new Dictionary<Guid, (string Slug, string Title)>()
            : await dbContext.TinTucs
                .Where(x => newsIds.Contains(x.MaSo))
                .Select(x => new { x.MaSo, x.DuongDan, x.TieuDe })
                .ToDictionaryAsync(x => x.MaSo, x => (Slug: x.DuongDan, Title: x.TieuDe), cancellationToken);

        var destinationMap = destinationIds.Count == 0
            ? new Dictionary<Guid, (string Slug, string Title)>()
            : await dbContext.DiaDiems
                .Where(x => destinationIds.Contains(x.MaSo))
                .Select(x => new { x.MaSo, x.DuongDan, x.TieuDe })
                .ToDictionaryAsync(x => x.MaSo, x => (Slug: x.DuongDan, Title: x.TieuDe), cancellationToken);

        return entities.Select(entity =>
        {
            var normalizedType = NormalizeTargetType(entity.TargetType);
            if (normalizedType == "news" && newsMap.TryGetValue(entity.TargetId, out var newsInfo))
            {
                return ToDto(entity, newsInfo.Slug, newsInfo.Title);
            }

            if (normalizedType == "destination" && destinationMap.TryGetValue(entity.TargetId, out var destinationInfo))
            {
                return ToDto(entity, destinationInfo.Slug, destinationInfo.Title);
            }

            return ToDto(entity, null, null);
        }).ToList();
    }

    private static CommentDto ToDto(BinhLuan entity, string? targetSlug, string? targetTitle)
        => new(
            entity.MaSo,
            entity.TargetType,
            entity.TargetId,
            targetSlug,
            targetTitle,
            entity.TenNguoiGui,
            entity.Email,
            entity.NoiDung,
            entity.TrangThai,
            entity.TaoLuc
        );
}
