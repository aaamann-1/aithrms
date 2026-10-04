namespace MyProject.API.DTOs;

public class IndividualReportDto
{
    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string PersonalEmail { get; set; } = string.Empty;

    public string MobileNumber { get; set; } = string.Empty;

    public string? Department { get; set; }

    public string? Designation { get; set; }

    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public int TotalAttendanceRecords { get; set; }

    public int TotalHoursWorkedMinutes { get; set; }

    public List<AttendanceReportItemDto> Attendance { get; set; } = new();
}


public class AttendanceReportItemDto
{
    public DateTime Date { get; set; }

    public string Half { get; set; } = string.Empty;

    public DateTime CheckIn { get; set; }

    public DateTime? CheckOut { get; set; }

    public int HoursWorkedMinutes { get; set; }
}