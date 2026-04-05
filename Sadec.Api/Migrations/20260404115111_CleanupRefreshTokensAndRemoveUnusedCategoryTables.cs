using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadec.Api.Migrations
{
    /// <inheritdoc />
    public partial class CleanupRefreshTokensAndRemoveUnusedCategoryTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiaDiemDanhMucs");

            migrationBuilder.DropTable(
                name: "TinTucDanhMucs");

            migrationBuilder.DropTable(
                name: "DanhMucs");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_ExpiresAt",
                table: "RefreshTokens",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_RevokedAt",
                table: "RefreshTokens",
                column: "RevokedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RefreshTokens_ExpiresAt",
                table: "RefreshTokens");

            migrationBuilder.DropIndex(
                name: "IX_RefreshTokens_RevokedAt",
                table: "RefreshTokens");

            migrationBuilder.CreateTable(
                name: "DanhMucs",
                columns: table => new
                {
                    MaSo = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CapNhatLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DuongDan = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    TaoLuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Ten = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhMucs", x => x.MaSo);
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
                name: "IX_TinTucDanhMucs_DanhMucId",
                table: "TinTucDanhMucs",
                column: "DanhMucId");
        }
    }
}
