import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
let ForgotPassword = class ForgotPassword {
    username = '';
    contactNumber = '';
    sendResetRequest(form) {
        if (form.invalid) {
            Object.values(form.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }
        alert('Reset request validated. Backend password reset will be connected later.');
    }
};
ForgotPassword = __decorate([
    Component({
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
], ForgotPassword);
export { ForgotPassword };
