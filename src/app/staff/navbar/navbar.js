import { __decorate } from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let Navbar = class Navbar {
    menuToggle = new EventEmitter();
    searchQuery = '';
    // Today's date by default
    selectedDate = this.getTodayDate();
    showNotifications = false;
    showProfile = false;
    toggleMenu() {
        this.menuToggle.emit();
    }
    toggleNotifications() {
        this.showNotifications = !this.showNotifications;
        if (this.showNotifications) {
            this.showProfile = false;
        }
    }
    toggleProfile() {
        this.showProfile = !this.showProfile;
        if (this.showProfile) {
            this.showNotifications = false;
        }
    }
    getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
};
__decorate([
    Output()
], Navbar.prototype, "menuToggle", void 0);
Navbar = __decorate([
    Component({
        selector: 'app-staff-navbar',
        standalone: true,
        imports: [
            CommonModule,
            FormsModule
        ],
        templateUrl: './navbar.html',
        styleUrl: './navbar.css'
    })
], Navbar);
export { Navbar };
