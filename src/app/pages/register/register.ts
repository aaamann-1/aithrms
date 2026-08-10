import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  fullName = '';
  username = '';
  contactNumber = '';
  password = '';
  confirmPassword = '';
  selectedRole = 'staff';

  showPassword = false;
  showConfirmPassword = false;

  register() {

    if (
      !this.fullName ||
      !this.username ||
      !this.contactNumber ||
      !this.password ||
      !this.confirmPassword
    ) {
      alert('Please fill in all fields.');
      return;
    }

    if (this.contactNumber.length !== 10) {
      alert('Please enter a valid 10-digit contact number.');
      return;
    }

    if (this.password.length < 6) {
      alert('Password must contain at least 6 characters.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    console.log({
      fullName: this.fullName,
      username: this.username,
      contactNumber: this.contactNumber,
      role: this.selectedRole
    });

    alert('Form validated successfully. Backend connection will be added next.');
  }
}