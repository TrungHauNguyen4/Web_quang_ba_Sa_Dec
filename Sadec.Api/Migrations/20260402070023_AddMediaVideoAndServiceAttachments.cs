using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadec.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaVideoAndServiceAttachments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "TinTucs",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "MonAns",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TepDinhKemJson",
                table: "HoSoDichVus",
                type: "nvarchar(max)",
                maxLength: 8000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "DiaDiems",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "TinTucs");

            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "MonAns");

            migrationBuilder.DropColumn(
                name: "TepDinhKemJson",
                table: "HoSoDichVus");

            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "DiaDiems");
        }
    }
}
