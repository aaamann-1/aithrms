import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let TaskEntryService = class TaskEntryService {
    http;
    apiUrl = 'http://localhost:5089/api/TaskEntry';
    constructor(http) {
        this.http = http;
    }
    // ================= CREATE TASK =================
    createTask(task) {
        return this.http.post(this.apiUrl, task);
    }
    // ================= GET MY TASKS =================
    getMyTasks() {
        return this.http.get(`${this.apiUrl}/my`);
    }
    // ================= UPDATE TASK =================
    updateTask(id, status, escalatedTo) {
        return this.http.put(`${this.apiUrl}/${id}`, {
            status: status,
            escalatedTo: status === 'Escalated'
                ? escalatedTo
                : ''
        });
    }
};
TaskEntryService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], TaskEntryService);
export { TaskEntryService };
