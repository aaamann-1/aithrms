import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  // Profile information
  fullName = 'Rahul Sharma';
  employeeId = 'EMP-0072';
  contactNumber = '+91 98765 43210';
  email = 'rahul.sharma@dsrweb.com';
  department = 'Billing Support';
  designation = 'Support Executive';
  joiningDate = '15 March 2022';

  // Popup controls
  showEditProfile = false;
  showChangePassword = false;

  // Password fields
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Open Edit Profile
  editProfile(): void {
    this.showEditProfile = true;
    this.showChangePassword = false;
  }

  // Open Change Password
  changePassword(): void {
    this.showChangePassword = true;
    this.showEditProfile = false;
  }

  // Close popup
  closeForms(): void {
    this.showEditProfile = false;
    this.showChangePassword = false;
  }

  // Save profile
  saveProfile(): void {
    alert('Profile updated successfully!');
    this.closeForms();
  }

  // Update password
  updatePassword(): void {

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      alert('Please fill all password fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    alert('Password changed successfully!');

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';

    this.closeForms();
  }
}