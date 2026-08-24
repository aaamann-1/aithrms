import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-task-entry',
  standalone: true,
  imports: [
    FormsModule,
    Sidebar,
    Navbar
  ],
  templateUrl: './task-entry.html',
  styleUrl: './task-entry.css'
})
export class TaskEntry {

  clientName = '';
  clientId = '';
  issueCategory = '';
  priority = '';
  issueDescription = '';
  startTime = '';
  endTime = '';
  resolutionNotes = '';
  status = '';

  submitTask(): void {
    console.log('Task submitted:', {
      clientName: this.clientName,
      clientId: this.clientId,
      issueCategory: this.issueCategory,
      priority: this.priority,
      issueDescription: this.issueDescription,
      startTime: this.startTime,
      endTime: this.endTime,
      resolutionNotes: this.resolutionNotes,
      status: this.status
    });
  }

  clearForm(): void {
    this.clientName = '';
    this.clientId = '';
    this.issueCategory = '';
    this.priority = '';
    this.issueDescription = '';
    this.startTime = '';
    this.endTime = '';
    this.resolutionNotes = '';
    this.status = '';
  }
}