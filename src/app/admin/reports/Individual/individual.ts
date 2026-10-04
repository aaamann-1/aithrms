import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { EmployeeService } from '../../../services/employee.service';
import {
  ReportService,
  IndividualReport,
  AttendanceReportItem
} from '../../../services/report.service';

interface Staff {
  id: number;
  name: string;
  initials: string;
  role: string;
  status: 'Online' | 'Offline' | 'Busy';
  color: string;
}

@Component({
  selector: 'app-individual-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './individual.html',
  styleUrl: './individual.css'
})
export class IndividualReports implements OnInit {

  sidebarCollapsed = false;

  searchQuery = '';

  /*
   * Report date range.
   *
   * We start with the current month.
   */
  fromDate = this.getFirstDayOfCurrentMonth();
  toDate = this.getToday();

  profileOpen = false;
  notificationOpen = false;

  staffList: Staff[] = [];

  selectedStaff: Staff | null = null;

  selectedReport: IndividualReport | null = null;

  loadingStaff = false;
  loadingReport = false;

  errorMessage = '';

  constructor(
  private router: Router,
  private employeeService: EmployeeService,
  private reportService: ReportService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  // =========================================================
  // STAFF
  // =========================================================

 loadStaff(): void {
  console.log('1. loadStaff() started');

  this.loadingStaff = true;

  this.employeeService.getStaff().subscribe({
    next: (employees: any[]) => {
      console.log('2. STAFF API RESPONSE:', employees);

      this.staffList = employees.map(employee => {
        const name =
          employee.employeeName ??
          employee.name ??
          'Unknown Employee';

        return {
          id: employee.employeeId ?? employee.id,
          name: name,
          initials: this.getInitials(name),
          role: employee.designation ?? employee.title ?? 'Staff',
          status: 'Online' as 'Online',
          color: this.getColor(name)
        };
      });

      console.log('3. staffList AFTER MAP:', this.staffList);

      this.loadingStaff = false;

      console.log('4. loadingStaff:', this.loadingStaff);

      if (this.staffList.length > 0) {
        console.log(
          '5. Selecting first staff:',
          this.staffList[0]
        );

        this.selectStaff(this.staffList[0]);
      }

      // Force Angular to refresh the screen
      this.cdr.detectChanges();
    },

    error: (error: any) => {
      console.error('STAFF API ERROR:', error);

      this.loadingStaff = false;

      this.errorMessage =
        'Unable to load staff members. Please check the API connection.';

      this.cdr.detectChanges();
    }
  });
}
  selectStaff(staff: Staff): void {

    this.selectedStaff = staff;

    this.loadIndividualReport();
  }

  // =========================================================
  // INDIVIDUAL REPORT
  // =========================================================

  loadIndividualReport(): void {
  if (!this.selectedStaff) {
    return;
  }

  console.log(
    '1. Loading report for employee:',
    this.selectedStaff.id
  );

  this.loadingReport = true;
  this.selectedReport = null;
  this.errorMessage = '';

  this.reportService
    .getIndividualReport(
      this.selectedStaff.id,
      this.fromDate,
      this.toDate
    )
    .subscribe({
      next: (report: IndividualReport) => {
        console.log('2. REPORT API RESPONSE:', report);

        this.selectedReport = report;
        this.loadingReport = false;

        console.log(
          '3. selectedReport:',
          this.selectedReport
        );

        console.log(
          '4. loadingReport:',
          this.loadingReport
        );

        // Force Angular to refresh the view
        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error(
          'REPORT API ERROR:',
          error
        );

        this.loadingReport = false;
        this.selectedReport = null;

        if (error.status === 404) {
          this.errorMessage = 'Employee report not found.';
        } else if (error.status === 400) {
          this.errorMessage =
            error.error?.message ||
            'Invalid report date range.';
        } else if (error.status === 401) {
          this.errorMessage =
            'Your session has expired. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage =
            'You are not authorized to view reports.';
        } else {
          this.errorMessage =
            'Unable to load the attendance report.';
        }

        this.cdr.detectChanges();
      }
    });
}

  onDateChange(): void {
    this.loadIndividualReport();
  }

  // =========================================================
  // DATE HELPERS
  // =========================================================

  getToday(): string {

    const today = new Date();

    return this.formatDate(today);
  }

  getFirstDayOfCurrentMonth(): string {

    const date = new Date();

    date.setDate(1);

    return this.formatDate(date);
  }

  private formatDate(date: Date): string {

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // =========================================================
  // DISPLAY DATE
  // =========================================================

  get formattedDate(): string {

    if (!this.fromDate || !this.toDate) {
      return 'Select date range';
    }

    const from = new Date(
      this.fromDate + 'T00:00:00'
    );

    const to = new Date(
      this.toDate + 'T00:00:00'
    );

    const fromText = from.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

    const toText = to.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

    return `${fromText} - ${toText}`;
  }

  // =========================================================
  // ATTENDANCE
  // =========================================================

  getFilteredActivities(): AttendanceReportItem[] {

    if (!this.selectedReport) {
      return [];
    }

    const search =
      this.searchQuery
        .trim()
        .toLowerCase();

    if (!search) {
      return this.selectedReport.attendance;
    }

    return this.selectedReport.attendance.filter(
      attendance => {

        const date =
          this.formatAttendanceDate(
            attendance.date
          ).toLowerCase();

        const half =
          attendance.half
            ?.toLowerCase() ?? '';

        return (
          date.includes(search) ||
          half.includes(search)
        );
      }
    );
  }

  formatAttendanceDate(dateValue: string): string {

    if (!dateValue) {
      return '';
    }

    const date = new Date(dateValue);

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  formatTime(dateValue: string | null): string {

    if (!dateValue) {
      return '-';
    }

    const date = new Date(dateValue);

    return date.toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }

  formatMinutes(minutes: number): string {

    if (!minutes || minutes <= 0) {
      return '0m';
    }

    const hours = Math.floor(
      minutes / 60
    );

    const remainingMinutes =
      minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}m`;
    }

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }

  // =========================================================
  // REPORT STATISTICS
  // =========================================================

  get totalAttendanceRecords(): number {

    return this.selectedReport
      ?.totalAttendanceRecords ?? 0;
  }

  get totalHoursWorkedMinutes(): number {

    return this.selectedReport
      ?.totalHoursWorkedMinutes ?? 0;
  }

  get totalHoursWorked(): string {

    return this.formatMinutes(
      this.totalHoursWorkedMinutes
    );
  }

  // =========================================================
  // STAFF HELPERS
  // =========================================================

  getInitials(name: string): string {

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

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  }

  getColor(name: string): string {

    const colors = [
      'green',
      'blue',
      'purple',
      'orange',
      'yellow',
      'pink'
    ];

    let total = 0;

    for (let i = 0; i < name.length; i++) {
      total += name.charCodeAt(i);
    }

    return colors[
      total % colors.length
    ];
  }

  getStatusDot(status: string): string {

    switch (status) {

      case 'Online':
        return 'online';

      case 'Busy':
        return 'busy';

      case 'Offline':
        return 'offline';

      default:
        return '';
    }
  }

  // =========================================================
  // SIDEBAR / NAVIGATION
  // =========================================================

  toggleSidebar(): void {

    this.sidebarCollapsed =
      !this.sidebarCollapsed;
  }

  goTo(path: string): void {

    this.router.navigate([path]);
  }

  // =========================================================
  // PROFILE / NOTIFICATIONS
  // =========================================================

  toggleProfile(): void {

    this.profileOpen =
      !this.profileOpen;

    this.notificationOpen = false;
  }

  toggleNotifications(): void {

    this.notificationOpen =
      !this.notificationOpen;

    this.profileOpen = false;
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    localStorage.removeItem('authUser');
    localStorage.removeItem('token');

    sessionStorage.removeItem('currentUser');

    this.router.navigate(['/login']);
  }
}