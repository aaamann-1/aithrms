import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let Dashboard = class Dashboard {
    http;
    router;
    cdr;
    apiUrl = 'http://localhost:5089/api';
    stats = {
        totalStaff: 0,
        presentToday: 0,
        issuesSolved: 0,
        pendingIssues: 0,
        inProgress: 0,
        avgResolution: '0m',
        escalated: 0
    };
    attendanceSummary = {
        present: 0,
        absent: 0,
        averageHours: '0m',
        firstCheckIn: '-',
        late: 0
    };
    currentUser = null;
    profileOpen = false;
    notificationOpen = false;
    sidebarCollapsed = false;
    searchQuery = '';
    searchPerformed = false;
    selectedDate = '';
    dashboardTasks = [];
    dashboardAttendance = [];
    dashboardEmployees = [];
    activities = [];
    categories = [];
    weeklyData = [];
    recentTasks = [];
    attendance = [];
    notifications = [
        {
            title: 'New task assigned',
            message: 'A new support task has been assigned.',
            time: '10 min ago'
        },
        {
            title: 'Attendance update',
            message: 'Attendance records have been updated.',
            time: '30 min ago'
        }
    ];
    filteredActivities = [];
    filteredRecentTasks = [];
    filteredAttendance = [];
    filteredCategories = [];
    constructor(http, router, cdr) {
        this.http = http;
        this.router = router;
        this.cdr = cdr;
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUser =
                    JSON.parse(savedUser);
            }
            catch {
                this.currentUser = null;
            }
        }
        const today = new Date();
        this.selectedDate =
            this.getLocalDateString(today);
        this.resetFilteredData();
    }
    ngOnInit() {
        console.log('Dashboard initialized');
        this.loadTotalStaff();
        this.loadTasks();
        this.loadAttendance();
    }
    // ==========================================================
    // LOAD TOTAL STAFF
    // ==========================================================
    loadTotalStaff() {
        this.http
            .get(`${this.apiUrl}/Employee`)
            .subscribe({
            next: (staffMembers) => {
                console.log('Staff members received:', staffMembers);
                this.dashboardEmployees =
                    Array.isArray(staffMembers)
                        ? staffMembers
                        : [];
                this.stats.totalStaff =
                    this.dashboardEmployees.length;
                this.buildTodayAttendance();
                this.cdr.detectChanges();
                console.log('Total Staff:', this.stats.totalStaff);
            },
            error: (error) => {
                console.error('Failed to load staff:', error);
            }
        });
    }
    // ==========================================================
    // LOAD TASKS
    // ==========================================================
    loadTasks() {
        this.http
            .get(`${this.apiUrl}/TaskEntry/all`)
            .subscribe({
            next: (tasks) => {
                console.log('Task data received:', tasks);
                this.dashboardTasks =
                    Array.isArray(tasks)
                        ? tasks
                        : [];
                const resolvedTasks = this.dashboardTasks.filter(task => task.status
                    ?.trim()
                    .toLowerCase() === 'resolved');
                const pendingTasks = this.dashboardTasks.filter(task => task.status
                    ?.trim()
                    .toLowerCase() === 'pending');
                const inProgressTasks = this.dashboardTasks.filter(task => task.status
                    ?.trim()
                    .toLowerCase() === 'in progress');
                const escalatedTasks = this.dashboardTasks.filter(task => task.status
                    ?.trim()
                    .toLowerCase() === 'escalated');
                this.stats.issuesSolved =
                    resolvedTasks.length;
                this.stats.pendingIssues =
                    pendingTasks.length;
                this.stats.inProgress =
                    inProgressTasks.length;
                this.stats.avgResolution =
                    this.calculateAverageResolution(resolvedTasks);
                this.stats.escalated =
                    escalatedTasks.length;
                this.buildLiveActivities();
                this.buildCategories();
                this.buildWeeklyActivity();
                this.buildRecentTasks();
                this.cdr.detectChanges();
                console.log('Task dashboard updated:', this.stats);
            },
            error: (error) => {
                console.error('Failed to load tasks:', error);
            }
        });
    }
    // ==========================================================
    // LOAD ATTENDANCE
    // ==========================================================
    loadAttendance() {
        this.http
            .get(`${this.apiUrl}/Attendance/admin`)
            .subscribe({
            next: (records) => {
                console.log('Attendance data received:', records);
                this.dashboardAttendance =
                    Array.isArray(records)
                        ? records
                        : [];
                this.buildTodayAttendance();
                this.cdr.detectChanges();
                console.log('Present Today:', this.stats.presentToday);
            },
            error: (error) => {
                console.error('Failed to load attendance:', error);
            }
        });
    }
    // ==========================================================
    // BUILD TODAY ATTENDANCE
    // ==========================================================
    buildTodayAttendance() {
        if (!Array.isArray(this.dashboardEmployees)) {
            return;
        }
        const today = new Date();
        const todayDate = this.getLocalDateString(today);
        // ========================================================
        // SUNDAY = HOLIDAY
        // ========================================================
        if (today.getDay() === 0) {
            console.log('Today is Sunday. Attendance is a holiday.');
            this.stats.presentToday = 0;
            this.attendanceSummary.present = 0;
            this.attendanceSummary.absent = 0;
            this.attendanceSummary.late = 0;
            this.attendanceSummary.averageHours = '0m';
            this.attendanceSummary.firstCheckIn = '-';
            this.attendance = [];
            this.filteredAttendance = [];
            this.cdr.detectChanges();
            return;
        }
        // ========================================================
        // GET TODAY'S ATTENDANCE RECORDS
        // ========================================================
        const todayRecords = this.dashboardAttendance.filter(record => this.getAttendanceDateString(record.date) === todayDate);
        // ========================================================
        // GROUP ATTENDANCE BY USER ID
        // ========================================================
        const attendanceByUser = new Map();
        for (const record of todayRecords) {
            const userId = Number(record.userId);
            if (!attendanceByUser.has(userId)) {
                attendanceByUser.set(userId, []);
            }
            attendanceByUser
                .get(userId)
                .push(record);
        }
        const attendanceRows = [];
        let presentCount = 0;
        let lateCount = 0;
        let totalPresentMinutes = 0;
        let earliestCheckIn = null;
        // ========================================================
        // LOOP THROUGH ALL STAFF
        // ========================================================
        for (const employee of this.dashboardEmployees) {
            const employeeUserId = this.getEmployeeUserId(employee);
            if (employeeUserId === null) {
                continue;
            }
            const employeeRecords = attendanceByUser.get(employeeUserId) || [];
            // ======================================================
            // ABSENT STAFF
            // ======================================================
            if (employeeRecords.length === 0) {
                attendanceRows.push({
                    id: employeeUserId,
                    userId: employeeUserId,
                    name: this.getEmployeeName(employee) || 'Unknown Staff',
                    initials: this.getInitials(this.getEmployeeName(employee) || 'Unknown Staff'),
                    time: '-',
                    checkIn: null,
                    checkOut: null,
                    hoursWorkedMinutes: 0,
                    status: 'Absent'
                });
                continue;
            }
            // ======================================================
            // PRESENT STAFF
            // ======================================================
            presentCount++;
            let totalMinutes = 0;
            let firstCheckIn = null;
            let lastCheckOut = null;
            let half1Record = null;
            for (const record of employeeRecords) {
                totalMinutes +=
                    Number(record.hoursWorkedMinutes || 0);
                const checkInDate = record.checkIn
                    ? new Date(record.checkIn)
                    : null;
                const checkOutDate = record.checkOut
                    ? new Date(record.checkOut)
                    : null;
                if (checkInDate &&
                    (!firstCheckIn ||
                        checkInDate < firstCheckIn)) {
                    firstCheckIn =
                        checkInDate;
                }
                if (checkOutDate &&
                    (!lastCheckOut ||
                        checkOutDate > lastCheckOut)) {
                    lastCheckOut =
                        checkOutDate;
                }
                if (record.half
                    ?.toLowerCase() === 'half1') {
                    half1Record = record;
                }
            }
            totalPresentMinutes +=
                totalMinutes;
            // ======================================================
            // FIRST CHECK-IN OF ALL STAFF
            // ======================================================
            if (firstCheckIn &&
                (!earliestCheckIn ||
                    firstCheckIn < earliestCheckIn)) {
                earliestCheckIn =
                    firstCheckIn;
            }
            // ======================================================
            // LATE CHECK-IN
            // ======================================================
            let isLate = false;
            if (half1Record &&
                half1Record.checkIn) {
                const half1CheckIn = new Date(half1Record.checkIn);
                const lateLimit = new Date(half1CheckIn);
                lateLimit.setHours(9, 30, 0, 0);
                if (half1CheckIn >
                    lateLimit) {
                    isLate = true;
                    lateCount++;
                }
            }
            const employeeName = this.getEmployeeName(employee) ||
                employeeRecords[0]?.staffName ||
                'Unknown Staff';
            let displayStatus = 'Present';
            if (isLate) {
                displayStatus = 'Late';
            }
            // ======================================================
            // TIME DISPLAY
            // ======================================================
            let timeText = '-';
            if (firstCheckIn) {
                const checkInText = this.formatTime(firstCheckIn);
                const checkOutText = lastCheckOut
                    ? this.formatTime(lastCheckOut)
                    : '';
                if (checkOutText) {
                    timeText =
                        `${checkInText} - ${checkOutText}`;
                }
                else {
                    timeText =
                        checkInText;
                }
            }
            attendanceRows.push({
                id: employeeUserId,
                userId: employeeUserId,
                name: employeeName,
                initials: this.getInitials(employeeName),
                time: timeText,
                checkIn: firstCheckIn,
                checkOut: lastCheckOut,
                hoursWorkedMinutes: totalMinutes,
                hours: this.formatMinutes(totalMinutes),
                status: displayStatus
            });
        }
        // ========================================================
        // UPDATE ATTENDANCE SUMMARY
        // ========================================================
        this.stats.presentToday =
            presentCount;
        this.attendanceSummary.present =
            presentCount;
        this.attendanceSummary.absent =
            Math.max(this.stats.totalStaff -
                presentCount, 0);
        this.attendanceSummary.late =
            lateCount;
        // ========================================================
        // AVERAGE HOURS
        // ========================================================
        if (presentCount > 0) {
            const averageMinutes = Math.round(totalPresentMinutes /
                presentCount);
            this.attendanceSummary.averageHours =
                this.formatMinutes(averageMinutes);
        }
        else {
            this.attendanceSummary.averageHours =
                '0m';
        }
        // ========================================================
        // FIRST CHECK-IN
        // ========================================================
        this.attendanceSummary.firstCheckIn =
            earliestCheckIn
                ? this.formatTime(earliestCheckIn)
                : '-';
        // ========================================================
        // SAVE ATTENDANCE LIST
        // ========================================================
        this.attendance =
            attendanceRows;
        this.filteredAttendance =
            [...attendanceRows];
        this.cdr.detectChanges();
        console.log('Today attendance:', attendanceRows);
        console.log('Attendance summary:', this.attendanceSummary);
    }
    // ==========================================================
    // EMPLOYEE USER ID
    // ==========================================================
    getEmployeeUserId(employee) {
        if (employee.userId !== undefined &&
            employee.userId !== null) {
            return Number(employee.userId);
        }
        if (employee.id !== undefined &&
            employee.id !== null) {
            return Number(employee.id);
        }
        return null;
    }
    // ==========================================================
    // EMPLOYEE NAME
    // ==========================================================
    getEmployeeName(employee) {
        return (employee.fullName ||
            employee.employeeName ||
            employee.username ||
            '');
    }
    // ==========================================================
    // GET LOCAL DATE
    // ==========================================================
    getLocalDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    // ==========================================================
    // GET ATTENDANCE DATE
    // ==========================================================
    getAttendanceDateString(value) {
        if (!value) {
            return '';
        }
        const date = new Date(value);
        return this.getLocalDateString(date);
    }
    // ==========================================================
    // FORMAT TIME
    // ==========================================================
    formatTime(date) {
        return date.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    // ==========================================================
    // FORMAT MINUTES
    // ==========================================================
    formatMinutes(minutes) {
        if (!minutes ||
            minutes <= 0) {
            return '0m';
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours > 0) {
            if (remainingMinutes > 0) {
                return `${hours}h ${remainingMinutes}m`;
            }
            else {
                return `${hours}h`;
            }
        }
        return `${remainingMinutes}m`;
    }
    // ==========================================================
    // GET INITIALS
    // ==========================================================
    getInitials(name) {
        if (!name) {
            return '?';
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
    // ==========================================================
    // TASK - LIVE ACTIVITIES
    // ==========================================================
    buildLiveActivities() {
        this.activities =
            this.dashboardTasks
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime())
                .slice(0, 10)
                .map(task => ({
                name: task.staffName ||
                    'Staff',
                initials: this.getInitials(task.staffName ||
                    'Staff'),
                avatar: 'avatar-' +
                    (task.id % 5),
                client: task.clientName ||
                    '-',
                clientId: task.clientId ||
                    '-',
                category: task.issueCategory ||
                    '-',
                duration: this.getTaskDuration(task),
                status: this.formatStatus(task.status),
                time: this.getRelativeTime(task.createdAt)
            }));
        this.filteredActivities =
            [...this.activities];
    }
    // ==========================================================
    // BUILD CATEGORIES
    // ==========================================================
    buildCategories() {
        const categoryMap = new Map();
        for (const task of this.dashboardTasks) {
            const category = task.issueCategory ||
                'Other';
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        }
        this.categories =
            Array.from(categoryMap.entries())
                .map(([name, value]) => ({
                name,
                value
            }))
                .sort((a, b) => b.value - a.value);
        this.filteredCategories =
            [...this.categories];
    }
    // ==========================================================
    // BUILD WEEKLY ACTIVITY
    // ==========================================================
    buildWeeklyActivity() {
        const days = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
        ];
        const today = new Date();
        const weekly = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = this.getLocalDateString(date);
            const count = this.dashboardTasks.filter(task => this.getLocalDateString(new Date(task.createdAt)) === dateString).length;
            weekly.push({
                day: days[date.getDay()],
                value: Math.min(count * 10, 100)
            });
        }
        this.weeklyData =
            weekly;
    }
    // ==========================================================
    // BUILD RECENT TASKS
    // ==========================================================
    buildRecentTasks() {
        this.recentTasks =
            this.dashboardTasks
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime())
                .slice(0, 10)
                .map(task => ({
                clientId: task.clientId ||
                    '-',
                clientName: task.clientName ||
                    '-',
                category: task.issueCategory ||
                    '-',
                status: this.formatStatus(task.status),
                time: this.getRelativeTime(task.createdAt),
                staff: task.staffName ||
                    '-'
            }));
        this.filteredRecentTasks =
            [...this.recentTasks];
    }
    // ==========================================================
    // TASK DURATION
    // ==========================================================
    getTaskDuration(task) {
        if (!task.startTime ||
            !task.endTime) {
            return '-';
        }
        const start = new Date(task.startTime);
        const end = new Date(task.endTime);
        const minutes = Math.round((end.getTime() -
            start.getTime()) / 60000);
        return this.formatMinutes(minutes);
    }
    // ==========================================================
    // AVERAGE RESOLUTION
    // ==========================================================
    calculateAverageResolution(tasks) {
        if (tasks.length === 0) {
            return '0m';
        }
        let totalMinutes = 0;
        let validTasks = 0;
        for (const task of tasks) {
            if (!task.startTime ||
                !task.endTime) {
                continue;
            }
            const start = new Date(task.startTime);
            const end = new Date(task.endTime);
            const difference = (end.getTime() -
                start.getTime()) / 60000;
            if (difference >= 0) {
                totalMinutes +=
                    difference;
                validTasks++;
            }
        }
        if (validTasks === 0) {
            return '0m';
        }
        return this.formatMinutes(Math.round(totalMinutes /
            validTasks));
    }
    // ==========================================================
    // FORMAT STATUS
    // ==========================================================
    formatStatus(status) {
        if (!status) {
            return '-';
        }
        const value = status
            .trim()
            .toLowerCase();
        if (value === 'resolved') {
            return 'Resolved';
        }
        if (value === 'pending') {
            return 'Pending';
        }
        if (value === 'in progress') {
            return 'In Progress';
        }
        if (value === 'escalated') {
            return 'Escalated';
        }
        return status;
    }
    // ==========================================================
    // RELATIVE TIME
    // ==========================================================
    getRelativeTime(value) {
        if (!value) {
            return '-';
        }
        const date = new Date(value);
        const now = new Date();
        const difference = Math.floor((now.getTime() -
            date.getTime()) / 60000);
        if (difference < 1) {
            return 'Just now';
        }
        if (difference < 60) {
            return `${difference} min ago`;
        }
        const hours = Math.floor(difference / 60);
        if (hours < 24) {
            return `${hours} hr ago`;
        }
        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    // ==========================================================
    // RESET FILTERED DATA
    // ==========================================================
    resetFilteredData() {
        this.filteredActivities =
            [];
        this.filteredRecentTasks =
            [];
        this.filteredAttendance =
            [];
        this.filteredCategories =
            [];
    }
    // ==========================================================
    // SEARCH
    // ==========================================================
    performSearch() {
        const query = this.searchQuery
            .trim()
            .toLowerCase();
        if (!query) {
            this.searchPerformed =
                false;
            this.filteredActivities =
                [...this.activities];
            this.filteredRecentTasks =
                [...this.recentTasks];
            this.filteredAttendance =
                [...this.attendance];
            this.filteredCategories =
                [...this.categories];
            return;
        }
        this.searchPerformed =
            true;
        this.filteredActivities =
            this.activities.filter(activity => JSON.stringify(activity)
                .toLowerCase()
                .includes(query));
        this.filteredRecentTasks =
            this.recentTasks.filter(task => JSON.stringify(task)
                .toLowerCase()
                .includes(query));
        this.filteredAttendance =
            this.attendance.filter(person => JSON.stringify(person)
                .toLowerCase()
                .includes(query));
        this.filteredCategories =
            this.categories.filter(category => JSON.stringify(category)
                .toLowerCase()
                .includes(query));
    }
    // ==========================================================
    // CLEAR SEARCH
    // ==========================================================
    clearSearch() {
        this.searchQuery =
            '';
        this.searchPerformed =
            false;
        this.filteredActivities =
            [...this.activities];
        this.filteredRecentTasks =
            [...this.recentTasks];
        this.filteredAttendance =
            [...this.attendance];
        this.filteredCategories =
            [...this.categories];
    }
    // ==========================================================
    // CATEGORY WIDTH
    // ==========================================================
    getCategoryWidth(value) {
        if (!this.categories.length) {
            return 0;
        }
        const maxValue = Math.max(...this.categories.map(category => category.value));
        if (maxValue === 0) {
            return 0;
        }
        return (value /
            maxValue) * 100;
    }
    // ==========================================================
    // NAVIGATION
    // ==========================================================
    goTo(route) {
        this.router.navigateByUrl(route);
    }
    // ==========================================================
    // PROFILE
    // ==========================================================
    toggleProfile() {
        this.profileOpen =
            !this.profileOpen;
        this.notificationOpen =
            false;
    }
    // ==========================================================
    // NOTIFICATIONS
    // ==========================================================
    toggleNotifications() {
        this.notificationOpen =
            !this.notificationOpen;
        this.profileOpen =
            false;
    }
    // ==========================================================
    // SIDEBAR
    // ==========================================================
    toggleSidebar() {
        this.sidebarCollapsed =
            !this.sidebarCollapsed;
    }
    // ==========================================================
    // LOGOUT
    // ==========================================================
    logout() {
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.router.navigateByUrl('/login');
    }
};
Dashboard = __decorate([
    Component({
        selector: 'app-dashboard',
        standalone: true,
        imports: [
            CommonModule,
            FormsModule
        ],
        templateUrl: './dashboard.html',
        styleUrls: ['./dashboard.css']
    })
], Dashboard);
export { Dashboard };
