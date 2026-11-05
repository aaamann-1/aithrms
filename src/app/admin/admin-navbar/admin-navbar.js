import { __decorate } from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
let AdminNavbarComponent = class AdminNavbarComponent {
    router;
    menuToggle = new EventEmitter();
    searchQuery = '';
    selectedDate = '';
    notificationOpen = false;
    profileOpen = false;
    currentUser = null;
    notifications = [
        {
            title: 'New Ticket',
            message: 'A new support ticket has been created.',
            time: '5 min ago'
        },
        {
            title: 'Task Completed',
            message: 'Rahul completed a support task.',
            time: '15 min ago'
        },
        {
            title: 'New Staff',
            message: 'A new staff member has joined.',
            time: '30 min ago'
        }
    ];
    constructor(router) {
        this.router = router;
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
            }
            catch {
                this.currentUser = null;
            }
        }
        const today = new Date();
        this.selectedDate =
            today.toISOString().split('T')[0];
    }
    toggleMenu() {
        this.menuToggle.emit();
    }
    /* SEARCH */
    performSearch() {
        const query = this.searchQuery.trim();
        if (!query) {
            return;
        }
        console.log('Searching:', query);
    }
    onSearchKey(event) {
        if (event.key === 'Enter') {
            this.performSearch();
        }
    }
    clearSearch() {
        this.searchQuery = '';
    }
    /* DATE */
    onDateChange() {
        console.log('Selected date:', this.selectedDate);
    }
    getFormattedDate() {
        if (!this.selectedDate) {
            return '';
        }
        const date = new Date(this.selectedDate);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
    /* NOTIFICATIONS */
    toggleNotifications() {
        this.notificationOpen =
            !this.notificationOpen;
        this.profileOpen = false;
    }
    /* PROFILE */
    toggleProfile() {
        this.profileOpen =
            !this.profileOpen;
        this.notificationOpen = false;
    }
    openProfile() {
        this.profileOpen = false;
        this.router.navigate([
            '/admin/profile'
        ]);
    }
    openSettings() {
        this.profileOpen = false;
        this.router.navigate([
            '/admin/settings'
        ]);
    }
    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']);
    }
};
__decorate([
    Output()
], AdminNavbarComponent.prototype, "menuToggle", void 0);
AdminNavbarComponent = __decorate([
    Component({
        selector: 'app-admin-navbar',
        standalone: true,
        imports: [
            CommonModule,
            FormsModule
        ],
        templateUrl: './admin-navbar.html',
        styleUrl: './admin-navbar.css'
    })
], AdminNavbarComponent);
export { AdminNavbarComponent };
