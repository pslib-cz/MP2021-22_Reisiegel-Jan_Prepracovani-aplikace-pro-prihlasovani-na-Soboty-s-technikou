using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SobotySTechnikou.Migrations
{
    public partial class mig2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                column: "ConcurrencyStamp",
                value: "be22da1b-0f9c-47c6-9251-e7105b6cb978");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
                column: "ConcurrencyStamp",
                value: "4c271216-1c75-45c7-a6ea-fd09400a48d9");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                columns: new[] { "BirthDate", "ConcurrencyStamp", "Gender", "PasswordHash", "Year" },
                values: new object[] { "17.02.2022 0:00:00", "a5772053-ebb1-4117-824c-bc3a3764fcdb", 0, "AQAAAAEAACcQAAAAEJusdsrqhmxjjZA6PjHV6A/9y9J/5Nz6lK4CI6FGYfOFywBKTr6updqney7L18ZSzg==", 4 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                column: "ConcurrencyStamp",
                value: "ec36a620-dd89-4cf9-8370-b2d155775019");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
                column: "ConcurrencyStamp",
                value: "f9ec8bd6-f3fc-4a94-9b90-5322bc157738");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                columns: new[] { "BirthDate", "ConcurrencyStamp", "Gender", "PasswordHash", "Year" },
                values: new object[] { "15.02.2022 0:00:00", "b05bd792-2475-4ff3-9ffb-b1818ff7c6a8", 2, "AQAAAAEAACcQAAAAEJBoC95wP/0KnV4bs3tZQANqb5XFfbMAfHlG2jciDheaXf4eXAtgN5Hg/IAx/cEcGQ==", 3 });
        }
    }
}
