
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IndividualReport {
  employeeId: number;
  employeeName: string;
  title: string;
  personalEmail: string;
  mobileNumber: string;
  department: string | null;
  designation: string | null;
  fromDate: string;
  toDate: string;
  totalAttendanceRecords: number;
  totalHoursWorkedMinutes: number;
  attendance: AttendanceReportItem[];
}

export interface AttendanceReportItem {
  date: string;
  half: string;
  checkIn: string;
  checkOut: string | null;
  hoursWorkedMinutes: number;
}

export interface TeamReport {
  fromDate: string;
  toDate: string;
  totalEmployees: number;
  employees: TeamEmployeeReport[];
}

export interface TeamEmployeeReport {
  employeeId: number;
  employeeName: string;
  department: string | null;
  designation: string | null;
  totalAttendanceRecords: number;
  totalHoursWorkedMinutes: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly apiUrl = 'http://localhost:5089/api/Reports';

  constructor(private http: HttpClient) {}

  // DATE PARAMETERS
  private getParams(fromDate: string, toDate: string): HttpParams {
    return new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);
  }

  // GENERIC EXPORT METHOD
  private downloadReport(
    reportName: string,
    format: 'pdf' | 'excel',
    fromDate: string,
    toDate: string
  ): Observable<Blob> {

    const params = this.getParams(fromDate, toDate);

    return this.http.get(
      `${this.apiUrl}/export/${reportName}/${format}`,
      {
        params,
        responseType: 'blob'
      }
    );
  }

  // 1. DAILY SUMMARY
  downloadDailySummaryPdf(from: string, to: string) {
    return this.downloadReport('daily-summary', 'pdf', from, to);
  }

  downloadDailySummaryExcel(from: string, to: string) {
    return this.downloadReport('daily-summary', 'excel', from, to);
  }

  // 2. STAFF PERFORMANCE
  downloadStaffPerformancePdf(from: string, to: string) {
    return this.downloadReport('staff-performance', 'pdf', from, to);
  }

  downloadStaffPerformanceExcel(from: string, to: string) {
    return this.downloadReport('staff-performance', 'excel', from, to);
  }

  // 3. ISSUE CATEGORY
  downloadIssueCategoryPdf(from: string, to: string) {
    return this.downloadReport('issue-category', 'pdf', from, to);
  }

  downloadIssueCategoryExcel(from: string, to: string) {
    return this.downloadReport('issue-category', 'excel', from, to);
  }

  // 4. ATTENDANCE
  downloadAttendancePdf(from: string, to: string) {
    return this.downloadReport('attendance', 'pdf', from, to);
  }

  downloadAttendanceExcel(from: string, to: string) {
    return this.downloadReport('attendance', 'excel', from, to);
  }

  // 5. CLIENT SUPPORT HISTORY
  downloadClientHistoryPdf(from: string, to: string) {
    return this.downloadReport('client-support-history', 'pdf', from, to);
  }

  downloadClientHistoryExcel(from: string, to: string) {
    return this.downloadReport('client-support-history', 'excel', from, to);
  }

  // 6. MONTHLY ANALYTICS
  downloadMonthlyAnalyticsPdf(from: string, to: string) {
    return this.downloadReport('monthly-analytics', 'pdf', from, to);
  }

  downloadMonthlyAnalyticsExcel(from: string, to: string) {
    return this.downloadReport('monthly-analytics', 'excel', from, to);
  }

  // QUICK EXPORT - ALL REPORTS TOGETHER
  downloadQuickExcel(from: string, to: string) {
    const params = this.getParams(from, to);

    return this.http.get(
      `${this.apiUrl}/quick-export/excel`,
      {
        params,
        responseType: 'blob'
      }
    );
  }

  downloadQuickPdf(from: string, to: string) {
    const params = this.getParams(from, to);

    return this.http.get(
      `${this.apiUrl}/quick-export/pdf`,
      {
        params,
        responseType: 'blob'
      }
    );
  }

  // EXISTING TEAM REPORT
  downloadTeamExcel(fromDate: string, toDate: string) {
    const params = this.getParams(fromDate, toDate);

    return this.http.get(
      `${this.apiUrl}/team/export/excel`,
      {
        params,
        responseType: 'blob'
      }
    );
  }

  downloadTeamPdf(fromDate: string, toDate: string) {
    const params = this.getParams(fromDate, toDate);

    return this.http.get(
      `${this.apiUrl}/team/export/pdf`,
      {
        params,
        responseType: 'blob'
      }
    );
  }

  // EXISTING TEAM REPORT DATA
  getTeamReport(
    fromDate: string,
    toDate: string
  ): Observable<TeamReport> {

    const params = this.getParams(fromDate, toDate);

    return this.http.get<TeamReport>(
      `${this.apiUrl}/team`,
      { params }
    );
  }

  // EXISTING INDIVIDUAL REPORT
  getIndividualReport(
    employeeId: number,
    fromDate: string,
    toDate: string
  ): Observable<IndividualReport> {

    const params = this.getParams(fromDate, toDate);

    return this.http.get<IndividualReport>(
      `${this.apiUrl}/individual/${employeeId}`,
      { params }
    );
  }
}
