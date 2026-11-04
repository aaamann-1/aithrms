using Microsoft.EntityFrameworkCore;
using MyProject.API.Data;
using MyProject.API.DTOs;

namespace MyProject.API.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;

    public ReportService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IndividualReportDto?> GetIndividualReportAsync(
        int employeeId,
        DateTime fromDate,
        DateTime toDate)
    {
        var employee = await _context.Employees
            .AsNoTracking()
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (employee == null || employee.User == null || !employee.UserId.HasValue)
        {
            return null;
        }

        // PostgreSQL timestamp with time zone requires UTC DateTime values.
        var from = DateTime.SpecifyKind(
            fromDate.Date,
            DateTimeKind.Utc);

        var to = DateTime.SpecifyKind(
            toDate.Date.AddDays(1),
            DateTimeKind.Utc);

        var attendances = await _context.Attendances
            .AsNoTracking()
            .Where(a =>
                a.UserId == employee.UserId.Value &&
                a.Date >= from &&
                a.Date < to)
            .OrderBy(a => a.Date)
            .ToListAsync();

        return new IndividualReportDto
        {
            EmployeeId = employee.Id,

            EmployeeName = employee.EmployeeName,

            Title = employee.Title,

            PersonalEmail = employee.PersonalEmail,

            MobileNumber = employee.MobileNumber,

            Department = employee.Department,

            Designation = employee.Designation,

            FromDate = fromDate.Date,

            ToDate = toDate.Date,

            TotalAttendanceRecords = attendances.Count,

            TotalHoursWorkedMinutes =
                attendances.Sum(a => a.HoursWorkedMinutes),

            Attendance = attendances
                .Select(a => new AttendanceReportItemDto
                {
                    Date = a.Date,

                    Half = a.Half,

                    CheckIn = a.CheckIn,

                    CheckOut = a.CheckOut,

                    HoursWorkedMinutes =
                        a.HoursWorkedMinutes
                })
                .ToList()
        };
    }

    public async Task<TeamReportDto> GetTeamReportAsync(
        DateTime fromDate,
        DateTime toDate)
    {
        var employees = await _context.Employees
            .AsNoTracking()
            .Include(e => e.User)
            .Where(e => e.User != null && e.UserId.HasValue)
            .OrderBy(e => e.EmployeeName)
            .ToListAsync();

        var userIds = employees
            .Select(e => e.UserId!.Value)
            .ToList();

        // PostgreSQL timestamp with time zone requires UTC DateTime values.
        var from = DateTime.SpecifyKind(
            fromDate.Date,
            DateTimeKind.Utc);

        var to = DateTime.SpecifyKind(
            toDate.Date.AddDays(1),
            DateTimeKind.Utc);

        var attendances = await _context.Attendances
            .AsNoTracking()
            .Where(a =>
                userIds.Contains(a.UserId) &&
                a.Date >= from &&
                a.Date < to)
            .ToListAsync();

        var employeeReports = employees
            .Select(employee =>
            {
                var employeeAttendances = attendances
                    .Where(a =>
                        a.UserId == employee.UserId!.Value)
                    .ToList();

                return new TeamEmployeeReportDto
                {
                    EmployeeId = employee.Id,

                    EmployeeName = employee.EmployeeName,

                    Department = employee.Department,

                    Designation = employee.Designation,

                    TotalAttendanceRecords =
                        employeeAttendances.Count,

                    TotalHoursWorkedMinutes =
                        employeeAttendances.Sum(
                            a => a.HoursWorkedMinutes)
                };
            })
            .ToList();

        return new TeamReportDto
        {
            FromDate = fromDate.Date,

            ToDate = toDate.Date,

            TotalEmployees = employeeReports.Count,

            Employees = employeeReports
        };
    }
}