import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let IndividualReports = class IndividualReports {
    router;
    sidebarCollapsed = false;
    searchQuery = '';
    // Default date
    selectedDate = '2026-08-19';
    profileOpen = false;
    notificationOpen = false;
    selectedStaff;
    staffList = [
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
                {
                    clientName: 'Sharma Enterprises',
                    clientId: 'CLI-4821',
                    category: 'Licensing',
                    time: '14m',
                    status: 'Resolved',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Heritage Foods Ltd',
                    clientId: 'CLI-9901',
                    category: 'Bill Format Modification',
                    time: '25m',
                    status: 'Resolved',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Mehta & Sons Pvt Ltd',
                    clientId: 'CLI-3309',
                    category: 'Bill Format Modification',
                    time: '32m',
                    status: 'Pending',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Rajkumar Trading',
                    clientId: 'CLI-5517',
                    category: 'Backup & Restore',
                    time: '1h 05m',
                    status: 'Escalated',
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
                {
                    clientName: 'Mehta & Sons Pvt Ltd',
                    clientId: 'CLI-3309',
                    category: 'Bill Format Modification',
                    time: '32m',
                    status: 'Pending',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Patel Pharma Ltd',
                    clientId: 'CLI-2234',
                    category: 'Wallet Activation',
                    time: '22m',
                    status: 'Resolved',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Apex Solutions',
                    clientId: 'CLI-7743',
                    category: 'Licensing',
                    time: '35m',
                    status: 'Resolved',
                    date: '2026-08-18'
                },
                {
                    clientName: 'Sunrise Exports',
                    clientId: 'CLI-1122',
                    category: 'Installation',
                    time: '18m',
                    status: 'Escalated',
                    date: '2026-08-18'
                }
            ]
        },
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
                {
                    clientName: 'Rajkumar Trading',
                    clientId: 'CLI-5517',
                    category: 'Backup & Restore',
                    time: '1h 05m',
                    status: 'Escalated',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Global Textiles Co',
                    clientId: 'CLI-6601',
                    category: 'Windows Formatting',
                    time: '48m',
                    status: 'Pending',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Sharma Enterprises',
                    clientId: 'CLI-4821',
                    category: 'Licensing',
                    time: '20m',
                    status: 'Resolved',
                    date: '2026-08-18'
                }
            ]
        },
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
                {
                    clientName: 'Patel Pharma Ltd',
                    clientId: 'CLI-2234',
                    category: 'Wallet Activation',
                    time: '22m',
                    status: 'Resolved',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Sunrise Exports',
                    clientId: 'CLI-1122',
                    category: 'Installation',
                    time: '18m',
                    status: 'Resolved',
                    date: '2026-08-18'
                },
                {
                    clientName: 'Heritage Foods Ltd',
                    clientId: 'CLI-9901',
                    category: 'Bill Format Modification',
                    time: '27m',
                    status: 'Pending',
                    date: '2026-08-18'
                }
            ]
        },
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
                {
                    clientName: 'Global Textiles Co',
                    clientId: 'CLI-6601',
                    category: 'Windows Formatting',
                    time: '48m',
                    status: 'Pending',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Apex Solutions',
                    clientId: 'CLI-7743',
                    category: 'Licensing',
                    time: '40m',
                    status: 'Resolved',
                    date: '2026-08-18'
                }
            ]
        },
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
                {
                    clientName: 'Sunrise Exports',
                    clientId: 'CLI-1122',
                    category: 'Installation',
                    time: '18m',
                    status: 'Resolved',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Patel Pharma Ltd',
                    clientId: 'CLI-2234',
                    category: 'Wallet Activation',
                    time: '29m',
                    status: 'Resolved',
                    date: '2026-08-18'
                }
            ]
        },
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
                {
                    clientName: 'Apex Solutions',
                    clientId: 'CLI-7743',
                    category: 'Licensing',
                    time: '2h 10m',
                    status: 'Escalated',
                    date: '2026-08-19'
                },
                {
                    clientName: 'Global Textiles Co',
                    clientId: 'CLI-6601',
                    category: 'Windows Formatting',
                    time: '35m',
                    status: 'Resolved',
                    date: '2026-08-18'
                }
            ]
        },
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
                {
                    clientName: 'Mehta & Sons Pvt Ltd',
                    clientId: 'CLI-3309',
                    category: 'Bill Format Modification',
                    time: '30m',
                    status: 'Resolved',
                    date: '2026-08-19'
                }
            ]
        }
    ];
    constructor(router) {
        this.router = router;
        this.selectedStaff = this.staffList[0];
    }
    get formattedDate() {
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
    onDateChange() {
        // Recent Activity automatically updates
        // through getFilteredActivities()
    }
    getFilteredActivities() {
        const search = this.searchQuery
            .trim()
            .toLowerCase();
        return this.selectedStaff.activities.filter(activity => {
            const matchesDate = !this.selectedDate ||
                activity.date === this.selectedDate;
            const matchesSearch = !search ||
                activity.clientName.toLowerCase().includes(search) ||
                activity.clientId.toLowerCase().includes(search) ||
                activity.category.toLowerCase().includes(search) ||
                activity.status.toLowerCase().includes(search);
            return matchesDate && matchesSearch;
        });
    }
    selectStaff(staff) {
        this.selectedStaff = staff;
    }
    getStatusClass(status) {
        switch (status) {
            case 'Resolved':
                return 'resolved';
            case 'Pending':
                return 'pending';
            case 'Escalated':
                return 'escalated';
            default:
                return '';
        }
    }
    getStatusDot(status) {
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
    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }
    goTo(path) {
        this.router.navigate([path]);
    }
    toggleProfile() {
        this.profileOpen = !this.profileOpen;
        this.notificationOpen = false;
    }
    toggleNotifications() {
        this.notificationOpen = !this.notificationOpen;
        this.profileOpen = false;
    }
    logout() {
        sessionStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
};
IndividualReports = __decorate([
    Component({
        selector: 'app-individual-reports',
        standalone: true,
        imports: [CommonModule, FormsModule],
        templateUrl: './individual.html',
        styleUrl: './individual.css'
    })
], IndividualReports);
export { IndividualReports };
