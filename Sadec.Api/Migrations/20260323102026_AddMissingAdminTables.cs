using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadec.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingAdminTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AnhDaiDienUrl",
                table: "TinTucs",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LuotXem",
                table: "TinTucs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "TacGiaId",
                table: "TinTucs",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AnhDaiDienUrl",
                table: "DiaDiems",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LuotXem",
                table: "DiaDiems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "CaiDatHeThongs",
                columns: table => new
                {
                    MaSo = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Khoa = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    GiaTri = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    CapNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CaiDatHeThongs", x => x.MaSo);
                });

            migrationBuilder.CreateTable(
                name: "DanhMucs",
                columns: table => new
                {
                    MaSo = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Ten = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    DuongDan = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    TaoLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CapNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhMucs", x => x.MaSo);
                });

            migrationBuilder.CreateTable(
                name: "HoSoDichVus",
                columns: table => new
                {
                    MaHoSo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TenThuTuc = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    NguoiNop = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    NgayNopLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DiaChi = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    GhiChu = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CapNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoSoDichVus", x => x.MaHoSo);
                });

            migrationBuilder.CreateTable(
                name: "MonAns",
                columns: table => new
                {
                    MaSo = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TieuDe = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DuongDan = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    PhanLoai = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    AnhDaiDienUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TaoLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CapNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonAns", x => x.MaSo);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDungs",
                columns: table => new
                {
                    MaSo = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenHienThi = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    MatKhauHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    VaiTro = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    HoatDongGanNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TaoLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CapNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDungs", x => x.MaSo);
                });

            migrationBuilder.CreateTable(
                name: "ThuTucDichVus",
                columns: table => new
                {
                    MaSo = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Ten = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    TaoLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CapNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThuTucDichVus", x => x.MaSo);
                });

            migrationBuilder.CreateTable(
                name: "DiaDiemDanhMucs",
                columns: table => new
                {
                    DiaDiemId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DanhMucId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiaDiemDanhMucs", x => new { x.DiaDiemId, x.DanhMucId });
                    table.ForeignKey(
                        name: "FK_DiaDiemDanhMucs_DanhMucs_DanhMucId",
                        column: x => x.DanhMucId,
                        principalTable: "DanhMucs",
                        principalColumn: "MaSo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiaDiemDanhMucs_DiaDiems_DiaDiemId",
                        column: x => x.DiaDiemId,
                        principalTable: "DiaDiems",
                        principalColumn: "MaSo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TinTucDanhMucs",
                columns: table => new
                {
                    TinTucId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DanhMucId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TinTucDanhMucs", x => new { x.TinTucId, x.DanhMucId });
                    table.ForeignKey(
                        name: "FK_TinTucDanhMucs_DanhMucs_DanhMucId",
                        column: x => x.DanhMucId,
                        principalTable: "DanhMucs",
                        principalColumn: "MaSo",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TinTucDanhMucs_TinTucs_TinTucId",
                        column: x => x.TinTucId,
                        principalTable: "TinTucs",
                        principalColumn: "MaSo",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BinhLuans",
                columns: table => new
                {
                    MaSo = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenNguoiGui = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    TargetType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TargetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TrangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TaoLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NguoiDungId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BinhLuans", x => x.MaSo);
                    table.ForeignKey(
                        name: "FK_BinhLuans_NguoiDungs_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaSo",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "MediaFiles",
                columns: table => new
                {
                    MaSo = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    TenTep = table.Column<string>(type: "nvarchar(260)", maxLength: 260, nullable: false),
                    KichThuocBytes = table.Column<long>(type: "bigint", nullable: true),
                    LoaiNoiDung = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    NguoiTaiLenId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TaoLuc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaFiles", x => x.MaSo);
                    table.ForeignKey(
                        name: "FK_MediaFiles_NguoiDungs_NguoiTaiLenId",
                        column: x => x.NguoiTaiLenId,
                        principalTable: "NguoiDungs",
                        principalColumn: "MaSo",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TinTucs_TacGiaId",
                table: "TinTucs",
                column: "TacGiaId");

            migrationBuilder.CreateIndex(
                name: "IX_BinhLuans_NguoiDungId",
                table: "BinhLuans",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_BinhLuans_TargetType_TargetId",
                table: "BinhLuans",
                columns: new[] { "TargetType", "TargetId" });

            migrationBuilder.CreateIndex(
                name: "IX_CaiDatHeThongs_Khoa",
                table: "CaiDatHeThongs",
                column: "Khoa",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DanhMucs_DuongDan",
                table: "DanhMucs",
                column: "DuongDan",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DiaDiemDanhMucs_DanhMucId",
                table: "DiaDiemDanhMucs",
                column: "DanhMucId");

            migrationBuilder.CreateIndex(
                name: "IX_HoSoDichVus_TrangThai",
                table: "HoSoDichVus",
                column: "TrangThai");

            migrationBuilder.CreateIndex(
                name: "IX_MediaFiles_NguoiTaiLenId",
                table: "MediaFiles",
                column: "NguoiTaiLenId");

            migrationBuilder.CreateIndex(
                name: "IX_MonAns_DuongDan",
                table: "MonAns",
                column: "DuongDan",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDungs_Email",
                table: "NguoiDungs",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TinTucDanhMucs_DanhMucId",
                table: "TinTucDanhMucs",
                column: "DanhMucId");

            migrationBuilder.AddForeignKey(
                name: "FK_TinTucs_NguoiDungs_TacGiaId",
                table: "TinTucs",
                column: "TacGiaId",
                principalTable: "NguoiDungs",
                principalColumn: "MaSo",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TinTucs_NguoiDungs_TacGiaId",
                table: "TinTucs");

            migrationBuilder.DropTable(
                name: "BinhLuans");

            migrationBuilder.DropTable(
                name: "CaiDatHeThongs");

            migrationBuilder.DropTable(
                name: "DiaDiemDanhMucs");

            migrationBuilder.DropTable(
                name: "HoSoDichVus");

            migrationBuilder.DropTable(
                name: "MediaFiles");

            migrationBuilder.DropTable(
                name: "MonAns");

            migrationBuilder.DropTable(
                name: "ThuTucDichVus");

            migrationBuilder.DropTable(
                name: "TinTucDanhMucs");

            migrationBuilder.DropTable(
                name: "NguoiDungs");

            migrationBuilder.DropTable(
                name: "DanhMucs");

            migrationBuilder.DropIndex(
                name: "IX_TinTucs_TacGiaId",
                table: "TinTucs");

            migrationBuilder.DropColumn(
                name: "AnhDaiDienUrl",
                table: "TinTucs");

            migrationBuilder.DropColumn(
                name: "LuotXem",
                table: "TinTucs");

            migrationBuilder.DropColumn(
                name: "TacGiaId",
                table: "TinTucs");

            migrationBuilder.DropColumn(
                name: "AnhDaiDienUrl",
                table: "DiaDiems");

            migrationBuilder.DropColumn(
                name: "LuotXem",
                table: "DiaDiems");
        }
    }
}
