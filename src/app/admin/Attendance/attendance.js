import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let Attendance = class Attendance {
    http;
    router;
    cdr;
    // ==========================================================
    // API
    // ==========================================================
    apiUrl = 'http://localhost:5089/api';
    // ==========================================================
    // SIDEBAR
    // ==========================================================
    sidebarCollapsed = false;
    // ==========================================================
    // SEARCH
    // ==========================================================
    searchQuery = '';
    filteredAttendance = [];
    // ==========================================================
    // DATE
    // ==========================================================
    selectedDate = '';
    // ==========================================================
    // DROPDOWNS
    // ==========================================================
    showNotifications = false;
    showProfile = false;
    // ==========================================================
    // BACKEND DATA
    // ==========================================================
    attendanceRecords = [];
    employees = [];
    // ==========================================================
    // DISPLAY DATA
    // ==========================================================
    attendance = [];
    // ==========================================================
    // HOLIDAY
    // ==========================================================
    isHoliday = false;
    // ==========================================================
    // STATISTICS
    // ==========================================================
    totalStaff = 0;
    presentCount = 0;
    absentCount = 0;
    averageHours = '0m';
    // ==========================================================
    // CONSTRUCTOR
    // ==========================================================
    constructor(http, router, cdr) {
        this.http = http;
        this.router = router;
        this.cdr = cdr;
        const today = new Date();
        this.selectedDate =
            this.getLocalDateString(today);
    }
    // ==========================================================
    // ON INIT
    // ==========================================================
    ngOnInit() {
        this.loadEmployees();
        this.loadAttendance();
    }
    // ==========================================================
    // LOAD EMPLOYEES
    // ==========================================================
    loadEmployees() {
        this.http
            .get(`${this.apiUrl}/Employee`)
            .subscribe({
            next: (employees) => {
                console.log('Employees received:', employees);
                this.employees =
                    Array.isArray(employees)
                        ? employees
                        : [];
                this.totalStaff =
                    this.employees.length;
                this.buildAttendance();
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to load employees:', error);
            }
        });
    }
    // ==========================================================
    // LOAD ATTENDANCE
    // ==========================================================
    loadAttendance() {
        this.http
            .get(`${this.apiUrl}/Attendance/admin`)
            .subscribe({
            next: (records) => {
                console.log('Attendance records received:', records);
                this.attendanceRecords =
                    Array.isArray(records)
                        ? records
                        : [];
                this.buildAttendance();
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to load attendance:', error);
            }
        });
    }
    // ==========================================================
    // BUILD ATTENDANCE
    // ==========================================================
    buildAttendance() {
        if (!this.employees ||
            this.employees.length === 0) {
            return;
        }
        // ========================================================
        // CHECK SUNDAY
        // ========================================================
        const selectedDateObject = new Date(this.selectedDate +
            'T00:00:00');
        this.isHoliday =
            selectedDateObject.getDay() === 0;
        // ========================================================
        // SUNDAY / HOLIDAY
        // ========================================================
        if (this.isHoliday) {
            console.log('Selected date is Sunday. Holiday.');
            this.totalStaff =
                this.employees.length;
            this.presentCount = 0;
            this.absentCount = 0;
            this.averageHours = '0m';
            this.attendance = [];
            this.filteredAttendance = [];
            this.cdr.detectChanges();
            return;
        }
        // ========================================================
        // GET SELECTED DATE RECORDS
        // ========================================================
        const selectedRecords = this.attendanceRecords.filter(record => this.getAttendanceDateString(record.date) === this.selectedDate);
        // ========================================================
        // GROUP RECORDS BY USER ID
        // ========================================================
        const attendanceByUser = new Map();
        for (const record of selectedRecords) {
            const userId = Number(record.userId);
            if (!attendanceByUser.has(userId)) {
                attendanceByUser.set(userId, []);
            }
            attendanceByUser
                .get(userId)
                .push(record);
        }
        // ========================================================
        // BUILD STAFF ROWS
        // ========================================================
        const rows = [];
        let present = 0;
        let totalMinutes = 0;
        for (const employee of this.employees) {
            const userId = this.getEmployeeUserId(employee);
            if (userId === null) {
                continue;
            }
            const records = attendanceByUser.get(userId) || [];
            // ======================================================
            // ABSENT
            // ======================================================
            if (records.length === 0) {
                const name = this.getEmployeeName(employee) ||
                    'Unknown Staff';
                rows.push({
                    userId,
                    initials: this.getInitials(name),
                    name,
                    punchIn: '—',
                    punchOut: '—',
                    hours: '—',
                    status: 'Absent',
                    hoursWorkedMinutes: 0
                });
                continue;
            }
            // ======================================================
            // PRESENT
            // ======================================================
            present++;
            let firstCheckIn = null;
            let lastCheckOut = null;
            let workedMinutes = 0;
            for (const record of records) {
                workedMinutes +=
                    Number(record.hoursWorkedMinutes ||
                        0);
                if (record.checkIn) {
                    const checkIn = new Date(record.checkIn);
                    if (!firstCheckIn ||
                        checkIn <
                            firstCheckIn) {
                        firstCheckIn =
                            checkIn;
                    }
                }
                if (record.checkOut) {
                    const checkOut = new Date(record.checkOut);
                    if (!lastCheckOut ||
                        checkOut >
                            lastCheckOut) {
                        lastCheckOut =
                            checkOut;
                    }
                }
            }
            totalMinutes +=
                workedMinutes;
            const name = this.getEmployeeName(employee) ||
                records[0]?.staffName ||
                'Unknown Staff';
            rows.push({
                userId,
                initials: this.getInitials(name),
                name,
                punchIn: firstCheckIn
                    ? this.formatTime(firstCheckIn)
                    : '—',
                punchOut: lastCheckOut
                    ? this.formatTime(lastCheckOut)
                    : '—',
                hours: this.formatMinutes(workedMinutes),
                status: 'Present',
                hoursWorkedMinutes: workedMinutes
            });
        }
        // ========================================================
        // UPDATE STATISTICS
        // ========================================================
        this.totalStaff =
            this.employees.length;
        this.presentCount =
            present;
        this.absentCount =
            Math.max(this.totalStaff -
                this.presentCount, 0);
        if (this.presentCount > 0) {
            const averageMinutes = Math.round(totalMinutes /
                this.presentCount);
            this.averageHours =
                this.formatMinutes(averageMinutes);
        }
        else {
            this.averageHours =
                '0m';
        }
        // ========================================================
        // SAVE DATA
        // ========================================================
        this.attendance =
            rows;
        this.filteredAttendance =
            [...rows];
        // Reapply search if needed
        this.searchAttendance();
        this.cdr.detectChanges();
        console.log('Attendance rows:', this.attendance);
        console.log('Attendance statistics:', {
            totalStaff: this.totalStaff,
            present: this.presentCount,
            absent: this.absentCount,
            averageHours: this.averageHours
        });
    }
    // ==========================================================
    // DATE CHANGE
    // ==========================================================
    onDateChange() {
        console.log('Attendance date changed:', this.selectedDate);
        this.buildAttendance();
    }
    // ==========================================================
    // GET EMPLOYEE USER ID
    // ==========================================================
    getEmployeeUserId(employee) {
        if (employee.userId !== undefined &&
            employee.userId !== null) {
            return Number(employee.userId);
        }
        if (employee.id !== undefined &&
            employee.id !== null) {
            return Number(employee.id);
        }
        return null;
    }
    // ==========================================================
    // GET EMPLOYEE NAME
    // ==========================================================
    getEmployeeName(employee) {
        return (employee.fullName ||
            employee.employeeName ||
            employee.username ||
            '');
    }
    // ==========================================================
    // SEARCH
    // ==========================================================
    searchAttendance() {
        const query = this.searchQuery
            .trim()
            .toLowerCase();
        if (!query) {
            this.filteredAttendance =
                [...this.attendance];
            return;
        }
        this.filteredAttendance =
            this.attendance.filter(person => person.name
                .toLowerCase()
                .includes(query) ||
                person.initials
                    .toLowerCase()
                    .includes(query) ||
                person.status
                    .toLowerCase()
                    .includes(query));
    }
    // ==========================================================
    // CLEAR SEARCH
    // ==========================================================
    clearSearch() {
        this.searchQuery = '';
        this.filteredAttendance =
            [...this.attendance];
    }
    // ==========================================================
    // GET LOCAL DATE STRING
    // ==========================================================
    getLocalDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    // ==========================================================
    // GET ATTENDANCE DATE STRING
    // ==========================================================
    getAttendanceDateString(value) {
        if (!value) {
            return '';
        }
        const date = new Date(value);
        return this.getLocalDateString(date);
    }
    // ==========================================================
    // FORMAT DATE
    // ==========================================================
    getFormattedDate() {
        if (!this.selectedDate) {
            return '';
        }
        const date = new Date(this.selectedDate +
            'T00:00:00');
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }
    // ==========================================================
    // FORMAT TIME
    // ==========================================================
    formatTime(date) {
        return date.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    // ==========================================================
    // FORMAT MINUTES
    // ==========================================================
    formatMinutes(minutes) {
        if (!minutes ||
            minutes <= 0) {
            return '0m';
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours > 0 &&
            remainingMinutes > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        if (hours > 0) {
            return `${hours}h`;
        }
        return `${remainingMinutes}m`;
    }
    // ==========================================================
    // GET INITIALS
    // ==========================================================
    getInitials(name) {
        if (!name) {
            return '?';
        }
        const parts = name
            .trim()
            .split(/\s+/);
        if (parts.length === 1) {
            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }
        return (parts[0][0] +
            parts[parts.length - 1][0]).toUpperCase();
    }
    // ==========================================================
    // NAVIGATION
    // ==========================================================
    goTo(path) {
        this.showNotifications =
            false;
        this.showProfile =
            false;
        this.router.navigateByUrl(path);
    }
    // ==========================================================
    // SIDEBAR TOGGLE
    // ==========================================================
    toggleSidebar() {
        this.sidebarCollapsed =
            !this.sidebarCollapsed;
    }
    // ==========================================================
    // NOTIFICATIONS
    // ==========================================================
    toggleNotifications() {
        this.showNotifications =
            !this.showNotifications;
        if (this.showNotifications) {
            this.showProfile =
                false;
        }
    }
    // ==========================================================
    // PROFILE
    // ==========================================================
    toggleProfile() {
        this.showProfile =
            !this.showProfile;
        if (this.showProfile) {
            this.showNotifications =
                false;
        }
    }
    // ==========================================================
    // LOGOUT
    // ==========================================================
    logout() {
        console.log('User logged out');
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
    }
};
Attendance = __decorate([
    Component({
        selector: 'app-attendance',
        standalone: true,
        imports: [
            CommonModule,
            FormsModule
        ],
        templateUrl: './attendance.html',
        styleUrl: './attendance.css'
    })
], Attendance);
export { Attendance };
