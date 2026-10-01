namespace MyProject.API.DTOs;

public class AttendanceCheckInRequest
{
    public string Half { get; set; } = string.Empty;
}

public class AttendanceCheckOutRequest
{
    public string Half { get; set; } = string.Empty;
}

public class AttendanceSessionResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public string Half { get; set; } = string.Empty;
    public DateTime CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public int HoursWorkedMinutes { get; set; }
}

public class AdminAttendanceRecordDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string StaffName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Half { get; set; } = string.Empty;
    public DateTime CheckIn { get; set; }
    public DateTime? CheckOut { get; set; }
    public int HoursWorkedMinutes { get; set; }
}