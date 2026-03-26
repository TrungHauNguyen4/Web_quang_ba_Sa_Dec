using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/destinations")]
public class DestinationsController(ApplicationDbContext dbContext) : ControllerBase
{
    // Public GET: chỉ trả địa điểm đã xuất bản
    [HttpGet]
    public async Task<ActionResult<PagedResultDto<DestinationDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? q = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = dbContext.DiaDiems
            .Where(x => x.TrangThai == ContentStatus.Published);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim();
            query = query.Where(x => x.TieuDe.Contains(keyword) || (x.MoTaNgan != null && x.MoTaNgan.Contains(keyword)));
        }

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new DestinationDto(
                x.MaSo,
                x.TieuDe,
                x.DuongDan,
                x.MoTaNgan,
                x.NoiDung,
                x.ViDo,
                x.KinhDo,
                x.TrangThai,
                x.TaoLuc,
                x.CapNhatLuc
            ))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return Ok(new PagedResultDto<DestinationDto>(items, page, pageSize, total, totalPages));
    }

    // Public GET chi tiết: chỉ xem được địa điểm đã xuất bản
    [HttpGet("{maSo:guid}")]
    public async Task<ActionResult<DestinationDto>> GetById(Guid maSo, CancellationToken cancellationToken)
    {
        var entity = await dbContext.DiaDiems
            .Where(x => x.TrangThai == ContentStatus.Published)
            .FirstOrDefaultAsync(x => x.MaSo == maSo, cancellationToken);

        if (entity is null) return NotFound();

        return Ok(new DestinationDto(
            entity.MaSo,
            entity.TieuDe,
            entity.DuongDan,
            entity.MoTaNgan,
            entity.NoiDung,
            entity.ViDo,
            entity.KinhDo,
            entity.TrangThai,
            entity.TaoLuc,
            entity.CapNhatLuc
        ));
    }

    // Public GET chi tiết theo slug
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<DestinationDto>> GetBySlug(string slug, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(slug)) return BadRequest();

        var normalized = slug.Trim();

        var entity = await dbContext.DiaDiems
            .Where(x => x.TrangThai == ContentStatus.Published)
            .FirstOrDefaultAsync(x => x.DuongDan == normalized, cancellationToken);

        if (entity is null) return NotFound();

        return Ok(new DestinationDto(
            entity.MaSo,
            entity.TieuDe,
            entity.DuongDan,
            entity.MoTaNgan,
            entity.NoiDung,
            entity.ViDo,
            entity.KinhDo,
            entity.TrangThai,
            entity.TaoLuc,
            entity.CapNhatLuc
        ));
    }

    // Admin GET: xem tất cả trạng thái địa điểm
    [HttpGet("/api/admin/destinations")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<PagedResultDto<DestinationDto>>> GetAllForAdmin(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null,
        [FromQuery] ContentStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.DiaDiems.AsQueryable();

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
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new DestinationDto(
                x.MaSo,
                x.TieuDe,
                x.DuongDan,
                x.MoTaNgan,
                x.NoiDung,
                x.ViDo,
                x.KinhDo,
                x.TrangThai,
                x.TaoLuc,
                x.CapNhatLuc
            ))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return Ok(new PagedResultDto<DestinationDto>(items, page, pageSize, total, totalPages));
    }

    [HttpPost("/api/admin/destinations")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<DestinationDto>> Create([FromBody] DestinationCreateDto request, CancellationToken cancellationToken)
    {
        var slug = request.Slug.Trim();
        var slugExists = await dbContext.DiaDiems.AnyAsync(x => x.DuongDan == slug, cancellationToken);
        if (slugExists)
            return Conflict(new { message = "Slug already exists." });

        var entity = new DiaDiem
        {
            TieuDe = request.Title.Trim(),
            DuongDan = slug,
            MoTaNgan = request.Excerpt,
            NoiDung = request.Content,
            ViDo = request.Latitude,
            KinhDo = request.Longitude,
            TrangThai = request.Status
        };

        dbContext.DiaDiems.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { maSo = entity.MaSo }, new DestinationDto(
            entity.MaSo,
            entity.TieuDe,
            entity.DuongDan,
            entity.MoTaNgan,
            entity.NoiDung,
            entity.ViDo,
            entity.KinhDo,
            entity.TrangThai,
            entity.TaoLuc,
            entity.CapNhatLuc
        ));
    }

    [HttpPut("/api/admin/destinations/{maSo:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Update(Guid maSo, [FromBody] DestinationUpdateDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.DiaDiems.FirstOrDefaultAsync(x => x.MaSo == maSo, cancellationToken);
        if (entity is null) return NotFound();

        var slug = request.Slug.Trim();
        var slugExists = await dbContext.DiaDiems.AnyAsync(x => x.DuongDan == slug && x.MaSo != maSo, cancellationToken);
        if (slugExists)
            return Conflict(new { message = "Slug already exists." });

        entity.TieuDe = request.Title.Trim();
        entity.DuongDan = slug;
        entity.MoTaNgan = request.Excerpt;
        entity.NoiDung = request.Content;
        entity.ViDo = request.Latitude;
        entity.KinhDo = request.Longitude;
        entity.TrangThai = request.Status;
        entity.CapNhatLuc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("/api/admin/destinations/{maSo:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> Delete(Guid maSo, CancellationToken cancellationToken)
    {
        var entity = await dbContext.DiaDiems.FirstOrDefaultAsync(x => x.MaSo == maSo, cancellationToken);
        if (entity is null) return NotFound();

        dbContext.DiaDiems.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
