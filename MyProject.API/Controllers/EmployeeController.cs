using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using MyProject.API.Data;
using MyProject.API.DTOs;
using MyProject.API.Models;

namespace MyProject.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class EmployeeController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public EmployeeController(
        ApplicationDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // =========================================================
    // CREATE EMPLOYEE
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> CreateEmployee(
        CreateEmployeeRequest request)
    {
        // -----------------------------------------------------
        // Clean input
        // -----------------------------------------------------

        request.EmployeeName =
            request.EmployeeName.Trim();

        request.PersonalEmail =
            request.PersonalEmail.Trim();

        request.MobileNumber =
            request.MobileNumber.Trim();

        request.Title =
            request.Title.Trim();

        // -----------------------------------------------------
        // Check email
        // -----------------------------------------------------

        bool emailExists = await _context.Users
            .AnyAsync(user =>
                user.Username.ToLower() ==
                request.PersonalEmail.ToLower());

        if (emailExists)
        {
            return BadRequest(new
            {
                message =
                    "An account with this email already exists."
            });
        }

        // -----------------------------------------------------
        // Check mobile
        // -----------------------------------------------------

        bool mobileExists = await _context.Users
            .AnyAsync(user =>
                user.ContactNumber ==
                request.MobileNumber);

        if (mobileExists)
        {
            return BadRequest(new
            {
                message =
                    "An account with this mobile number already exists."
            });
        }

        // -----------------------------------------------------
        // Get common staff password
        // -----------------------------------------------------

        var staffPassword =
            _configuration["DefaultStaff:Password"];

        if (string.IsNullOrWhiteSpace(staffPassword))
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "Default staff password is not configured."
                });
        }

        // -----------------------------------------------------
        // Create User
        // -----------------------------------------------------

        var user = new User
        {
            FullName =
                $"{request.Title} {request.EmployeeName}".Trim(),

            Username =
                request.PersonalEmail,

            ContactNumber =
                request.MobileNumber,

            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    staffPassword),

            Role = "Staff"
        };

        // -----------------------------------------------------
        // Create Employee
        // -----------------------------------------------------

        var employee = new Employee
        {
            User = user,

            Title =
                request.Title,

            EmployeeName =
                request.EmployeeName,

            FatherName =
                request.FatherName,

            MotherName =
                request.MotherName,

            Gender =
                request.Gender,

            DateOfBirth =
                request.DateOfBirth,

            BloodGroup =
                request.BloodGroup,

            MobileNumber =
                request.MobileNumber,

            PersonalEmail =
                request.PersonalEmail,

            Nationality =
                request.Nationality,

            MaritalStatus =
                request.MaritalStatus,

            SpouseName =
                request.SpouseName,

            AadhaarNumber =
                request.AadhaarNumber,

            PanNumber =
                request.PanNumber,

            Religion =
                request.Religion,

            // Current address
            CurrentAddress =
                request.CurrentAddress,

            CurrentCountry =
                request.CurrentCountry,

            CurrentState =
                request.CurrentState,

            CurrentCity =
                request.CurrentCity,

            CurrentPincode =
                request.CurrentPincode,

            // Permanent address
            PermanentAddress =
                request.PermanentAddress,

            PermanentCountry =
                request.PermanentCountry,

            PermanentState =
                request.PermanentState,

            PermanentCity =
                request.PermanentCity,

            PermanentPincode =
                request.PermanentPincode,

            // Emergency
            EmergencyContact =
                request.EmergencyContact,

            EmergencyMobile =
                request.EmergencyMobile,

            EmergencyRelation =
                request.EmergencyRelation
        };

        // -----------------------------------------------------
        // Save both
        // -----------------------------------------------------

       _context.Users.Add(user);


_context.Employees.Add(employee);

await _context.SaveChangesAsync();

        // -----------------------------------------------------
        // Response
        // -----------------------------------------------------

        return CreatedAtAction(
            nameof(GetEmployee),
            new
            {
                id = employee.Id
            },
            new
            {
                message = "Employee created successfully.",

                employeeId = employee.Id,

                loginUsername = user.Username,

                loginMobile = user.ContactNumber,

                role = user.Role
            });
    }

    // =========================================================
    // GET EMPLOYEE
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetEmployee(int id)
    {
        var employee = await _context.Employees
            .Include(employee => employee.User)
            .FirstOrDefaultAsync(employee =>
                employee.Id == id);

        if (employee is null)
        {
            return NotFound(new
            {
                message = "Employee not found."
            });
        }

        return Ok(employee);
    }

    // =========================================================
    // GET ALL EMPLOYEES
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
        var employees = await _context.Employees
            .Include(employee => employee.User)
            .OrderBy(employee => employee.EmployeeName)
            .ToListAsync();

        return Ok(employees);
    }

    // =========================================================
    // DELETE EMPLOYEE
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var employee = await _context.Employees
            .Include(employee => employee.User)
            .FirstOrDefaultAsync(employee =>
                employee.Id == id);

        if (employee is null)
        {
            return NotFound(new
            {
                message = "Employee not found."
            });
        }

        if (employee.User != null)
        {
            _context.Users.Remove(employee.User);
        }

        _context.Employees.Remove(employee);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Employee deleted successfully."
        });
    }
}