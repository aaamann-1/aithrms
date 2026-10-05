import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AttendanceService = class AttendanceService {
    http;
    apiUrl = '/api/Attendance';
    constructor(http) {
        this.http = http;
    }
    checkIn(half) {
        return this.http.post(`${this.apiUrl}/check-in?half=${encodeURIComponent(half)}`, {});
    }
    checkOut(half) {
        return this.http.post(`${this.apiUrl}/check-out?half=${encodeURIComponent(half)}`, {});
    }
    getMyAttendance(from, to) {
        let url = `${this.apiUrl}/my`;
        const params = [];
        if (from)
            params.push(`from=${encodeURIComponent(from)}`);
        if (to)
            params.push(`to=${encodeURIComponent(to)}`);
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        return this.http.get(url);
    }
    getMyTodayAttendance() {
        return this.http.get(`${this.apiUrl}/my/today`);
    }
    getAdminAttendance(from, to) {
        let url = `${this.apiUrl}/admin`;
        const params = [];
        if (from)
            params.push(`from=${encodeURIComponent(from)}`);
        if (to)
            params.push(`to=${encodeURIComponent(to)}`);
        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }
        return this.http.get(url);
    }
};
AttendanceService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AttendanceService);
export { AttendanceService };
