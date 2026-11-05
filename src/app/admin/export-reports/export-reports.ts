
import { Component } from '@angular/core';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-export-reports',
  standalone: true,
  imports: [],
  templateUrl: './export-reports.html',
  styleUrl: './export-reports.css'
})
export class ExportReports {

  constructor(private reportService: ReportService) {}

  // GET TODAY'S DATE
  private getToday(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // GET FIRST DAY OF CURRENT MONTH
  private getMonthStart(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${year}-${month}-01`;
  }

  // COMMON DOWNLOAD FUNCTION
  private downloadFile(
    blob: Blob,
    filename: string
  ): void {

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  }

  // COMMON ERROR HANDLING
  private handleError(error: any): void {
    console.error('Report download failed:', error);

    alert(
      `Report download failed. Status: ${error.status}`
    );
  }

  // COMMON EXPORT HANDLER
  private exportReport(
    request: any,
    filename: string
  ): void {

    request.subscribe({
      next: (blob: Blob) => {
        this.downloadFile(blob, filename);
      },

      error: (error: any) => {
        this.handleError(error);
      }
    });
  }

  // 1. DAILY SUMMARY
  downloadDailySummaryPdf(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadDailySummaryPdf(today, today),
      `Daily_Summary_${today}.pdf`
    );
  }

  downloadDailySummaryExcel(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadDailySummaryExcel(today, today),
      `Daily_Summary_${today}.xlsx`
    );
  }

  // 2. STAFF PERFORMANCE
  downloadStaffPerformancePdf(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadStaffPerformancePdf(today, today),
      `Staff_Performance_${today}.pdf`
    );
  }

  downloadStaffPerformanceExcel(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadStaffPerformanceExcel(today, today),
      `Staff_Performance_${today}.xlsx`
    );
  }

  // 3. ISSUE CATEGORY
  downloadIssueCategoryPdf(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadIssueCategoryPdf(today, today),
      `Issue_Category_${today}.pdf`
    );
  }

  downloadIssueCategoryExcel(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadIssueCategoryExcel(today, today),
      `Issue_Category_${today}.xlsx`
    );
  }

  // 4. ATTENDANCE
  downloadAttendancePdf(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadAttendancePdf(today, today),
      `Attendance_${today}.pdf`
    );
  }

  downloadAttendanceExcel(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadAttendanceExcel(today, today),
      `Attendance_${today}.xlsx`
    );
  }

  // 5. CLIENT SUPPORT HISTORY
  downloadClientHistoryPdf(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadClientHistoryPdf(today, today),
      `Client_Support_History_${today}.pdf`
    );
  }

  downloadClientHistoryExcel(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadClientHistoryExcel(today, today),
      `Client_Support_History_${today}.xlsx`
    );
  }

  // 6. MONTHLY ANALYTICS
  downloadMonthlyAnalyticsPdf(): void {
    const from = this.getMonthStart();
    const to = this.getToday();

    this.exportReport(
      this.reportService.downloadMonthlyAnalyticsPdf(from, to),
      `Monthly_Analytics_${to}.pdf`
    );
  }

  downloadMonthlyAnalyticsExcel(): void {
    const from = this.getMonthStart();
    const to = this.getToday();

    this.exportReport(
      this.reportService.downloadMonthlyAnalyticsExcel(from, to),
      `Monthly_Analytics_${to}.xlsx`
    );
  }

  // QUICK EXPORT - COMPLETE EXCEL
  downloadTodayExcel(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadQuickExcel(today, today),
      `DSR_Complete_Report_${today}.xlsx`
    );
  }

  // QUICK EXPORT - COMPLETE PDF
  downloadTodayPdf(): void {
    const today = this.getToday();

    this.exportReport(
      this.reportService.downloadQuickPdf(today, today),
      `DSR_Complete_Report_${today}.pdf`
    );
  }
}
