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
        private readonly IReportExportService _reportExportService;

        public ReportsController(
            IReportService reportService,
            IReportExportService reportExportService)
        {
            _reportService = reportService;
            _reportExportService = reportExportService;
        }


        // =========================================================
        // INDIVIDUAL REPORT
        // =========================================================
        [HttpGet("individual/{employeeId:int}")]
        public async Task<IActionResult> GetIndividualReport(
            int employeeId,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (fromDate > toDate)
                return BadRequest(new
                {
                    message = "From date cannot be later than to date."
                });

            var report = await _reportService.GetIndividualReportAsync(
                employeeId,
                fromDate,
                toDate);

            if (report == null)
                return NotFound(new
                {
                    message = "Employee not found."
                });

            return Ok(report);
        }


        // =========================================================
        // TEAM REPORT
        // =========================================================
        [HttpGet("team")]
        public async Task<IActionResult> GetTeamReport(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (fromDate > toDate)
                return BadRequest(new
                {
                    message = "From date cannot be later than to date."
                });

            var report = await _reportService.GetTeamReportAsync(
                fromDate,
                toDate);

            return Ok(report);
        }


        // =========================================================
        // INDIVIDUAL EXCEL
        // =========================================================
        [HttpGet("individual/{employeeId:int}/export/excel")]
        public async Task<IActionResult> ExportIndividualExcel(
            int employeeId,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (fromDate > toDate)
                return BadRequest(new
                {
                    message = "From date cannot be later than to date."
                });

            try
            {
                var file = await _reportExportService
                    .ExportIndividualExcelAsync(
                        employeeId,
                        fromDate,
                        toDate);

                return File(
                    file,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"Individual_Attendance_{employeeId}_{fromDate:yyyyMMdd}_{toDate:yyyyMMdd}.xlsx");
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new
                {
                    message = "Employee not found."
                });
            }
        }


        // =========================================================
        // INDIVIDUAL PDF
        // =========================================================
        [HttpGet("individual/{employeeId:int}/export/pdf")]
        public async Task<IActionResult> ExportIndividualPdf(
            int employeeId,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (fromDate > toDate)
                return BadRequest(new
                {
                    message = "From date cannot be later than to date."
                });

            try
            {
                var file = await _reportExportService
                    .ExportIndividualPdfAsync(
                        employeeId,
                        fromDate,
                        toDate);

                return File(
                    file,
                    "application/pdf",
                    $"Individual_Attendance_{employeeId}_{fromDate:yyyyMMdd}_{toDate:yyyyMMdd}.pdf");
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new
                {
                    message = "Employee not found."
                });
            }
        }


        // =========================================================
        // TEAM EXCEL
        // =========================================================
        [HttpGet("team/export/excel")]
        public async Task<IActionResult> ExportTeamExcel(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (fromDate > toDate)
                return BadRequest(new
                {
                    message = "From date cannot be later than to date."
                });

            var file = await _reportExportService
                .ExportTeamExcelAsync(
                    fromDate,
                    toDate);

            return File(
                file,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"Team_Attendance_{fromDate:yyyyMMdd}_{toDate:yyyyMMdd}.xlsx");
        }


        // =========================================================
        // TEAM PDF
        // =========================================================
        [HttpGet("team/export/pdf")]
        public async Task<IActionResult> ExportTeamPdf(
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate)
        {
            if (fromDate > toDate)
                return BadRequest(new
                {
                    message = "From date cannot be later than to date."
                });

            var file = await _reportExportService
                .ExportTeamPdfAsync(
                    fromDate,
                    toDate);

            return File(
                file,
                "application/pdf",
                $"Team_Attendance_{fromDate:yyyyMMdd}_{toDate:yyyyMMdd}.pdf");
        }
    }
}