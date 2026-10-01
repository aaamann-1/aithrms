import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private readonly apiUrl = '/api/Attendance';

  constructor(private http: HttpClient) {}

  checkIn(half: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-in?half=${encodeURIComponent(half)}`, {});
  }

  checkOut(half: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-out?half=${encodeURIComponent(half)}`, {});
  }

  getMyAttendance(from?: string, to?: string): Observable<any[]> {
    let url = `${this.apiUrl}/my`;
    const params: string[] = [];
    if (from) params.push(`from=${encodeURIComponent(from)}`);
    if (to) params.push(`to=${encodeURIComponent(to)}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this.http.get<any[]>(url);
  }

  getMyTodayAttendance(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my/today`);
  }

  getAdminAttendance(from?: string, to?: string): Observable<any[]> {
    let url = `${this.apiUrl}/admin`;
    const params: string[] = [];
    if (from) params.push(`from=${encodeURIComponent(from)}`);
    if (to) params.push(`to=${encodeURIComponent(to)}`);
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    return this.http.get<any[]>(url);
  }
}
