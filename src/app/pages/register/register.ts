import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  constructor(private authService: AuthService) {}

  fullName = '';
  username = '';
  contactNumber = '';
  password = '';
  confirmPassword = '';
  selectedRole = 'staff';
  showPassword = false;
  showConfirmPassword = false;
  submitted = false;

  register() {
    this.submitted = true;

    if (
      !this.fullName ||
      !this.username ||
      !this.contactNumber ||
      !this.password ||
      !this.confirmPassword
    ) {
      return;
    }

    if (this.contactNumber.length !== 10) {
      return;
    }

    if (this.password.length < 6) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      return;
    }

    const userData = {
      fullName: this.fullName,
      username: this.username,
      contactNumber: this.contactNumber,
      password: this.password,
      confirmPassword: this.confirmPassword,
      role: this.selectedRole
    };

    this.authService.register(userData).subscribe({
      next: () => {
        alert('Account created successfully. You can now sign in.');
      },
      error: (error: any) => {
        alert(error.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}