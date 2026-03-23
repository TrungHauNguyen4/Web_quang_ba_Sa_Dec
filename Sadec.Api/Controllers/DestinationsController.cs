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
    [HttpGet]
    public async Task<ActionResult<List<DestinationDto>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await dbContext.DiaDiems
            .OrderByDescending(x => x.TaoLuc)
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

        return Ok(items);
    }

    [HttpGet("{maSo:guid}")]
    public async Task<ActionResult<DestinationDto>> GetById(Guid maSo, CancellationToken cancellationToken)
    {
        var entity = await dbContext.DiaDiems.FirstOrDefaultAsync(x => x.MaSo == maSo, cancellationToken);
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

    [HttpPost("/api/admin/destinations")]
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
    public async Task<IActionResult> Delete(Guid maSo, CancellationToken cancellationToken)
    {
        var entity = await dbContext.DiaDiems.FirstOrDefaultAsync(x => x.MaSo == maSo, cancellationToken);
        if (entity is null) return NotFound();

        dbContext.DiaDiems.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
