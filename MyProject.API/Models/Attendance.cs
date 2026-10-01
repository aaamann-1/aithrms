using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyProject.API.Models;

public class Attendance
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [MaxLength(10)]
    public string Half { get; set; } = string.Empty;

    [Required]
    public DateTime CheckIn { get; set; }

    public DateTime? CheckOut { get; set; }

    public int HoursWorkedMinutes { get; set; }
}