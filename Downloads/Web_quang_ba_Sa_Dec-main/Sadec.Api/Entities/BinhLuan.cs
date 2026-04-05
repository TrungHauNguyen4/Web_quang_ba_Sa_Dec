namespace Sadec.Api.Entities;

public sealed class BinhLuan
{
    public Guid MaSo { get; set; } = Guid.NewGuid();

    public string TenNguoiGui { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public string NoiDung { get; set; } = string.Empty;

    // Polymorphic target: TinTuc | DiaDiem | MonAn | ...
    public string TargetType { get; set; } = string.Empty;
    public Guid TargetId { get; set; }

    public CommentStatus TrangThai { get; set; } = CommentStatus.Pending;

    public DateTime TaoLuc { get; set; } = DateTime.UtcNow;

    public Guid? NguoiDungId { get; set; }
    public ApplicationUser? NguoiDung { get; set; }
}
