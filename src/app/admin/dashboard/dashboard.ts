import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  // =====================================================
  // CURRENT USER
  // =====================================================

  currentUser: any;

  // =====================================================
  // DROPDOWN
  // =====================================================

  profileDropdownOpen = false;

  notificationDropdownOpen = false;

  // =====================================================
  // SEARCH
  // =====================================================

  searchText = '';

  searchResults: any[] = [];

  // =====================================================
  // DASHBOARD STATISTICS
  // =====================================================

  stats = {
    totalStaff: 12,
    presentToday: 10,
    issuesSolved: 156,
    pendingIssues: 38,
    escalated: 18,
    avgResolution: '24m'
  };

  // =====================================================
  // LIVE ACTIVITY
  // =====================================================

  activities = [

    {
      initials: 'RV',
      name: 'Rahul Verma',
      client: 'Sharma Enterprises',
      clientId: 'CLI-4821',
      category: 'Licensing',
      duration: '14m',
      time: '10:42 AM',
      status: 'Resolved',
      avatar: 'green'
    },

    {
      initials: 'PN',
      name: 'Priya Nair',
      client: 'Mehta & Sons Pvt Ltd',
      clientId: 'CLI-3309',
      category: 'Bill Format Modification',
      duration: '32m',
      time: '10:28 AM',
      status: 'Pending',
      avatar: 'blue'
    },

    {
      initials: 'AS',
      name: 'Amit Sharma',
      client: 'Rajkumar Trading',
      clientId: 'CLI-5517',
      category: 'Backup & Restore',
      duration: '1h 05m',
      time: '09:55 AM',
      status: 'Escalated',
      avatar: 'purple'
    },

    {
      initials: 'SJ',
      name: 'Sneha Joshi',
      client: 'Patel Pharma Ltd',
      clientId: 'CLI-2234',
      category: 'Wallet Activation',
      duration: '22m',
      time: '09:38 AM',
      status: 'Resolved',
      avatar: 'orange'
    },

    {
      initials: 'KM',
      name: 'Karan Mehta',
      client: 'Global Textiles Co',
      clientId: 'CLI-6601',
      category: 'Windows Formatting',
      duration: '48m',
      time: '09:15 AM',
      status: 'Pending',
      avatar: 'yellow'
    },

    {
      initials: 'DP',
      name: 'Divya Pillai',
      client: 'Sunrise Exports',
      clientId: 'CLI-1122',
      category: 'Installation',
      duration: '18m',
      time: '08:57 AM',
      status: 'Resolved',
      avatar: 'pink'
    }

  ];

  // =====================================================
  // ISSUE CATEGORIES
  // =====================================================

  categories = [

    {
      name: 'Installation',
      value: 58
    },

    {
      name: 'Bill Format Mod.',
      value: 42
    },

    {
      name: 'Backup & Restore',
      value: 35
    },

    {
      name: 'Licensing',
      value: 31
    },

    {
      name: 'Wallet Activation',
      value: 24
    },

    {
      name: 'Windows Format.',
      value: 18
    },

    {
      name: 'Others',
      value: 14
    }

  ];

  // =====================================================
  // WEEKLY TREND
  // =====================================================

  weeklyData = [

    {
      day: 'Mon',
      value: 32
    },

    {
      day: 'Tue',
      value: 28
    },

    {
      day: 'Wed',
      value: 41
    },

    {
      day: 'Thu',
      value: 35
    },

    {
      day: 'Fri',
      value: 38
    },

    {
      day: 'Sat',
      value: 20
    },

    {
      day: 'Sun',
      value: 12
    }

  ];

  // =====================================================
  // RECENT TASKS
  // =====================================================

  recentTasks = [

    {
      clientId: 'CLI-4821',
      clientName: 'Sharma Enterprises',
      category: 'Licensing',
      status: 'Resolved',
      time: '14m',
      staff: 'Rahul Verma'
    },

    {
      clientId: 'CLI-3309',
      clientName: 'Mehta & Sons Pvt Ltd',
      category: 'Bill Format Modification',
      status: 'Pending',
      time: '32m',
      staff: 'Priya Nair'
    },

    {
      clientId: 'CLI-5517',
      clientName: 'Rajkumar Trading',
      category: 'Backup & Restore',
      status: 'Escalated',
      time: '1h 05m',
      staff: 'Amit Sharma'
    },

    {
      clientId: 'CLI-2234',
      clientName: 'Patel Pharma Ltd',
      category: 'Wallet Activation',
      status: 'Resolved',
      time: '22m',
      staff: 'Sneha Joshi'
    },

    {
      clientId: 'CLI-6601',
      clientName: 'Global Textiles Co',
      category: 'Windows Formatting',
      status: 'Pending',
      time: '48m',
      staff: 'Karan Mehta'
    },

    {
      clientId: 'CLI-1122',
      clientName: 'Sunrise Exports',
      category: 'Installation',
      status: 'Resolved',
      time: '18m',
      staff: 'Divya Pillai'
    },

    {
      clientId: 'CLI-7743',
      clientName: 'Apex Solutions',
      category: 'Licensing',
      status: 'Escalated',
      time: '2h 10m',
      staff: 'Rohan Gupta'
    }

  ];

  // =====================================================
  // ATTENDANCE
  // =====================================================

  attendance = [

    {
      initials: 'RV',
      name: 'Rahul Verma',
      time: '09:02 AM',
      status: 'Present'
    },

    {
      initials: 'PN',
      name: 'Priya Nair',
      time: '09:15 AM',
      status: 'Present'
    },

    {
      initials: 'AS',
      name: 'Amit Sharma',
      time: '09:30 AM',
      status: 'Present'
    },

    {
      initials: 'SJ',
      name: 'Sneha Joshi',
      time: '09:00 AM',
      status: 'Present'
    },

    {
      initials: 'KM',
      name: 'Karan Mehta',
      time: '—',
      status: 'Absent'
    }

  ];

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(private router: Router) {

    const user = sessionStorage.getItem('currentUser');

    if (user) {
      this.currentUser = JSON.parse(user);
    }

  }

  // =====================================================
  // CATEGORY BAR WIDTH
  // =====================================================

  getCategoryWidth(value: number): string {

    return `${(value / 60) * 100}%`;

  }

  // =====================================================
  // NAVIGATION
  // =====================================================

  goTo(path: string): void {

    this.profileDropdownOpen = false;

    this.notificationDropdownOpen = false;

    this.router.navigate([path]);

  }

  // =====================================================
  // PROFILE DROPDOWN
  // =====================================================

  toggleProfileDropdown(): void {

    this.profileDropdownOpen =
      !this.profileDropdownOpen;

    if (this.profileDropdownOpen) {

      this.notificationDropdownOpen = false;

    }

  }

  // =====================================================
  // NOTIFICATION DROPDOWN
  // =====================================================

  toggleNotificationDropdown(): void {

    this.notificationDropdownOpen =
      !this.notificationDropdownOpen;

    if (this.notificationDropdownOpen) {

      this.profileDropdownOpen = false;

    }

  }

  // =====================================================
  // SEARCH
  // =====================================================

  searchDashboard(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchText =
      input.value.trim().toLowerCase();

    if (!this.searchText) {

      this.searchResults = [];

      return;

    }

    const activityResults =
      this.activities.filter(activity =>

        activity.name.toLowerCase().includes(this.searchText) ||

        activity.client.toLowerCase().includes(this.searchText) ||

        activity.clientId.toLowerCase().includes(this.searchText) ||

        activity.category.toLowerCase().includes(this.searchText) ||

        activity.status.toLowerCase().includes(this.searchText)

      );

    const taskResults =
      this.recentTasks.filter(task =>

        task.clientName.toLowerCase().includes(this.searchText) ||

        task.clientId.toLowerCase().includes(this.searchText) ||

        task.category.toLowerCase().includes(this.searchText) ||

        task.staff.toLowerCase().includes(this.searchText) ||

        task.status.toLowerCase().includes(this.searchText)

      );

    this.searchResults = [

      ...activityResults.map(item => ({
        type: 'Activity',
        title: item.name,
        description:
          `${item.client} - ${item.category}`,
        status: item.status
      })),

      ...taskResults.map(item => ({
        type: 'Task',
        title: item.clientName,
        description:
          `${item.staff} - ${item.category}`,
        status: item.status
      }))

    ];

  }

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  clearSearch(): void {

    this.searchText = '';

    this.searchResults = [];

  }

  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    sessionStorage.removeItem('currentUser');

    this.profileDropdownOpen = false;

    this.router.navigate(['/login']);

  }

  // =====================================================
  // CURRENT DATE
  // =====================================================

  getCurrentDate(): string {

    return new Date().toLocaleDateString(
      'en-IN',
      {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    );

  }

}