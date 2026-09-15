import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  // Profile information
  fullName = '';
  employeeId = '';
  contactNumber = '';
  email = '';
  department = '';
  designation = '';
  joiningDate = '';

  // Popup controls
  showEditProfile = false;
  showChangePassword = false;

  // Password fields
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Load logged-in Staff profile information
  ngOnInit(): void {
    this.fullName = localStorage.getItem('fullName') ?? '';
    this.employeeId = localStorage.getItem('employeeId') ?? '';
    this.contactNumber = localStorage.getItem('contactNumber') ?? '';
    this.email = localStorage.getItem('username') ?? '';
    this.department = localStorage.getItem('department') ?? '';
    this.designation = localStorage.getItem('designation') ?? '';
    this.joiningDate = localStorage.getItem('joiningDate') ?? '';
  }

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