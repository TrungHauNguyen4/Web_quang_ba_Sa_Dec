using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;

namespace Sadec.Api.Controllers;

[ApiController]
public sealed class ServiceApplicationsController(ApplicationDbContext dbContext, IWebHostEnvironment environment) : ControllerBase
{
    private const int DefaultSlaDays = 3;

    private static readonly HashSet<string> AllowedAttachmentExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".doc", ".docx"
    };

    private static readonly HashSet<string> AllowedAttachmentContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf",
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };

    private const long MaxAttachmentSizeBytes = 10 * 1024 * 1024;

    [HttpGet("/api/services")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<PublicServiceDto>>> GetServices(CancellationToken cancellationToken)
    {
        var items = await dbContext.ThuTucDichVus
            .Where(x => x.DangHoatDong)
            .OrderBy(x => x.Ten)
            .Select(x => new PublicServiceDto(
                x.MaSo,
                x.Ten,
                x.MoTa,
                x.DangHoatDong,
                ParseFormSchema(x.CauHinhBieuMauJson),
                x.TaoLuc,
                x.CapNhatLuc
            ))
            .ToListAsync(cancellationToken);

        return Ok(items);
    }

    [HttpGet("/api/service-applications/{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ServiceApplicationDto>> GetById(string id, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(id)) return BadRequest();

        var normalizedId = id.Trim();
        var entity = await dbContext.HoSoDichVus.FirstOrDefaultAsync(x => x.MaHoSo == normalizedId, cancellationToken);
        if (entity is null) return NotFound();

        return Ok(ToServiceApplicationDto(entity));
    }

    [HttpPost("/api/service-applications")]
    [AllowAnonymous]
    public async Task<ActionResult<ServiceApplicationDto>> Submit(
        [FromBody] ServiceApplicationCreateDto request,
        CancellationToken cancellationToken)
    {
        var serviceName = request.ServiceName?.Trim() ?? string.Empty;
        var applicant = request.Applicant?.Trim() ?? string.Empty;
        var phone = request.Phone?.Trim() ?? string.Empty;
        var email = request.Email?.Trim() ?? string.Empty;
        var address = request.Address?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(serviceName) || string.IsNullOrWhiteSpace(applicant) || string.IsNullOrWhiteSpace(phone) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(address))
        {
            return BadRequest(new { message = "Thong tin bat buoc khong duoc de trong." });
        }

        var now = DateTime.UtcNow;
        var id = $"HS-{now:yyyyMMddHHmmss}";

        var entity = new HoSoDichVu
        {
            MaHoSo = id,
            TenThuTuc = serviceName,
            NguoiNop = applicant,
            SoDienThoai = phone,
            Email = email,
            DiaChi = address,
            GhiChu = request.Note,
            TepDinhKemJson = ToAttachmentUrlsJson(request.AttachmentUrls),
            NgayNopLuc = now,
            CapNhatLuc = now,
            TrangThai = "pending"
        };

        dbContext.HoSoDichVus.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(ToServiceApplicationDto(entity));
    }

    [HttpPost("/api/service-applications/upload")]
    [AllowAnonymous]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<ServiceAttachmentUploadDto>> UploadAttachment([FromForm] MediaUploadRequestDto request, CancellationToken cancellationToken)
    {
        var file = request.File;
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "Vui long chon tep hop le." });
        }

        if (file.Length > MaxAttachmentSizeBytes)
        {
            return BadRequest(new { message = "Dung luong tep vuot qua gioi han 10MB." });
        }

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension) || !AllowedAttachmentExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Dinh dang tep khong duoc ho tro." });
        }

        if (!AllowedAttachmentContentTypes.Contains(file.ContentType))
        {
            return BadRequest(new { message = "Loai noi dung tep khong hop le." });
        }

        var now = DateTime.UtcNow;
        var relativeFolder = Path.Combine("uploads", "service-applications", now.ToString("yyyy"), now.ToString("MM"));
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

        var media = new MediaFile
        {
            Url = publicUrl,
            TenTep = Path.GetFileName(file.FileName),
            KichThuocBytes = file.Length,
            LoaiNoiDung = file.ContentType,
            TaoLuc = now
        };

        dbContext.MediaFiles.Add(media);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new ServiceAttachmentUploadDto(
            media.MaSo,
            media.Url,
            media.TenTep,
            media.KichThuocBytes ?? 0,
            media.LoaiNoiDung ?? string.Empty
        ));
    }

    [HttpGet("/api/admin/service-applications")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<PagedResultDto<ServiceApplicationDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null,
        [FromQuery] string? status = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.HoSoDichVus.AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim();
            query = query.Where(x =>
                x.MaHoSo.Contains(keyword) ||
                x.TenThuTuc.Contains(keyword) ||
                x.NguoiNop.Contains(keyword));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            var normalized = status.Trim().ToLower();
            query = query.Where(x => x.TrangThai.ToLower() == normalized);
        }

        var total = await query.CountAsync(cancellationToken);

        var entities = await query
            .OrderByDescending(x => x.NgayNopLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = entities
            .Select(ToServiceApplicationDto)
            .ToList();

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return Ok(new PagedResultDto<ServiceApplicationDto>(items, page, pageSize, total, totalPages));
    }

    [HttpPatch("/api/admin/service-applications/{id}/status")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdateStatus(
        string id,
        [FromBody] ServiceApplicationStatusUpdateDto request,
        CancellationToken cancellationToken)
    {
        var entity = await dbContext.HoSoDichVus.FirstOrDefaultAsync(x => x.MaHoSo == id, cancellationToken);
        if (entity is null) return NotFound();

        var requestedStatus = request.Status.Trim().ToLower();
        var nextStatus = requestedStatus switch
        {
            "resolved" => "completed",
            "resolved-success" => "completed",
            "resolved_success" => "completed",
            _ => requestedStatus
        };

        var allowed = new[] { "pending", "processing", "completed", "rejected" };
        if (!allowed.Contains(nextStatus))
        {
            return BadRequest(new { message = "Trang thai khong hop le." });
        }

        entity.TrangThai = nextStatus;
        entity.CapNhatLuc = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(request.Note))
        {
            entity.GhiChu = request.Note.Trim();
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("/api/admin/service-applications/{id}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DeleteApplication(string id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.HoSoDichVus.FirstOrDefaultAsync(x => x.MaHoSo == id, cancellationToken);
        if (entity is null) return NotFound();

        if (!string.Equals(entity.TrangThai, "completed", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Chi duoc xoa ho so da giai quyet thanh cong." });
        }

        var attachmentUrls = ParseAttachmentUrls(entity.TepDinhKemJson);
        foreach (var url in attachmentUrls)
        {
            await RemoveAttachmentMediaByUrlAsync(url, entity.MaHoSo, cancellationToken);
        }

        dbContext.HoSoDichVus.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpGet("/api/admin/services")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<PagedResultDto<PublicServiceDto>>> GetServicesAdmin(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? q = null,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = dbContext.ThuTucDichVus.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            var keyword = q.Trim();
            query = query.Where(x => x.Ten.Contains(keyword) || (x.MoTa != null && x.MoTa.Contains(keyword)));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(x => x.CapNhatLuc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new PublicServiceDto(
                x.MaSo,
                x.Ten,
                x.MoTa,
                x.DangHoatDong,
                ParseFormSchema(x.CauHinhBieuMauJson),
                x.TaoLuc,
                x.CapNhatLuc
            ))
            .ToListAsync(cancellationToken);

        var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)pageSize);
        return Ok(new PagedResultDto<PublicServiceDto>(items, page, pageSize, total, totalPages));
    }

    [HttpPost("/api/admin/services")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<ActionResult<PublicServiceDto>> CreateService([FromBody] PublicServiceCreateDto request, CancellationToken cancellationToken)
    {
        var name = request.Name.Trim();
        var exists = await dbContext.ThuTucDichVus.AnyAsync(x => x.Ten == name, cancellationToken);
        if (exists)
        {
            return Conflict(new { message = "Tên thủ tục đã tồn tại." });
        }

        var entity = new ThuTucDichVu
        {
            Ten = name,
            MoTa = request.Description,
            DangHoatDong = request.IsActive,
            CauHinhBieuMauJson = ToFormSchemaJson(request.FormSchema),
            TaoLuc = DateTime.UtcNow,
            CapNhatLuc = DateTime.UtcNow
        };

        dbContext.ThuTucDichVus.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new PublicServiceDto(entity.MaSo, entity.Ten, entity.MoTa, entity.DangHoatDong, ParseFormSchema(entity.CauHinhBieuMauJson), entity.TaoLuc, entity.CapNhatLuc));
    }

    [HttpPut("/api/admin/services/{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> UpdateService(Guid id, [FromBody] PublicServiceUpdateDto request, CancellationToken cancellationToken)
    {
        var entity = await dbContext.ThuTucDichVus.FirstOrDefaultAsync(x => x.MaSo == id, cancellationToken);
        if (entity is null) return NotFound();

        var name = request.Name.Trim();
        var exists = await dbContext.ThuTucDichVus.AnyAsync(x => x.Ten == name && x.MaSo != id, cancellationToken);
        if (exists)
        {
            return Conflict(new { message = "Tên thủ tục đã tồn tại." });
        }

        entity.Ten = name;
        entity.MoTa = request.Description;
        entity.DangHoatDong = request.IsActive;
        entity.CauHinhBieuMauJson = ToFormSchemaJson(request.FormSchema);
        entity.CapNhatLuc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpDelete("/api/admin/services/{id:guid}")]
    [Authorize(Roles = "Admin,Editor")]
    public async Task<IActionResult> DeleteService(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.ThuTucDichVus.FirstOrDefaultAsync(x => x.MaSo == id, cancellationToken);
        if (entity is null) return NotFound();

        dbContext.ThuTucDichVus.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static ServiceFormSchemaDto? ParseFormSchema(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return null;

        try
        {
            var parsed = JsonSerializer.Deserialize<ServiceFormSchemaDto>(raw);
            if (parsed is null) return null;
            return NormalizeFormSchema(parsed);
        }
        catch
        {
            return null;
        }
    }

    private static DateTime GetDueAt(DateTime submittedAt)
    {
        return submittedAt.AddDays(DefaultSlaDays);
    }

    private static bool IsOverdue(HoSoDichVu entity)
    {
        if (string.IsNullOrWhiteSpace(entity.TrangThai)) return false;

        var status = entity.TrangThai.Trim().ToLowerInvariant();
        if (status == "completed" || status == "rejected") return false;

        return DateTime.UtcNow > GetDueAt(entity.NgayNopLuc);
    }

    private static ServiceApplicationDto ToServiceApplicationDto(HoSoDichVu entity)
    {
        return new ServiceApplicationDto(
            entity.MaHoSo,
            entity.TenThuTuc,
            entity.NguoiNop,
            entity.NgayNopLuc,
            GetDueAt(entity.NgayNopLuc),
            entity.TrangThai,
            IsOverdue(entity),
            entity.SoDienThoai,
            entity.Email,
            entity.DiaChi,
            entity.GhiChu,
            ParseAttachmentUrls(entity.TepDinhKemJson),
            entity.CapNhatLuc
        );
    }

    private static string? ToFormSchemaJson(ServiceFormSchemaDto? schema)
    {
        var normalized = NormalizeFormSchema(schema);
        if (normalized is null)
        {
            return null;
        }

        return JsonSerializer.Serialize(normalized);
    }

    private static ServiceFormSchemaDto? NormalizeFormSchema(ServiceFormSchemaDto? schema)
    {
        if (schema is null) return null;

        var fields = (schema.Fields ?? [])
            .Where(x => !string.IsNullOrWhiteSpace(x.Key) && !string.IsNullOrWhiteSpace(x.Label))
            .Select(x => new ServiceFormFieldDto(
                x.Key.Trim(),
                x.Label.Trim(),
                x.Required,
                NormalizeFieldType(x.Type),
                string.IsNullOrWhiteSpace(x.Placeholder) ? null : x.Placeholder.Trim()))
            .GroupBy(x => x.Key, StringComparer.OrdinalIgnoreCase)
            .Select(g => g.First())
            .ToList();

        if (fields.Count == 0
            && string.IsNullOrWhiteSpace(schema.Title)
            && string.IsNullOrWhiteSpace(schema.Hint)
            && string.IsNullOrWhiteSpace(schema.TemplateUrl)
            && string.IsNullOrWhiteSpace(schema.RequiredDocuments))
        {
            return null;
        }

        return new ServiceFormSchemaDto(
            string.IsNullOrWhiteSpace(schema.Title) ? null : schema.Title.Trim(),
            string.IsNullOrWhiteSpace(schema.Hint) ? null : schema.Hint.Trim(),
            string.IsNullOrWhiteSpace(schema.TemplateUrl) ? null : schema.TemplateUrl.Trim(),
            string.IsNullOrWhiteSpace(schema.RequiredDocuments) ? null : schema.RequiredDocuments.Trim(),
            fields);
    }

    private static string NormalizeFieldType(string? type)
    {
        var normalized = (type ?? string.Empty).Trim().ToLowerInvariant();
        return normalized switch
        {
            "textarea" => "textarea",
            "date" => "date",
            _ => "text"
        };
    }

    private static IReadOnlyList<string> ParseAttachmentUrls(string? raw)
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

    private static string? ToAttachmentUrlsJson(IReadOnlyList<string>? attachmentUrls)
    {
        if (attachmentUrls is null || attachmentUrls.Count == 0) return null;

        var normalized = attachmentUrls
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Select(x => x.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        return normalized.Count == 0 ? null : JsonSerializer.Serialize(normalized);
    }

    private async Task RemoveAttachmentMediaByUrlAsync(string url, string deletingApplicationId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(url)) return;

        var normalizedUrl = url.Trim();

        var unresolvedApps = await dbContext.HoSoDichVus
            .Where(x => x.MaHoSo != deletingApplicationId && x.TrangThai != "completed")
            .Select(x => x.TepDinhKemJson)
            .ToListAsync(cancellationToken);

        var isReferencedByUnresolved = unresolvedApps
            .SelectMany(ParseAttachmentUrls)
            .Any(attachment => string.Equals(attachment, normalizedUrl, StringComparison.OrdinalIgnoreCase));

        if (isReferencedByUnresolved)
        {
            return;
        }

        var media = await dbContext.MediaFiles.FirstOrDefaultAsync(x => x.Url == normalizedUrl, cancellationToken);
        if (media is not null)
        {
            dbContext.MediaFiles.Remove(media);
        }

        DeletePhysicalFile(normalizedUrl);
    }

    private void DeletePhysicalFile(string url)
    {
        if (string.IsNullOrWhiteSpace(url)) return;

        var webRootPath = environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRootPath))
        {
            webRootPath = Path.Combine(environment.ContentRootPath, "wwwroot");
        }

        try
        {
            var uri = new Uri(url);
            var relativePath = uri.AbsolutePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var physicalPath = Path.Combine(webRootPath, relativePath);
            if (System.IO.File.Exists(physicalPath))
            {
                System.IO.File.Delete(physicalPath);
            }
        }
        catch
        {
            // Ignore invalid URL.
        }
    }
}