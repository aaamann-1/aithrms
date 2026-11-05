using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyProject.API.Services;

namespace MyProject.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IReportExportService _exportService;

        public ReportsController(
            IReportService reportService,
            IReportExportService exportService)
        {
            _reportService = reportService;
            _exportService = exportService;
        }

        // ==========================================
        // INDIVIDUAL REPORT
        // ==========================================

        [HttpGet("individual/{employeeId}")]
        public async Task<IActionResult> GetIndividualReport(
            int employeeId,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (!IsValidDateRange(fromDate, toDate))
                return BadRequest("Invalid date range.");

            var report = await _reportService.GetIndividualReportAsync(
                employeeId, fromDate, toDate);

            if (report == null)
                return NotFound("Employee not found.");

            return Ok(report);
        }

        // INDIVIDUAL EXCEL
        [HttpGet("individual/{employeeId}/export/excel")]
        public async Task<IActionResult> ExportIndividualExcel(
            int employeeId,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (!IsValidDateRange(fromDate, toDate))
                return BadRequest("Invalid date range.");

            var file = await _exportService.ExportIndividualExcelAsync(
                employeeId, fromDate, toDate);

            return File(
                file,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"Individual_Report_{employeeId}.xlsx");
        }

        // INDIVIDUAL PDF
        [HttpGet("individual/{employeeId}/export/pdf")]
        public async Task<IActionResult> ExportIndividualPdf(
            int employeeId,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (!IsValidDateRange(fromDate, toDate))
                return BadRequest("Invalid date range.");

            var file = await _exportService.ExportIndividualPdfAsync(
                employeeId, fromDate, toDate);

            return File(
                file,
                "application/pdf",
                $"Individual_Report_{employeeId}.pdf");
        }

        // ==========================================
        // TEAM REPORT
        // ==========================================

        [HttpGet("team")]
        public async Task<IActionResult> GetTeamReport(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (!IsValidDateRange(fromDate, toDate))
                return BadRequest("Invalid date range.");

            var report = await _reportService.GetTeamReportAsync(
                fromDate, toDate);

            return Ok(report);
        }

        // TEAM EXCEL
        [HttpGet("team/export/excel")]
        public async Task<IActionResult> ExportTeamExcel(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (!IsValidDateRange(fromDate, toDate))
                return BadRequest("Invalid date range.");

            var file = await _exportService.ExportTeamExcelAsync(
                fromDate, toDate);

            return File(
                file,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Team_Attendance_Report.xlsx");
        }

        // TEAM PDF
        [HttpGet("team/export/pdf")]
        public async Task<IActionResult> ExportTeamPdf(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (!IsValidDateRange(fromDate, toDate))
                return BadRequest("Invalid date range.");

            var file = await _exportService.ExportTeamPdfAsync(
                fromDate, toDate);

            return File(
                file,
                "application/pdf",
                "Team_Attendance_Report.pdf");
        }

        // ==========================================
        // SIX REPORT TYPES
        // ==========================================

        // REPORT EXCEL
        [HttpGet("export/{reportType}/excel")]
        public async Task<IActionResult> ExportReportExcel(
            string reportType,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (!IsValidDateRange(fromDate, toDate))
                return BadRequest("Invalid date range.");

            try
            {
                var file = await _exportService.ExportReportExcelAsync(
                    reportType, fromDate, toDate);

                return File(
                    file,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"{reportType}_Report.xlsx");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // REPORT PDF
        [HttpGet("export/{reportType}/pdf")]
        public async Task<IActionResult> ExportReportPdf(
            string reportType,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (!IsValidDateRange(fromDate, toDate))
                return BadRequest("Invalid date range.");

            try
            {
                var file = await _exportService.ExportReportPdfAsync(
                    reportType, fromDate, toDate);

                return File(
                    file,
                    "application/pdf",
                    $"{reportType}_Report.pdf");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ==========================================
        // QUICK EXPORT - ALL DATA
        // ==========================================

        [HttpGet("quick-export/excel")]
        public async Task<IActionResult> ExportQuickExcel()
        {
            var file = await _exportService.ExportQuickExcelAsync();

            return File(
                file,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Complete_DSR_Report.xlsx");
        }

        [HttpGet("quick-export/pdf")]
        public async Task<IActionResult> ExportQuickPdf()
        {
            var file = await _exportService.ExportQuickPdfAsync();

            return File(
                file,
                "application/pdf",
                "Complete_DSR_Report.pdf");
        }

        // ==========================================
        // DATE VALIDATION
        // ==========================================

        private static bool IsValidDateRange(
            DateTime fromDate, DateTime toDate)
        {
            return fromDate != default
                && toDate != default
                && fromDate.Date <= toDate.Date;
        }
    }
}