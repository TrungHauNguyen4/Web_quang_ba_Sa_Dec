namespace Sadec.Api.Entities;

public sealed class CaiDatHeThong
{
    public Guid MaSo { get; set; } = Guid.NewGuid();

    public string Khoa { get; set; } = string.Empty;
    public string GiaTri { get; set; } = string.Empty;

    public DateTime CapNhatLuc { get; set; } = DateTime.UtcNow;
}
