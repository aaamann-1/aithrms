
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  TaskEntryService
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
}

interface Report {
  date: string;
  totalTasks: number;
  resolved: number;
  pending: number;
  escalated: number;
  avgTime: string;
  status: string;
}

@Component({
  selector: 'app-my-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-reports.html',
  styleUrls: ['./my-reports.css']
})
export class MyReports implements OnInit {

  selectedPeriod: 'Daily' | 'Weekly' = 'Daily';

  tasks: MyTask[] = [];
  reports: Report[] = [];

  loading = false;
  errorMessage = '';

  dateFilter = '';
  statusFilter = 'All';
  clientSearch = '';

  totalTasks = 0;
  resolved = 0;
  pending = 0;
  escalated = 0;
  avgResolutionTime = '0 min';

  constructor(
    private taskEntryService: TaskEntryService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  // FETCH TASKS FROM BACKEND

  loadReports(): void {
    this.loading = true;
    this.errorMessage = '';

    this.taskEntryService.getMyTasks().subscribe({

      next: (data: MyTask[]) => {

        console.log('My Reports API response:', data);

        this.tasks = Array.isArray(data) ? data : [];

        this.loading = false;

        this.calculateReports();
      },

      error: (error) => {

        console.error('My Reports API error:', error);

        this.loading = false;
        this.tasks = [];
        this.reports = [];

        this.resetSummary();

        this.errorMessage =
          error?.error?.message ||
          'Unable to load reports. Please login again or check the backend.';
      }
    });
  }

  // DAILY / WEEKLY

  setPeriod(period: 'Daily' | 'Weekly'): void {
    this.selectedPeriod = period;
    this.calculateReports();
  }

  // FILTER TASKS

  getFilteredTasks(): MyTask[] {

    return this.tasks.filter(task => {

      if (!task.createdAt) {
        return false;
      }

      const taskDate = new Date(task.createdAt);

      if (isNaN(taskDate.getTime())) {
        return false;
      }

      // DATE FILTER

      if (this.dateFilter) {

        const actualDate = this.toDateKey(taskDate);

        if (actualDate !== this.dateFilter) {
          return false;
        }
      }

      // CLIENT NAME FILTER

      if (this.clientSearch.trim()) {

        const search = this.clientSearch.trim().toLowerCase();

        if (!(task.clientName || '').toLowerCase().includes(search)) {
          return false;
        }
      }

      // STATUS FILTER

      if (
        this.statusFilter !== 'All' &&
        (task.status || '').toLowerCase() !==
        this.statusFilter.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }

  // CALCULATE SUMMARY AND REPORT TABLE

  calculateReports(): void {

    const filteredTasks = this.getFilteredTasks();

    this.totalTasks = filteredTasks.length;

    this.resolved = filteredTasks.filter(
      task => (task.status || '').toLowerCase() === 'resolved'
    ).length;

    this.pending = filteredTasks.filter(
      task => ['pending', 'in progress'].includes(
        (task.status || '').toLowerCase()
      )
    ).length;

    this.escalated = filteredTasks.filter(
      task => (task.status || '').toLowerCase() === 'escalated'
    ).length;

    this.avgResolutionTime =
      this.calculateAverageResolutionTime(filteredTasks);

    const grouped = new Map<string, MyTask[]>();

    filteredTasks.forEach(task => {

      const date = new Date(task.createdAt);

      const key = this.selectedPeriod === 'Daily'
        ? this.toDateKey(date)
        : this.getWeekStart(date);

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key)!.push(task);
    });

    this.reports = Array.from(grouped.entries())
      .map(([key, group]) => {

        const resolvedTasks = group.filter(
          task => (task.status || '').toLowerCase() === 'resolved'
        );

        const pendingTasks = group.filter(
          task => ['pending', 'in progress'].includes(
            (task.status || '').toLowerCase()
          )
        );

        const escalatedTasks = group.filter(
          task => (task.status || '').toLowerCase() === 'escalated'
        );

        return {
          date: this.formatReportDate(key),

          totalTasks: group.length,

          resolved: resolvedTasks.length,

          pending: pendingTasks.length,

          escalated: escalatedTasks.length,

          avgTime: this.calculateAverageResolutionTime(group),

          status: 'Recorded'
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  // AVERAGE RESOLUTION TIME

  calculateAverageResolutionTime(tasks: MyTask[]): string {

    const resolvedTasks = tasks.filter(task =>
      (task.status || '').toLowerCase() === 'resolved' &&
      task.startTime &&
      task.endTime
    );

    if (resolvedTasks.length === 0) {
      return '0 min';
    }

    let totalMinutes = 0;
    let validRecords = 0;

    resolvedTasks.forEach(task => {

      const start = this.timeToMinutes(task.startTime!);
      const end = this.timeToMinutes(task.endTime!);

      if (start !== null && end !== null) {

        let duration = end - start;

        // Supports tasks ending after midnight

        if (duration < 0) {
          duration += 24 * 60;
        }

        totalMinutes += duration;
        validRecords++;
      }
    });

    if (validRecords === 0) {
      return '0 min';
    }

    return `${Math.round(totalMinutes / validRecords)} min`;
  }

  timeToMinutes(time: string): number | null {

    const parts = time.split(':');

    if (parts.length < 2) {
      return null;
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      !Number.isFinite(hours) ||
      !Number.isFinite(minutes) ||
      hours < 0 || hours > 23 ||
      minutes < 0 || minutes > 59
    ) {
      return null;
    }

    return hours * 60 + minutes;
  }

  // DATE HELPERS

  toDateKey(date: Date): string {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getWeekStart(date: Date): string {

    const weekDate = new Date(date);

    const day = weekDate.getDay();

    const difference = day === 0 ? -6 : 1 - day;

    weekDate.setDate(weekDate.getDate() + difference);

    return this.toDateKey(weekDate);
  }

  formatReportDate(key: string): string {

    const date = new Date(key + 'T00:00:00');

    if (this.selectedPeriod === 'Weekly') {

      const endDate = new Date(date);

      endDate.setDate(endDate.getDate() + 6);

      const startLabel = date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      });

      const endLabel = endDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      });

      return `${startLabel} - ${endLabel}`;
    }

    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  }

  // FILTER ACTIONS

  applyFilters(): void {
    this.calculateReports();
  }

  clearFilters(): void {

    this.dateFilter = '';
    this.statusFilter = 'All';
    this.clientSearch = '';

    this.calculateReports();
  }

  // RESET SUMMARY

  resetSummary(): void {

    this.totalTasks = 0;
    this.resolved = 0;
    this.pending = 0;
    this.escalated = 0;

    this.avgResolutionTime = '0 min';
  }
}
