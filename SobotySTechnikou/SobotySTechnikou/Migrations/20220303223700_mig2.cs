using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SobotySTechnikou.Migrations
{
    public partial class mig2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Actions",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-AKCE-XXXX-XXXXXXXXXXXX",
                columns: new[] { "CreatedAt", "End", "Start", "UpdatedAt" },
                values: new object[] { new DateTime(2022, 3, 3, 23, 37, 0, 13, DateTimeKind.Local).AddTicks(770), new DateTime(2022, 3, 4, 23, 37, 0, 13, DateTimeKind.Local).AddTicks(766), new DateTime(2022, 3, 3, 23, 37, 0, 13, DateTimeKind.Local).AddTicks(753), new DateTime(2022, 3, 3, 23, 37, 0, 13, DateTimeKind.Local).AddTicks(772) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                column: "ConcurrencyStamp",
                value: "bdfe687d-8c90-44aa-9960-fb6daf686160");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
                column: "ConcurrencyStamp",
                value: "609d3a5d-bbd0-48aa-b810-4d10867cd228");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "ac131dd7-4308-4d65-b9e5-2bdcbcfcadea", "AQAAAAEAACcQAAAAEM0VBC6dAZIgU3yLlmXcUQ8MWbXamVvD2ixVZFTadgdN8yjkq3GKII3Ji1DFgbFoVA==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Actions",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-AKCE-XXXX-XXXXXXXXXXXX",
                columns: new[] { "CreatedAt", "End", "Start", "UpdatedAt" },
                values: new object[] { new DateTime(2022, 3, 3, 20, 30, 8, 116, DateTimeKind.Local).AddTicks(1667), new DateTime(2022, 3, 4, 20, 30, 8, 116, DateTimeKind.Local).AddTicks(1663), new DateTime(2022, 3, 3, 20, 30, 8, 116, DateTimeKind.Local).AddTicks(1656), new DateTime(2022, 3, 3, 20, 30, 8, 116, DateTimeKind.Local).AddTicks(1669) });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX1",
                column: "ConcurrencyStamp",
                value: "068e1b23-e027-43a5-afa1-314dbf9093d2");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXX2",
                column: "ConcurrencyStamp",
                value: "0679668c-4799-4b36-a446-73e70cb54813");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "7b0dbeed-c7e6-4678-b5b5-8eeed029a58d", "AQAAAAEAACcQAAAAEDgKbLS0Iys5MfiZPFoRPng4PzRD0fc0iifStLgiBEOAMZGj2Yp8Bp84K+WFBWOqAg==" });
        }
    }
}
