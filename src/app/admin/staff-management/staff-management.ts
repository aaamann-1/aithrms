import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Staff {
  name: string;
  role: string;
  initials: string;
  avatarClass: string;
  status: 'Online' | 'Away' | 'Offline';
  statusClass: string;
  badgeClass: string;
  tickets: number;
  resolved: number;
  pending: number;
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    [RouterLink],
    CommonModule,
    FormsModule
  ],
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.css'
})
export class StaffManagement {

  // ================= SEARCH =================

  searchQuery: string = '';

  // ================= CALENDAR =================

  selectedDate: string = '';

  // ================= STAFF DATA =================

  staffList: Staff[] = [
    {
      name: 'Rahul Verma',
      role: 'Senior Support',
      initials: 'RV',
      avatarClass: 'avatar-green',
      status: 'Online',
      statusClass: 'online',
      badgeClass: 'online-badge',
      tickets: 48,
      resolved: 43,
      pending: 3
    },
    {
      name: 'Priya Nair',
      role: 'Support Engineer',
      initials: 'PN',
      avatarClass: 'avatar-blue',
      status: 'Online',
      statusClass: 'online',
      badgeClass: 'online-badge',
      tickets: 41,
      resolved: 38,
      pending: 2
    },
    {
      name: 'Amit Sharma',
      role: 'Support Engineer',
      initials: 'AS',
      avatarClass: 'avatar-purple',
      status: 'Away',
      statusClass: 'away',
      badgeClass: 'away-badge',
      tickets: 36,
      resolved: 30,
      pending: 4
    },
    {
      name: 'Sneha Joshi',
      role: 'Junior Support',
      initials: 'SJ',
      avatarClass: 'avatar-orange',
      status: 'Online',
      statusClass: 'online',
      badgeClass: 'online-badge',
      tickets: 29,
      resolved: 25,
      pending: 3
    },
    {
      name: 'Karan Mehta',
      role: 'Senior Support',
      initials: 'KM',
      avatarClass: 'avatar-orange',
      status: 'Offline',
      statusClass: 'offline',
      badgeClass: 'offline-badge',
      tickets: 22,
      resolved: 18,
      pending: 2
    },
    {
      name: 'Divya Pillai',
      role: 'Support Engineer',
      initials: 'DP',
      avatarClass: 'avatar-pink',
      status: 'Online',
      statusClass: 'online',
      badgeClass: 'online-badge',
      tickets: 31,
      resolved: 28,
      pending: 2
    },
    {
      name: 'Rohan Gupta',
      role: 'Junior Support',
      initials: 'RG',
      avatarClass: 'avatar-green',
      status: 'Online',
      statusClass: 'online',
      badgeClass: 'online-badge',
      tickets: 19,
      resolved: 16,
      pending: 2
    },
    {
      name: 'Ananya Singh',
      role: 'Support Engineer',
      initials: 'AS',
      avatarClass: 'avatar-purple',
      status: 'Away',
      statusClass: 'away',
      badgeClass: 'away-badge',
      tickets: 25,
      resolved: 21,
      pending: 3
    }
  ];

  filteredStaff: Staff[] = [...this.staffList];

  // ================= CONSTRUCTOR =================

  constructor() {

    // Set today's date
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1)
      .padStart(2, '0');

    const day = String(today.getDate())
      .padStart(2, '0');

    this.selectedDate = `${year}-${month}-${day}`;
  }

  // ================= ADD STAFF =================

  addStaff(): void {
    console.log('Add Staff button clicked');
  }

  // ================= SEARCH =================

  performSearch(): void {

    const query = this.searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      this.filteredStaff = [...this.staffList];
      return;
    }

    this.filteredStaff = this.staffList.filter((staff) =>
      staff.name.toLowerCase().includes(query) ||
      staff.role.toLowerCase().includes(query) ||
      staff.status.toLowerCase().includes(query)
    );
  }

   onSearchKey(event: KeyboardEvent): void {

    if (event.key === 'Enter') {
      event.preventDefault();
      this.performSearch();
    }

  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredStaff = [...this.staffList];
  }

  // ================= CALENDAR =================

  onDateChange(): void {

    console.log(
      'Selected date:',
      this.selectedDate
    );

    // Clear search when date changes
    this.searchQuery = '';

    // Show all staff again
    this.filteredStaff = [...this.staffList];
  }

  getFormattedDate(): string {

    if (!this.selectedDate) {
      return 'Select Date';
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
}