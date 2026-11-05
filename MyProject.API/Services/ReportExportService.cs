using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using MyProject.API.Data;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace MyProject.API.Services
{
    public class ReportExportService : IReportExportService
    {
        private readonly ApplicationDbContext _context;
        private readonly IReportService _reportService;

        public ReportExportService(
            ApplicationDbContext context,
            IReportService reportService)
        {
            _context = context;
            _reportService = reportService;
        }

        // INDIVIDUAL EXCEL
        public async Task<byte[]> ExportIndividualExcelAsync(
            int employeeId, DateTime fromDate, DateTime toDate)
        {
            var report = await _reportService.GetIndividualReportAsync(
                employeeId, fromDate, toDate);

            if (report == null)
                throw new KeyNotFoundException("Employee not found.");

            using var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add("Attendance");

            ws.Cell("A1").Value = "Individual Attendance Report";
            ws.Cell("A1").Style.Font.Bold = true;

            ws.Cell("A3").Value = "Employee";
            ws.Cell("B3").Value = report.EmployeeName;

            ws.Cell("A4").Value = "Department";
            ws.Cell("B4").Value = report.Department ?? "";

            ws.Cell("A5").Value = "Designation";
            ws.Cell("B5").Value = report.Designation ?? "";

            ws.Cell("A6").Value = "Total Attendance";
            ws.Cell("B6").Value = report.TotalAttendanceRecords;

            ws.Cell("A7").Value = "Total Hours";
            ws.Cell("B7").Value =
                FormatMinutes(report.TotalHoursWorkedMinutes);

            WriteTable(ws, 10,
                new[] { "Date", "Half", "Check In", "Check Out", "Hours" },
                report.Attendance.Select(a => new[]
                {
                    a.Date.ToString("dd-MMM-yyyy"),
                    a.Half ?? "",
                    a.CheckIn.ToString("HH:mm"),
                    a.CheckOut?.ToString("HH:mm") ?? "",
                    FormatMinutes(a.HoursWorkedMinutes)
                }).ToList());

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        // INDIVIDUAL PDF
        public async Task<byte[]> ExportIndividualPdfAsync(
            int employeeId, DateTime fromDate, DateTime toDate)
        {
            var report = await _reportService.GetIndividualReportAsync(
                employeeId, fromDate, toDate);

            if (report == null)
                throw new KeyNotFoundException("Employee not found.");

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);

                    page.Header().Text("Individual Attendance Report")
                        .Bold().FontSize(20);

                    page.Content().Column(column =>
                    {
                        column.Spacing(8);

                        column.Item().Text($"Employee: {report.EmployeeName}");
                        column.Item().Text($"Department: {report.Department}");
                        column.Item().Text($"Designation: {report.Designation}");
                        column.Item().Text(
                            $"Period: {fromDate:dd-MMM-yyyy} - {toDate:dd-MMM-yyyy}");
                        column.Item().Text(
                            $"Total Attendance: {report.TotalAttendanceRecords}");
                        column.Item().Text(
                            $"Total Hours: {FormatMinutes(report.TotalHoursWorkedMinutes)}");

                        column.Item().PaddingTop(15).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                for (int i = 0; i < 5; i++)
                                    columns.RelativeColumn();
                            });

                            table.Header(header =>
                            {
                                header.Cell().Text("Date").Bold();
                                header.Cell().Text("Half").Bold();
                                header.Cell().Text("Check In").Bold();
                                header.Cell().Text("Check Out").Bold();
                                header.Cell().Text("Hours").Bold();
                            });

                            foreach (var a in report.Attendance)
                            {
                                table.Cell().Text(a.Date.ToString("dd-MMM-yyyy"));
                                table.Cell().Text(a.Half ?? "");
                                table.Cell().Text(a.CheckIn.ToString("HH:mm"));
                                table.Cell().Text(a.CheckOut?.ToString("HH:mm") ?? "");
                                table.Cell().Text(FormatMinutes(a.HoursWorkedMinutes));
                            }
                        });
                    });
                });
            });

            return document.GeneratePdf();
        }

        // TEAM EXCEL
        public async Task<byte[]> ExportTeamExcelAsync(
            DateTime fromDate, DateTime toDate)
        {
            var report = await _reportService.GetTeamReportAsync(
                fromDate, toDate);

            using var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add("Team Attendance");

            ws.Cell("A1").Value = "Team Attendance Report";
            ws.Cell("A1").Style.Font.Bold = true;

            ws.Cell("A3").Value = "Total Employees";
            ws.Cell("B3").Value = report.TotalEmployees;

            WriteTable(ws, 6,
                new[]
                {
                    "Employee", "Department", "Designation",
                    "Attendance", "Hours Worked"
                },
                report.Employees.Select(e => new[]
                {
                    e.EmployeeName,
                    e.Department ?? "",
                    e.Designation ?? "",
                    e.TotalAttendanceRecords.ToString(),
                    FormatMinutes(e.TotalHoursWorkedMinutes)
                }).ToList());

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        // TEAM PDF
        public async Task<byte[]> ExportTeamPdfAsync(
            DateTime fromDate, DateTime toDate)
        {
            var report = await _reportService.GetTeamReportAsync(
                fromDate, toDate);

            var table = new ReportTable
            {
                Title = "Team Attendance Report",
                Headers = new[]
                {
                    "Employee", "Department", "Designation",
                    "Attendance", "Hours Worked"
                },
                Rows = report.Employees.Select(e => new[]
                {
                    e.EmployeeName,
                    e.Department ?? "",
                    e.Designation ?? "",
                    e.TotalAttendanceRecords.ToString(),
                    FormatMinutes(e.TotalHoursWorkedMinutes)
                }).ToList()
            };

            return GeneratePdf(
                "Team Attendance Report",
                fromDate, toDate,
                new List<ReportTable> { table });
        }

        // EXPORT ONE REPORT TO EXCEL
        public async Task<byte[]> ExportReportExcelAsync(
            string reportType, DateTime fromDate, DateTime toDate)
        {
            var tables = await GetReportTablesAsync(
                reportType, fromDate, toDate);

            using var workbook = new XLWorkbook();

            foreach (var table in tables)
            {
                var ws = workbook.Worksheets.Add(table.Title);

                ws.Cell("A1").Value = table.Title;
                ws.Cell("A1").Style.Font.Bold = true;
                ws.Cell("A1").Style.Font.FontSize = 16;

                ws.Cell("A2").Value =
                    $"Period: {fromDate:dd-MMM-yyyy} - {toDate:dd-MMM-yyyy}";

                WriteTable(ws, 4, table.Headers, table.Rows);
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        // EXPORT ONE REPORT TO PDF
        public async Task<byte[]> ExportReportPdfAsync(
            string reportType, DateTime fromDate, DateTime toDate)
        {
            var tables = await GetReportTablesAsync(
                reportType, fromDate, toDate);

            return GeneratePdf(
                reportType.Replace("-", " ") + " Report",
                fromDate, toDate, tables);
        }

        // QUICK EXPORT EXCEL - ALL RECORDS
        public async Task<byte[]> ExportQuickExcelAsync()
        {
            var tables = await GetAllReportTablesAsync();

            using var workbook = new XLWorkbook();

            foreach (var table in tables)
            {
                var ws = workbook.Worksheets.Add(table.Title);

                ws.Cell("A1").Value = table.Title;
                ws.Cell("A1").Style.Font.Bold = true;
                ws.Cell("A1").Style.Font.FontSize = 16;

                WriteTable(ws, 3, table.Headers, table.Rows);
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }

        // QUICK EXPORT PDF - ALL RECORDS
        public async Task<byte[]> ExportQuickPdfAsync()
        {
            var tables = await GetAllReportTablesAsync();

            return GeneratePdf(
                "Complete DSR Report",
                DateTime.MinValue,
                DateTime.Today,
                tables);
        }

        // SELECT A REPORT TYPE
        private async Task<List<ReportTable>> GetReportTablesAsync(
            string reportType, DateTime fromDate, DateTime toDate)
        {
            var all = await GetAllReportTablesAsync(fromDate, toDate);

            var type = reportType.ToLowerInvariant()
                .Replace("-", "")
                .Replace("_", "")
                .Replace(" ", "");

            var result = type switch
            {
                "dailysummary" => all.Take(1),
                "staffperformance" => all.Skip(1).Take(1),
                "issuecategory" => all.Skip(2).Take(1),
                "attendance" => all.Skip(3).Take(1),
                "clientsupporthistory" => all.Skip(4).Take(1),
                "monthlyanalytics" => all.Skip(5).Take(1),
                _ => throw new ArgumentException("Invalid report type.")
            };

            return result.ToList();
        }

        // GET ALL REPORT DATA
        private async Task<List<ReportTable>> GetAllReportTablesAsync(
            DateTime? fromDate = null, DateTime? toDate = null)
        {
            var tasksQuery = _context.TaskEntries
                .AsNoTracking()
                .Include(t => t.User)
                .ThenInclude(u => u!.Employee)
                .AsQueryable();

            var attendanceQuery = _context.Attendances
                .AsNoTracking()
                .Include(a => a.User)
                .ThenInclude(u => u!.Employee)
                .AsQueryable();

            if (fromDate.HasValue && toDate.HasValue)
            {
                var from = DateTime.SpecifyKind(
                    fromDate.Value.Date, DateTimeKind.Utc);

                var to = DateTime.SpecifyKind(
                    toDate.Value.Date.AddDays(1), DateTimeKind.Utc);

                tasksQuery = tasksQuery.Where(
                    t => t.CreatedAt >= from && t.CreatedAt < to);

                attendanceQuery = attendanceQuery.Where(
                    a => a.Date >= from && a.Date < to);
            }

            var tasks = await tasksQuery
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            var attendance = await attendanceQuery
                .OrderBy(a => a.Date)
                .ToListAsync();

            var employees = await _context.Employees
                .AsNoTracking()
                .Include(e => e.User)
                .Where(e => e.User != null && e.User.Role == "Staff")
                .OrderBy(e => e.EmployeeName)
                .ToListAsync();

            var categories = await _context.IssueCategories
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .ToListAsync();

            string StaffName(int userId)
            {
                var task = tasks.FirstOrDefault(t => t.UserId == userId);

                if (task?.User?.Employee != null)
                    return task.User.Employee.EmployeeName;

                var employee = employees.FirstOrDefault(
                    e => e.UserId == userId);

                return employee?.EmployeeName
                    ?? task?.User?.FullName
                    ?? "Unknown";
            }

            // 1. DAILY SUMMARY
            var summary = new ReportTable
            {
                Title = "Daily Summary",
                Headers = new[] { "Metric", "Value" },
                Rows = new List<string[]>
                {
                    new[] { "Total Tasks", tasks.Count.ToString() },
                    new[] { "Resolved Tasks", tasks.Count(t => IsStatus(t.Status, "Resolved")).ToString() },
                    new[] { "Pending Tasks", tasks.Count(t => IsStatus(t.Status, "Pending")).ToString() },
                    new[] { "In Progress Tasks", tasks.Count(t => IsStatus(t.Status, "In Progress")).ToString() },
                    new[] { "Escalated Tasks", tasks.Count(t => IsStatus(t.Status, "Escalated")).ToString() },
                    new[] { "Attendance Records", attendance.Count.ToString() },
                    new[] { "Staff Present", attendance.Select(a => a.UserId).Distinct().Count().ToString() },
                    new[] { "Unique Clients", tasks.Where(t => !string.IsNullOrWhiteSpace(t.ClientId)).Select(t => t.ClientId).Distinct().Count().ToString() }
                }
            };

            // 2. STAFF PERFORMANCE
            var performance = new ReportTable
            {
                Title = "Staff Performance",
                Headers = new[]
                {
                    "Staff Name", "Total Tasks", "Resolved",
                    "Pending", "Escalated", "Hours Worked"
                },
                Rows = employees.Select(e =>
                {
                    var staffTasks = tasks
                        .Where(t => t.UserId == e.UserId)
                        .ToList();

                    var staffAttendance = attendance
                        .Where(a => a.UserId == e.UserId)
                        .ToList();

                    return new[]
                    {
                        e.EmployeeName,
                        staffTasks.Count.ToString(),
                        staffTasks.Count(t => IsStatus(t.Status, "Resolved")).ToString(),
                        staffTasks.Count(t => IsStatus(t.Status, "Pending")).ToString(),
                        staffTasks.Count(t => IsStatus(t.Status, "Escalated")).ToString(),
                        FormatMinutes(staffAttendance.Sum(a => a.HoursWorkedMinutes))
                    };
                }).ToList()
            };

            // 3. ISSUE CATEGORY
            var issueReport = new ReportTable
            {
                Title = "Issue Categories",
                Headers = new[]
                {
                    "Category", "Status", "Total Issues",
                    "Resolved", "Pending", "Escalated"
                },
                Rows = categories.Select(c =>
                {
                    var categoryTasks = tasks
                        .Where(t => string.Equals(
                            t.IssueCategory, c.Name,
                            StringComparison.OrdinalIgnoreCase))
                        .ToList();

                    return new[]
                    {
                        c.Name,
                        c.IsActive ? "Active" : "Inactive",
                        categoryTasks.Count.ToString(),
                        categoryTasks.Count(t => IsStatus(t.Status, "Resolved")).ToString(),
                        categoryTasks.Count(t => IsStatus(t.Status, "Pending")).ToString(),
                        categoryTasks.Count(t => IsStatus(t.Status, "Escalated")).ToString()
                    };
                }).ToList()
            };

            // 4. ATTENDANCE
            var attendanceReport = new ReportTable
            {
                Title = "Attendance Report",
                Headers = new[]
                {
                    "Staff", "Date", "Half", "Check In",
                    "Check Out", "Hours Worked"
                },
                Rows = attendance.Select(a => new[]
                {
                    StaffName(a.UserId),
                    a.Date.ToString("dd-MMM-yyyy"),
                    a.Half ?? "",
                    a.CheckIn.ToString("HH:mm"),
                    a.CheckOut?.ToString("HH:mm") ?? "Not checked out",
                    FormatMinutes(a.HoursWorkedMinutes)
                }).ToList()
            };

            // 5. CLIENT SUPPORT HISTORY
            var clientReport = new ReportTable
            {
                Title = "Client Support History",
                Headers = new[]
                {
                    "Date", "Staff", "Client ID", "Client Name",
                    "Category", "Description", "Status",
                    "Resolution", "Escalated To"
                },
                Rows = tasks.Select(t => new[]
                {
                    t.CreatedAt.ToString("dd-MMM-yyyy HH:mm"),
                    StaffName(t.UserId),
                    t.ClientId ?? "",
                    t.ClientName ?? "",
                    t.IssueCategory ?? "",
                    t.IssueDescription ?? "",
                    t.Status ?? "",
                    t.ResolutionNotes ?? "",
                    t.EscalatedTo ?? ""
                }).ToList()
            };

            // 6. MONTHLY ANALYTICS
            var days = tasks.Select(t => t.CreatedAt.Date)
                .Concat(attendance.Select(a => a.Date.Date))
                .Distinct()
                .OrderBy(d => d)
                .ToList();

            var monthly = new ReportTable
            {
                Title = "Monthly Analytics",
                Headers = new[]
                {
                    "Date", "Total Tasks", "Resolved",
                    "Pending", "Escalated", "Staff Present",
                    "Hours Worked"
                },
                Rows = days.Select(day =>
                {
                    var dayTasks = tasks
                        .Where(t => t.CreatedAt.Date == day)
                        .ToList();

                    var dayAttendance = attendance
                        .Where(a => a.Date.Date == day)
                        .ToList();

                    return new[]
                    {
                        day.ToString("dd-MMM-yyyy"),
                        dayTasks.Count.ToString(),
                        dayTasks.Count(t => IsStatus(t.Status, "Resolved")).ToString(),
                        dayTasks.Count(t => IsStatus(t.Status, "Pending")).ToString(),
                        dayTasks.Count(t => IsStatus(t.Status, "Escalated")).ToString(),
                        dayAttendance.Select(a => a.UserId).Distinct().Count().ToString(),
                        FormatMinutes(dayAttendance.Sum(a => a.HoursWorkedMinutes))
                    };
                }).ToList()
            };

            return new List<ReportTable>
            {
                summary,
                performance,
                issueReport,
                attendanceReport,
                clientReport,
                monthly
            };
        }

        // EXCEL TABLE HELPER
        private static void WriteTable(
            IXLWorksheet ws,
            int startRow,
            string[] headers,
            List<string[]> rows)
        {
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(startRow, i + 1).Value = headers[i];
                ws.Cell(startRow, i + 1).Style.Font.Bold = true;
                ws.Cell(startRow, i + 1).Style.Fill.BackgroundColor =
                    XLColor.LightGray;
            }

            int row = startRow + 1;

            foreach (var values in rows)
            {
                for (int i = 0; i < values.Length; i++)
                    ws.Cell(row, i + 1).Value = values[i] ?? "";

                row++;
            }

            ws.Columns().AdjustToContents();
        }

        // PDF GENERATOR
        private static byte[] GeneratePdf(
            string title,
            DateTime fromDate,
            DateTime toDate,
            List<ReportTable> tables)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4.Landscape());
                    page.Margin(25);

                    page.Header().Column(header =>
                    {
                        header.Item().Text(title)
                            .Bold().FontSize(20);

                        if (fromDate != DateTime.MinValue)
                        {
                            header.Item().Text(
                                $"Period: {fromDate:dd-MMM-yyyy} - {toDate:dd-MMM-yyyy}")
                                .FontSize(10);
                        }
                        else
                        {
                            header.Item().Text("All available records")
                                .FontSize(10);
                        }
                    });

                    page.Content().Column(column =>
                    {
                        column.Spacing(15);

                        foreach (var report in tables)
                        {
                            column.Item().Text(report.Title)
                                .Bold().FontSize(14);

                            if (report.Rows.Count == 0)
                            {
                                column.Item().Text("No records found.")
                                    .Italic().FontSize(9);

                                continue;
                            }

                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    foreach (var heading in report.Headers)
                                        columns.RelativeColumn();
                                });

                                table.Header(header =>
                                {
                                    foreach (var heading in report.Headers)
                                    {
                                        header.Cell()
                                            .Element(CellStyle)
                                            .Background(Colors.Grey.Lighten2)
                                            .Text(heading)
                                            .Bold()
                                            .FontSize(8);
                                    }
                                });

                                foreach (var row in report.Rows)
                                {
                                    foreach (var value in row)
                                    {
                                        table.Cell()
                                            .Element(CellStyle)
                                            .Text(value ?? "")
                                            .FontSize(7);
                                    }
                                }
                            });
                        }
                    });

                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.Span("DSR Web Panel | Billing Support | ");
                        text.Span(
                            "Generated on " +
                            DateTime.Now.ToString("dd-MMM-yyyy HH:mm"));
                    });
                });
            });

            return document.GeneratePdf();
        }

        private static IContainer CellStyle(IContainer container)
        {
            return container
                .Border(0.5f)
                .BorderColor(Colors.Grey.Lighten2)
                .Padding(4);
        }

        private static bool IsStatus(string? actual, string expected)
        {
            return string.Equals(
                actual, expected,
                StringComparison.OrdinalIgnoreCase);
        }

        private static string FormatMinutes(int minutes)
        {
            if (minutes <= 0)
                return "0h 0m";

            return $"{minutes / 60}h {minutes % 60}m";
        }

        private class ReportTable
        {
            public string Title { get; set; } = "";
            public string[] Headers { get; set; } = Array.Empty<string>();
            public List<string[]> Rows { get; set; } = new();
        }
    }
}