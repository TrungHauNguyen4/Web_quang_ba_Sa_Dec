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
    [HttpGet]
    public async Task<ActionResult<List<NewsDto>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await dbContext.TinTucs
            .OrderByDescending(x => x.PhatHanhLuc ?? x.TaoLuc)
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

        return Ok(items);
    }

    [HttpGet("{maSo:guid}")]
    public async Task<ActionResult<NewsDto>> GetById(Guid maSo, CancellationToken cancellationToken)
    {
        var entity = await dbContext.TinTucs.FirstOrDefaultAsync(x => x.MaSo == maSo, cancellationToken);
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

    [HttpPost("/api/admin/news")]
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
    public async Task<IActionResult> Delete(Guid maSo, CancellationToken cancellationToken)
    {
        var entity = await dbContext.TinTucs.FirstOrDefaultAsync(x => x.MaSo == maSo, cancellationToken);
        if (entity is null) return NotFound();

        dbContext.TinTucs.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
