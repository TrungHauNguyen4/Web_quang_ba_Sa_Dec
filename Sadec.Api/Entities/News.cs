namespace Sadec.Api.Entities;

public class TinTuc
{
    public Guid MaSo { get; set; } = Guid.NewGuid();

    public string TieuDe { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;

    public string? MoTaNgan { get; set; }
    public string? DanhMuc { get; set; }
    public string? NoiDung { get; set; }

    public string? AnhDaiDienUrl { get; set; }
    public string? VideoUrl { get; set; }

    public int LuotXem { get; set; }

    public Guid? TacGiaId { get; set; }
    public ApplicationUser? TacGia { get; set; }

    public ContentStatus TrangThai { get; set; } = ContentStatus.Draft;

    public DateTime? PhatHanhLuc { get; set; }

    public DateTime TaoLuc { get; set; } = DateTime.UtcNow;
    public DateTime CapNhatLuc { get; set; } = DateTime.UtcNow;
}
