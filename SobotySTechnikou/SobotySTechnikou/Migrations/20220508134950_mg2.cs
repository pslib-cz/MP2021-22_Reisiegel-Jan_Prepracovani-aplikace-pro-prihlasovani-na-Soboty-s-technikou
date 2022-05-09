using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SobotySTechnikou.Migrations
{
    public partial class mg2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Actions",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-AKCE-XXXX-XXXXXXXXXXXX",
                columns: new[] { "CreatedAt", "End", "Start", "UpdatedAt" },
                values: new object[] { new DateTime(2022, 5, 8, 15, 49, 47, 772, DateTimeKind.Local).AddTicks(6647), new DateTime(2022, 5, 9, 15, 49, 47, 772, DateTimeKind.Local).AddTicks(6642), new DateTime(2022, 5, 8, 15, 49, 47, 772, DateTimeKind.Local).AddTicks(6634), new DateTime(2022, 5, 8, 15, 49, 47, 772, DateTimeKind.Local).AddTicks(6651) });

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1");

            migrationBuilder.InsertData(
                table: "AspNetRoleClaims",
                columns: new[] { "Id", "ClaimType", "ClaimValue", "RoleId" },
                values: new object[] { 3, "lector", "1", "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2" });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                column: "ConcurrencyStamp",
                value: "ff4704cf-d922-41c9-8465-6bf4a1e85de1");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
                column: "ConcurrencyStamp",
                value: "0471a2f2-5811-4bc8-82af-e6e043edc3aa");

            migrationBuilder.InsertData(
                table: "AspNetUserClaims",
                columns: new[] { "Id", "ClaimType", "ClaimValue", "UserId" },
                values: new object[] { 2, "lector", "1", "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                columns: new[] { "BirthDate", "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "08.05.2022 0:00:00", "8350a1a1-acf3-48c7-8270-cc58159f0279", "AQAAAAEAACcQAAAAEJ38SUjWupm6uDMcjA9kbHUBA8ePF+0C9VvF58rt3ZgfTt2vFOxIPmUHT4VNQ3bV+Q==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "AspNetUserClaims",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.UpdateData(
                table: "Actions",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-AKCE-XXXX-XXXXXXXXXXXX",
                columns: new[] { "CreatedAt", "End", "Start", "UpdatedAt" },
                values: new object[] { new DateTime(2022, 4, 2, 15, 59, 22, 648, DateTimeKind.Local).AddTicks(9882), new DateTime(2022, 4, 3, 15, 59, 22, 648, DateTimeKind.Local).AddTicks(9879), new DateTime(2022, 4, 2, 15, 59, 22, 648, DateTimeKind.Local).AddTicks(9875), new DateTime(2022, 4, 2, 15, 59, 22, 648, DateTimeKind.Local).AddTicks(9884) });

            migrationBuilder.UpdateData(
                table: "AspNetRoleClaims",
                keyColumn: "Id",
                keyValue: 2,
                column: "RoleId",
                value: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                column: "ConcurrencyStamp",
                value: "3382a2d1-a04f-414a-8cb8-d6a33e3073f4");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
                column: "ConcurrencyStamp",
                value: "9e42bb0c-111f-4da0-aa50-aea7b47898ca");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                columns: new[] { "BirthDate", "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "02.04.2022 0:00:00", "0604fd87-035d-4276-863d-62731004b74a", "AQAAAAEAACcQAAAAEBNfxcGw+z9Kd81zmnQRiykubZHngfdtjozHd8lWoTY2RX1XNnQLMMKwoeAZcuvPGQ==" });
        }
    }
}
