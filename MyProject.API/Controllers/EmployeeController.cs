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
    // CREATE EMPLOYEE + STAFF LOGIN
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> CreateEmployee(
        [FromBody] CreateEmployeeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.EmployeeName) ||
            string.IsNullOrWhiteSpace(request.PersonalEmail) ||
            string.IsNullOrWhiteSpace(request.MobileNumber) ||
            string.IsNullOrWhiteSpace(request.Title))
        {
            return BadRequest(new
            {
                message = "Employee name, title, personal email, and mobile number are required."
            });
        }

        request.EmployeeName = request.EmployeeName.Trim();
        request.PersonalEmail = request.PersonalEmail.Trim().ToLower();
        request.MobileNumber = request.MobileNumber.Trim();
        request.Title = request.Title.Trim();

        bool emailExists = await _context.Users.AnyAsync(user =>
            user.Username.ToLower() == request.PersonalEmail);

        if (emailExists)
        {
            return BadRequest(new
            {
                message = "An account with this email already exists."
            });
        }

        bool mobileExists = await _context.Users.AnyAsync(user =>
            user.ContactNumber == request.MobileNumber);

        if (mobileExists)
        {
            return BadRequest(new
            {
                message = "An account with this mobile number already exists."
            });
        }

        var defaultStaffPassword =
            _configuration["DefaultStaff:Password"];

        if (string.IsNullOrWhiteSpace(defaultStaffPassword))
        {
            return StatusCode(500, new
            {
                message = "Default staff password is not configured in appsettings.json."
            });
        }

        var user = new User
        {
            FullName = $"{request.Title} {request.EmployeeName}".Trim(),
            Username = request.PersonalEmail,
            ContactNumber = request.MobileNumber,
            PasswordHash = defaultStaffPassword.StartsWith("$2")
                ? defaultStaffPassword
                : BCrypt.Net.BCrypt.HashPassword(defaultStaffPassword),
            Role = "Staff"
        };

        var employee = new Employee
        {
            User = user,

            Title = request.Title,
            EmployeeName = request.EmployeeName,
            FatherName = request.FatherName,
            MotherName = request.MotherName,
            Gender = request.Gender,
            DateOfBirth = request.DateOfBirth,
            BloodGroup = request.BloodGroup,
            MobileNumber = request.MobileNumber,
            PersonalEmail = request.PersonalEmail,
            Nationality = request.Nationality,
            MaritalStatus = request.MaritalStatus,
            SpouseName = request.SpouseName,
            AadhaarNumber = request.AadhaarNumber,
            PanNumber = request.PanNumber,
            Religion = request.Religion,
            Department = request.Department,
            Designation = request.Designation,
            JoiningDate = request.JoiningDate,

            CurrentAddress = request.CurrentAddress,
            CurrentCountry = request.CurrentCountry,
            CurrentState = request.CurrentState,
            CurrentCity = request.CurrentCity,
            CurrentPincode = request.CurrentPincode,

            PermanentAddress = request.PermanentAddress,
            PermanentCountry = request.PermanentCountry,
            PermanentState = request.PermanentState,
            PermanentCity = request.PermanentCity,
            PermanentPincode = request.PermanentPincode,

            EmergencyContact = request.EmergencyContact,
            EmergencyMobile = request.EmergencyMobile,
            EmergencyRelation = request.EmergencyRelation
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetEmployee),
            new { id = employee.Id },
            new
            {
                message = "Employee and staff login created successfully.",
                employeeId = employee.Id,
                loginUsername = user.Username,
                defaultPassword = defaultStaffPassword.StartsWith("$2") ? "staff@123" : defaultStaffPassword,
                role = user.Role
            });
    }

    // =========================================================
    // GET ONE EMPLOYEE PROFILE
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetEmployee(int id)
    {
        var employee = await _context.Employees
            .Where(employee => employee.Id == id)
            .Select(employee => new
            {
                employee.Id,
                employee.Title,
                employee.EmployeeName,
                employee.FatherName,
                employee.MotherName,
                employee.Gender,
                employee.DateOfBirth,
                employee.BloodGroup,
                employee.MobileNumber,
                employee.PersonalEmail,
                employee.Nationality,
                employee.MaritalStatus,
                employee.SpouseName,
                employee.AadhaarNumber,
                employee.PanNumber,
                employee.Religion,
                employee.Department,
                employee.Designation,
                employee.JoiningDate,

                employee.CurrentAddress,
                employee.CurrentCountry,
                employee.CurrentState,
                employee.CurrentCity,
                employee.CurrentPincode,

                employee.PermanentAddress,
                employee.PermanentCountry,
                employee.PermanentState,
                employee.PermanentCity,
                employee.PermanentPincode,

                employee.EmergencyContact,
                employee.EmergencyMobile,
                employee.EmergencyRelation
            })
            .FirstOrDefaultAsync();

        if (employee is null)
        {
            return NotFound(new { message = "Employee profile not found." });
        }

        return Ok(employee);
    }

    // =========================================================
    // GET ALL STAFF FOR EMPLOYEE LIST
    // Reads from Users, so old staff accounts also appear.
    // =========================================================


