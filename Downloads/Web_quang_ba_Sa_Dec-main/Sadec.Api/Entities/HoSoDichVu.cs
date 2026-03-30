namespace Sadec.Api.Entities;

public sealed class HoSoDichVu
{
    // UI đang dùng mã dạng: HS-12345
    public string MaHoSo { get; set; } = string.Empty;

    public string TenThuTuc { get; set; } = string.Empty;
    public string NguoiNop { get; set; } = string.Empty;

    public DateTime NgayNopLuc { get; set; } = DateTime.UtcNow;

    // pending | processing | completed | rejected
    public string TrangThai { get; set; } = "pending";

    public string? SoDienThoai { get; set; }
    public string? Email { get; set; }
    public string? DiaChi { get; set; }

    public string? GhiChu { get; set; }

    public DateTime CapNhatLuc { get; set; } = DateTime.UtcNow;
}
