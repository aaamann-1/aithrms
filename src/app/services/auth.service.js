import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
let AuthService = class AuthService {
    http;
    apiUrl = '/api/Auth';
    constructor(http) {
        this.http = http;
    }
    login(data) {
        return this.http.post(`${this.apiUrl}/login`, data).pipe(tap(response => {
            // Save login response
            localStorage.setItem('authUser', JSON.stringify(response));
            // Save JWT token separately
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
        }));
    }
    register(data) {
        return this.http.post(`${this.apiUrl}/register`, data);
    }
    getCurrentUser() {
        const user = localStorage.getItem('authUser');
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }
    getToken() {
        return localStorage.getItem('token');
    }
    logout() {
        localStorage.removeItem('authUser');
        localStorage.removeItem('token');
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
