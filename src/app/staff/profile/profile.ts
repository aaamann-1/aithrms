import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, Sidebar, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  sidebarCollapsed = false;
  isEditing = false;

  fullName = 'Rahul Sharma';
  employeeId = 'EMP-0072';
  phone = '+91 98765 43210';
  email = 'rahul.sharma@dsrweb.com';
  department = 'Billing Support';
  designation = 'Support Executive';
  joiningDate = '15 March 2022';

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  editProfile(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    this.isEditing = false;
    alert('Profile saved successfully.');
  }

  changePassword(): void {
    alert('Change password feature will be added soon.');
  }
}