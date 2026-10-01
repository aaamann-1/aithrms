using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyProject.API.DTOs;
using MyProject.API.Services;

namespace MyProject.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;

    public AttendanceController(
        IAttendanceService attendanceService)
    {
        _attendanceService = attendanceService;
    }

    [Authorize(Roles = "Staff")]
    [HttpPost("check-in")]
    public async Task<IActionResult> CheckIn(
        [FromQuery] string half)
    {
        try
        {
            var userId = GetUserId();

            var result =
                await _attendanceService.CheckInAsync(
                    userId,
                    half);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize(Roles = "Staff")]
    [HttpPost("check-out")]
    public async Task<IActionResult> CheckOut(
        [FromQuery] string half)
    {
        try
        {
            var userId = GetUserId();

            var result =
                await _attendanceService.CheckOutAsync(
                    userId,
                    half);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize(Roles = "Staff")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyAttendance()
    {
        var userId = GetUserId();

        var result =
            await _attendanceService
                .GetMyAttendanceAsync(userId);

        return Ok(result);
    }

    [Authorize(Roles = "Staff")]
    [HttpGet("my/today")]
    public async Task<IActionResult> GetMyToday()
    {
        var userId = GetUserId();

        var result =
            await _attendanceService
                .GetMyTodayAsync(userId);

        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAdminAttendance()
    {
        var result =
            await _attendanceService
                .GetAdminAttendanceAsync();

        return Ok(result);
    }

    private int GetUserId()
    {
        var claim =
            User.FindFirst(
                ClaimTypes.NameIdentifier);

        if (claim == null)
        {
            throw new UnauthorizedAccessException(
                "User ID was not found.");
        }

        return int.Parse(claim.Value);
    }
}