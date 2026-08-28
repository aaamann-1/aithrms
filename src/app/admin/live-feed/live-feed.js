import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let LiveFeedComponent = class LiveFeedComponent {
    router;
    currentUser;
    profileDropdownOpen = false;
    notificationDropdownOpen = false;
    mobileMenuOpen = false;
    searchText = '';
    searchResults = [];
    activeFilter = 'All';
    filters = ['All', 'Resolved', 'Pending', 'Escalated'];
    selectedDate = new Date().toISOString().split('T')[0];
    onDateChange() {
        // Add date-based filtering here later if needed.
    }
    openDatePicker(input) {
        input.focus();
        input.showPicker?.();
    }
    getFormattedDate() {
        return new Date(`${this.selectedDate}T00:00:00`).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }
    activities = [
        { initials: 'RV', name: 'Rahul Verma', client: 'Sharma Enterprises', clientId: 'CLI-4821', category: 'Licensing', duration: '14m', time: '10:42 AM', status: 'Resolved', avatar: 'green' },
        { initials: 'PN', name: 'Priya Nair', client: 'Mehta & Sons Pvt Ltd', clientId: 'CLI-3309', category: 'Bill Format Modification', duration: '32m', time: '10:28 AM', status: 'Pending', avatar: 'blue' },
        { initials: 'AS', name: 'Amit Sharma', client: 'Rajkumar Trading', clientId: 'CLI-5517', category: 'Backup & Restore', duration: '1h 05m', time: '09:55 AM', status: 'Escalated', avatar: 'purple' },
        { initials: 'SJ', name: 'Sneha Joshi', client: 'Patel Pharma Ltd', clientId: 'CLI-2234', category: 'Wallet Activation', duration: '22m', time: '09:38 AM', status: 'Resolved', avatar: 'orange' },
        { initials: 'KM', name: 'Karan Mehta', client: 'Global Textiles Co', clientId: 'CLI-6601', category: 'Windows Formatting', duration: '48m', time: '09:15 AM', status: 'Pending', avatar: 'yellow' },
        { initials: 'DP', name: 'Divya Pillai', client: 'Sunrise Exports', clientId: 'CLI-1122', category: 'Installation', duration: '18m', time: '08:57 AM', status: 'Resolved', avatar: 'pink' }
    ];
    constructor(router) {
        this.router = router;
        const user = sessionStorage.getItem('currentUser');
        this.currentUser = user ? JSON.parse(user) : { name: 'Admin User', role: 'Administrator' };
    }
    get displayedActivities() {
        const query = this.searchText.trim().toLowerCase();
        return this.activities.filter(activity => {
            const matchesFilter = this.activeFilter === 'All' || activity.status === this.activeFilter;
            const searchable = [activity.name, activity.client, activity.clientId, activity.category, activity.status]
                .join(' ')
                .toLowerCase();
            return matchesFilter && (!query || searchable.includes(query));
        });
    }
    get userInitials() {
        return (this.currentUser?.name || 'Admin User').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    }
    goTo(path) {
        this.closeMenus();
        this.router.navigate([path]);
    }
    toggleProfileDropdown() {
        this.profileDropdownOpen = !this.profileDropdownOpen;
        this.notificationDropdownOpen = false;
    }
    toggleNotificationDropdown() {
        this.notificationDropdownOpen = !this.notificationDropdownOpen;
        this.profileDropdownOpen = false;
    }
    setFilter(filter) { this.activeFilter = filter; }
    searchDashboard() { this.searchResults = this.displayedActivities; }
    clearSearch() {
        this.searchText = '';
        this.searchResults = [];
    }
    logout() {
        sessionStorage.removeItem('currentUser');
        this.closeMenus();
        this.router.navigate(['/login']);
    }
    closeMenus() {
        this.profileDropdownOpen = false;
        this.notificationDropdownOpen = false;
        this.mobileMenuOpen = false;
    }
};
LiveFeedComponent = __decorate([
    Component({
        selector: 'app-live-feed',
        standalone: true,
        imports: [CommonModule, FormsModule],
        templateUrl: './live-feed.html',
        styleUrl: './live-feed.css'
    })
], LiveFeedComponent);
export { LiveFeedComponent };
