import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ReportService,
  TeamReport,
  TeamEmployeeReport
} from '../../../services/report.service';


@Component({
  selector: 'app-team-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './team.html',
  styleUrls: ['./team.css']
})
export class TeamReportsComponent implements OnInit {

  /* =========================================
     SIDEBAR
  ========================================= */

  sidebarCollapsed = false;


  /* =========================================
     SEARCH
  ========================================= */

  searchText = '';


  /* =========================================
     DATE RANGE
  ========================================= */

  fromDate = this.getFirstDayOfCurrentMonth();

  toDate = this.getToday();


  /* =========================================
     REPORT
  ========================================= */

  teamReport: TeamReport | null = null;

  loadingReport = false;

  errorMessage = '';


  /* =========================================
     NOTIFICATIONS
  ========================================= */

  notificationOpen = false;


  /* =========================================
     PROFILE
  ========================================= */

  profileOpen = false;


  constructor(
    private router: Router,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}


  /* =========================================
     INIT
  ========================================= */

  ngOnInit(): void {
    this.loadTeamReport();
  }


  /* =========================================
     LOAD TEAM REPORT
  ========================================= */

  loadTeamReport(): void {

    console.log(
      '1. Loading team report:',
      this.fromDate,
      this.toDate
    );

    this.loadingReport = true;

    this.errorMessage = '';

    this.teamReport = null;


    this.reportService
      .getTeamReport(
        this.fromDate,
        this.toDate
      )
      .subscribe({

        next: (report: TeamReport) => {

          console.log(
            '2. TEAM REPORT API RESPONSE:',
            report
          );


          this.teamReport = report;

          this.loadingReport = false;


          console.log(
            '3. teamReport:',
            this.teamReport
          );

          console.log(
            '4. loadingReport:',
            this.loadingReport
          );


          this.cdr.detectChanges();
        },


        error: (error: any) => {

          console.error(
            'TEAM REPORT API ERROR:',
            error
          );


          this.loadingReport = false;

          this.teamReport = null;


          if (error.status === 400) {

            this.errorMessage =
              error.error?.message ||
              'Invalid report date range.';

          }
          else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          }
          else if (error.status === 403) {

            this.errorMessage =
              'You are not authorized to view team reports.';

          }
          else {

            this.errorMessage =
              'Unable to load the team report.';

          }


          this.cdr.detectChanges();
        }

      });
  }


  /* =========================================
     DATE CHANGE
  ========================================= */

  onDateChange(): void {

    if (!this.fromDate || !this.toDate) {
      return;
    }


    if (this.fromDate > this.toDate) {

      this.errorMessage =
        'From date cannot be later than to date.';

      this.teamReport = null;

      return;
    }


    this.loadTeamReport();
  }


  /* =========================================
     FORMATTED DATE RANGE
  ========================================= */

  getFormattedDate(): string {

    if (!this.fromDate || !this.toDate) {
      return '';
    }


    const from = new Date(
      this.fromDate + 'T00:00:00'
    );

    const to = new Date(
      this.toDate + 'T00:00:00'
    );


    const format = (date: Date): string => {

      return date.toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );

    };


    return `${format(from)} - ${format(to)}`;
  }


  /* =========================================
     FILTERED STAFF
  ========================================= */

  get filteredStaff(): TeamEmployeeReport[] {

    if (!this.teamReport) {
      return [];
    }


    const search =
      this.searchText
        .toLowerCase()
        .trim();


    if (!search) {

      return this.teamReport.employees;

    }


    return this.teamReport.employees.filter(
      staff =>

        staff.employeeName
          .toLowerCase()
          .includes(search) ||

        (staff.department ?? '')
          .toLowerCase()
          .includes(search) ||

        (staff.designation ?? '')
          .toLowerCase()
          .includes(search)

    );
  }


  /* =========================================
     RANK
  ========================================= */

  getRank(staff: TeamEmployeeReport): number {

    const employees = [...this.filteredStaff];


    employees.sort(
      (a, b) =>
        b.totalHoursWorkedMinutes -
        a.totalHoursWorkedMinutes
    );


    return (
      employees.findIndex(
        employee =>
          employee.employeeId === staff.employeeId
      ) + 1
    );
  }


  /* =========================================
     INITIALS
  ========================================= */

  getInitials(name: string): string {

    if (!name) {
      return '';
    }


    const parts =
      name.trim().split(/\s+/);


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


  /* =========================================
     WORKING HOURS
  ========================================= */

  formatMinutes(minutes: number): string {

    if (!minutes || minutes <= 0) {
      return '0h 0m';
    }


    const hours =
      Math.floor(minutes / 60);

    const remainingMinutes =
      minutes % 60;


    return `${hours}h ${remainingMinutes}m`;
  }


  /* =========================================
     BAR HEIGHT
  ========================================= */

  getBarHeight(
    minutes: number
  ): number {

    const maxMinutes =
      Math.max(
        ...this.filteredStaff.map(
          staff =>
            staff.totalHoursWorkedMinutes
        ),
        1
      );


    return Math.round(
      (minutes / maxMinutes) * 100
    );
  }


  /* =========================================
     TOTAL ATTENDANCE
  ========================================= */

  get totalAttendanceRecords(): number {

    return this.filteredStaff.reduce(
      (total, staff) =>
        total +
        staff.totalAttendanceRecords,
      0
    );
  }


  /* =========================================
     TOTAL HOURS
  ========================================= */

  get totalHoursWorkedMinutes(): number {

    return this.filteredStaff.reduce(
      (total, staff) =>
        total +
        staff.totalHoursWorkedMinutes,
      0
    );
  }


  get totalHoursWorked(): string {

    return this.formatMinutes(
      this.totalHoursWorkedMinutes
    );
  }


  /* =========================================
     AVERAGE HOURS
  ========================================= */

  get averageHoursWorked(): string {

    if (this.filteredStaff.length === 0) {
      return '0h 0m';
    }


    const average =
      Math.round(
        this.totalHoursWorkedMinutes /
        this.filteredStaff.length
      );


    return this.formatMinutes(average);
  }


  /* =========================================
     NAVIGATION
  ========================================= */

  goTo(route: string): void {

    this.router.navigateByUrl(route);

  }


  /* =========================================
     SIDEBAR
  ========================================= */

  toggleSidebar(): void {

    this.sidebarCollapsed =
      !this.sidebarCollapsed;

  }


  /* =========================================
     NOTIFICATIONS
  ========================================= */

  toggleNotifications(): void {

    this.notificationOpen =
      !this.notificationOpen;


    if (this.notificationOpen) {
      this.profileOpen = false;
    }

  }


  /* =========================================
     PROFILE
  ========================================= */

  toggleProfile(): void {

    this.profileOpen =
      !this.profileOpen;


    if (this.profileOpen) {
      this.notificationOpen = false;
    }

  }


  openProfile(): void {

    this.profileOpen = false;

    this.goTo('/admin/profile');

  }


  openSettings(): void {

    this.profileOpen = false;

    this.goTo('/admin/settings');

  }


  /* =========================================
     LOGOUT
  ========================================= */

  logout(): void {

    this.profileOpen = false;

    localStorage.removeItem('authUser');

    localStorage.removeItem('token');

    localStorage.removeItem('role');

    localStorage.removeItem('currentUser');

    this.router.navigateByUrl('/login');

  }


  /* =========================================
     DATE HELPERS
  ========================================= */

  private getToday(): string {

    const date = new Date();

    return this.formatDateForInput(date);

  }


  private getFirstDayOfCurrentMonth(): string {

    const date = new Date();

    date.setDate(1);

    return this.formatDateForInput(date);

  }


  private formatDateForInput(
    date: Date
  ): string {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');


    return `${year}-${month}-${day}`;
  }

}