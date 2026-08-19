import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance {

  // =========================
  // SIDEBAR
  // =========================

  sidebarCollapsed = false;


  // =========================
  // SEARCH
  // =========================

  searchQuery = '';

  filteredAttendance: any[] = [];


  // =========================
  // DATE
  // =========================

  selectedDate = '2026-08-19';


  // =========================
  // DROPDOWNS
  // =========================

  showNotifications = false;
  showProfile = false;


  // =========================
  // ATTENDANCE DATA
  // =========================

  attendance = [
    {
      initials: 'RV',
      name: 'Rahul Verma',
      punchIn: '09:02 AM',
      punchOut: '06:02 PM',
      hours: '8h 30m',
      status: 'Present'
    },
    {
      initials: 'PN',
      name: 'Priya Nair',
      punchIn: '09:15 AM',
      punchOut: '05:45 PM',
      hours: '8h 15m',
      status: 'Present'
    },
    {
      initials: 'AS',
      name: 'Amit Sharma',
      punchIn: '09:30 AM',
      punchOut: '—',
      hours: '7h 45m',
      status: 'Present'
    },
    {
      initials: 'SJ',
      name: 'Sneha Joshi',
      punchIn: '09:00 AM',
      punchOut: '05:30 PM',
      hours: '8h 00m',
      status: 'Present'
    },
    {
      initials: 'KM',
      name: 'Karan Mehta',
      punchIn: '—',
      punchOut: '—',
      hours: '—',
      status: 'Absent'
    },
    {
      initials: 'DP',
      name: 'Divya Pillai',
      punchIn: '08:55 AM',
      punchOut: '05:40 PM',
      hours: '8h 10m',
      status: 'Present'
    },
    {
      initials: 'RG',
      name: 'Rohan Gupta',
      punchIn: '09:10 AM',
      punchOut: '05:50 PM',
      hours: '7h 50m',
      status: 'Present'
    },
    {
      initials: 'AS',
      name: 'Ananya Singh',
      punchIn: '09:25 AM',
      punchOut: '—',
      hours: '7h 20m',
      status: 'Present'
    }
  ];


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(private router: Router) {

    this.filteredAttendance = [...this.attendance];

  }


  // =========================
  // NAVIGATION
  // =========================

  goTo(path: string): void {

    this.showNotifications = false;
    this.showProfile = false;

    this.router.navigateByUrl(path);

  }


  // =========================
  // SIDEBAR TOGGLE
  // =========================

  toggleSidebar(): void {

    this.sidebarCollapsed = !this.sidebarCollapsed;

  }


  // =========================
  // SEARCH
  // =========================

  searchAttendance(): void {

    const query = this.searchQuery
      .trim()
      .toLowerCase();

    if (!query) {

      this.filteredAttendance = [...this.attendance];

      return;

    }

    this.filteredAttendance = this.attendance.filter(person =>

      person.name.toLowerCase().includes(query) ||

      person.initials.toLowerCase().includes(query) ||

      person.status.toLowerCase().includes(query)

    );

  }


  // =========================
  // DATE CHANGE
  // =========================

  onDateChange(): void {

    console.log(
      'Attendance date changed:',
      this.selectedDate
    );

  }


  // =========================
  // FORMAT DATE
  // =========================

  getFormattedDate(): string {

    if (!this.selectedDate) {
      return '';
    }

    const date = new Date(
      this.selectedDate + 'T00:00:00'
    );

    return date.toLocaleDateString('en-US', {

      weekday: 'long',

      month: 'long',

      day: 'numeric',

      year: 'numeric'

    });

  }


  // =========================
  // NOTIFICATIONS
  // =========================

  toggleNotifications(): void {

    this.showNotifications =
      !this.showNotifications;

    if (this.showNotifications) {

      this.showProfile = false;

    }

  }


  // =========================
  // PROFILE
  // =========================

  toggleProfile(): void {

    this.showProfile =
      !this.showProfile;

    if (this.showProfile) {

      this.showNotifications = false;

    }

  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    console.log('User logged out');

    this.router.navigateByUrl('/login');

  }

}