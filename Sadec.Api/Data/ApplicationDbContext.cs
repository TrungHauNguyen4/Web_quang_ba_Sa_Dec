using Microsoft.EntityFrameworkCore;
using Sadec.Api.Entities;

namespace Sadec.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<TinTuc> TinTucs => Set<TinTuc>();
    public DbSet<DiaDiem> DiaDiems => Set<DiaDiem>();

    public DbSet<NguoiDung> NguoiDungs => Set<NguoiDung>();
    public DbSet<DanhMuc> DanhMucs => Set<DanhMuc>();
    public DbSet<TinTucDanhMuc> TinTucDanhMucs => Set<TinTucDanhMuc>();
    public DbSet<DiaDiemDanhMuc> DiaDiemDanhMucs => Set<DiaDiemDanhMuc>();

    public DbSet<MonAn> MonAns => Set<MonAn>();
    public DbSet<MediaFile> MediaFiles => Set<MediaFile>();
    public DbSet<BinhLuan> BinhLuans => Set<BinhLuan>();

    public DbSet<HoSoDichVu> HoSoDichVus => Set<HoSoDichVu>();
    public DbSet<ThuTucDichVu> ThuTucDichVus => Set<ThuTucDichVu>();

    public DbSet<CaiDatHeThong> CaiDatHeThongs => Set<CaiDatHeThong>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TinTuc>(entity =>
        {
            entity.HasKey(x => x.MaSo);
            entity.Property(x => x.TieuDe).HasMaxLength(200).IsRequired();
            entity.Property(x => x.DuongDan).HasMaxLength(200).IsRequired();
            entity.HasIndex(x => x.DuongDan).IsUnique();
            entity.Property(x => x.TrangThai).HasConversion<string>().HasMaxLength(20);
            entity.Property(x => x.MoTaNgan).HasMaxLength(500);

            entity.Property(x => x.AnhDaiDienUrl).HasMaxLength(1000);
            entity.Property(x => x.LuotXem).HasDefaultValue(0);

            entity.HasOne(x => x.TacGia)
                .WithMany(x => x.TinTucs)
                .HasForeignKey(x => x.TacGiaId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<DiaDiem>(entity =>
        {
            entity.HasKey(x => x.MaSo);
            entity.Property(x => x.TieuDe).HasMaxLength(200).IsRequired();
            entity.Property(x => x.DuongDan).HasMaxLength(200).IsRequired();
            entity.HasIndex(x => x.DuongDan).IsUnique();
            entity.Property(x => x.TrangThai).HasConversion<string>().HasMaxLength(20);
            entity.Property(x => x.MoTaNgan).HasMaxLength(500);

            entity.Property(x => x.AnhDaiDienUrl).HasMaxLength(1000);
            entity.Property(x => x.LuotXem).HasDefaultValue(0);
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(x => x.MaSo);
            entity.Property(x => x.TenHienThi).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(200).IsRequired();
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.MatKhauHash).HasMaxLength(500);
            entity.Property(x => x.VaiTro).HasMaxLength(20).IsRequired();
        });

        modelBuilder.Entity<DanhMuc>(entity =>
        {
            entity.HasKey(x => x.MaSo);
            entity.Property(x => x.Ten).HasMaxLength(120).IsRequired();
            entity.Property(x => x.DuongDan).HasMaxLength(120).IsRequired();
            entity.HasIndex(x => x.DuongDan).IsUnique();
        });

        modelBuilder.Entity<TinTucDanhMuc>(entity =>
        {
            entity.HasKey(x => new { x.TinTucId, x.DanhMucId });

            entity.HasOne(x => x.TinTuc)
                .WithMany(x => x.TinTucDanhMucs)
                .HasForeignKey(x => x.TinTucId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.DanhMuc)
                .WithMany(x => x.TinTucDanhMucs)
                .HasForeignKey(x => x.DanhMucId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DiaDiemDanhMuc>(entity =>
        {
            entity.HasKey(x => new { x.DiaDiemId, x.DanhMucId });

            entity.HasOne(x => x.DiaDiem)
                .WithMany(x => x.DiaDiemDanhMucs)
                .HasForeignKey(x => x.DiaDiemId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.DanhMuc)
                .WithMany(x => x.DiaDiemDanhMucs)
                .HasForeignKey(x => x.DanhMucId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<MonAn>(entity =>
        {
            entity.HasKey(x => x.MaSo);
            entity.Property(x => x.TieuDe).HasMaxLength(200).IsRequired();
            entity.Property(x => x.DuongDan).HasMaxLength(200).IsRequired();
            entity.HasIndex(x => x.DuongDan).IsUnique();
            entity.Property(x => x.PhanLoai).HasMaxLength(120);
            entity.Property(x => x.AnhDaiDienUrl).HasMaxLength(1000);
            entity.Property(x => x.MoTa).HasMaxLength(2000);
            entity.Property(x => x.TrangThai).HasConversion<string>().HasMaxLength(20);
        });

        modelBuilder.Entity<MediaFile>(entity =>
        {
            entity.HasKey(x => x.MaSo);
            entity.Property(x => x.Url).HasMaxLength(2000).IsRequired();
            entity.Property(x => x.TenTep).HasMaxLength(260).IsRequired();
            entity.Property(x => x.LoaiNoiDung).HasMaxLength(100);

            entity.HasOne(x => x.NguoiTaiLen)
                .WithMany()
                .HasForeignKey(x => x.NguoiTaiLenId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<BinhLuan>(entity =>
        {
            entity.HasKey(x => x.MaSo);
            entity.Property(x => x.TenNguoiGui).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(200).IsRequired();
            entity.Property(x => x.NoiDung).HasMaxLength(2000).IsRequired();
            entity.Property(x => x.TargetType).HasMaxLength(50).IsRequired();
            entity.Property(x => x.TrangThai).HasConversion<string>().HasMaxLength(20);
            entity.HasIndex(x => new { x.TargetType, x.TargetId });

            entity.HasOne(x => x.NguoiDung)
                .WithMany()
                .HasForeignKey(x => x.NguoiDungId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<HoSoDichVu>(entity =>
        {
            entity.HasKey(x => x.MaHoSo);
            entity.Property(x => x.MaHoSo).HasMaxLength(50).IsRequired();
            entity.Property(x => x.TenThuTuc).HasMaxLength(250).IsRequired();
            entity.Property(x => x.NguoiNop).HasMaxLength(250).IsRequired();
            entity.Property(x => x.TrangThai).HasMaxLength(20).IsRequired();
            entity.Property(x => x.SoDienThoai).HasMaxLength(30);
            entity.Property(x => x.Email).HasMaxLength(200);
            entity.Property(x => x.DiaChi).HasMaxLength(500);
            entity.Property(x => x.GhiChu).HasMaxLength(2000);

            entity.HasIndex(x => x.TrangThai);
        });

        modelBuilder.Entity<ThuTucDichVu>(entity =>
        {
            entity.HasKey(x => x.MaSo);
            entity.Property(x => x.Ten).HasMaxLength(250).IsRequired();
            entity.Property(x => x.MoTa).HasMaxLength(2000);
        });

        modelBuilder.Entity<CaiDatHeThong>(entity =>
        {
            entity.HasKey(x => x.MaSo);
            entity.Property(x => x.Khoa).HasMaxLength(120).IsRequired();
            entity.HasIndex(x => x.Khoa).IsUnique();
            entity.Property(x => x.GiaTri).HasMaxLength(4000).IsRequired();
        });
    }
}
