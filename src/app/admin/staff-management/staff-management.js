import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let StaffManagement = class StaffManagement {
    http;
    cdr;
    searchQuery = '';
    selectedDate = '';
    loading = true;
    employeeApiUrl = 'http://localhost:5089/api/Employee';
    taskApiUrl = 'http://localhost:5089/api/TaskEntry';
    staffList = [];
    filteredStaff = [];
    constructor(http, cdr) {
        this.http = http;
        this.cdr = cdr;
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1)
            .padStart(2, '0');
        const day = String(today.getDate())
            .padStart(2, '0');
        this.selectedDate =
            `${year}-${month}-${day}`;
    }
    ngOnInit() {
        this.refreshStaffManagement();
    }
    refreshStaffManagement() {
        this.loading = true;
        this.loadStaff();
    }
    loadStaff() {
        this.http
            .get(this.employeeApiUrl)
            .subscribe({
            next: (employees) => {
                this.staffList = employees.map((employee, index) => {
                    const name = employee.employeeName ||
                        employee.fullName ||
                        'Staff';
                    const status = employee.status === 'Online' ||
                        employee.status === 'Away' ||
                        employee.status === 'Offline'
                        ? employee.status
                        : 'Offline';
                    return {
                        id: employee.id,
                        name: name,
                        role: employee.designation ||
                            employee.title ||
                            'Staff',
                        initials: this.getInitials(name),
                        avatarClass: this.getAvatarClass(index),
                        status: status,
                        statusClass: status.toLowerCase(),
                        badgeClass: `${status.toLowerCase()}-badge`,
                        inProgress: 0,
                        resolved: 0,
                        pending: 0
                    };
                });
                this.filteredStaff = [
                    ...this.staffList
                ];
                this.cdr.detectChanges();
                this.loadTaskSummary();
            },
            error: (error) => {
                console.error('Failed to load staff:', error);
                this.staffList = [];
                this.filteredStaff = [];
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
    loadTaskSummary() {
        this.http
            .get(`${this.taskApiUrl}/staff-summary`)
            .subscribe({
            next: (summaries) => {
                this.staffList =
                    this.staffList.map(staff => {
                        const summary = summaries.find(item => item.id === staff.id);
                        if (summary) {
                            return {
                                ...staff,
                                inProgress: summary.inProgress,
                                resolved: summary.resolved,
                                pending: summary.pending
                            };
                        }
                        return staff;
                    });
                this.applyCurrentFilter();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error('Failed to load task summary:', error);
                this.applyCurrentFilter();
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }
    applyCurrentFilter() {
        const query = this.searchQuery
            .trim()
            .toLowerCase();
        if (!query) {
            this.filteredStaff = [
                ...this.staffList
            ];
            return;
        }
        this.filteredStaff =
            this.staffList.filter((staff) => staff.name
                .toLowerCase()
                .includes(query) ||
                staff.role
                    .toLowerCase()
                    .includes(query) ||
                staff.status
                    .toLowerCase()
                    .includes(query));
    }
    getInitials(name) {
        return name
            .split(' ')
            .filter((part) => part.length > 0)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('');
    }
    getAvatarClass(index) {
        const classes = [
            'avatar-green',
            'avatar-blue',
            'avatar-purple',
            'avatar-orange',
            'avatar-pink'
        ];
        return classes[index % classes.length];
    }
    addStaff() {
        console.log('Add Staff button clicked');
    }
    performSearch() {
        this.applyCurrentFilter();
    }
    onSearchKey(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.performSearch();
        }
    }
    clearSearch() {
        this.searchQuery = '';
        this.filteredStaff = [
            ...this.staffList
        ];
    }
    onDateChange() {
        this.searchQuery = '';
        this.filteredStaff = [
            ...this.staffList
        ];
    }
    getFormattedDate() {
        if (!this.selectedDate) {
            return 'Select Date';
        }
        const date = new Date(this.selectedDate +
            'T00:00:00');
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }
};
StaffManagement = __decorate([
    Component({
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
], StaffManagement);
export { StaffManagement };
