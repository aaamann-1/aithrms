using System.ComponentModel.DataAnnotations;

namespace MyProject.API.DTOs;

public class UpdateTaskStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;

    public string? EscalatedTo { get; set; }
}