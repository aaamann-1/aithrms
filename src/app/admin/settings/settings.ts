import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {

  // Profile
  fullName = 'Dev Sharma';
  email = 'dev.sharma@dsrpanel.com';
  phone = '+91 98765 43210';
  role = 'Administrator';

  // Preferences
  pushNotifications = true;
  autoExport = false;
  liveUpdates = true;
  darkMode = false;

  // Password popup
  showPasswordForm = false;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  saveChanges(): void {
    alert('Profile changes saved successfully!');
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

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

    alert('Password changed successfully!');

    this.closeChangePassword();
  }
}