using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/cuisines")]
public sealed class CuisinesController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<CuisineDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 12,
        [FromQuery] string? q = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.MonAns.Where(x => x.TrangThai == ContentStatus.Published);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim();
            query = query.Where(x => x.TieuDe.Contains(keyword) || (x.MoTa != null && x.MoTa.Contains(keyword)));
        }

        var total = await query.CountAsync(cancellationToken);

        var entities = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = entities
            .Select(x => new CuisineDto(
                x.MaSo,
                x.TieuDe,
                x.DuongDan,
                x.MoTa,
                x.PhanLoai,
                x.AnhDaiDienUrl,
                ParseGalleryImageUrls(x.AnhBoSungJson),
                x.VideoUrl,
                x.ViDo,
                x.KinhDo,
                x.TrangThai,
                x.TaoLuc,
                x.CapNhatLuc
            ))
            .ToList();

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return Ok(new PagedResultDto<CuisineDto>(items, page, pageSize, total, totalPages));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CuisineDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.MonAns
            .Where(x => x.TrangThai == ContentStatus.Published)
            .FirstOrDefaultAsync(x => x.MaSo == id, cancellationToken);

        if (entity is null) return NotFound();

        return Ok(new CuisineDto(
            entity.MaSo,
            entity.TieuDe,
            entity.DuongDan,
            entity.MoTa,
            entity.PhanLoai,
            entity.AnhDaiDienUrl,
            ParseGalleryImageUrls(entity.AnhBoSungJson),
            entity.VideoUrl,
            entity.ViDo,
            entity.KinhDo,
            entity.TrangThai,
            entity.TaoLuc,
            entity.CapNhatLuc
        ));
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<CuisineDto>> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(slug)) return BadRequest();

        var normalized = slug.Trim();

        var entity = await dbContext.MonAns
            .Where(x => x.TrangThai == ContentStatus.Published)
            .FirstOrDefaultAsync(x => x.DuongDan == normalized, cancellationToken);

        if (entity is null) return NotFound();

        return Ok(new CuisineDto(
            entity.MaSo,
            entity.TieuDe,
            entity.DuongDan,
            entity.MoTa,
            entity.PhanLoai,
            entity.AnhDaiDienUrl,
            ParseGalleryImageUrls(entity.AnhBoSungJson),
            entity.VideoUrl,
            entity.ViDo,
            entity.KinhDo,
            entity.TrangThai,
            entity.TaoLuc,
            entity.CapNhatLuc
        ));
    }

    [HttpGet("/api/admin/cuisines")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<PagedResultDto<CuisineDto>>> GetAllAdmin(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null,
        [FromQuery] ContentStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.MonAns.AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim();
            query = query.Where(x => x.TieuDe.Contains(keyword) || (x.MoTa != null && x.MoTa.Contains(keyword)));
        }

        if (status.HasValue)
        {
            query = query.Where(x => x.TrangThai == status.Value);
        }

        var total = await query.CountAsync(cancellationToken);

        var entities = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = entities
            .Select(x => new CuisineDto(
                x.MaSo,
                x.TieuDe,
                x.DuongDan,
                x.MoTa,
                x.PhanLoai,
                x.AnhDaiDienUrl,
                ParseGalleryImageUrls(x.AnhBoSungJson),
                x.VideoUrl,
                x.ViDo,
                x.KinhDo,
                x.TrangThai,
                x.TaoLuc,
                x.CapNhatLuc
            ))
            .ToList();

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return Ok(new PagedResultDto<CuisineDto>(items, page, pageSize, total, totalPages));
    }

    [HttpPost("/api/admin/cuisines")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<CuisineDto>> Create([FromBody] CuisineCreateDto request, CancellationToken cancellationToken)
    {
        var slug = request.Slug.Trim();
        var slugExists = await dbContext.MonAns.AnyAsync(x => x.DuongDan == slug, cancellationToken);
        if (slugExists)
        {
            return Conflict(new { message = "Slug already exists." });
        }

        var entity = new MonAn
        {
            TieuDe = request.Title.Trim(),
            DuongDan = slug,
            MoTa = request.Description,
            PhanLoai = request.Category,
            AnhDaiDienUrl = request.ImageUrl,
            AnhBoSungJson = ToGalleryImageUrlsJson(request.GalleryImageUrls),
            VideoUrl = request.VideoUrl,
            ViDo = request.Latitude,
            KinhDo = request.Longitude,
            TrangThai = request.Status
        };

        dbContext.MonAns.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new CuisineDto(
            entity.MaSo,
            entity.TieuDe,
            entity.DuongDan,
            entity.MoTa,
            entity.PhanLoai,
            entity.AnhDaiDienUrl,
            ParseGalleryImageUrls(entity.AnhBoSungJson),
            entity.VideoUrl,
            entity.ViDo,
            entity.KinhDo,
            entity.TrangThai,
            entity.TaoLuc,
            entity.CapNhatLuc
        ));
    }

    [HttpPut("/api/admin/cuisines/{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CuisineUpdateDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.MonAns.FirstOrDefaultAsync(x => x.MaSo == id, cancellationToken);
        if (entity is null) return NotFound();

        var slug = request.Slug.Trim();
        var slugExists = await dbContext.MonAns.AnyAsync(x => x.DuongDan == slug && x.MaSo != id, cancellationToken);
        if (slugExists)
        {
            return Conflict(new { message = "Slug already exists." });
        }

        entity.TieuDe = request.Title.Trim();
        entity.DuongDan = slug;
        entity.MoTa = request.Description;
        entity.PhanLoai = request.Category;
        entity.AnhDaiDienUrl = request.ImageUrl;
        entity.AnhBoSungJson = ToGalleryImageUrlsJson(request.GalleryImageUrls);
        entity.VideoUrl = request.VideoUrl;
        entity.ViDo = request.Latitude;
        entity.KinhDo = request.Longitude;
        entity.TrangThai = request.Status;
        entity.CapNhatLuc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("/api/admin/cuisines/{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.MonAns.FirstOrDefaultAsync(x => x.MaSo == id, cancellationToken);
        if (entity is null) return NotFound();

        dbContext.MonAns.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static IReadOnlyList<string> ParseGalleryImageUrls(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return [];

        try
        {
            var parsed = JsonSerializer.Deserialize<List<string>>(raw) ?? [];
            return parsed
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();
        }
        catch
        {
            return [];
        }
    }

    private static string? ToGalleryImageUrlsJson(IReadOnlyList<string>? imageUrls)
    {
        if (imageUrls is null || imageUrls.Count == 0) return null;

        var normalized = imageUrls
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => x.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        return normalized.Count == 0 ? null : JsonSerializer.Serialize(normalized);
    }
}