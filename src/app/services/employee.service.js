import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let EmployeeService = class EmployeeService {
    http;
    apiUrl = 'http://localhost:5089/api/Employee';
    constructor(http) {
        this.http = http;
    }
    getEmployees() {
        return this.http.get(this.apiUrl);
    }
    deleteEmployee(id) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
};
EmployeeService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], EmployeeService);
export { EmployeeService };
