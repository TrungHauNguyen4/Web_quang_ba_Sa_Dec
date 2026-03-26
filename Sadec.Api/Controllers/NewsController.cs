using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController(ApplicationDbContext dbContext) : ControllerBase
{
    // Public GET: chỉ trả tin đã xuất bản
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<NewsDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? q = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = dbContext.TinTucs
            .Where(x => x.TrangThai == ContentStatus.Published);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim();
            query = query.Where(x => x.TieuDe.Contains(keyword) || (x.MoTaNgan != null && x.MoTaNgan.Contains(keyword)));
        }

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.PhatHanhLuc ?? x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new NewsDto(
                x.MaSo,
                x.TieuDe,
                x.DuongDan,
                x.MoTaNgan,
                x.NoiDung,
                x.TrangThai,
                x.PhatHanhLuc,
                x.TaoLuc,
                x.CapNhatLuc
            ))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return Ok(new PagedResultDto<NewsDto>(items, page, pageSize, total, totalPages));
    }

    // Public GET chi tiết: chỉ xem được tin đã xuất bản
    [HttpGet("{maSo:guid}")]
    public async Task<ActionResult<NewsDto>> GetById(Guid maSo, CancellationToken cancellationToken)
    {
        var entity = await dbContext.TinTucs
            .Where(x => x.TrangThai == ContentStatus.Published)
            .FirstOrDefaultAsync(x => x.MaSo == maSo, cancellationToken);

        if (entity is null) return NotFound();

        return Ok(new NewsDto(
            entity.MaSo,
            entity.TieuDe,
            entity.DuongDan,
            entity.MoTaNgan,
            entity.NoiDung,
            entity.TrangThai,
            entity.PhatHanhLuc,
            entity.TaoLuc,
            entity.CapNhatLuc
        ));
    }

    // Public GET chi tiết theo slug
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<NewsDto>> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(slug)) return BadRequest();

        var normalized = slug.Trim();

        var entity = await dbContext.TinTucs
            .Where(x => x.TrangThai == ContentStatus.Published)
            .FirstOrDefaultAsync(x => x.DuongDan == normalized, cancellationToken);

        if (entity is null) return NotFound();

        return Ok(new NewsDto(
            entity.MaSo,
            entity.TieuDe,
            entity.DuongDan,
            entity.MoTaNgan,
            entity.NoiDung,
            entity.TrangThai,
            entity.PhatHanhLuc,
            entity.TaoLuc,
            entity.CapNhatLuc
        ));
    }

    // Admin GET: xem tất cả trạng thái (Draft/Published/Archived)
    [HttpGet("/api/admin/news")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<PagedResultDto<NewsDto>>> GetAllForAdmin(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null,
        [FromQuery] ContentStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.TinTucs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim();
            query = query.Where(x => x.TieuDe.Contains(keyword) || (x.MoTaNgan != null && x.MoTaNgan.Contains(keyword)));
        }

        if (status.HasValue)
        {
            query = query.Where(x => x.TrangThai == status.Value);
        }

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.PhatHanhLuc ?? x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new NewsDto(
                x.MaSo,
                x.TieuDe,
                x.DuongDan,
                x.MoTaNgan,
                x.NoiDung,
                x.TrangThai,
                x.PhatHanhLuc,
                x.TaoLuc,
                x.CapNhatLuc
            ))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return Ok(new PagedResultDto<NewsDto>(items, page, pageSize, total, totalPages));
    }

    [HttpPost("/api/admin/news")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<NewsDto>> Create([FromBody] NewsCreateDto request, CancellationToken cancellationToken)
    {
        var slug = request.Slug.Trim();
        var slugExists = await dbContext.TinTucs.AnyAsync(x => x.DuongDan == slug, cancellationToken);
        if (slugExists)
            return Conflict(new { message = "Slug already exists." });

        var entity = new TinTuc
        {
            TieuDe = request.Title.Trim(),
            DuongDan = slug,
            MoTaNgan = request.Excerpt,
            NoiDung = request.Content,
            TrangThai = request.Status,
            PhatHanhLuc = request.PublishedAt
        };

        dbContext.TinTucs.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { maSo = entity.MaSo }, new NewsDto(
            entity.MaSo,
            entity.TieuDe,
            entity.DuongDan,
            entity.MoTaNgan,
            entity.NoiDung,
            entity.TrangThai,
            entity.PhatHanhLuc,
            entity.TaoLuc,
            entity.CapNhatLuc
        ));
    }

    [HttpPut("/api/admin/news/{maSo:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Update(Guid maSo, [FromBody] NewsUpdateDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.TinTucs.FirstOrDefaultAsync(x => x.MaSo == maSo, cancellationToken);
        if (entity is null) return NotFound();

        var slug = request.Slug.Trim();
        var slugExists = await dbContext.TinTucs.AnyAsync(x => x.DuongDan == slug && x.MaSo != maSo, cancellationToken);
        if (slugExists)
            return Conflict(new { message = "Slug already exists." });

        entity.TieuDe = request.Title.Trim();
        entity.DuongDan = slug;
        entity.MoTaNgan = request.Excerpt;
        entity.NoiDung = request.Content;
        entity.TrangThai = request.Status;
        entity.PhatHanhLuc = request.PublishedAt;
        entity.CapNhatLuc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("/api/admin/news/{maSo:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Delete(Guid maSo, CancellationToken cancellationToken)
    {
        var entity = await dbContext.TinTucs.FirstOrDefaultAsync(x => x.MaSo == maSo, cancellationToken);
        if (entity is null) return NotFound();

        dbContext.TinTucs.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
