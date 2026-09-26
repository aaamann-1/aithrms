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

  // =========================================
  // STAFF PROFILE INFORMATION
  // =========================================

  fullName = 'Rahul Sharma';
  employeeId = 'EMP-0072';
  contactNumber = '+91 98765 43210';
  email = 'rahul.sharma@dsrpanel.com';
  department = 'Customer Support';
  designation = 'Support Executive';
  joiningDate = '15 January 2026';

  // =========================================
  // POPUP CONTROLS
  // =========================================

  showEditProfile = false;
  showChangePassword = false;

  // =========================================
  // PASSWORD FIELDS
  // =========================================

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // =========================================
  // LOAD STAFF INFORMATION
  // =========================================

  ngOnInit(): void {

    /*
     * Default Staff information is Rahul Sharma.
     *
     * If a Staff user is stored in currentUser,
     * we use that information instead.
     *
     * Admin information will NOT be loaded here.
     */

    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
      return;
    }

    try {

      const user = JSON.parse(currentUser);

      const role =
        user.role ||
        user.Role ||
        '';

      // Only load data if the logged-in user is Staff
      if (role.toLowerCase() !== 'staff') {
        return;
      }

      this.fullName =
        user.fullName ||
        user.FullName ||
        this.fullName;

      this.employeeId =
        user.employeeId ||
        user.EmployeeId ||
        this.employeeId;

      this.contactNumber =
        user.contactNumber ||
        user.ContactNumber ||
        this.contactNumber;

      this.email =
        user.username ||
        user.email ||
        user.Email ||
        this.email;

      this.department =
        user.department ||
        user.Department ||
        this.department;

      this.designation =
        user.designation ||
        user.Designation ||
        this.designation;

      this.joiningDate =
        user.joiningDate ||
        user.JoiningDate ||
        this.joiningDate;

    } catch (error) {

      console.log('Unable to load Staff profile information.');

    }
  }

  // =========================================
  // EDIT PROFILE
  // =========================================

  editProfile(): void {

    this.showEditProfile = true;
    this.showChangePassword = false;

  }

  // =========================================
  // CHANGE PASSWORD
  // =========================================

  changePassword(): void {

    this.showChangePassword = true;
    this.showEditProfile = false;

  }

  // =========================================
  // CLOSE POPUPS
  // =========================================

  closeForms(): void {

    this.showEditProfile = false;
    this.showChangePassword = false;

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';

  }

  // =========================================
  // SAVE PROFILE
  // =========================================

  saveProfile(): void {

    /*
     * UI-only for now.
     * Later we will connect this to the .NET API.
     */

    alert('Profile updated successfully!');

    this.closeForms();

  }

  // =========================================
  // UPDATE PASSWORD
  // =========================================

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

    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';

    this.closeForms();

  }

}