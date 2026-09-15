using System.ComponentModel.DataAnnotations;

namespace MyProject.API.DTOs;

public class LoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string ContactNumber { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    public int? EmployeeId { get; set; }
    public string? Department { get; set; }
    public string? Designation { get; set; }
    public string? JoiningDate { get; set; }
}