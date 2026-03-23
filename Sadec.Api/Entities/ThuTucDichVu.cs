namespace Sadec.Api.Entities;

public sealed class ThuTucDichVu
{
    public Guid MaSo { get; set; } = Guid.NewGuid();

    public string Ten { get; set; } = string.Empty;
    public string? MoTa { get; set; }

    public bool DangHoatDong { get; set; } = true;

    public DateTime TaoLuc { get; set; } = DateTime.UtcNow;
    public DateTime CapNhatLuc { get; set; } = DateTime.UtcNow;
}
