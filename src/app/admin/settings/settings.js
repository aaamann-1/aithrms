import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
let Settings = class Settings {
    // =========================================
    // PROFILE
    // =========================================
    fullName = 'Dev Sharma';
    email = 'dev.sharma@dsrpanel.com';
    phone = '+91 98765 43210';
    role = 'Administrator';
    // =========================================
    // PREFERENCES
    // =========================================
    pushNotifications = true;
    autoExport = false;
    liveUpdates = true;
    darkMode = false;
    // =========================================
    // PASSWORD POPUP
    // =========================================
    showPasswordForm = false;
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    // =========================================
    // INITIALIZE
    // =========================================
    ngOnInit() {
        this.darkMode = document.body.classList.contains('dark-mode');
    }
    // =========================================
    // SAVE PROFILE
    // =========================================
    saveChanges() {
        alert('Profile changes saved successfully!');
    }
    // =========================================
    // DARK MODE
    // =========================================
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
        }
        else {
            document.body.classList.remove('dark-mode');
        }
    }
    // =========================================
    // CHANGE PASSWORD
    // =========================================
    openChangePassword() {
        this.showPasswordForm = true;
    }
    closeChangePassword() {
        this.showPasswordForm = false;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
    }
    updatePassword() {
        if (!this.currentPassword ||
            !this.newPassword ||
            !this.confirmPassword) {
            alert('Please fill all password fields.');
            return;
        }
        if (this.newPassword.length < 6) {
            alert('New password must contain at least 6 characters.');
            return;
        }
        if (this.newPassword !== this.confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }
        alert('Password changed successfully!');
        this.closeChangePassword();
    }
};
Settings = __decorate([
    Component({
        selector: 'app-settings',
        standalone: true,
        imports: [FormsModule],
        templateUrl: './settings.html',
        styleUrl: './settings.css'
    })
], Settings);
export { Settings };
