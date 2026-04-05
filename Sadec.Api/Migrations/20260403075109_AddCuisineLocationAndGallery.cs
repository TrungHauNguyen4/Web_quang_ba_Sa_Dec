using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadec.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCuisineLocationAndGallery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AnhBoSungJson",
                table: "MonAns",
                type: "nvarchar(max)",
                maxLength: 8000,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "KinhDo",
                table: "MonAns",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ViDo",
                table: "MonAns",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnhBoSungJson",
                table: "MonAns");

            migrationBuilder.DropColumn(
                name: "KinhDo",
                table: "MonAns");

            migrationBuilder.DropColumn(
                name: "ViDo",
                table: "MonAns");
        }
    }
}
