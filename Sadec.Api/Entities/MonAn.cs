namespace Sadec.Api.Entities;

public sealed class MonAn
{
    public Guid MaSo { get; set; } = Guid.NewGuid();

    public string TieuDe { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    public string? PhanLoai { get; set; }

    public string? AnhDaiDienUrl { get; set; }

    public ContentStatus TrangThai { get; set; } = ContentStatus.Draft;

    public DateTime TaoLuc { get; set; } = DateTime.UtcNow;
    public DateTime CapNhatLuc { get; set; } = DateTime.UtcNow;
}
