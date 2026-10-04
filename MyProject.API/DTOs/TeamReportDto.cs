namespace MyProject.API.DTOs;

public class TeamReportDto
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public int TotalEmployees { get; set; }

    public List<TeamEmployeeReportDto> Employees { get; set; } = new();
}


public class TeamEmployeeReportDto
{
    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = string.Empty;

    public string? Department { get; set; }

    public string? Designation { get; set; }

    public int TotalAttendanceRecords { get; set; }

    public int TotalHoursWorkedMinutes { get; set; }
}