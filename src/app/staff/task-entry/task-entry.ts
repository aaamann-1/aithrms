import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  TaskEntryService,
  TaskEntryRequest
} from '../../services/task-entry.service';

interface MyTask {
  id: number;
  userId: number;
  clientName: string;
  clientId: string | null;
  issueCategory: string;
  issueDescription: string | null;
  startTime: string | null;
  endTime: string | null;
  resolutionNotes: string | null;
  status: string;
  escalatedTo: string | null;
  createdAt: string;
  updatedAt: string | null;

  // Used only while editing the task in the View window
  selectedStatus?: string;
  selectedEscalatedTo?: string;
}

@Component({
  selector: 'app-task-entry',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './task-entry.html',
  styleUrl: './task-entry.css'
})
export class TaskEntry implements OnInit {

  // =====================================================
  // NEW TASK FORM
  // =====================================================

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

  isSubmitting = false;


  // =====================================================
  // SUBMITTED TASKS
  // =====================================================

  myTasks: MyTask[] = [];

  isLoadingTasks = false;

  selectedTask: MyTask | null = null;

  isUpdatingTask = false;


  // =====================================================
  // PEOPLE FOR ESCALATION
  // =====================================================

  escalatedUsers = [
    'Rahul Sharma',
    'Aman Kumar',
    'Priya Singh',
    'Neha Patel',
    'Arjun Mehta'
  ];


  constructor(
    private taskEntryService: TaskEntryService
  ) {}


  // =====================================================
  // PAGE LOAD
  // =====================================================

  ngOnInit(): void {
    this.loadMyTasks();
  }


  // =====================================================
  // NEW TASK FORM
  // =====================================================

  onStatusChange(): void {

    if (this.status !== 'Escalated') {
      this.escalatedTo = '';
    }
  }


  onCategoryChange(): void {

    if (this.issueCategory !== 'Other') {
      this.otherIssueCategory = '';
    }
  }


  submitTask(): void {

    const finalCategory = this.issueCategory;

    if (!this.clientName.trim()) {

      alert('Please enter client name.');

      return;
    }


    if (!finalCategory.trim()) {

      alert('Please select an issue category.');

      return;
    }


    if (!this.status) {

      alert('Please select a status.');

      return;
    }


    const taskData: TaskEntryRequest = {

      clientName:
        this.clientName.trim(),

      clientId:
        this.clientId.trim(),

      issueCategory:
        finalCategory.trim(),

      issueDescription:
        this.issueDescription.trim(),

      startTime:
        this.startTime,

      endTime:
        this.endTime,

      resolutionNotes:
        this.resolutionNotes.trim(),

      status:
        this.status,

      escalatedTo:
        this.status === 'Escalated'
          ? this.escalatedTo
          : ''
    };


    this.isSubmitting = true;


    this.taskEntryService
      .createTask(taskData)
      .subscribe({

        next: (response) => {

          console.log(
            'Task submitted:',
            response
          );


          alert(
            'Task submitted successfully!'
          );


          this.clearForm();


          this.isSubmitting = false;


          // Refresh submitted task list
          this.loadMyTasks();
        },


        error: (error) => {

          console.error(
            'Task submission failed:',
            error
          );


          alert(
            error?.error?.message ||
            'Failed to submit task.'
          );


          this.isSubmitting = false;
        }

      });
  }


  // =====================================================
  // LOAD MY SUBMITTED TASKS
  // =====================================================

  loadMyTasks(): void {

    this.isLoadingTasks = true;


    this.taskEntryService
      .getMyTasks()
      .subscribe({

        next: (tasks) => {

          this.myTasks =
            tasks.map(task => ({
              ...task,

              selectedStatus:
                task.status,

              selectedEscalatedTo:
                task.escalatedTo || ''
            }));


          this.isLoadingTasks = false;
        },


        error: (error) => {

          console.error(
            'Failed to load tasks:',
            error
          );


          this.myTasks = [];

          this.isLoadingTasks = false;
        }

      });
  }


  // =====================================================
  // VIEW TASK DETAILS
  // =====================================================

  viewTask(task: MyTask): void {

    this.selectedTask = {

      ...task,

      selectedStatus:
        task.status,

      selectedEscalatedTo:
        task.escalatedTo || ''
    };
  }


  // =====================================================
  // CLOSE TASK DETAILS
  // =====================================================

  closeTaskDetails(): void {

    if (this.isUpdatingTask) {
      return;
    }

    this.selectedTask = null;
  }


  // =====================================================
  // STATUS CHANGE INSIDE VIEW
  // =====================================================

  onViewStatusChange(): void {

    if (!this.selectedTask) {
      return;
    }


    if (
      this.selectedTask.selectedStatus !==
      'Escalated'
    ) {

      this.selectedTask.selectedEscalatedTo = '';
    }
  }


  // =====================================================
  // UPDATE EXISTING TASK
  // =====================================================

  updateSelectedTask(): void {

    if (!this.selectedTask) {
      return;
    }


    const task =
      this.selectedTask;


    const newStatus =
      task.selectedStatus || task.status;


    if (!newStatus) {

      alert('Please select a status.');

      return;
    }


    if (
      newStatus === 'Escalated' &&
      !task.selectedEscalatedTo
    ) {

      alert(
        'Please select the person to escalate this task to.'
      );

      return;
    }


    // No change
    if (
      newStatus === task.status &&
      (
        newStatus !== 'Escalated' ||
        (task.selectedEscalatedTo || '') ===
        (task.escalatedTo || '')
      )
    ) {

      alert(
        'No changes were made to this task.'
      );

      return;
    }


    this.isUpdatingTask = true;


    this.taskEntryService
      .updateTask(
        task.id,
        newStatus,
        task.selectedEscalatedTo || ''
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Task updated:',
            response
          );


          // Update the task in the list
          const taskIndex =
            this.myTasks.findIndex(
              item => item.id === task.id
            );


          if (taskIndex !== -1) {

            this.myTasks[taskIndex].status =
              response?.status || newStatus;

            this.myTasks[taskIndex].escalatedTo =
              response?.escalatedTo ||
              (
                newStatus === 'Escalated'
                  ? task.selectedEscalatedTo || null
                  : null
              );

            this.myTasks[taskIndex].updatedAt =
              response?.updatedAt ||
              new Date().toISOString();
          }


          // Update currently opened task
          task.status =
            response?.status || newStatus;

          task.escalatedTo =
            response?.escalatedTo ||
            (
              newStatus === 'Escalated'
                ? task.selectedEscalatedTo || null
                : null
            );

          task.selectedStatus =
            task.status;

          task.selectedEscalatedTo =
            task.escalatedTo || '';


          this.isUpdatingTask = false;


          alert(
            'Task status updated successfully!'
          );
        },


        error: (error) => {

          console.error(
            'Task update failed:',
            error
          );


          this.isUpdatingTask = false;


          alert(
            error?.error?.message ||
            'Failed to update task.'
          );
        }

      });
  }


  // =====================================================
  // CLEAR NEW TASK FORM
  // =====================================================

  clearForm(): void {

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
}