using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;
using Sadec.Api.Services.Media;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/admin/media")]
[Authorize(Roles = "Admin,Editor")]
public class AdminMediaController(
    ApplicationDbContext dbContext,
    IMediaStorageService mediaStorageService) : ControllerBase
{
    private static readonly HashSet<string> AllowedContentTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4"
    ];

    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(MaxFileSizeBytes)]
    public async Task<ActionResult<MediaUploadResponseDto>> Upload(
        [FromForm] MediaUploadRequestDto request,
        CancellationToken cancellationToken)
    {
        var file = request.File;

        if (file is null)
        {
            return BadRequest(new { message = "File is required." });
        }

        if (file.Length <= 0)
        {
            return BadRequest(new { message = "File is empty." });
        }

        if (file.Length > MaxFileSizeBytes)
        {
            return BadRequest(new { message = "File exceeds max size 10MB." });
        }

        if (!AllowedContentTypes.Contains(file.ContentType))
        {
            return BadRequest(new { message = "Unsupported file type. Allowed: jpg, png, webp, gif, mp4." });
        }

        var stored = await mediaStorageService.SaveAsync(file, cancellationToken);

        Guid? uploadedBy = null;
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(userIdClaim, out var parsedUserId))
        {
            uploadedBy = parsedUserId;
        }

        var entity = new MediaFile
        {
            Url = stored.RelativeUrl,
            TenTep = file.FileName,
            LoaiNoiDung = stored.ContentType,
            KichThuocBytes = stored.SizeBytes,
            NguoiTaiLenId = uploadedBy
        };

        dbContext.MediaFiles.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        var absoluteUrl = $"{Request.Scheme}://{Request.Host}{entity.Url}";

        return Ok(new MediaUploadResponseDto(
            entity.MaSo,
            absoluteUrl,
            entity.TenTep,
            entity.LoaiNoiDung,
            entity.KichThuocBytes,
            entity.TaoLuc
        ));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MediaItemDto>>> GetAll(CancellationToken cancellationToken)
    {
        var entities = await dbContext.MediaFiles
            .OrderByDescending(x => x.TaoLuc)
            .Take(200)
            .ToListAsync(cancellationToken);

        var items = entities
            .Select(x => new MediaItemDto(
                x.MaSo,
                x.TenTep,
                $"{Request.Scheme}://{Request.Host}{x.Url}",
                x.LoaiNoiDung,
                x.KichThuocBytes,
                x.TaoLuc,
                x.NguoiTaiLenId
            ));

        return Ok(items);
    }
}
