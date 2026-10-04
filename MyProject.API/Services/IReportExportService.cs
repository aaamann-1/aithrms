using System.Threading.Tasks;

namespace MyProject.API.Services
{
    public interface IReportExportService
    {
        Task<byte[]> ExportIndividualExcelAsync(
            int employeeId,
            DateTime fromDate,
            DateTime toDate);

        Task<byte[]> ExportIndividualPdfAsync(
            int employeeId,
            DateTime fromDate,
            DateTime toDate);

        Task<byte[]> ExportTeamExcelAsync(
            DateTime fromDate,
            DateTime toDate);

        Task<byte[]> ExportTeamPdfAsync(
            DateTime fromDate,
            DateTime toDate);
    }
}