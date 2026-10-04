using ClosedXML.Excel;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MyProject.API.Services
{
    public class ReportExportService : IReportExportService
    {
        private readonly IReportService _reportService;

        public ReportExportService(IReportService reportService)
        {
            _reportService = reportService;
        }

        // =========================================================
        // INDIVIDUAL EXCEL
        // =========================================================
        public async Task<byte[]> ExportIndividualExcelAsync(
            int employeeId,
            DateTime fromDate,
            DateTime toDate)
        {
            var report = await _reportService.GetIndividualReportAsync(
                employeeId,
                fromDate,
                toDate);

            if (report == null)
                throw new KeyNotFoundException("Employee not found.");

            using var workbook = new XLWorkbook();

            var worksheet = workbook.Worksheets.Add("Attendance Report");

            // Employee information
            worksheet.Cell("A1").Value = "Individual Attendance Report";
            worksheet.Cell("A1").Style.Font.Bold = true;
            worksheet.Cell("A1").Style.Font.FontSize = 16;

            worksheet.Cell("A3").Value = "Employee Name";
            worksheet.Cell("B3").Value = report.EmployeeName;

            worksheet.Cell("A4").Value = "Title";
            worksheet.Cell("B4").Value = report.Title;

            worksheet.Cell("A5").Value = "Email";
            worksheet.Cell("B5").Value = report.PersonalEmail;

            worksheet.Cell("A6").Value = "Mobile";
            worksheet.Cell("B6").Value = report.MobileNumber;

            worksheet.Cell("A7").Value = "Department";
            worksheet.Cell("B7").Value = report.Department ?? "";

            worksheet.Cell("A8").Value = "Designation";
            worksheet.Cell("B8").Value = report.Designation ?? "";

            worksheet.Cell("A9").Value = "From Date";
            worksheet.Cell("B9").Value = report.FromDate.ToString("dd-MMM-yyyy");

            worksheet.Cell("A10").Value = "To Date";
            worksheet.Cell("B10").Value = report.ToDate.ToString("dd-MMM-yyyy");

            worksheet.Cell("A11").Value = "Total Attendance Records";
            worksheet.Cell("B11").Value = report.TotalAttendanceRecords;

            worksheet.Cell("A12").Value = "Total Hours Worked";
            worksheet.Cell("B12").Value =
                FormatMinutes(report.TotalHoursWorkedMinutes);

            // Attendance table
            var startRow = 15;

            worksheet.Cell(startRow, 1).Value = "Date";
            worksheet.Cell(startRow, 2).Value = "Half";
            worksheet.Cell(startRow, 3).Value = "Check In";
            worksheet.Cell(startRow, 4).Value = "Check Out";
            worksheet.Cell(startRow, 5).Value = "Hours Worked";

            var headerRange = worksheet.Range(
                startRow,
                1,
                startRow,
                5);

            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;

            var row = startRow + 1;

            foreach (var attendance in report.Attendance)
            {
                worksheet.Cell(row, 1).Value =
                    attendance.Date.ToString("dd-MMM-yyyy");

                worksheet.Cell(row, 2).Value = attendance.Half;

                worksheet.Cell(row, 3).Value =
                    attendance.CheckIn.ToString("dd-MMM-yyyy HH:mm");

                worksheet.Cell(row, 4).Value =
                    attendance.CheckOut.HasValue
                        ? attendance.CheckOut.Value.ToString("dd-MMM-yyyy HH:mm")
                        : "";

                worksheet.Cell(row, 5).Value =
                    FormatMinutes(attendance.HoursWorkedMinutes);

                row++;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            return stream.ToArray();
        }


        // =========================================================
        // TEAM EXCEL
        // =========================================================
        public async Task<byte[]> ExportTeamExcelAsync(
            DateTime fromDate,
            DateTime toDate)
        {
            var report = await _reportService.GetTeamReportAsync(
                fromDate,
                toDate);

            using var workbook = new XLWorkbook();

            var worksheet = workbook.Worksheets.Add("Team Report");

            worksheet.Cell("A1").Value = "Team Attendance Report";
            worksheet.Cell("A1").Style.Font.Bold = true;
            worksheet.Cell("A1").Style.Font.FontSize = 16;

            worksheet.Cell("A3").Value = "From Date";
            worksheet.Cell("B3").Value =
                report.FromDate.ToString("dd-MMM-yyyy");

            worksheet.Cell("A4").Value = "To Date";
            worksheet.Cell("B4").Value =
                report.ToDate.ToString("dd-MMM-yyyy");

            worksheet.Cell("A5").Value = "Total Employees";
            worksheet.Cell("B5").Value = report.TotalEmployees;

            var startRow = 8;

            worksheet.Cell(startRow, 1).Value = "Employee";
            worksheet.Cell(startRow, 2).Value = "Department";
            worksheet.Cell(startRow, 3).Value = "Designation";
            worksheet.Cell(startRow, 4).Value = "Attendance Records";
            worksheet.Cell(startRow, 5).Value = "Hours Worked";

            var headerRange = worksheet.Range(
                startRow,
                1,
                startRow,
                5);

            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;

            var row = startRow + 1;

            foreach (var employee in report.Employees)
            {
                worksheet.Cell(row, 1).Value =
                    employee.EmployeeName;

                worksheet.Cell(row, 2).Value =
                    employee.Department ?? "";

                worksheet.Cell(row, 3).Value =
                    employee.Designation ?? "";

                worksheet.Cell(row, 4).Value =
                    employee.TotalAttendanceRecords;

                worksheet.Cell(row, 5).Value =
                    FormatMinutes(employee.TotalHoursWorkedMinutes);

                row++;
            }

            worksheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            return stream.ToArray();
        }


        // =========================================================
        // INDIVIDUAL PDF
        // =========================================================
        public async Task<byte[]> ExportIndividualPdfAsync(
            int employeeId,
            DateTime fromDate,
            DateTime toDate)
        {
            var report = await _reportService.GetIndividualReportAsync(
                employeeId,
                fromDate,
                toDate);

            if (report == null)
                throw new KeyNotFoundException("Employee not found.");

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);

                    page.Header()
                        .Text("Individual Attendance Report")
                        .Bold()
                        .FontSize(20);

                    page.Content().Column(column =>
                    {
                        column.Spacing(8);

                        column.Item().Text(
                            $"Employee: {report.EmployeeName}");

                        column.Item().Text(
                            $"Title: {report.Title}");

                        column.Item().Text(
                            $"Email: {report.PersonalEmail}");

                        column.Item().Text(
                            $"Mobile: {report.MobileNumber}");

                        column.Item().Text(
                            $"Department: {report.Department ?? ""}");

                        column.Item().Text(
                            $"Designation: {report.Designation ?? ""}");

                        column.Item().Text(
                            $"Period: {report.FromDate:dd-MMM-yyyy} - {report.ToDate:dd-MMM-yyyy}");

                        column.Item().Text(
                            $"Total Attendance Records: {report.TotalAttendanceRecords}");

                        column.Item().Text(
                            $"Total Hours Worked: {FormatMinutes(report.TotalHoursWorkedMinutes)}");

                        column.Item().PaddingTop(15).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(1);
                                columns.RelativeColumn(1);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.2f);
                            });

                            table.Header(header =>
                            {
                                header.Cell().Text("Date").Bold();
                                header.Cell().Text("Half").Bold();
                                header.Cell().Text("Check In").Bold();
                                header.Cell().Text("Check Out").Bold();
                                header.Cell().Text("Hours").Bold();
                            });

                            foreach (var attendance in report.Attendance)
                            {
                                table.Cell().Text(
                                    attendance.Date.ToString("dd-MMM-yyyy"));

                                table.Cell().Text(attendance.Half);

                                table.Cell().Text(
                                    attendance.CheckIn.ToString("HH:mm"));

                                table.Cell().Text(
                                    attendance.CheckOut.HasValue
                                        ? attendance.CheckOut.Value.ToString("HH:mm")
                                        : "");

                                table.Cell().Text(
                                    FormatMinutes(attendance.HoursWorkedMinutes));
                            }
                        });
                    });
                });
            });

            return document.GeneratePdf();
        }


        // =========================================================
        // TEAM PDF
        // =========================================================
        public async Task<byte[]> ExportTeamPdfAsync(
            DateTime fromDate,
            DateTime toDate)
        {
            var report = await _reportService.GetTeamReportAsync(
                fromDate,
                toDate);

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);

                    page.Header()
                        .Text("Team Attendance Report")
                        .Bold()
                        .FontSize(20);

                    page.Content().Column(column =>
                    {
                        column.Spacing(8);

                        column.Item().Text(
                            $"Period: {report.FromDate:dd-MMM-yyyy} - {report.ToDate:dd-MMM-yyyy}");

                        column.Item().Text(
                            $"Total Employees: {report.TotalEmployees}");

                        column.Item().PaddingTop(15).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(1.5f);
                                columns.RelativeColumn(1.2f);
                                columns.RelativeColumn(1.2f);
                                columns.RelativeColumn(1.2f);
                                columns.RelativeColumn(1.2f);
                            });

                            table.Header(header =>
                            {
                                header.Cell().Text("Employee").Bold();
                                header.Cell().Text("Department").Bold();
                                header.Cell().Text("Designation").Bold();
                                header.Cell().Text("Attendance").Bold();
                                header.Cell().Text("Hours Worked").Bold();
                            });

                            foreach (var employee in report.Employees)
                            {
                                table.Cell().Text(employee.EmployeeName);

                                table.Cell().Text(
                                    employee.Department ?? "");

                                table.Cell().Text(
                                    employee.Designation ?? "");

                                table.Cell().Text(
                                    employee.TotalAttendanceRecords.ToString());

                                table.Cell().Text(
                                    FormatMinutes(employee.TotalHoursWorkedMinutes));
                            }
                        });
                    });
                });
            });

            return document.GeneratePdf();
        }


        // =========================================================
        // HELPER
        // =========================================================
        private static string FormatMinutes(int minutes)
        {
            if (minutes <= 0)
                return "0h 0m";

            var hours = minutes / 60;
            var remainingMinutes = minutes % 60;

            return $"{hours}h {remainingMinutes}m";
        }
    }
}