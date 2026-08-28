import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
let Register = class Register {
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
        // Required field validation
        if (!this.fullName ||
            !this.username ||
            !this.contactNumber ||
            !this.password ||
            !this.confirmPassword) {
            return;
        }
        // Contact validation
        if (this.contactNumber.length !== 10) {
            return;
        }
        // Password validation
        if (this.password.length < 6) {
            return;
        }
        // Confirm password validation
        if (this.password !== this.confirmPassword) {
            return;
        }
        console.log({
            fullName: this.fullName,
            username: this.username,
            contactNumber: this.contactNumber,
            role: this.selectedRole
        });
        alert('Account Created successfully.');
    }
};
Register = __decorate([
    Component({
        selector: 'app-register',
        standalone: true,
        imports: [CommonModule, FormsModule, RouterLink],
        templateUrl: './register.html',
        styleUrl: './register.css'
    })
], Register);
export { Register };
