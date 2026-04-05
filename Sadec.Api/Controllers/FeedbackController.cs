using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sadec.Api.Data;
using Sadec.Api.Dtos;
using Sadec.Api.Entities;

namespace Sadec.Api.Controllers;

[ApiController]
[Route("api/feedback")]
[AllowAnonymous]
public sealed class FeedbackController(ApplicationDbContext dbContext) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<FeedbackSubmitResultDto>> Submit([FromBody] FeedbackCreateDto request, CancellationToken cancellationToken)
    {
        var fullName = request.FullName?.Trim() ?? string.Empty;
        var email = request.Email?.Trim() ?? string.Empty;
        var phone = request.Phone?.Trim() ?? string.Empty;
        var address = request.Address?.Trim() ?? string.Empty;
        var content = request.Content?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(fullName) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(phone) || string.IsNullOrWhiteSpace(address) || string.IsNullOrWhiteSpace(content))
        {
            return BadRequest(new { message = "Thong tin bat buoc khong duoc de trong." });
        }

        var now = DateTime.UtcNow;
        var ticketId = $"PA-{now:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..4].ToUpperInvariant()}";

        var entity = new HoSoDichVu
        {
            MaHoSo = ticketId,
            TenThuTuc = "Phản ánh/kiến nghị",
            NguoiNop = fullName,
            SoDienThoai = phone,
            Email = email,
            DiaChi = address,
            GhiChu = content,
            NgayNopLuc = now,
            CapNhatLuc = now,
            TrangThai = "pending"
        };

        dbContext.HoSoDichVus.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new FeedbackSubmitResultDto(
            TicketId: entity.MaHoSo,
            Status: entity.TrangThai,
            SubmittedAt: entity.NgayNopLuc
        ));
    }
}
