import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AttendanceService = class AttendanceService {
    http;
    apiUrl = 'https://localhost:7022/api/Attendance';
    constructor(http) {
        this.http = http;
    }
    checkIn(half) {
        return this.http.post(`${this.apiUrl}/check-in?half=${half}`, {});
    }
    checkOut(half) {
        return this.http.post(`${this.apiUrl}/check-out?half=${half}`, {});
    }
    getMyAttendance() {
        return this.http.get(`${this.apiUrl}/my`);
    }
    getMyToday() {
        return this.http.get(`${this.apiUrl}/my/today`);
    }
    getAdminAttendance() {
        return this.http.get(`${this.apiUrl}/admin`);
    }
};
AttendanceService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AttendanceService);
export { AttendanceService };
