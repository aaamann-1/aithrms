namespace MyProject.API.Models;

public class Employee
{
    public int Id { get; set; }

    // Link to the staff login account
    public int? UserId { get; set; }
    public User? User { get; set; }

    // Personal details
    public string Title { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string? FatherName { get; set; }
    public string? MotherName { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string? DateOfBirth { get; set; }
    public string? BloodGroup { get; set; }

    // These create the staff login
    public string MobileNumber { get; set; } = string.Empty;
    public string PersonalEmail { get; set; } = string.Empty;

    public string? Nationality { get; set; }
    public string? MaritalStatus { get; set; }
    public string? SpouseName { get; set; }
    public string? AadhaarNumber { get; set; }
    public string? PanNumber { get; set; }
    public string? Religion { get; set; }

public string? Department { get; set; }
public string? Designation { get; set; }
public string? JoiningDate { get; set; }
    // Current address
    public string? CurrentAddress { get; set; }
    public string? CurrentCountry { get; set; }
    public string? CurrentState { get; set; }
    public string? CurrentCity { get; set; }
    public string? CurrentPincode { get; set; }

    // Permanent address
    public string? PermanentAddress { get; set; }
    public string? PermanentCountry { get; set; }
    public string? PermanentState { get; set; }
    public string? PermanentCity { get; set; }
    public string? PermanentPincode { get; set; }

    // Emergency contact
    public string? EmergencyContact { get; set; }
    public string? EmergencyMobile { get; set; }
    public string? EmergencyRelation { get; set; }
}