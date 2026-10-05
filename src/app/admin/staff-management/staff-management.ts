import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Staff {
  id: number;
  name: string;
  role: string;
  initials: string;
  avatarClass: string;
  status: 'Online' | 'Away' | 'Offline';
  statusClass: string;
  badgeClass: string;
  inProgress: number;
  resolved: number;
  pending: number;
}

interface StaffTaskSummary {
  id: number;
  name: string;
  role: string;
  inProgress: number;
  resolved: number;
  pending: number;
}

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.css'
})
export class StaffManagement implements OnInit {

  searchQuery: string = '';
  selectedDate: string = '';

  loading: boolean = true;

  private employeeApiUrl =
    'http://localhost:5089/api/Employee';

  private taskApiUrl =
    'http://localhost:5089/api/TaskEntry';

  staffList: Staff[] = [];
  filteredStaff: Staff[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1)
      .padStart(2, '0');

    const day = String(today.getDate())
      .padStart(2, '0');

    this.selectedDate =
      `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.refreshStaffManagement();
  }

  refreshStaffManagement(): void {
    this.loading = true;
    this.loadStaff();
  }

  loadStaff(): void {
    this.http
      .get<any[]>(this.employeeApiUrl)
      .subscribe({
        next: (employees) => {

          this.staffList = employees.map(
            (employee, index) => {

              const name =
                employee.employeeName ||
                employee.fullName ||
                'Staff';

              const status =
                employee.status === 'Online' ||
                employee.status === 'Away' ||
                employee.status === 'Offline'
                  ? employee.status
                  : 'Offline';

              return {
                id: employee.id,

                name: name,

                role:
                  employee.designation ||
                  employee.title ||
                  'Staff',

                initials:
                  this.getInitials(name),

                avatarClass:
                  this.getAvatarClass(index),

                status: status,

                statusClass:
                  status.toLowerCase(),

                badgeClass:
                  `${status.toLowerCase()}-badge`,

                inProgress: 0,

                resolved: 0,

                pending: 0
              };
            }
          );

          this.filteredStaff = [
            ...this.staffList
          ];

          this.cdr.detectChanges();

          this.loadTaskSummary();
        },

        error: (error) => {

          console.error(
            'Failed to load staff:',
            error
          );

          this.staffList = [];

          this.filteredStaff = [];

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  loadTaskSummary(): void {

    this.http
      .get<StaffTaskSummary[]>(
        `${this.taskApiUrl}/staff-summary`
      )
      .subscribe({

        next: (summaries) => {

          this.staffList =
            this.staffList.map(staff => {

              const summary =
                summaries.find(
                  item => item.id === staff.id
                );

              if (summary) {

                return {
                  ...staff,

                  inProgress:
                    summary.inProgress,

                  resolved:
                    summary.resolved,

                  pending:
                    summary.pending
                };
              }

              return staff;
            });

          this.applyCurrentFilter();

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Failed to load task summary:',
            error
          );

          this.applyCurrentFilter();

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  applyCurrentFilter(): void {

    const query =
      this.searchQuery
        .trim()
        .toLowerCase();

    if (!query) {

      this.filteredStaff = [
        ...this.staffList
      ];

      return;
    }

    this.filteredStaff =
      this.staffList.filter(
        (staff) =>
          staff.name
            .toLowerCase()
            .includes(query) ||

          staff.role
            .toLowerCase()
            .includes(query) ||

          staff.status
            .toLowerCase()
            .includes(query)
      );
  }

  getInitials(name: string): string {

    return name
      .split(' ')
      .filter(
        (part: string) =>
          part.length > 0
      )
      .slice(0, 2)
      .map(
        (part: string) =>
          part.charAt(0).toUpperCase()
      )
      .join('');
  }

  getAvatarClass(index: number): string {

    const classes = [
      'avatar-green',
      'avatar-blue',
      'avatar-purple',
      'avatar-orange',
      'avatar-pink'
    ];

    return classes[
      index % classes.length
    ];
  }

  addStaff(): void {

    console.log(
      'Add Staff button clicked'
    );
  }

  performSearch(): void {

    this.applyCurrentFilter();
  }

  onSearchKey(
    event: KeyboardEvent
  ): void {

    if (event.key === 'Enter') {

      event.preventDefault();

      this.performSearch();
    }
  }

  clearSearch(): void {

    this.searchQuery = '';

    this.filteredStaff = [
      ...this.staffList
    ];
  }

  onDateChange(): void {

    this.searchQuery = '';

    this.filteredStaff = [
      ...this.staffList
    ];
  }

  getFormattedDate(): string {

    if (!this.selectedDate) {

      return 'Select Date';
    }

    const date = new Date(
      this.selectedDate +
      'T00:00:00'
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