namespace MyProject.API.DTOs;

public class CreateTaskEntryRequest
{
    public string? ClientName { get; set; }

    public string? ClientId { get; set; }

    public string? IssueCategory { get; set; }

    public string? IssueDescription { get; set; }

    public string? StartTime { get; set; }

    public string? EndTime { get; set; }

    public string? ResolutionNotes { get; set; }

    public string? Status { get; set; }

    public string? EscalatedTo { get; set; }
}