import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

<<<<<<< Updated upstream
interface Activity {
  clientName: string;
  clientId: string;
  category: string;
  time: string;
  status: 'Resolved' | 'Pending' | 'Escalated';
  date: string;
}

=======
>>>>>>> Stashed changes
interface StaffReport {
  name: string;
  initials: string;
  role: string;
  status: 'Online' | 'Offline' | 'Busy';
  color: string;

  totalTickets: number;
  resolved: number;
  pending: number;
  escalated: number;

<<<<<<< Updated upstream
  activities: Activity[];
=======
  activities: {
    clientName: string;
    clientId: string;
    category: string;
    time: string;
    status: 'Resolved' | 'Pending' | 'Escalated';
    date: string;
  }[];
>>>>>>> Stashed changes
}

@Component({
  selector: 'app-individual-reports',
  standalone: true,
<<<<<<< Updated upstream
  imports: [CommonModule, FormsModule],
=======
  imports: [
    CommonModule,
    FormsModule
  ],
>>>>>>> Stashed changes
  templateUrl: './individual.html',
  styleUrl: './individual.css'
})
export class IndividualReports {

<<<<<<< Updated upstream
  sidebarCollapsed = false;

  searchQuery = '';

  // Default date
  selectedDate = '2026-08-19';

  profileOpen = false;
  notificationOpen = false;

  selectedStaff: StaffReport;

  staffList: StaffReport[] = [

=======
  // =====================================================
  // TOP BAR
  // =====================================================

  searchQuery: string = '';

  // Opens with today's date, but user can manually
  // select any date from the calendar.
  selectedDate: string = this.getToday();

  profileOpen: boolean = false;
  notificationOpen: boolean = false;


  // =====================================================
  // SIDEBAR
  // =====================================================

  sidebarCollapsed: boolean = false;


  // =====================================================
  // SELECTED STAFF
  // =====================================================

  selectedStaff: StaffReport;


  // =====================================================
  // STAFF DATA
  // =====================================================

  staffList: StaffReport[] = [

    // ===================================================
    // RAHUL VERMA
    // ===================================================

>>>>>>> Stashed changes
    {
      name: 'Rahul Verma',
      initials: 'RV',
      role: 'Senior Support',
      status: 'Online',
      color: 'green',

      totalTickets: 48,
      resolved: 43,
      pending: 3,
      escalated: 2,

      activities: [
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Sharma Enterprises',
          clientId: 'CLI-4821',
          category: 'Licensing',
          time: '14m',
          status: 'Resolved',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Heritage Foods Ltd',
          clientId: 'CLI-9901',
          category: 'Bill Format Modification',
          time: '25m',
          status: 'Resolved',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

        {
          clientName: 'Sharma Enterprises',
          clientId: 'CLI-4821',
          category: 'Licensing',
          time: '14m',
          status: 'Resolved',
          date: '2026-08-18'
        },

>>>>>>> Stashed changes
        {
          clientName: 'Mehta & Sons Pvt Ltd',
          clientId: 'CLI-3309',
          category: 'Bill Format Modification',
          time: '32m',
          status: 'Pending',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Rajkumar Trading',
          clientId: 'CLI-5517',
          category: 'Backup & Restore',
          time: '1h 05m',
          status: 'Escalated',
<<<<<<< Updated upstream
          date: '2026-08-19'
        },
        {
          clientName: 'Sharma Enterprises',
          clientId: 'CLI-4821',
          category: 'Licensing',
          time: '14m',
          status: 'Resolved',
          date: '2026-08-18'
        }
      ]
    },

=======
          date: '2026-08-18'
        }

      ]
    },


    // ===================================================
    // PRIYA NAIR
    // ===================================================

>>>>>>> Stashed changes
    {
      name: 'Priya Nair',
      initials: 'PN',
      role: 'Support Engineer',
      status: 'Online',
      color: 'blue',

      totalTickets: 41,
      resolved: 35,
      pending: 4,
      escalated: 2,

      activities: [
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Mehta & Sons Pvt Ltd',
          clientId: 'CLI-3309',
          category: 'Bill Format Modification',
          time: '32m',
          status: 'Pending',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Patel Pharma Ltd',
          clientId: 'CLI-2234',
          category: 'Wallet Activation',
          time: '22m',
          status: 'Resolved',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Apex Solutions',
          clientId: 'CLI-7743',
          category: 'Licensing',
          time: '35m',
          status: 'Resolved',
          date: '2026-08-18'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Sunrise Exports',
          clientId: 'CLI-1122',
          category: 'Installation',
          time: '18m',
          status: 'Escalated',
          date: '2026-08-18'
        }
<<<<<<< Updated upstream
      ]
    },

