import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let Profile = class Profile {
    // =========================
    // PROFILE DATA
    // =========================
    fullName = '';
    email = '';
    phone = '';
    role = '';
    // These remain fixed
    department = 'Support & Operations';
    employeeId = 'DSR001';
    // =========================
    // PROFILE PHOTO
    // =========================
    profileImage = '';
    // =========================
    // UI STATES
    // =========================
    showPasswordForm = false;
    showNotificationSettings = false;
    showAppearanceSettings = false;
    showLanguageSettings = false;
    // =========================
    // PASSWORD
    // =========================
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    // =========================
    // PREFERENCES
    // =========================
    notificationsEnabled = true;
    darkMode = false;
    selectedLanguage = 'English';
    // =========================
    // ACCOUNT ACTIVITY
    // =========================
    activities = [
        {
            title: 'Logged in',
            description: 'Windows • Chrome',
            time: 'Today, 10:24 AM'
        },
        {
            title: 'Profile updated',
            description: 'Changed profile information',
            time: '5 Sept 2026, 02:32 PM'
        },
        {
            title: 'Password changed',
            description: 'Account security updated',
            time: '1 Sept 2026, 09:15 AM'
        }
    ];
    // =========================
    // LOAD LOGGED-IN ADMIN
    // =========================
    ngOnInit() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                this.fullName =
                    user.fullName || 'Admin';
                this.email =
                    user.username || '';
                this.phone =
                    user.contactNumber || '';
                this.role =
                    user.role === 'Admin'
                        ? 'Administrator'
                        : user.role || '';
            }
            catch (error) {
                console.error('Unable to load current user:', error);
            }
        }
    }
    // =========================
    // SAVE PROFILE
    // =========================
    saveChanges() {
        const storedUser = localStorage.getItem('currentUser');
        let user = {};
        if (storedUser) {
            try {
                user = JSON.parse(storedUser);
            }
            catch {
                user = {};
            }
        }
        const updatedUser = {
            ...user,
            fullName: this.fullName,
            username: this.email,
            contactNumber: this.phone,
            role: 'Admin'
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.role = 'Administrator';
        this.activities.unshift({
            title: 'Profile updated',
            description: 'Changed profile information',
            time: 'Just now'
        });
        alert('Profile changes saved successfully!');
    }
    // =========================
    // CHANGE PHOTO
    // =========================
    triggerPhotoUpload(input) {
        input.click();
    }
    onPhotoSelected(event) {
        const input = event.target;
        if (!input.files || input.files.length === 0) {
            return;
        }
        const file = input.files[0];
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.profileImage =
                reader.result;
        };
        reader.readAsDataURL(file);
    }
    // =========================
    // CHANGE PASSWORD
    // =========================
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
        if (this.newPassword !== this.confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }
        if (this.newPassword.length < 6) {
            alert('New password must contain at least 6 characters.');
            return;
        }
        alert('Password changed successfully!');
        this.activities.unshift({
            title: 'Password changed',
            description: 'Account security updated',
            time: 'Just now'
        });
        this.closeChangePassword();
    }
    // =========================
    // NOTIFICATIONS
    // =========================
    toggleNotifications() {
        this.notificationsEnabled =
            !this.notificationsEnabled;
        this.showNotificationSettings =
            this.notificationsEnabled;
    }
    // =========================
    // APPEARANCE
    // =========================
    toggleAppearance() {
        this.showAppearanceSettings =
            !this.showAppearanceSettings;
    }
    toggleDarkMode() {
        this.darkMode =
            !this.darkMode;
        document.body.classList.toggle('dark-mode', this.darkMode);
    }
    // =========================
    // LANGUAGE
    // =========================
    toggleLanguage() {
        this.showLanguageSettings =
            !this.showLanguageSettings;
    }
    changeLanguage(language) {
        this.selectedLanguage = language;
        this.showLanguageSettings = false;
        alert(`Language changed to ${language}.`);
    }
    // =========================
    // CANCEL
    // =========================
    cancelChanges() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                this.fullName =
                    user.fullName || 'Admin';
                this.email =
                    user.username || '';
                this.phone =
                    user.contactNumber || '';
                this.role =
                    user.role === 'Admin'
                        ? 'Administrator'
                        : user.role || '';
            }
            catch {
                // Keep current values
            }
        }
        // These remain fixed
        this.department = 'Support & Operations';
        this.employeeId = 'DSR001';
        alert('Changes cancelled.');
    }
};
Profile = __decorate([
    Component({
        selector: 'app-profile',
        standalone: true,
        imports: [
            CommonModule,
            FormsModule
        ],
        templateUrl: './profile.html',
        styleUrl: './profile.css'
    })
], Profile);
export { Profile };
