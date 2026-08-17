import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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

  sendResetRequest(form: NgForm) {

    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });

      return;
    }

    alert('Reset request validated. Backend password reset will be connected later.');
  }
}