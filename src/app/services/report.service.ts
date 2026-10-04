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

  downloadTeamExcel(fromDate: string, toDate: string) {
  const params = new HttpParams()
    .set('fromDate', fromDate)
    .set('toDate', toDate);

  return this.http.get(
    `${this.apiUrl}/team/export/excel`,
    {
      params,
      responseType: 'blob'
    }
  );
}

downloadTeamPdf(fromDate: string, toDate: string) {
  const params = new HttpParams()
    .set('fromDate', fromDate)
    .set('toDate', toDate);

  return this.http.get(
    `${this.apiUrl}/team/export/pdf`,
    {
      params,
      responseType: 'blob'
    }
  );
}

  getTeamReport(
  fromDate: string,
  toDate: string
): Observable<TeamReport> {
  const params = new HttpParams()
    .set('fromDate', fromDate)
    .set('toDate', toDate);

  return this.http.get<TeamReport>(
    `${this.apiUrl}/team`,
    { params }
  );
}

  getIndividualReport(
    employeeId: number,
    fromDate: string,
    toDate: string
  ): Observable<IndividualReport> {

    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<IndividualReport>(
      `${this.apiUrl}/individual/${employeeId}`,
      { params }
    );
  }
}



