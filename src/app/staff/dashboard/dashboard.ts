import { Component,  OnDestroy,OnInit,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  AttendanceService,
  AttendanceSession
} from '../attendance/attendance.service';

import {
  TaskService,
  StaffTask
} from '../services/task.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  // =====================================================
  // LOGGED-IN USER
  // =====================================================

  fullName = 'Staff';
  employeeId = '—';
  designation = 'Staff';
  greeting = 'Good Morning';


  // =====================================================
  // ATTENDANCE
  // =====================================================

  hoursWorked = '0h 00m';
  attendanceStatus = 'Not Marked';


  // =====================================================
  // TASKS
  // =====================================================

  tasks: StaffTask[] = [];
  todayTasks: StaffTask[] = [];

  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  resolvedTasks = 0;


  // =====================================================
  // TIMER
  // =====================================================

  private dashboardTimer:
    ReturnType<typeof setInterval> | undefined;

constructor(
  private attendanceService: AttendanceService,
  private taskService: TaskService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadLoggedInUser();

    this.setGreeting();

    this.loadTodayAttendance();

    this.loadMyTasks();


    // Refresh dashboard data periodically
    this.dashboardTimer = setInterval(() => {

      this.setGreeting();

      this.loadTodayAttendance();

      this.loadMyTasks();

    }, 10000);
  }


  // =====================================================
  // DESTROY
  // =====================================================

  ngOnDestroy(): void {

    if (this.dashboardTimer) {

      clearInterval(this.dashboardTimer);

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

      }

      catch (error) {

        console.error(
          'Unable to read current user:',
          error
        );

        this.fullName =
          localStorage.getItem('fullName') ||
          'Staff';
      }

    }

    else {

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

    }

    else if (hour < 17) {

      this.greeting = 'Good Afternoon';

    }

    else {

      this.greeting = 'Good Evening';
    }
  }


  // =====================================================
  // ATTENDANCE
  // =====================================================
loadTodayAttendance(): void {

  this.attendanceService.getMyAttendance().subscribe({

    next: (records: AttendanceSession[]) => {

      console.log('ALL ATTENDANCE RECORDS:', records);

      const today = new Date().toLocaleDateString('en-CA');

      const todayRecords = (records || []).filter(record => {

        if (!record.date) return false;

        return new Date(record.date).toLocaleDateString('en-CA') === today;

      });

      console.log('TODAY ATTENDANCE RECORDS:', todayRecords);
console.table(
  todayRecords.map(record => ({
    id: record.id,
    half: record.half,
    checkIn: record.checkIn,
    checkOut: record.checkOut,
    hoursWorkedMinutes: record.hoursWorkedMinutes
  }))
);
      this.updateAttendanceDashboard(todayRecords);

      this.cdr.detectChanges();

    },

    error: (error) => {

      console.error('Failed to load attendance:', error);

      this.hoursWorked = '0h 00m';
      this.attendanceStatus = 'Not Marked';

      this.cdr.detectChanges();

    }

  });

}



updateAttendanceDashboard(records: AttendanceSession[]): void {

  if (!records || records.length === 0) {
    this.hoursWorked = '0h 00m';
    this.attendanceStatus = 'Not Marked';
    return;
  }

  const now = new Date();
  const intervals: { start: number; end: number }[] = [];
  let currentlyWorking = false;

  for (const record of records) {

    if (!record.checkIn) {
      continue;
    }

    const checkIn = new Date(record.checkIn);
    const checkOut = record.checkOut
      ? new Date(record.checkOut)
      : now;

    if (isNaN(checkIn.getTime())) {
      continue;
    }

    if (!record.checkOut) {
      currentlyWorking = true;
    }

    const halfStart = new Date(checkIn);
    const halfEnd = new Date(checkIn);

    if (record.half === 'half1') {
      halfStart.setHours(9, 30, 0, 0);
      halfEnd.setHours(14, 0, 0, 0);
    } else {
      halfStart.setHours(15, 0, 0, 0);
      halfEnd.setHours(18, 0, 0, 0);
    }

    const start = Math.max(
      checkIn.getTime(),
      halfStart.getTime()
    );

    const end = Math.min(
      checkOut.getTime(),
      halfEnd.getTime(),
      now.getTime()
    );

    if (end > start) {
      intervals.push({ start, end });
    }
  }

  // Sort intervals and merge overlaps to avoid double counting.
  intervals.sort((a, b) => a.start - b.start);

  let totalMilliseconds = 0;
  let currentStart = 0;
  let currentEnd = 0;

  for (const interval of intervals) {

    if (currentEnd === 0) {
      currentStart = interval.start;
      currentEnd = interval.end;
    } else if (interval.start <= currentEnd) {
      currentEnd = Math.max(currentEnd, interval.end);
    } else {
      totalMilliseconds += currentEnd - currentStart;
      currentStart = interval.start;
      currentEnd = interval.end;
    }
  }

  if (currentEnd !== 0) {
    totalMilliseconds += currentEnd - currentStart;
  }

  const totalMinutes = Math.floor(
    totalMilliseconds / 60000
  );

  this.hoursWorked = this.formatDuration(totalMinutes);

  this.attendanceStatus = currentlyWorking
    ? 'Working'
    : 'Present';
}
formatDuration(totalMinutes: number): string {

  if (totalMinutes <= 0) {
    return '0h 00m';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}
  // =====================================================
  // TASKS
  // =====================================================

  loadMyTasks(): void {

  this.taskService.getMyTasks().subscribe({

    next: (tasks: StaffTask[]) => {

      console.log('API TASKS:', tasks);

      this.tasks = tasks || [];

      this.filterTodayTasks();

      console.log('TODAY TASKS:', this.todayTasks);
      console.log('TOTAL TASKS:', this.totalTasks);
      console.log('COMPLETED TASKS:', this.completedTasks);
      console.log('PENDING TASKS:', this.pendingTasks);

      this.cdr.detectChanges();

    },

    error: (error) => {

      console.error('Failed to load staff tasks:', error);

    }

  });

}

  // =====================================================
  // TODAY'S TASKS
  // =====================================================

filterTodayTasks(): void {
  const today = new Date().toDateString();

  this.todayTasks = (this.tasks || []).filter(task => {
    if (!task.createdAt) {
      return false;
    }

    return new Date(task.createdAt).toDateString() === today;
  });

  this.totalTasks = this.todayTasks.length;

  this.completedTasks = this.todayTasks.filter(
    task => task.status?.toLowerCase() === 'resolved'
  ).length;

  this.pendingTasks = this.todayTasks.filter(task => {
    const status = task.status?.toLowerCase();

    return status === 'pending' || status === 'in progress';
  }).length;

  this.resolvedTasks = this.completedTasks;
}

  // =====================================================
  // ADD TASK
  // =====================================================

  addTask(): void {

    this.router.navigate([
      '/staff/task-entry'
    ]);
  }


  // =====================================================
  // VIEW TASK
  // =====================================================

  viewTask(task: StaffTask): void {

    console.log(
      'Selected task:',
      task
    );

    // We will connect this to the task
    // details/edit page later.
  }

}