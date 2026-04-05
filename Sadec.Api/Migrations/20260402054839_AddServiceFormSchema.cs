using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadec.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceFormSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CauHinhBieuMauJson",
                table: "ThuTucDichVus",
                type: "nvarchar(max)",
                maxLength: 8000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CauHinhBieuMauJson",
                table: "ThuTucDichVus");
        }
    }
}
