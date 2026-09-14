using System.ComponentModel.DataAnnotations;

namespace MyProject.API.DTOs;

public class CreateEmployeeRequest
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string EmployeeName { get; set; } = string.Empty;

    public string? FatherName { get; set; }

    public string? MotherName { get; set; }

    [Required]
    public string Gender { get; set; } = string.Empty;

    public string? DateOfBirth { get; set; }

    public string? BloodGroup { get; set; }

    [Required]
    public string MobileNumber { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string PersonalEmail { get; set; } = string.Empty;

    public string? Nationality { get; set; }

    public string? MaritalStatus { get; set; }

    public string? SpouseName { get; set; }

    public string? AadhaarNumber { get; set; }

    public string? PanNumber { get; set; }

    public string? Religion { get; set; }

    // Current address
    public string? CurrentAddress { get; set; }

    [Required]
    public string CurrentCountry { get; set; } = string.Empty;

    [Required]
    public string CurrentState { get; set; } = string.Empty;

    [Required]
    public string CurrentCity { get; set; } = string.Empty;

    [Required]
    public string CurrentPincode { get; set; } = string.Empty;

    // Permanent address
    public string? PermanentAddress { get; set; }

    [Required]
    public string PermanentCountry { get; set; } = string.Empty;

    [Required]
    public string PermanentState { get; set; } = string.Empty;

    [Required]
    public string PermanentCity { get; set; } = string.Empty;

    [Required]
    public string PermanentPincode { get; set; } = string.Empty;

    // Emergency
    public string? EmergencyContact { get; set; }

    public string? EmergencyMobile { get; set; }

    public string? EmergencyRelation { get; set; }
}