[HttpGet]
public async Task<IActionResult> GetEmployees()
{
    var staffMembers = await _context.Users
        .AsNoTracking()
        .Where(user => user.Role == "Staff")
        .OrderBy(user => user.FullName)
        .Select(user => new
        {
            id = user.Id,

            title = user.Employee != null
                ? user.Employee.Title
                : "",

            employeeName = user.Employee != null
                ? user.Employee.EmployeeName
                : user.FullName,

            personalEmail = user.Employee != null
                ? user.Employee.PersonalEmail
                : user.Username,

            mobileNumber = user.Employee != null
                ? user.Employee.MobileNumber
                : user.ContactNumber,

            designation = user.Employee != null
                ? user.Employee.Designation
                : "Not added",

            status = "Active",

            fatherName = user.Employee != null ? user.Employee.FatherName : "",
            motherName = user.Employee != null ? user.Employee.MotherName : "",
            gender = user.Employee != null ? user.Employee.Gender : "",
            dateOfBirth = user.Employee != null ? user.Employee.DateOfBirth : "",
            bloodGroup = user.Employee != null ? user.Employee.BloodGroup : "",
            nationality = user.Employee != null ? user.Employee.Nationality : "",
            maritalStatus = user.Employee != null ? user.Employee.MaritalStatus : "",
            spouseName = user.Employee != null ? user.Employee.SpouseName : "",
            aadhaarNumber = user.Employee != null ? user.Employee.AadhaarNumber : "",
            panNumber = user.Employee != null ? user.Employee.PanNumber : "",
            religion = user.Employee != null ? user.Employee.Religion : "",

            currentAddress = user.Employee != null ? user.Employee.CurrentAddress : "",
            currentCountry = user.Employee != null ? user.Employee.CurrentCountry : "",
            currentState = user.Employee != null ? user.Employee.CurrentState : "",
            currentCity = user.Employee != null ? user.Employee.CurrentCity : "",
            currentPincode = user.Employee != null ? user.Employee.CurrentPincode : "",

            permanentAddress = user.Employee != null ? user.Employee.PermanentAddress : "",
            permanentCountry = user.Employee != null ? user.Employee.PermanentCountry : "",
            permanentState = user.Employee != null ? user.Employee.PermanentState : "",
            permanentCity = user.Employee != null ? user.Employee.PermanentCity : "",
            permanentPincode = user.Employee != null ? user.Employee.PermanentPincode : "",

            emergencyContact = user.Employee != null ? user.Employee.EmergencyContact : "",
            emergencyMobile = user.Employee != null ? user.Employee.EmergencyMobile : "",
            emergencyRelation = user.Employee != null ? user.Employee.EmergencyRelation : ""
        })
        .ToListAsync();

    Console.WriteLine($"STAFF FOUND IN USERS TABLE: {staffMembers.Count}");

    return Ok(staffMembers);
}


    // =========================================================
    // DELETE EMPLOYEE PROFILE AND/OR STAFF LOGIN
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var employee = await _context.Employees
            .Include(employee => employee.User)
            .FirstOrDefaultAsync(employee => employee.Id == id);

        if (employee is not null)
        {
            _context.Employees.Remove(employee);

            if (employee.User is not null)
            {
                _context.Users.Remove(employee.User);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Employee profile and staff login deleted successfully."
            });
        }

        // Supports older staff users that do not yet have an Employee record.
        var staffUser = await _context.Users
            .FirstOrDefaultAsync(user =>
                user.Id == id &&
                user.Role.ToLower() == "staff");

        if (staffUser is null)
        {
            return NotFound(new { message = "Employee not found." });
        }

        _context.Users.Remove(staffUser);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Staff login deleted successfully."
        });
    }
}