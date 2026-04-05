namespace Sadec.Api.Entities;

public class DiaDiem
{
    public Guid MaSo { get; set; } = Guid.NewGuid();

    public string TieuDe { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;

    public string? MoTaNgan { get; set; }
    public string? NoiDung { get; set; }

    public string? AnhDaiDienUrl { get; set; }

    public int LuotXem { get; set; }

    public double? ViDo { get; set; }
    public double? KinhDo { get; set; }

    public ContentStatus TrangThai { get; set; } = ContentStatus.Draft;

    public DateTime TaoLuc { get; set; } = DateTime.UtcNow;
    public DateTime CapNhatLuc { get; set; } = DateTime.UtcNow;

    public ICollection<DiaDiemDanhMuc> DiaDiemDanhMucs { get; set; } = new List<DiaDiemDanhMuc>();
}
