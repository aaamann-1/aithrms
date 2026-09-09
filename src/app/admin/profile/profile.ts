import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  // =========================
  // PROFILE DATA
  // =========================

  fullName = 'Dev Sharma';
  email = 'dev.sharma@dsrpanel.com';
  phone = '+91 98765 43210';
  role = 'Administrator';
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
  // SAVE PROFILE
  // =========================

  saveChanges(): void {

    const user = {
      name: this.fullName,
      email: this.email,
      phone: this.phone,
      role: this.role,
      department: this.department,
      employeeId: this.employeeId
    };

    localStorage.setItem(
      'currentUser',
      JSON.stringify(user)
    );

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

  triggerPhotoUpload(input: HTMLInputElement): void {
    input.click();
  }

  onPhotoSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

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
      this.profileImage = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  // =========================
  // CHANGE PASSWORD
  // =========================

  openChangePassword(): void {
    this.showPasswordForm = true;
  }

  closeChangePassword(): void {

    this.showPasswordForm = false;

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  updatePassword(): void {

    if (
      !this.currentPassword ||
      !this.newPassword ||
      !this.confirmPassword
    ) {
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

  toggleNotifications(): void {
    this.notificationsEnabled =
      !this.notificationsEnabled;

    this.showNotificationSettings =
      this.notificationsEnabled;
  }

  // =========================
  // APPEARANCE
  // =========================

  toggleAppearance(): void {
    this.showAppearanceSettings =
      !this.showAppearanceSettings;
  }

  toggleDarkMode(): void {

    this.darkMode = !this.darkMode;

    document.body.classList.toggle(
      'dark-mode',
      this.darkMode
    );
  }

  // =========================
  // LANGUAGE
  // =========================

  toggleLanguage(): void {
    this.showLanguageSettings =
      !this.showLanguageSettings;
  }

  changeLanguage(language: string): void {
    this.selectedLanguage = language;
    this.showLanguageSettings = false;

    alert(`Language changed to ${language}.`);
  }

  // =========================
  // CANCEL
  // =========================

  cancelChanges(): void {

    this.fullName = 'Dev Sharma';
    this.email = 'dev.sharma@dsrpanel.com';
    this.phone = '+91 98765 43210';
    this.role = 'Administrator';
    this.department = 'Support & Operations';
    this.employeeId = 'DSR001';

    alert('Changes cancelled.');
  }
}