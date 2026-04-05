namespace Sadec.Api.Entities;

public sealed class TinTucDanhMuc
{
    public Guid TinTucId { get; set; }
    public TinTuc TinTuc { get; set; } = null!;

    public Guid DanhMucId { get; set; }
    public DanhMuc DanhMuc { get; set; } = null!;
}
