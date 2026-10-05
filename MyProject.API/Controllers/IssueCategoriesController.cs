using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyProject.API.Data;
using MyProject.API.Models;

namespace MyProject.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IssueCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public IssueCategoriesController(
        ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET: api/IssueCategories
    // Used by the Issue Categories page
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.IssueCategories
            .AsNoTracking()
            .OrderBy(category => category.Id)
            .Select(category => new
            {
                category.Id,
                category.Name,
                category.Description,
                category.IsActive,
                category.CreatedAt,
                category.UpdatedAt,

                // Count Task Entries belonging to this category
                total = _context.TaskEntries.Count(
                    task =>
                        task.IssueCategory ==
                        category.Name)
            })
            .ToListAsync();

        return Ok(categories);
    }


    // =========================================================
    // GET: api/IssueCategories/{id}
    // Get one category
    // =========================================================

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategory(
        int id)
    {
        var category = await _context.IssueCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(
                category => category.Id == id);

        if (category == null)
        {
            return NotFound(new
            {
                message =
                    "Issue category not found."
            });
        }

        return Ok(category);
    }


    // =========================================================
    // GET: api/IssueCategories/{id}/tasks
    // Get all Task Entries belonging to a category
    // =========================================================

    [HttpGet("{id}/tasks")]
    public async Task<IActionResult> GetCategoryTasks(
        int id)
    {
        // Find the category first
        var category = await _context.IssueCategories
            .AsNoTracking()
            .FirstOrDefaultAsync(
                category => category.Id == id);

        if (category == null)
        {
            return NotFound(new
            {
                message =
                    "Issue category not found."
            });
        }


        // Find all Task Entries having
        // the same IssueCategory name
        var tasks = await _context.TaskEntries
            .AsNoTracking()
            .Where(task =>
                task.IssueCategory ==
                category.Name)
            .Include(task => task.User)
            .OrderByDescending(
                task => task.CreatedAt)
            .Select(task => new
            {
                id = task.Id,

                userId = task.UserId,

                staffName =
                    task.User != null
                        ? task.User.Username
                        : "Unknown",

                clientName =
                    task.ClientName,

                clientId =
                    task.ClientId,

                issueCategory =
                    task.IssueCategory,

                issueDescription =
                    task.IssueDescription,

                startTime =
                    task.StartTime,

                endTime =
                    task.EndTime,

                resolutionNotes =
                    task.ResolutionNotes,

                status =
                    task.Status,

                escalatedTo =
                    task.EscalatedTo,

                createdAt =
                    task.CreatedAt,

                updatedAt =
                    task.UpdatedAt
            })
            .ToListAsync();


        // Return category information
        // together with its Task Entries
        return Ok(new
        {
            category = new
            {
                id = category.Id,

                name = category.Name,

                description =
                    category.Description
            },

            total = tasks.Count,

            tasks
        });
    }


    // =========================================================
    // POST: api/IssueCategories
    // Admin only
    // =========================================================

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCategory(
        [FromBody] IssueCategory request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                message =
                    "Category name is required."
            });
        }

        var name = request.Name.Trim();

        var alreadyExists =
            await _context.IssueCategories
                .AnyAsync(category =>
                    category.Name.ToLower() ==
                    name.ToLower());

        if (alreadyExists)
        {
            return Conflict(new
            {
                message =
                    "This issue category already exists."
            });
        }

        var category = new IssueCategory
        {
            Name = name,

            Description =
                string.IsNullOrWhiteSpace(
                    request.Description)
                    ? null
                    : request.Description.Trim(),

            IsActive =
                request.IsActive
        };

        _context.IssueCategories.Add(
            category);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message =
                "Issue category created successfully.",

            category
        });
    }


    // =========================================================
    // PUT: api/IssueCategories/{id}
    // Admin only
    // =========================================================

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCategory(
        int id,
        [FromBody] IssueCategory request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new
            {
                message =
                    "Category name is required."
            });
        }

        var category =
            await _context.IssueCategories
                .FirstOrDefaultAsync(
                    category =>
                        category.Id == id);

        if (category == null)
        {
            return NotFound(new
            {
                message =
                    "Issue category not found."
            });
        }

        var name = request.Name.Trim();

        var alreadyExists =
            await _context.IssueCategories
                .AnyAsync(existing =>
                    existing.Id != id &&
                    existing.Name.ToLower() ==
                    name.ToLower());

        if (alreadyExists)
        {
            return Conflict(new
            {
                message =
                    "Another issue category with this name already exists."
            });
        }

        category.Name = name;

        category.Description =
            string.IsNullOrWhiteSpace(
                request.Description)
                ? null
                : request.Description.Trim();

        category.IsActive =
            request.IsActive;

        category.UpdatedAt =
            DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message =
                "Issue category updated successfully.",

            category
        });
    }


    // =========================================================
    // PATCH: api/IssueCategories/{id}/status
    // Admin only
    // =========================================================

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] UpdateCategoryStatusRequest request)
    {
        var category =
            await _context.IssueCategories
                .FirstOrDefaultAsync(
                    category =>
                        category.Id == id);

        if (category == null)
        {
            return NotFound(new
            {
                message =
                    "Issue category not found."
            });
        }

        category.IsActive =
            request.IsActive;

        category.UpdatedAt =
            DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message =
                "Issue category status updated successfully.",

            category
        });
    }


    // =========================================================
    // DELETE: api/IssueCategories/{id}
    // Admin only
    // =========================================================

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCategory(
        int id)
    {
        var category =
            await _context.IssueCategories
                .FirstOrDefaultAsync(
                    category =>
                        category.Id == id);

        if (category == null)
        {
            return NotFound(new
            {
                message =
                    "Issue category not found."
            });
        }

        _context.IssueCategories.Remove(
            category);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message =
                "Issue category deleted successfully."
        });
    }
}


// =============================================================
// Request model for changing active/inactive status
// =============================================================

public class UpdateCategoryStatusRequest
{
    public bool IsActive { get; set; }
}