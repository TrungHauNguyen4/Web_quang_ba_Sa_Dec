namespace Sadec.Api.Entities;

public sealed class DanhMuc
{
    public Guid MaSo { get; set; } = Guid.NewGuid();

    public string Ten { get; set; } = string.Empty;
    public string DuongDan { get; set; } = string.Empty;

    public DateTime TaoLuc { get; set; } = DateTime.UtcNow;
    public DateTime CapNhatLuc { get; set; } = DateTime.UtcNow;

    public ICollection<TinTucDanhMuc> TinTucDanhMucs { get; set; } = new List<TinTucDanhMuc>();
    public ICollection<DiaDiemDanhMuc> DiaDiemDanhMucs { get; set; } = new List<DiaDiemDanhMuc>();
}
