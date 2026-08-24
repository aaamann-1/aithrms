import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface StaffReport {
  rank: number;
  name: string;
  initials: string;
  role: string;
  totalTickets: number;
  resolved: number;
  pending: number;
  escalated: number;
  workingHours: string;
}

interface Notification {
  title: string;
  message: string;
  time: string;
}

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
export class TeamReportsComponent {

  /* =========================================
     SIDEBAR
  ========================================= */

  sidebarCollapsed = false;


  /* =========================================
     SEARCH
  ========================================= */

  searchText = '';


  /* =========================================
     DATE
  ========================================= */

  selectedDate = '2026-08-22';


  /* =========================================
     NOTIFICATIONS
  ========================================= */

  notificationOpen = false;

  notifications: Notification[] = [
    {
      title: 'Ticket resolved',
      message: 'Rahul resolved a support ticket.',
      time: '10 min ago'
    },
    {
      title: 'Pending ticket',
      message: 'A ticket is waiting for attention.',
      time: '25 min ago'
    },
    {
      title: 'Ticket escalated',
      message: 'An issue has been escalated.',
      time: '1 hour ago'
    }
  ];


  /* =========================================
     PROFILE
  ========================================= */

  profileOpen = false;


  /* =========================================
     STAFF DATA
  ========================================= */

  staffReports: StaffReport[] = [

    {
      rank: 1,
      name: 'Rahul Verma',
      initials: 'RV',
      role: 'Senior Support',
      totalTickets: 48,
      resolved: 43,
      pending: 3,
      escalated: 2,
      workingHours: '8h 30m'
    },

    {
      rank: 2,
      name: 'Priya Nair',
      initials: 'PN',
      role: 'Support Engineer',
      totalTickets: 41,
      resolved: 38,
      pending: 2,
      escalated: 1,
      workingHours: '8h 15m'
    },

    {
      rank: 3,
      name: 'Amit Sharma',
      initials: 'AS',
      role: 'Support Engineer',
      totalTickets: 36,
      resolved: 30,
      pending: 4,
      escalated: 2,
      workingHours: '7h 45m'
    },

    {
      rank: 4,
      name: 'Sneha Joshi',
      initials: 'SJ',
      role: 'Junior Support',
      totalTickets: 29,
      resolved: 25,
      pending: 3,
      escalated: 1,
      workingHours: '8h 00m'
    },

    {
      rank: 5,
      name: 'Karan Mehta',
      initials: 'KM',
      role: 'Senior Support',
      totalTickets: 22,
      resolved: 18,
      pending: 2,
      escalated: 2,
      workingHours: '6h 30m'
    },

    {
      rank: 6,
      name: 'Divya Pillai',
      initials: 'DP',
      role: 'Support Engineer',
      totalTickets: 31,
      resolved: 28,
      pending: 2,
      escalated: 1,
      workingHours: '8h 10m'
    },

    {
      rank: 7,
      name: 'Rohan Gupta',
      initials: 'RG',
      role: 'Junior Support',
      totalTickets: 19,
      resolved: 16,
      pending: 2,
      escalated: 1,
      workingHours: '7h 50m'
    },

    {
      rank: 8,
      name: 'Ananya Singh',
      initials: 'AS',
      role: 'Support Engineer',
      totalTickets: 25,
      resolved: 21,
      pending: 3,
      escalated: 1,
      workingHours: '7h 20m'
    }

  ];


  constructor(private router: Router) {}


  /* =========================================
     NAVIGATION
  ========================================= */

  goTo(route: string): void {
    this.router.navigateByUrl(route);
  }


  /* =========================================
     SIDEBAR TOGGLE
  ========================================= */

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }


  /* =========================================
     SEARCH
  ========================================= */

  get filteredStaff(): StaffReport[] {

    const search = this.searchText
      .toLowerCase()
      .trim();

    if (!search) {
      return this.staffReports;
    }

    return this.staffReports.filter(staff =>

      staff.name.toLowerCase().includes(search) ||

      staff.initials.toLowerCase().includes(search) ||

      staff.role.toLowerCase().includes(search) ||

      staff.totalTickets.toString().includes(search) ||

      staff.resolved.toString().includes(search) ||

      staff.pending.toString().includes(search) ||

      staff.escalated.toString().includes(search) ||

      staff.workingHours.toLowerCase().includes(search) ||

      'resolved'.includes(search) ||

      'pending'.includes(search) ||

      'escalated'.includes(search)

    );
  }


  clearSearch(): void {
    this.searchText = '';
  }


  /* =========================================
     CALENDAR
  ========================================= */

  onDateChange(): void {
    console.log('Selected date:', this.selectedDate);
  }


  getFormattedDate(): string {

    if (!this.selectedDate) {
      return '';
    }

    const date = new Date(
      this.selectedDate + 'T00:00:00'
    );

    return date.toLocaleDateString(
      'en-IN',
      {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    );
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


  logout(): void {
    this.profileOpen = false;

    // Change this route if your login route is different
    this.router.navigateByUrl('/login');
  }


  /* =========================================
     RESOLUTION RATE
  ========================================= */

  getResolutionRate(staff: StaffReport): number {

    if (staff.totalTickets === 0) {
      return 0;
    }

    return Math.round(
      (staff.resolved / staff.totalTickets) * 100
    );
  }


  /* =========================================
     CHART HEIGHT
  ========================================= */

  getBarHeight(value: number): number {

    const maxTickets = 50;

    return Math.min(
      Math.round((value / maxTickets) * 100),
      100
    );
  }


  /* =========================================
     TOTAL TICKETS
  ========================================= */

  get totalTickets(): number {

    return this.filteredStaff.reduce(
      (total, staff) =>
        total + staff.totalTickets,
      0
    );
  }


  /* =========================================
     TOTAL RESOLVED
  ========================================= */

  get totalResolved(): number {

    return this.filteredStaff.reduce(
      (total, staff) =>
        total + staff.resolved,
      0
    );
  }


  /* =========================================
     TOTAL PENDING
  ========================================= */

  get totalPending(): number {

    return this.filteredStaff.reduce(
      (total, staff) =>
        total + staff.pending,
      0
    );
  }


  /* =========================================
     TOTAL ESCALATED
  ========================================= */

  get totalEscalated(): number {

    return this.filteredStaff.reduce(
      (total, staff) =>
        total + staff.escalated,
      0
    );
  }


  /* =========================================
     TEAM RESOLUTION RATE
  ========================================= */

  get teamResolutionRate(): number {

    if (this.totalTickets === 0) {
      return 0;
    }

    return Math.round(
      (this.totalResolved / this.totalTickets) * 100
    );
  }

}