=======

      ]
    },


    // ===================================================
    // AMIT SHARMA
    // ===================================================

>>>>>>> Stashed changes
    {
      name: 'Amit Sharma',
      initials: 'AS',
      role: 'Support Engineer',
      status: 'Busy',
      color: 'purple',

      totalTickets: 39,
      resolved: 32,
      pending: 4,
      escalated: 3,

      activities: [
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Rajkumar Trading',
          clientId: 'CLI-5517',
          category: 'Backup & Restore',
          time: '1h 05m',
          status: 'Escalated',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Global Textiles Co',
          clientId: 'CLI-6601',
          category: 'Windows Formatting',
          time: '48m',
          status: 'Pending',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Sharma Enterprises',
          clientId: 'CLI-4821',
          category: 'Licensing',
          time: '20m',
          status: 'Resolved',
          date: '2026-08-18'
        }
<<<<<<< Updated upstream
      ]
    },

=======

      ]
    },


    // ===================================================
    // SNEHA JOSHI
    // ===================================================

>>>>>>> Stashed changes
    {
      name: 'Sneha Joshi',
      initials: 'SJ',
      role: 'Junior Support',
      status: 'Online',
      color: 'orange',

      totalTickets: 36,
      resolved: 31,
      pending: 4,
      escalated: 1,

      activities: [
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Patel Pharma Ltd',
          clientId: 'CLI-2234',
          category: 'Wallet Activation',
          time: '22m',
          status: 'Resolved',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Sunrise Exports',
          clientId: 'CLI-1122',
          category: 'Installation',
          time: '18m',
          status: 'Resolved',
          date: '2026-08-18'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Heritage Foods Ltd',
          clientId: 'CLI-9901',
          category: 'Bill Format Modification',
          time: '27m',
          status: 'Pending',
          date: '2026-08-18'
        }
<<<<<<< Updated upstream
      ]
    },

=======

      ]
    },


    // ===================================================
    // KARAN MEHTA
    // ===================================================

>>>>>>> Stashed changes
    {
      name: 'Karan Mehta',
      initials: 'KM',
      role: 'Senior Support',
      status: 'Offline',
      color: 'yellow',

      totalTickets: 33,
      resolved: 28,
      pending: 3,
      escalated: 2,

      activities: [
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Global Textiles Co',
          clientId: 'CLI-6601',
          category: 'Windows Formatting',
          time: '48m',
          status: 'Pending',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Apex Solutions',
          clientId: 'CLI-7743',
          category: 'Licensing',
          time: '40m',
          status: 'Resolved',
          date: '2026-08-18'
        }
<<<<<<< Updated upstream
      ]
    },

=======

      ]
    },


    // ===================================================
    // DIVYA PILLAI
    // ===================================================

>>>>>>> Stashed changes
    {
      name: 'Divya Pillai',
      initials: 'DP',
      role: 'Support Engineer',
      status: 'Online',
      color: 'pink',

      totalTickets: 45,
      resolved: 40,
      pending: 3,
      escalated: 2,

      activities: [
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Sunrise Exports',
          clientId: 'CLI-1122',
          category: 'Installation',
          time: '18m',
          status: 'Resolved',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Patel Pharma Ltd',
          clientId: 'CLI-2234',
          category: 'Wallet Activation',
          time: '29m',
          status: 'Resolved',
          date: '2026-08-18'
        }
<<<<<<< Updated upstream
      ]
    },

=======

      ]
    },


    // ===================================================
    // ROHAN GUPTA
    // ===================================================

>>>>>>> Stashed changes
    {
      name: 'Rohan Gupta',
      initials: 'RG',
      role: 'Junior Support',
      status: 'Online',
      color: 'green',

      totalTickets: 31,
      resolved: 25,
      pending: 4,
      escalated: 2,

      activities: [
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Apex Solutions',
          clientId: 'CLI-7743',
          category: 'Licensing',
          time: '2h 10m',
          status: 'Escalated',
          date: '2026-08-19'
        },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Global Textiles Co',
          clientId: 'CLI-6601',
          category: 'Windows Formatting',
          time: '35m',
          status: 'Resolved',
          date: '2026-08-18'
        }
<<<<<<< Updated upstream
      ]
    },

