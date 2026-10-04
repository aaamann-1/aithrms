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

  private getToday(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  downloadTodayExcel(): void {
    const today = this.getToday();

    this.reportService.downloadTeamExcel(today, today)
      .subscribe({
        next: (blob: Blob) => {
          this.downloadFile(
            blob,
            `Team_Attendance_${today}.xlsx`
          );
        },
        error: (error: any) => {
  console.error('Excel export failed');
  console.error('Status:', error.status);
  console.error('Message:', error.message);
  console.error('Error:', error.error);

  alert(`Excel export failed. Status: ${error.status}`);
}
      });
  }

  downloadTodayPdf(): void {
    const today = this.getToday();

    this.reportService.downloadTeamPdf(today, today)
      .subscribe({
        next: (blob: Blob) => {
          this.downloadFile(
            blob,
            `Team_Attendance_${today}.pdf`
          );
        },
        error: (error: any) => {
  console.error('PDF export failed');
  console.error('Status:', error.status);
  console.error('Message:', error.message);
  console.error('Error:', error.error);

  alert(`PDF export failed. Status: ${error.status}`);
}
      });
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(url);
  }
}