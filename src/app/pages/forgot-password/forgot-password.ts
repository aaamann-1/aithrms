import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  username = '';
  contactNumber = '';

  sendResetRequest() {

    if (!this.username || !this.contactNumber) {
      alert('Please enter your username and contact number.');
      return;
    }

    if (this.contactNumber.length !== 10) {
      alert('Please enter a valid 10-digit contact number.');
      return;
    }

    alert('Reset request validated. Backend password reset will be connected later.');
  }
}