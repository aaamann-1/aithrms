using Microsoft.EntityFrameworkCore;
using MyProject.API.Data;
using MyProject.API.DTOs;
using MyProject.API.Models;

namespace MyProject.API.Services;

public class AttendanceService : IAttendanceService
{
    private readonly ApplicationDbContext _context;

    private static readonly TimeZoneInfo IndiaTimeZone =
        TimeZoneInfo.FindSystemTimeZoneById(
            OperatingSystem.IsWindows()
                ? "India Standard Time"
                : "Asia/Kolkata");

    public AttendanceService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AttendanceSessionResponse> CheckInAsync(
        int userId,
        string half)
    {
        half = NormalizeHalf(half);

        var nowUtc = DateTime.UtcNow;

        var nowIndia = TimeZoneInfo.ConvertTimeFromUtc(
            nowUtc,
            IndiaTimeZone);

        var todayIndia = nowIndia.Date;

        // Convert India's midnight to a real UTC instant.
        var todayStartUtc =
            TimeZoneInfo.ConvertTimeToUtc(
                DateTime.SpecifyKind(
                    todayIndia,
                    DateTimeKind.Unspecified),
                IndiaTimeZone);

        var tomorrowStartUtc =
            TimeZoneInfo.ConvertTimeToUtc(
                DateTime.SpecifyKind(
                    todayIndia.AddDays(1),
                    DateTimeKind.Unspecified),
                IndiaTimeZone);

        var openSession = await _context.Attendances
            .FirstOrDefaultAsync(a =>
                a.UserId == userId &&
                a.Half == half &&
                a.CheckOut == null &&
                a.Date >= todayStartUtc &&
                a.Date < tomorrowStartUtc);

        if (openSession != null)
        {
            throw new InvalidOperationException(
                $"You already have an active {half} session.");
        }

        var attendance = new Attendance
        {
            UserId = userId,

            // Store India's calendar date as a UTC instant.
            Date = todayStartUtc,

            Half = half,

            // Always UTC in PostgreSQL timestamptz.
            CheckIn = nowUtc,

            CheckOut = null,

            HoursWorkedMinutes = 0
        };

        _context.Attendances.Add(attendance);

        await _context.SaveChangesAsync();

        return ToResponse(
            attendance,
            nowUtc);
    }

    public async Task<AttendanceSessionResponse> CheckOutAsync(
        int userId,
        string half)
    {
        half = NormalizeHalf(half);

        var nowUtc = DateTime.UtcNow;

        var session = await _context.Attendances
            .Where(a =>
                a.UserId == userId &&
                a.Half == half &&
                a.CheckOut == null)
            .OrderByDescending(a => a.CheckIn)
            .FirstOrDefaultAsync();

        if (session == null)
        {
            throw new InvalidOperationException(
                $"No active {half} session was found.");
        }

        session.CheckOut = nowUtc;

        session.HoursWorkedMinutes =
            CalculateWorkedMinutes(
                session.CheckIn,
                nowUtc,
                half);

        await _context.SaveChangesAsync();

        return ToResponse(
            session,
            nowUtc);
    }

    public async Task<List<AttendanceSessionResponse>> GetMyAttendanceAsync(
        int userId)
    {
        var records = await _context.Attendances
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.Date)
            .ThenBy(a => a.CheckIn)
            .ToListAsync();

        var nowUtc = DateTime.UtcNow;