=======

      ]
    },


    // ===================================================
    // ANANYA SINGH
    // ===================================================

>>>>>>> Stashed changes
    {
      name: 'Ananya Singh',
      initials: 'AS',
      role: 'Support Engineer',
      status: 'Busy',
      color: 'purple',

      totalTickets: 37,
      resolved: 30,
      pending: 5,
      escalated: 2,

      activities: [
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        {
          clientName: 'Mehta & Sons Pvt Ltd',
          clientId: 'CLI-3309',
          category: 'Bill Format Modification',
          time: '30m',
          status: 'Resolved',
          date: '2026-08-19'
        }
<<<<<<< Updated upstream
      ]
    }
  ];

  constructor(private router: Router) {
    this.selectedStaff = this.staffList[0];
  }

  get formattedDate(): string {

    if (!this.selectedDate) {
      return 'Select date';
    }

    const date = new Date(this.selectedDate + 'T00:00:00');

    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  onDateChange(): void {
    // Recent Activity automatically updates
    // through getFilteredActivities()
  }

  getFilteredActivities(): Activity[] {

    const search = this.searchQuery
      .trim()
      .toLowerCase();

    return this.selectedStaff.activities.filter(activity => {

      const matchesDate =
        !this.selectedDate ||
        activity.date === this.selectedDate;

      const matchesSearch =
        !search ||
        activity.clientName.toLowerCase().includes(search) ||
        activity.clientId.toLowerCase().includes(search) ||
        activity.category.toLowerCase().includes(search) ||
        activity.status.toLowerCase().includes(search);

      return matchesDate && matchesSearch;
    });
  }

  selectStaff(staff: StaffReport): void {
    this.selectedStaff = staff;
  }

  getStatusClass(status: string): string {

    switch (status) {
=======

      ]
    }

  ];


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(private router: Router) {

    this.selectedStaff = this.staffList[0];

  }


  // =====================================================
  // DATE
  // =====================================================

  getToday(): string {

    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        today.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  // =====================================================
  // FORMATTED DATE
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
  // DATE CHANGE
  // =====================================================

  onDateChange(): void {

    // Activities are automatically
    // filtered according to selected date.

  }


  // =====================================================
  // SELECT STAFF
  // =====================================================

  selectStaff(staff: StaffReport): void {

    this.selectedStaff = staff;

  }


  // =====================================================
  // FILTER ACTIVITIES
  // =====================================================

  getFilteredActivities() {

    const search =
      this.searchQuery
        .trim()
        .toLowerCase();

    return this.selectedStaff.activities.filter(
      activity => {

        const matchesDate =
          !this.selectedDate ||
          activity.date === this.selectedDate;

        const matchesSearch =
          !search ||
          activity.clientName
            .toLowerCase()
            .includes(search) ||

          activity.clientId
            .toLowerCase()
            .includes(search) ||

          activity.category
            .toLowerCase()
            .includes(search) ||

          activity.status
            .toLowerCase()
            .includes(search);

        return matchesDate && matchesSearch;

      }
    );

  }


  // =====================================================
  // SEARCH
  // =====================================================

  onSearch(): void {

    // Filtering is handled automatically
    // through getFilteredActivities().

  }


  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  clearSearch(): void {

    this.searchQuery = '';

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(status: string): string {

    switch (status) {

>>>>>>> Stashed changes
      case 'Resolved':
        return 'resolved';

      case 'Pending':
        return 'pending';

      case 'Escalated':
        return 'escalated';

      default:
        return '';
<<<<<<< Updated upstream
    }
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

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
    this.notificationOpen = false;
  }

  toggleNotifications(): void {
    this.notificationOpen = !this.notificationOpen;
    this.profileOpen = false;
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
=======

    }

  }


  // =====================================================
  // SIDEBAR
  // =====================================================

  toggleSidebar(): void {

    this.sidebarCollapsed =
      !this.sidebarCollapsed;

  }


  // =====================================================
  // NAVIGATION
  // =====================================================

  goTo(path: string): void {

    this.router.navigate([path]);

  }


  // =====================================================
  // PROFILE
  // =====================================================

  toggleProfile(): void {

    this.profileOpen =
      !this.profileOpen;

    this.notificationOpen = false;

  }


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  toggleNotifications(): void {

    this.notificationOpen =
      !this.notificationOpen;

    this.profileOpen = false;

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    sessionStorage.removeItem('currentUser');

    this.router.navigate(['/login']);

  }

>>>>>>> Stashed changes
}