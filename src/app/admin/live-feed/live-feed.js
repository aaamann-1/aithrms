import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let LiveFeedComponent = class LiveFeedComponent {
    http;
    router;
    apiUrl = 'http://localhost:5089/api';
    currentUser;
    profileDropdownOpen = false;
    notificationDropdownOpen = false;
    mobileMenuOpen = false;
    searchText = '';
    searchResults = [];
    activeFilter = 'All';
    filters = [
        'All',
        'Resolved',
        'Pending',
        'In Progress',
        'Escalated'
    ];
    selectedDate = new Date().toISOString().split('T')[0];
    activities = [];
    isLoading = false;
    constructor(http, router) {
        this.http = http;
        this.router = router;
        const user = sessionStorage.getItem('currentUser');
        this.currentUser =
            user
                ? JSON.parse(user)
                : {
                    name: 'Admin User',
                    role: 'Administrator'
                };
    }
    ngOnInit() {
        this.loadActivities();
    }
    // =========================================================
    // LOAD ALL TASKS FROM BACKEND
    // =========================================================
    loadActivities() {
        this.isLoading = true;
        this.http
            .get(`${this.apiUrl}/TaskEntry/all`)
            .subscribe({
            next: (tasks) => {
                console.log('Live Feed task data:', tasks);
                const allTasks = Array.isArray(tasks)
                    ? tasks
                    : [];
                this.activities =
                    allTasks.map(task => this.convertTaskToActivity(task));
                this.isLoading = false;
                console.log('Live Feed activities:', this.activities);
            },
            error: (error) => {
                console.error('Failed to load Live Feed:', error);
                this.activities = [];
                this.isLoading = false;
            }
        });
    }
    // =========================================================
    // CONVERT BACKEND TASK INTO LIVE FEED ACTIVITY
    // =========================================================
    convertTaskToActivity(task) {
        return {
            initials: this.getInitials(task.staffName),
            name: task.staffName ||
                'Unknown Staff',
            client: task.clientName ||
                '-',
            clientId: task.clientId ||
                '-',
            category: task.issueCategory ||
                '-',
            duration: this.getTaskDuration(task),
            time: this.formatDateTime(task.createdAt),
            status: this.normalizeStatus(task.status),
            avatar: this.getAvatarClass(task.staffName)
        };
    }
    // =========================================================
    // NORMALIZE STATUS
    // =========================================================
    normalizeStatus(status) {
        const value = (status || '')
            .trim()
            .toLowerCase();
        if (value === 'resolved') {
            return 'Resolved';
        }
        if (value === 'pending') {
            return 'Pending';
        }
        if (value === 'in progress' ||
            value === 'in-progress' ||
            value === 'in_progress') {
            return 'In Progress';
        }
        if (value === 'escalated') {
            return 'Escalated';
        }
        // Default if backend contains
        // an unexpected status
        return 'Pending';
    }
    // =========================================================
    // DISPLAYED ACTIVITIES
    // =========================================================
    get displayedActivities() {
        const query = this.searchText
            .trim()
            .toLowerCase();
        return this.activities
            .filter(activity => {
            const matchesFilter = this.activeFilter === 'All' ||
                activity.status ===
                    this.activeFilter;
            const searchable = [
                activity.name,
                activity.client,
                activity.clientId,
                activity.category,
                activity.status
            ]
                .join(' ')
                .toLowerCase();
            const matchesSearch = !query ||
                searchable.includes(query);
            return (matchesFilter &&
                matchesSearch);
        })
            .sort((a, b) => this.getActivityTime(b) -
            this.getActivityTime(a));
    }
    // =========================================================
    // SORT ACTIVITIES BY TIME
    // =========================================================
    getActivityTime(activity) {
        const date = new Date(`1970-01-01 ${activity.time}`);
        return date.getTime();
    }
    // =========================================================
    // GET STAFF INITIALS
    // =========================================================
    getInitials(name) {
        if (!name) {
            return '??';
        }
        const parts = name
            .trim()
            .split(/\s+/);
        if (parts.length === 1) {
            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }
        return (parts[0][0] +
            parts[parts.length - 1][0]).toUpperCase();
    }
    // =========================================================
    // AVATAR COLOR
    // =========================================================
    getAvatarClass(name) {
        const avatarClasses = [
            'green',
            'blue',
            'purple',
            'orange',
            'yellow',
            'pink'
        ];
        if (!name) {
            return 'blue';
        }
        let total = 0;
        for (let i = 0; i < name.length; i++) {
            total +=
                name.charCodeAt(i);
        }
        return avatarClasses[total % avatarClasses.length];
    }
    // =========================================================
    // TASK DURATION
    // =========================================================
    getTaskDuration(task) {
        if (!task.startTime ||
            !task.endTime) {
            return '—';
        }
        const start = this.convertTimeToMinutes(task.startTime);
        const end = this.convertTimeToMinutes(task.endTime);
        if (start === null ||
            end === null) {
            return '—';
        }
        let duration = end - start;
        // Handles tasks crossing midnight
        if (duration < 0) {
            duration += 24 * 60;
        }
        return this.formatMinutes(duration);
    }
    // =========================================================
    // CONVERT TIME TO MINUTES
    // =========================================================
    convertTimeToMinutes(value) {
        if (!value) {
            return null;
        }
        const cleanValue = value
            .trim()
            .toUpperCase();
        // 24-hour format: HH:mm
        const twentyFourHourMatch = cleanValue.match(/^(\d{1,2}):(\d{2})$/);
        if (twentyFourHourMatch) {
            const hours = Number(twentyFourHourMatch[1]);
            const minutes = Number(twentyFourHourMatch[2]);
            if (hours >= 0 &&
                hours <= 23 &&
                minutes >= 0 &&
                minutes <= 59) {
                return (hours * 60 +
                    minutes);
            }
        }
        // 12-hour format: hh:mm AM/PM
        const twelveHourMatch = cleanValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
        if (twelveHourMatch) {
            let hours = Number(twelveHourMatch[1]);
            const minutes = Number(twelveHourMatch[2]);
            const period = twelveHourMatch[3];
            if (hours < 1 ||
                hours > 12 ||
                minutes < 0 ||
                minutes > 59) {
                return null;
            }
            if (period === 'AM' &&
                hours === 12) {
                hours = 0;
            }
            if (period === 'PM' &&
                hours !== 12) {
                hours += 12;
            }
            return (hours * 60 +
                minutes);
        }
        return null;
    }
    // =========================================================
    // FORMAT MINUTES
    // =========================================================
    formatMinutes(minutes) {
        if (minutes < 60) {
            return `${minutes}m`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours}h`;
        }
        return `${hours}h ${remainingMinutes}m`;
    }
    // =========================================================
    // FORMAT CREATED DATE/TIME
    // =========================================================
    formatDateTime(value) {
        if (!value) {
            return '-';
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return '-';
        }
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    // =========================================================
    // DATE
    // =========================================================
    onDateChange() {
        // Date filtering can be added later.
    }
    openDatePicker(input) {
        input.focus();
        input
            .showPicker?.();
    }
    getFormattedDate() {
        return new Date(`${this.selectedDate}T00:00:00`).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }
    // =========================================================
    // USER INITIALS
    // =========================================================
    get userInitials() {
        return (this.currentUser?.name ||
            'Admin User')
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }
    // =========================================================
    // NAVIGATION
    // =========================================================
    goTo(path) {
        this.closeMenus();
        this.router.navigate([
            path
        ]);
    }
    // =========================================================
    // PROFILE DROPDOWN
    // =========================================================
    toggleProfileDropdown() {
        this.profileDropdownOpen =
            !this.profileDropdownOpen;
        this.notificationDropdownOpen =
            false;
    }
    // =========================================================
    // NOTIFICATION DROPDOWN
    // =========================================================
    toggleNotificationDropdown() {
        this.notificationDropdownOpen =
            !this.notificationDropdownOpen;
        this.profileDropdownOpen =
            false;
    }
    // =========================================================
    // FILTER
    // =========================================================
    setFilter(filter) {
        this.activeFilter =
            filter;
    }
    // =========================================================
    // SEARCH
    // =========================================================
    searchDashboard() {
        this.searchResults =
            this.displayedActivities;
    }
    clearSearch() {
        this.searchText = '';
        this.searchResults = [];
    }
    // =========================================================
    // LOGOUT
    // =========================================================
    logout() {
        sessionStorage.removeItem('currentUser');
        this.closeMenus();
        this.router.navigate([
            '/login'
        ]);
    }
    // =========================================================
    // CLOSE MENUS
    // =========================================================
    closeMenus() {
        this.profileDropdownOpen =
            false;
        this.notificationDropdownOpen =
            false;
        this.mobileMenuOpen =
            false;
    }
};
LiveFeedComponent = __decorate([
    Component({
        selector: 'app-live-feed',
        standalone: true,
        imports: [
            CommonModule,
            FormsModule
        ],
        templateUrl: './live-feed.html',
        styleUrl: './live-feed.css'
    })
], LiveFeedComponent);
export { LiveFeedComponent };
