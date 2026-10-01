import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AttendanceSession {
  id: number;
  userId: number;
  date: string;
  half: 'half1' | 'half2';
  checkIn: string;
  checkOut: string | null;
  hoursWorkedMinutes: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private readonly apiUrl =
    'https://localhost:7022/api/Attendance';

  constructor(private http: HttpClient) {}

  checkIn(
    half: 'half1' | 'half2'
  ): Observable<AttendanceSession> {

    return this.http.post<AttendanceSession>(
      `${this.apiUrl}/check-in?half=${half}`,
      {}
    );
  }

  checkOut(
    half: 'half1' | 'half2'
  ): Observable<AttendanceSession> {

    return this.http.post<AttendanceSession>(
      `${this.apiUrl}/check-out?half=${half}`,
      {}
    );
  }

  getMyAttendance(): Observable<AttendanceSession[]> {

    return this.http.get<AttendanceSession[]>(
      `${this.apiUrl}/my`
    );
  }

  getMyToday(): Observable<AttendanceSession[]> {

    return this.http.get<AttendanceSession[]>(
      `${this.apiUrl}/my/today`
    );
  }

  getAdminAttendance(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/admin`
    );
  }
}