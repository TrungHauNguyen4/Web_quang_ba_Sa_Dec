using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/admin/media")]
[Authorize(Roles = "Admin,Editor")]
public class MediaController(ApplicationDbContext dbContext, IWebHostEnvironment environment) : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".pdf"
    };

    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "application/pdf"
    };

    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<MediaUploadResponseDto>> Upload([FromForm] MediaUploadRequestDto request, CancellationToken cancellationToken)
    {
        var file = request.File;
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "Vui long chon tep hop le." });
        }

        if (file.Length > MaxFileSizeBytes)
        {
            return BadRequest(new { message = "Dung luong tep vuot qua gioi han 10MB." });
        }

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Dinh dang tep khong duoc ho tro." });
        }

        if (!AllowedContentTypes.Contains(file.ContentType))
        {
            return BadRequest(new { message = "Loai noi dung tep khong hop le." });
        }

        var now = DateTime.UtcNow;
        var relativeFolder = Path.Combine("uploads", now.ToString("yyyy"), now.ToString("MM"));
        var webRootPath = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(environment.ContentRootPath, "wwwroot");
        }

        var physicalFolder = Path.Combine(webRootPath, relativeFolder);
        Directory.CreateDirectory(physicalFolder);

        var savedFileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var physicalPath = Path.Combine(physicalFolder, savedFileName);

        await using (var stream = new FileStream(physicalPath, FileMode.CreateNew))
        {
            await file.CopyToAsync(stream, cancellationToken);
        }

        var relativeUrl = $"/{relativeFolder.Replace('\\', '/')}/{savedFileName}";
        var publicUrl = $"{Request.Scheme}://{Request.Host}{relativeUrl}";

        Guid? uploaderId = null;
        var nameIdentifier = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(nameIdentifier, out var parsedUserId))
        {
            uploaderId = parsedUserId;
        }

        var media = new MediaFile
        {
            Url = publicUrl,
            TenTep = Path.GetFileName(file.FileName),
            KichThuocBytes = file.Length,
            LoaiNoiDung = file.ContentType,
            NguoiTaiLenId = uploaderId,
            TaoLuc = now
        };

        dbContext.MediaFiles.Add(media);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new MediaUploadResponseDto(
            media.MaSo,
            media.Url,
            media.TenTep,
            media.KichThuocBytes ?? 0,
            media.LoaiNoiDung ?? file.ContentType
        ));
    }

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<MediaFileDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.MediaFiles.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim();
            query = query.Where(x => x.TenTep.Contains(keyword));
        }

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new MediaFileDto(
                x.MaSo,
                x.Url,
                x.TenTep,
                x.KichThuocBytes ?? 0,
                x.LoaiNoiDung ?? string.Empty,
                x.TaoLuc
            ))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return Ok(new PagedResultDto<MediaFileDto>(items, page, pageSize, total, totalPages));
    }

    [AllowAnonymous]
    [HttpGet("/api/media")]
    public async Task<ActionResult<PagedResultDto<MediaFileDto>>> GetPublic(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 30,
        [FromQuery] string? q = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.MediaFiles.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim();
            query = query.Where(x => x.TenTep.Contains(keyword));
        }

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(x => x.TaoLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new MediaFileDto(
                x.MaSo,
                x.Url,
                x.TenTep,
                x.KichThuocBytes ?? 0,
                x.LoaiNoiDung ?? string.Empty,
                x.TaoLuc
            ))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return Ok(new PagedResultDto<MediaFileDto>(items, page, pageSize, total, totalPages));
    }
}