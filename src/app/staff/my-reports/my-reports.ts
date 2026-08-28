import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './my-reports.html',
  styleUrls: ['./my-reports.css']
})
export class MyReports {

  selectedPeriod: 'Daily' | 'Weekly' = 'Daily';

  reports: Report[] = [
    {
      date: 'Mon, 12 Aug',
      totalTasks: 9,
      resolved: 7,
      pending: 1,
      escalated: 1,
      avgTime: '19 min',
      status: 'Submitted'
    },
    {
      date: 'Tue, 13 Aug',
      totalTasks: 11,
      resolved: 9,
      pending: 2,
      escalated: 0,
      avgTime: '17 min',
      status: 'Submitted'
    },
    {
      date: 'Wed, 14 Aug',
      totalTasks: 7,
      resolved: 5,
      pending: 2,
      escalated: 0,
      avgTime: '23 min',
      status: 'Submitted'
    },
    {
      date: 'Thu, 15 Aug',
      totalTasks: 10,
      resolved: 8,
      pending: 1,
      escalated: 1,
      avgTime: '21 min',
      status: 'Submitted'
    },
    {
      date: 'Fri, 16 Aug',
      totalTasks: 8,
      resolved: 6,
      pending: 2,
      escalated: 0,
      avgTime: '18 min',
      status: 'Submitted'
    },
    {
      date: 'Sat, 17 Aug',
      totalTasks: 8,
      resolved: 5,
      pending: 3,
      escalated: 0,
      avgTime: '20 min',
      status: 'Submitted'
    }
  ];

  setPeriod(period: 'Daily' | 'Weekly'): void {
    this.selectedPeriod = period;
  }
}