import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class StaffSettings {

  // ================================
  // STAFF PROFILE
  // ================================

  fullName = 'Rahul Sharma';
  email = 'rahul.sharma@dsrpanel.com';
  contactNumber = '+91 98765 43210';
  employeeId = 'EMP-0072';
  department = 'Customer Support';
  designation = 'Support Executive';

  // ================================
  // PREFERENCES
  // ================================

  pushNotifications = true;
  taskReminders = true;
  emailNotifications = true;
  darkMode = false;

  // ================================
  // PASSWORD
  // ================================

  showPasswordForm = false;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // ================================
  // SAVE SETTINGS
  // ================================

  saveChanges(): void {

    alert('Settings saved successfully!');

  }

  // ================================
  // DARK MODE
  // ================================

  toggleDarkMode(): void {

    this.darkMode = !this.darkMode;

    if (this.darkMode) {

      document.body.classList.add('dark-mode');

    } else {

      document.body.classList.remove('dark-mode');

    }

  }

  // ================================
  // CHANGE PASSWORD
  // ================================

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

  // ================================
  // TWO FACTOR AUTHENTICATION
  // ================================

  openTwoFactor(): void {

    alert('Two-Factor Authentication settings will be available soon.');

  }

}