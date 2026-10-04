import { Component, OnDestroy, OnInit } from '@angular/core';
import { AttendanceService, AttendanceSession } from '../attendance/attendance.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  fullName = 'Staff';
  employeeId = '—';
  designation = 'Staff';
  greeting = 'Good Morning';

  // Dashboard attendance data
  hoursWorked = '0h 00m';
  attendanceStatus = 'Not Marked';

  private attendanceTimer:
    ReturnType<typeof setInterval> | undefined;

  constructor(
    private AttendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadLoggedInUser();
    this.setGreeting();
    this.loadTodayAttendance();

    // Keep dashboard attendance updated while the employee is working.
    this.attendanceTimer = setInterval(() => {
      this.setGreeting();
      this.loadTodayAttendance();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.attendanceTimer) {
      clearInterval(this.attendanceTimer);
    }
  }

  // =====================================================
  // LOGGED-IN USER
  // =====================================================

  loadLoggedInUser(): void {

    const currentUserData =
      localStorage.getItem('currentUser');

    if (currentUserData) {
      try {

        const currentUser =
          JSON.parse(currentUserData);

        this.fullName =
          currentUser.fullName ||
          localStorage.getItem('fullName') ||
          'Staff';

      } catch (error) {

        console.error(
          'Unable to read current user:',
          error
        );

      }
    } else {

      this.fullName =
        localStorage.getItem('fullName') ||
        'Staff';
    }

    this.employeeId =
      localStorage.getItem('employeeId') ||
      '—';

    this.designation =
      localStorage.getItem('designation') ||
      localStorage.getItem('role') ||
      'Staff';
  }

  // =====================================================
  // GREETING
  // =====================================================

  setGreeting(): void {

    const hour = new Date().getHours();

    if (hour < 12) {

      this.greeting = 'Good Morning';

    } else if (hour < 17) {

      this.greeting = 'Good Afternoon';

    } else {

      this.greeting = 'Good Evening';

    }
  }

  // =====================================================
  // ATTENDANCE
  // =====================================================

  loadTodayAttendance(): void {

    this.AttendanceService.getMyToday().subscribe({

      next: (records: AttendanceSession[]) => {

        this.updateAttendanceDashboard(records);

      },

      error: (error) => {

        console.error(
          'Failed to load today attendance:',
          error
        );

        this.hoursWorked = '0h 00m';
        this.attendanceStatus = 'Not Marked';
      }

    });
  }

  updateAttendanceDashboard(
    records: AttendanceSession[]
  ): void {

    if (!records || records.length === 0) {

      this.hoursWorked = '0h 00m';
      this.attendanceStatus = 'Not Marked';

      return;
    }

    let totalMinutes = 0;
    let currentlyWorking = false;

    const now = new Date();

    for (const record of records) {

      if (!record.checkIn) {
        continue;
      }

      const checkIn =
        new Date(record.checkIn);

      const checkOut =
        record.checkOut
          ? new Date(record.checkOut)
          : now;

      if (!record.checkOut) {
        currentlyWorking = true;
      }

      // Match the existing Attendance page rules:
      // Half 1 = 09:30 AM - 02:00 PM
      // Half 2 = 03:00 PM - 06:00 PM

      const halfStart =
        new Date(checkIn);

      const halfEnd =
        new Date(checkIn);

      if (record.half === 'half1') {

        halfStart.setHours(9, 30, 0, 0);
        halfEnd.setHours(14, 0, 0, 0);

      } else {

        halfStart.setHours(15, 0, 0, 0);
        halfEnd.setHours(18, 0, 0, 0);
      }

      const start =
        Math.max(
          checkIn.getTime(),
          halfStart.getTime()
        );

      const end =
        Math.min(
          checkOut.getTime(),
          halfEnd.getTime()
        );

      if (end > start) {

        totalMinutes +=
          Math.floor(
            (end - start) / 60000
          );
      }
    }

    this.hoursWorked =
      this.formatDuration(totalMinutes);

    if (currentlyWorking) {

      this.attendanceStatus = 'Working';

    } else {

      this.attendanceStatus = 'Present';
    }
  }

  formatDuration(totalMinutes: number): string {

    if (totalMinutes <= 0) {
      return '0h 00m';
    }

    const hours =
      Math.floor(totalMinutes / 60);

    const minutes =
      totalMinutes % 60;

    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
}