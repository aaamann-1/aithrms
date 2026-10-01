using MyProject.API.DTOs;

namespace MyProject.API.Services;

public interface IAttendanceService
{
    Task<AttendanceSessionResponse> CheckInAsync(
        int userId,
        string half);

    Task<AttendanceSessionResponse> CheckOutAsync(
        int userId,
        string half);

    Task<List<AttendanceSessionResponse>> GetMyAttendanceAsync(
        int userId);

    Task<List<AttendanceSessionResponse>> GetMyTodayAsync(
        int userId);

    Task<List<AdminAttendanceRecordDto>> GetAdminAttendanceAsync();
}