import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  // =====================================================
  // CURRENT USER
  // =====================================================

  currentUser: any = null;


  // =====================================================
  // DROPDOWNS
  // =====================================================

  profileOpen: boolean = false;
  notificationOpen: boolean = false;


  // =====================================================
  // SIDEBAR
  // =====================================================

  sidebarCollapsed: boolean = false;


  // =====================================================
  // SEARCH
  // =====================================================

  searchQuery: string = '';
  searchPerformed: boolean = false;


  // =====================================================
  // CALENDAR
  // =====================================================

  selectedDate: string = '';


  // =====================================================
  // FILTERED DATA
  // =====================================================

  filteredActivities: any[] = [];
  filteredRecentTasks: any[] = [];
  filteredAttendance: any[] = [];
  filteredCategories: any[] = [];


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
  // NOTIFICATIONS
  // =====================================================

  notifications = [

    {
      title: 'New Issue',
      message: 'New support issue assigned to Rahul Verma',
      time: '5 min ago',
      type: 'issue'
    },

    {
      title: 'Issue Escalated',
      message: 'Amit Sharma escalated an issue',
      time: '15 min ago',
      type: 'warning'
    },

    {
      title: 'Task Resolved',
      message: 'Sneha Joshi resolved a support task',
      time: '25 min ago',
      type: 'success'
    },

    {
      title: 'Staff Attendance',
      message: 'Karan Mehta has not checked in',
      time: '1 hour ago',
      type: 'attendance'
    }

  ];


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(private router: Router) {

    // Get logged-in user

    const user =
      sessionStorage.getItem('currentUser');


    if (user) {

      try {

        this.currentUser =
          JSON.parse(user);

      } catch {

        this.currentUser = null;

      }

    }


    // ===================================================
    // SET TODAY'S DATE
    // ===================================================

    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(today.getMonth() + 1)
        .padStart(2, '0');

    const day =
      String(today.getDate())
        .padStart(2, '0');


    this.selectedDate =
      `${year}-${month}-${day}`;


    // ===================================================
    // INITIAL DATA
    // ===================================================

    this.resetFilteredData();

  }


  // =====================================================
  // RESET FILTERED DATA
  // =====================================================

  private resetFilteredData(): void {

    this.filteredActivities =
      [...this.activities];

    this.filteredRecentTasks =
      [...this.recentTasks];

    this.filteredAttendance =
      [...this.attendance];

    this.filteredCategories =
      [...this.categories];

  }


  // =====================================================
  // SEARCH
  // =====================================================

  performSearch(): void {

    const query =
      this.searchQuery
        .trim()
        .toLowerCase();


    // If search box is empty

    if (!query) {

      this.searchPerformed = false;

      this.resetFilteredData();

      return;

    }


    this.searchPerformed = true;


    // ===================================================
    // LIVE ACTIVITY SEARCH
    // ===================================================

    this.filteredActivities =
      this.activities.filter(activity => {

        return (

          activity.name
            .toLowerCase()
            .includes(query)

          ||

          activity.client
            .toLowerCase()
            .includes(query)

          ||

          activity.clientId
            .toLowerCase()
            .includes(query)

          ||

          activity.category
            .toLowerCase()
            .includes(query)

          ||

          activity.status
            .toLowerCase()
            .includes(query)

        );

      });


    // ===================================================
    // RECENT TASK SEARCH
    // ===================================================

    this.filteredRecentTasks =
      this.recentTasks.filter(task => {

        return (

          task.clientId
            .toLowerCase()
            .includes(query)

          ||

          task.clientName
            .toLowerCase()
            .includes(query)

          ||

          task.category
            .toLowerCase()
            .includes(query)

          ||

          task.status
            .toLowerCase()
            .includes(query)

          ||

          task.staff
            .toLowerCase()
            .includes(query)

        );

      });


    // ===================================================
    // ATTENDANCE SEARCH
    // ===================================================

    this.filteredAttendance =
      this.attendance.filter(person => {

        return (

          person.name
            .toLowerCase()
            .includes(query)

          ||

          person.status
            .toLowerCase()
            .includes(query)

        );

      });


    // ===================================================
    // CATEGORY SEARCH
    // ===================================================

    this.filteredCategories =
      this.categories.filter(category => {

        return category.name
          .toLowerCase()
          .includes(query);

      });

  }


  // =====================================================
  // SEARCH USING ENTER
  // =====================================================

  onSearchKey(event: KeyboardEvent): void {

    if (event.key === 'Enter') {

      event.preventDefault();

      this.performSearch();

    }

  }


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  clearSearch(): void {

    this.searchQuery = '';

    this.searchPerformed = false;

    this.resetFilteredData();

  }


  // =====================================================
  // CALENDAR DATE CHANGE
  // =====================================================

 onDateChange(): void {

  console.log('Selected date:', this.selectedDate);

  // Reset search when changing date
  this.searchQuery = '';
  this.searchPerformed = false;

  // At the moment your sample data is not connected
  // to actual dates, so the dashboard data remains visible.
  this.resetFilteredData();

}


  // =====================================================
  // FORMAT SELECTED DATE
  // =====================================================

  getFormattedDate(): string {

    if (!this.selectedDate) {

      return 'Select Date';

    }


    const date =
      new Date(
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


  // =====================================================
  // CATEGORY BAR WIDTH
  // =====================================================

  getCategoryWidth(value: number): string {

    const maximum =
      Math.max(
        ...this.categories.map(
          category => category.value
        )
      );


    return `${(value / maximum) * 100}%`;

  }


  // =====================================================
  // SIDEBAR
  // =====================================================

  toggleSidebar(): void {

    this.sidebarCollapsed =
      !this.sidebarCollapsed;

  }


  // =====================================================
  // PROFILE DROPDOWN
  // =====================================================

  toggleProfile(): void {

    this.profileOpen =
      !this.profileOpen;

    this.notificationOpen = false;

  }


  // =====================================================
  // NOTIFICATION DROPDOWN
  // =====================================================

  toggleNotifications(): void {

    this.notificationOpen =
      !this.notificationOpen;

    this.profileOpen = false;

  }


  // =====================================================
  // MY PROFILE
  // =====================================================

  openProfile(): void {

    this.profileOpen = false;

    this.router.navigate([
      '/admin/profile'
    ]);

  }


  // =====================================================
  // SETTINGS
  // =====================================================

  openSettings(): void {

    this.profileOpen = false;

    this.router.navigate([
      '/admin/setting'
    ]);

  }


  // =====================================================
  // GENERAL NAVIGATION
  // =====================================================

  goTo(path: string): void {

    this.router.navigate([
      path
    ]);

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    this.profileOpen = false;

    this.notificationOpen = false;


    sessionStorage.removeItem(
      'currentUser'
    );


    this.router.navigate([
      '/login'
    ]);

  }

}