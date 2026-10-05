using System.Security.Claims;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using MyProject.API.Data;
using MyProject.API.DTOs;
using MyProject.API.Models;

namespace MyProject.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TaskEntryController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TaskEntryController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // CREATE TASK
    // =========================================================

    [HttpPost]
    [Authorize(Roles = "Staff")]
    public async Task<IActionResult> CreateTask(
        [FromBody] CreateTaskEntryRequest request)
    {
        var userIdClaim =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user authentication."
            });
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(user => user.Id == userId);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "User account not found."
            });
        }

        if (string.IsNullOrWhiteSpace(request.ClientName))
        {
            return BadRequest(new
            {
                message = "Client name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.IssueCategory))
        {
            return BadRequest(new
            {
                message = "Issue category is required."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return BadRequest(new
            {
                message = "Status is required."
            });
        }

        var allowedStatuses = new[]
        {
            "Pending",
            "In Progress",
            "Resolved",
            "Escalated"
        };

        if (!allowedStatuses.Contains(
                request.Status,
                StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message = "Invalid task status."
            });
        }

        var task = new TaskEntry
        {
            UserId = userId,

            ClientName = request.ClientName.Trim(),

            ClientId = string.IsNullOrWhiteSpace(request.ClientId)
                ? null
                : request.ClientId.Trim(),

            IssueCategory = request.IssueCategory.Trim(),

            IssueDescription =
                string.IsNullOrWhiteSpace(request.IssueDescription)
                    ? null
                    : request.IssueDescription.Trim(),

            StartTime =
                string.IsNullOrWhiteSpace(request.StartTime)
                    ? null
                    : request.StartTime.Trim(),

            EndTime =
                string.IsNullOrWhiteSpace(request.EndTime)
                    ? null
                    : request.EndTime.Trim(),

            ResolutionNotes =
                string.IsNullOrWhiteSpace(request.ResolutionNotes)
                    ? null
                    : request.ResolutionNotes.Trim(),

            Status = request.Status.Trim(),

            EscalatedTo =
                request.Status.Equals(
                    "Escalated",
                    StringComparison.OrdinalIgnoreCase)
                    ? request.EscalatedTo?.Trim()
                    : null,

            CreatedAt = DateTime.UtcNow
        };

        _context.TaskEntries.Add(task);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Task submitted successfully.",

            taskId = task.Id,

            userId = task.UserId,

            status = task.Status
        });
    }


    // =========================================================
    // STAFF - GET OWN TASKS
    // =========================================================

    [HttpGet("my")]
    [Authorize(Roles = "Staff")]
    public async Task<IActionResult> GetMyTasks()
    {
        var userIdClaim =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user authentication."
            });
        }

        var tasks = await _context.TaskEntries
            .AsNoTracking()
            .Where(task => task.UserId == userId)
            .OrderByDescending(task => task.CreatedAt)
            .ToListAsync();

        return Ok(tasks);
    }


    // =========================================================
    // STAFF - UPDATE OWN TASK STATUS
    // =========================================================

    [HttpPut("{id}")]
    [Authorize(Roles = "Staff")]
    public async Task<IActionResult> UpdateTask(
        int id,
        [FromBody] UpdateTaskStatusRequest request)
    {
        // Get logged-in Staff user's ID
        var userIdClaim =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new
            {
                message = "Invalid user authentication."
            });
        }

        // Find the task and make sure it belongs to this Staff user
        var task = await _context.TaskEntries
            .FirstOrDefaultAsync(
                task =>
                    task.Id == id &&
                    task.UserId == userId
            );

        if (task is null)
        {
            return NotFound(new
            {
                message =
                    "Task not found or you do not have permission to update it."
            });
        }

        // Validate status
        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return BadRequest(new
            {
                message = "Status is required."
            });
        }

        var allowedStatuses = new[]
        {
            "Pending",
            "In Progress",
            "Resolved",
            "Escalated"
        };

        if (!allowedStatuses.Contains(
                request.Status,
                StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message = "Invalid task status."
            });
        }

        // Update status
        task.Status = request.Status.Trim();

        // Handle escalation
        if (task.Status.Equals(
                "Escalated",
                StringComparison.OrdinalIgnoreCase))
        {
            task.EscalatedTo =
                string.IsNullOrWhiteSpace(request.EscalatedTo)
                    ? null
                    : request.EscalatedTo.Trim();
        }
        else
        {
            // Remove escalation when status changes
            task.EscalatedTo = null;
        }

        // Save update time
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Task status updated successfully.",
            taskId = task.Id,
            status = task.Status,
            escalatedTo = task.EscalatedTo,
            updatedAt = task.UpdatedAt
        });
    }


    // =========================================================
    // ADMIN - GET ALL TASKS
    // =========================================================

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllTasks()
    {
        var tasks = await _context.TaskEntries
            .AsNoTracking()
            .Include(task => task.User)
            .OrderByDescending(task => task.CreatedAt)
            .Select(task => new
            {
                task.Id,

                task.UserId,

                staffName = task.User != null
                    ? task.User.FullName
                    : "Unknown",

                task.ClientName,
                task.ClientId,
                task.IssueCategory,
                task.IssueDescription,
                task.StartTime,
                task.EndTime,
                task.ResolutionNotes,
                task.Status,
                task.EscalatedTo,
                task.CreatedAt,
                task.UpdatedAt
            })
            .ToListAsync();

        return Ok(tasks);
    }


   // =========================================================
// ADMIN - STAFF TASK SUMMARY
// =========================================================

[HttpGet("staff-summary")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> GetStaffTaskSummary()
{
    var staffSummary = await _context.Users
        .AsNoTracking()
        .Where(user =>
            user.Role.ToLower() == "staff")
        .Select(user => new
        {
            id = user.Id,

            name = user.FullName,

            role = user.Employee != null
                ? user.Employee.Designation
                : "Staff",

            inProgress = _context.TaskEntries.Count(
                task =>
                    task.UserId == user.Id &&
                    task.Status == "In Progress"),

            resolved = _context.TaskEntries.Count(
                task =>
                    task.UserId == user.Id &&
                    task.Status == "Resolved"),

            pending = _context.TaskEntries.Count(
                task =>
                    task.UserId == user.Id &&
                    task.Status == "Pending")
        })
        .ToListAsync();

    return Ok(staffSummary);
}}