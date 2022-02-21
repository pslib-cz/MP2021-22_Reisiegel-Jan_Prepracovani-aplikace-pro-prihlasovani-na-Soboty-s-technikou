using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SobotySTechnikou.Migrations
{
    public partial class mig4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MinimalYear",
                table: "Groups",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Groups",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NoteForLectors",
                table: "Groups",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfLectors",
                table: "Groups",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                column: "ConcurrencyStamp",
                value: "b3afd876-80e9-4e9e-af06-4d973479e95f");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
                column: "ConcurrencyStamp",
                value: "3f764a10-1be6-4195-9f3d-c8dec53a2bd2");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                columns: new[] { "BirthDate", "ConcurrencyStamp", "NormalizedUserName", "PasswordHash" },
                values: new object[] { "21.02.2022 0:00:00", "b6dd7077-fdd9-47dc-bc2d-78b8d2eba1f6", "SOBOTA@PSLIB.CZ", "AQAAAAEAACcQAAAAEB2IXVLSmtQIdcQItLa2KvbIvkRvn8BaPfoZIKDSrQ2PANtnWElfqcVf21F0yLk4pQ==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MinimalYear",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "NoteForLectors",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "NumberOfLectors",
                table: "Groups");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                column: "ConcurrencyStamp",
                value: "3c80e263-7f46-42d0-a26c-0df0864fd7f8");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
                column: "ConcurrencyStamp",
                value: "04bb29a9-a82a-4e86-96e1-9b3e30fb6dc3");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                columns: new[] { "BirthDate", "ConcurrencyStamp", "NormalizedUserName", "PasswordHash" },
                values: new object[] { "17.02.2022 0:00:00", "6ec7f5f7-26fe-4ad6-818f-5f5d7a23bd2e", "INFO@MY-GALLERY.EU", "AQAAAAEAACcQAAAAEAa2C+lDulUBi8CEL/l0wHgTrf+CoapO3tw1lRREyV4+ipL1UFtqmJGFCWCt2AYvXQ==" });
        }
    }
}