        return records
            .Select(a => ToResponse(a, nowUtc))
            .ToList();
    }

    public async Task<List<AttendanceSessionResponse>> GetMyTodayAsync(
        int userId)
    {
        var nowUtc = DateTime.UtcNow;

        var nowIndia =
            TimeZoneInfo.ConvertTimeFromUtc(
                nowUtc,
                IndiaTimeZone);

        var todayIndia = nowIndia.Date;

        var todayStartUtc =
            TimeZoneInfo.ConvertTimeToUtc(
                DateTime.SpecifyKind(
                    todayIndia,
                    DateTimeKind.Unspecified),
                IndiaTimeZone);

        var tomorrowStartUtc =
            TimeZoneInfo.ConvertTimeToUtc(
                DateTime.SpecifyKind(
                    todayIndia.AddDays(1),
                    DateTimeKind.Unspecified),
                IndiaTimeZone);

        var records = await _context.Attendances
            .Where(a =>
                a.UserId == userId &&
                a.Date >= todayStartUtc &&
                a.Date < tomorrowStartUtc)
            .OrderBy(a => a.CheckIn)
            .ToListAsync();

        return records
            .Select(a => ToResponse(a, nowUtc))
            .ToList();
    }

    public async Task<List<AdminAttendanceRecordDto>> GetAdminAttendanceAsync()
    {
        var records = await _context.Attendances
            .Include(a => a.User)
            .OrderByDescending(a => a.Date)
            .ThenBy(a => a.UserId)
            .ThenBy(a => a.CheckIn)
            .ToListAsync();

        var nowUtc = DateTime.UtcNow;

        return records
            .Select(a => new AdminAttendanceRecordDto
            {
                Id = a.Id,
                UserId = a.UserId,
                StaffName = a.User?.FullName ?? "",
                Username = a.User?.Username ?? "",
                Date = a.Date,
                Half = a.Half,
                CheckIn = a.CheckIn,
                CheckOut = a.CheckOut,

                HoursWorkedMinutes =
                    CalculateWorkedMinutes(
                        a.CheckIn,
                        a.CheckOut ?? nowUtc,
                        a.Half)
            })
            .ToList();
    }

    private static string NormalizeHalf(string half)
    {
        if (string.Equals(
                half,
                "half1",
                StringComparison.OrdinalIgnoreCase))
        {
            return "half1";
        }

        if (string.Equals(
                half,
                "half2",
                StringComparison.OrdinalIgnoreCase))
        {
            return "half2";
        }

        throw new ArgumentException(
            "Half must be half1 or half2.");
    }

    private static int CalculateWorkedMinutes(
        DateTime checkInUtc,
        DateTime checkOutUtc,
        string half)
    {
        // Make sure database values are treated as UTC.
        checkInUtc = DateTime.SpecifyKind(
            checkInUtc,
            DateTimeKind.Utc);

        checkOutUtc = DateTime.SpecifyKind(
            checkOutUtc,
            DateTimeKind.Utc);

        var checkInIndia =
            TimeZoneInfo.ConvertTimeFromUtc(
                checkInUtc,
                IndiaTimeZone);

        var checkOutIndia =
            TimeZoneInfo.ConvertTimeFromUtc(
                checkOutUtc,
                IndiaTimeZone);

        var date = checkInIndia.Date;

        DateTime start;
        DateTime end;

        if (half == "half1")
        {
            // 09:30 AM to 02:00 PM
            start = date
                .AddHours(9)
                .AddMinutes(30);

            end = date.AddHours(14);
        }
        else
        {
            // 03:00 PM to 06:00 PM
            start = date.AddHours(15);

            end = date.AddHours(18);
        }

        var effectiveStart =
            checkInIndia > start
                ? checkInIndia
                : start;

        var effectiveEnd =
            checkOutIndia < end
                ? checkOutIndia
                : end;

        if (effectiveEnd <= effectiveStart)
        {
            return 0;
        }

        return (int)Math.Floor(
            (effectiveEnd - effectiveStart)
                .TotalMinutes);
    }

    private static AttendanceSessionResponse ToResponse(
        Attendance attendance,
        DateTime nowUtc)
    {
        var minutes = attendance.CheckOut.HasValue
            ? attendance.HoursWorkedMinutes
            : CalculateWorkedMinutes(
                attendance.CheckIn,
                nowUtc,
                attendance.Half);

        return new AttendanceSessionResponse
        {
            Id = attendance.Id,
            UserId = attendance.UserId,
            Date = attendance.Date,
            Half = attendance.Half,
            CheckIn = attendance.CheckIn,
            CheckOut = attendance.CheckOut,
            HoursWorkedMinutes = minutes
        };
    }
}