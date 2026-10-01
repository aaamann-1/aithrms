using System.ComponentModel.DataAnnotations;

namespace MyProject.API.DTOs;

public class CreateEmployeeRequest
{
    // =========================================================
    // REQUIRED PERSONAL INFORMATION
    // =========================================================

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string EmployeeName { get; set; } = string.Empty;

    public string? FatherName { get; set; }

    public string? MotherName { get; set; }

    [Required]
    public string Gender { get; set; } = string.Empty;

    // Optional
    public string? DateOfBirth { get; set; }

    // Optional
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


    // =========================================================
    // REQUIRED EMPLOYEE INFORMATION
    // =========================================================

    [Required]
    public string Department { get; set; } = string.Empty;

    [Required]
    public string Designation { get; set; } = string.Empty;

    [Required]
    public string JoiningDate { get; set; } = string.Empty;


    // =========================================================
    // CURRENT ADDRESS
    // All fields are OPTIONAL because there is no * in HTML.
    // =========================================================

    public string? CurrentAddress { get; set; }

    public string? CurrentCountry { get; set; }

    public string? CurrentState { get; set; }

    public string? CurrentCity { get; set; }

    public string? CurrentPincode { get; set; }


    // =========================================================
    // PERMANENT ADDRESS
    // All fields are OPTIONAL because there is no * in HTML.
    // =========================================================

    public string? PermanentAddress { get; set; }

    public string? PermanentCountry { get; set; }

    public string? PermanentState { get; set; }

    public string? PermanentCity { get; set; }

    public string? PermanentPincode { get; set; }


    // =========================================================
    // EMERGENCY CONTACT
    // All fields are OPTIONAL because there is no * in HTML.
    // =========================================================

    public string? EmergencyContact { get; set; }

    public string? EmergencyMobile { get; set; }

    public string? EmergencyRelation { get; set; }
}