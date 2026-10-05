using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyProject.API.Models;

public class TaskEntry
{
    [Key]
    public int Id { get; set; }

    // Staff/User who submitted the task
    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    // Client information
    [MaxLength(200)]
    public string? ClientName { get; set; }

    [MaxLength(100)]
    public string? ClientId { get; set; }

    // Task information
    [MaxLength(100)]
    public string? IssueCategory { get; set; }

    public string? IssueDescription { get; set; }

    // Time entered from the Task Entry form
    [MaxLength(20)]
    public string? StartTime { get; set; }

    [MaxLength(20)]
    public string? EndTime { get; set; }

    // Resolution
    public string? ResolutionNotes { get; set; }

    // Pending / In Progress / Resolved / Escalated
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Pending";

    // Used only when status is Escalated
    [MaxLength(200)]
    public string? EscalatedTo { get; set; }

    // Database timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}