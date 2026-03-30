namespace Sadec.Api.Entities;

public sealed class NguoiDung
{
    public Guid MaSo { get; set; } = Guid.NewGuid();

    public string TenHienThi { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // Chưa implement auth; để sẵn cho tương lai.
    public string? MatKhauHash { get; set; }

    public string VaiTro { get; set; } = "Viewer"; // Admin | Editor | Viewer

    public DateTime? HoatDongGanNhatLuc { get; set; }

    public DateTime TaoLuc { get; set; } = DateTime.UtcNow;
    public DateTime CapNhatLuc { get; set; } = DateTime.UtcNow;

    public ICollection<TinTuc> TinTucs { get; set; } = new List<TinTuc>();
}
