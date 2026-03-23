namespace Sadec.Api.Entities;

public sealed class MediaFile
{
    public Guid MaSo { get; set; } = Guid.NewGuid();

    public string Url { get; set; } = string.Empty;
    public string TenTep { get; set; } = string.Empty;

    public long? KichThuocBytes { get; set; }
    public string? LoaiNoiDung { get; set; }

    public Guid? NguoiTaiLenId { get; set; }
    public NguoiDung? NguoiTaiLen { get; set; }

    public DateTime TaoLuc { get; set; } = DateTime.UtcNow;
}
