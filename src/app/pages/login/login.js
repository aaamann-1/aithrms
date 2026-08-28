import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
let Login = class Login {
    selectedRole = 'admin';
};
Login = __decorate([
    Component({
        selector: 'app-login',
        imports: [
            FormsModule,
            RouterLink
        ],
        templateUrl: './login.html',
        styleUrl: './login.css'
    })
], Login);
export { Login };
