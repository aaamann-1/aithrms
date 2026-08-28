import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
let TaskEntry = class TaskEntry {
    clientName = '';
    clientId = '';
    issueCategory = '';
    otherIssueCategory = '';
    issueDescription = '';
    startTime = '';
    endTime = '';
    resolutionNotes = '';
    status = '';
    escalatedTo = '';
    // People who can receive an escalated issue
    escalatedUsers = [
        'Rahul Sharma',
        'Aman Kumar',
        'Priya Singh',
        'Neha Patel',
        'Arjun Mehta'
    ];
    onStatusChange() {
        // Clear escalated person if status is changed
        if (this.status !== 'Escalated') {
            this.escalatedTo = '';
        }
    }
    onCategoryChange() {
        // Clear manually entered category if needed
        if (this.issueCategory !== 'Other') {
            this.otherIssueCategory = '';
        }
    }
    submitTask() {
        const taskData = {
            clientName: this.clientName,
            clientId: this.clientId,
            issueCategory: this.issueCategory === 'Other'
                ? this.otherIssueCategory
                : this.issueCategory,
            issueDescription: this.issueDescription,
            startTime: this.startTime,
            endTime: this.endTime,
            resolutionNotes: this.resolutionNotes,
            status: this.status,
            escalatedTo: this.status === 'Escalated'
                ? this.escalatedTo
                : ''
        };
        console.log('Task submitted:', taskData);
        alert('Task submitted successfully!');
    }
    clearForm() {
        this.clientName = '';
        this.clientId = '';
        this.issueCategory = '';
        this.otherIssueCategory = '';
        this.issueDescription = '';
        this.startTime = '';
        this.endTime = '';
        this.resolutionNotes = '';
        this.status = '';
        this.escalatedTo = '';
    }
};
TaskEntry = __decorate([
    Component({
        selector: 'app-task-entry',
        standalone: true,
        imports: [
            CommonModule,
            FormsModule
        ],
        templateUrl: './task-entry.html',
        styleUrl: './task-entry.css'
    })
], TaskEntry);
export { TaskEntry };
