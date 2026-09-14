using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MyProject.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserEmployeeAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: false),
                    EmployeeName = table.Column<string>(type: "text", nullable: false),
                    FatherName = table.Column<string>(type: "text", nullable: true),
                    MotherName = table.Column<string>(type: "text", nullable: true),
                    Gender = table.Column<string>(type: "text", nullable: false),
                    DateOfBirth = table.Column<string>(type: "text", nullable: true),
                    BloodGroup = table.Column<string>(type: "text", nullable: true),
                    MobileNumber = table.Column<string>(type: "text", nullable: false),
                    PersonalEmail = table.Column<string>(type: "text", nullable: false),
                    Nationality = table.Column<string>(type: "text", nullable: true),
                    MaritalStatus = table.Column<string>(type: "text", nullable: true),
                    SpouseName = table.Column<string>(type: "text", nullable: true),
                    AadhaarNumber = table.Column<string>(type: "text", nullable: true),
                    PanNumber = table.Column<string>(type: "text", nullable: true),
                    Religion = table.Column<string>(type: "text", nullable: true),
                    CurrentAddress = table.Column<string>(type: "text", nullable: true),
                    CurrentCountry = table.Column<string>(type: "text", nullable: true),
                    CurrentState = table.Column<string>(type: "text", nullable: true),
                    CurrentCity = table.Column<string>(type: "text", nullable: true),
                    CurrentPincode = table.Column<string>(type: "text", nullable: true),
                    PermanentAddress = table.Column<string>(type: "text", nullable: true),
                    PermanentCountry = table.Column<string>(type: "text", nullable: true),
                    PermanentState = table.Column<string>(type: "text", nullable: true),
                    PermanentCity = table.Column<string>(type: "text", nullable: true),
                    PermanentPincode = table.Column<string>(type: "text", nullable: true),
                    EmergencyContact = table.Column<string>(type: "text", nullable: true),
                    EmergencyMobile = table.Column<string>(type: "text", nullable: true),
                    EmergencyRelation = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Employees_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employees_MobileNumber",
                table: "Employees",
                column: "MobileNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_PersonalEmail",
                table: "Employees",
                column: "PersonalEmail",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_UserId",
                table: "Employees",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
