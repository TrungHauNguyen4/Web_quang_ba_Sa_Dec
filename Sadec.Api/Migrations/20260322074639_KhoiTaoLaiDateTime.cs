using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadec.Api.Migrations
{
    /// <inheritdoc />
    public partial class KhoiTaoLaiDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DiaDiems",
                columns: table => new
                {
                    MaSo = table.Column<Guid>(nullable: false),
                    TieuDe = table.Column<string>(maxLength: 200, nullable: false),
                    DuongDan = table.Column<string>(maxLength: 200, nullable: false),
                    MoTaNgan = table.Column<string>(maxLength: 500, nullable: true),
                    NoiDung = table.Column<string>(nullable: true),
                    ViDo = table.Column<double>(nullable: true),
                    KinhDo = table.Column<double>(nullable: true),
                    TrangThai = table.Column<string>(maxLength: 20, nullable: false),
                    TaoLuc = table.Column<DateTime>(nullable: false),
                    CapNhatLuc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiaDiems", x => x.MaSo);
                });

            migrationBuilder.CreateTable(
                name: "TinTucs",
                columns: table => new
                {
                    MaSo = table.Column<Guid>(nullable: false),
                    TieuDe = table.Column<string>(maxLength: 200, nullable: false),
                    DuongDan = table.Column<string>(maxLength: 200, nullable: false),
                    MoTaNgan = table.Column<string>(maxLength: 500, nullable: true),
                    NoiDung = table.Column<string>(nullable: true),
                    TrangThai = table.Column<string>(maxLength: 20, nullable: false),
                    PhatHanhLuc = table.Column<DateTime>(nullable: true),
                    TaoLuc = table.Column<DateTime>(nullable: false),
                    CapNhatLuc = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TinTucs", x => x.MaSo);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DiaDiems_DuongDan",
                table: "DiaDiems",
                column: "DuongDan",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TinTucs_DuongDan",
                table: "TinTucs",
                column: "DuongDan",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiaDiems");

            migrationBuilder.DropTable(
                name: "TinTucs");
        }
    }
}
