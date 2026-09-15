using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using MyProject.API.Data;
using MyProject.API.DTOs;
using MyProject.API.Models;
using MyProject.API.Settings;

namespace MyProject.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtSettings _jwtSettings;

    private static readonly string[] AllowedRoles =
    {
        "Admin",
        "Staff"
    };

    public AuthController(
        ApplicationDbContext context,
        IOptions<JwtSettings> jwtOptions)
    {
        _context = context;
        _jwtSettings = jwtOptions.Value;
    }

    // =========================================================
    // LOGIN
    // =========================================================

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        request.Username = request.Username.Trim();
        request.ContactNumber = request.ContactNumber.Trim();
        request.Role = request.Role.Trim();

        if (!AllowedRoles.Contains(
                request.Role,
                StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message = "Role must be Admin or Staff."
            });
        }

       var user = await _context.Users
    .Include(user => user.Employee)
    .FirstOrDefaultAsync(user =>
        user.Username.ToLower() ==
            request.Username.ToLower() &&
        user.ContactNumber ==
            request.ContactNumber &&
        user.Role.ToLower() ==
            request.Role.ToLower());


        if (user is null)
        {
            return Unauthorized(new
            {
                message =
                    "Invalid username, contact number, password, or role."
            });
        }

        bool passwordValid =
            BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash);

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                message =
                    "Invalid username, contact number, password, or role."
            });
        }


return Ok(new AuthResponse
{
    Token = CreateToken(user),
    Username = user.Username,
    FullName = user.FullName,
    ContactNumber = user.ContactNumber,
    Role = user.Role,

    EmployeeId = user.Employee?.Id,
    Department = user.Employee?.Department,
    Designation = user.Employee?.Designation,
    JoiningDate = user.Employee?.JoiningDate
});
    }



    // =========================================================
    // CREATE JWT TOKEN
    // =========================================================

    private string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()),

            new Claim(
                ClaimTypes.Name,
                user.Username),

            new Claim(
                ClaimTypes.Role,
                user.Role),

            new Claim(
                "fullName",
                user.FullName),

            new Claim(
                "contactNumber",
                user.ContactNumber)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.Key));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                _jwtSettings.ExpiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}