using MyProject.API.DTOs;

namespace MyProject.API.Services;

public interface IReportService
{
    Task<IndividualReportDto?> GetIndividualReportAsync(
        int employeeId,
        DateTime fromDate,
        DateTime toDate);

    Task<TeamReportDto> GetTeamReportAsync(
        DateTime fromDate,
        DateTime toDate);
}