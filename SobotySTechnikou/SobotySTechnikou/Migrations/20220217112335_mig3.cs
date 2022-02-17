using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SobotySTechnikou.Migrations
{
    public partial class mig3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "6ec7f5f7-26fe-4ad6-818f-5f5d7a23bd2e", "AQAAAAEAACcQAAAAEAa2C+lDulUBi8CEL/l0wHgTrf+CoapO3tw1lRREyV4+ipL1UFtqmJGFCWCt2AYvXQ==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
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
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "a5772053-ebb1-4117-824c-bc3a3764fcdb", "AQAAAAEAACcQAAAAEJusdsrqhmxjjZA6PjHV6A/9y9J/5Nz6lK4CI6FGYfOFywBKTr6updqney7L18ZSzg==" });
        }
    }
}
