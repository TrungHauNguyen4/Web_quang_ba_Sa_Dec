namespace Sadec.Api.Entities;

public sealed class DiaDiemDanhMuc
{
    public Guid DiaDiemId { get; set; }
    public DiaDiem DiaDiem { get; set; } = null!;

    public Guid DanhMucId { get; set; }
    public DanhMuc DanhMuc { get; set; } = null!;
}
