import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-staff-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class StaffSettings implements OnInit {

  // ================================
  // STAFF PROFILE
  // ================================

  fullName = '';
  email = '';
  contactNumber = '';
  employeeId = '';
  department = '';
  designation = '';
  joiningDate = '';

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

  constructor(private authService: AuthService) {}

  // ================================
  // LOAD LOGGED-IN STAFF
  // ================================

  ngOnInit(): void {
    this.loadStaffDetails();
  }

  loadStaffDetails(): void {

    const user = this.authService.getCurrentUser();

    if (user) {

      this.fullName = user.fullName || '';
      this.email = user.email || '';
      this.contactNumber = user.contactNumber || '';
      this.employeeId = user.employeeId?.toString() || '';
      this.department = user.department || '';
      this.designation = user.designation || '';
      this.joiningDate = user.joiningDate || '';

    } else {

      // Fallback: read the values saved during login
      this.fullName = localStorage.getItem('fullName') || '';
      this.email = localStorage.getItem('email') || '';
      this.contactNumber = localStorage.getItem('contactNumber') || '';
      this.employeeId = localStorage.getItem('employeeId') || '';
      this.department = localStorage.getItem('department') || '';
      this.designation = localStorage.getItem('designation') || '';
      this.joiningDate = localStorage.getItem('joiningDate') || '';

    }
  }

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
