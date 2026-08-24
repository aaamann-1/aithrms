import { Component, OnDestroy, OnInit } from '@angular/core';

interface AttendanceRecord {
  day: string;
  date: string;
  status: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class AttendanceComponent implements OnInit, OnDestroy {

  today = 'Monday, 24 Aug';

  checkInTime = '09:05 AM';

  checkOutTime = '—';

  status = 'Active';

  hoursWorked = '6h 20m';

  checkedIn = true;

  private timer: ReturnType<typeof setInterval> | undefined;

  attendanceRecords: AttendanceRecord[] = [
    {
      day: 'Mon',
      date: '12 Aug',
      status: 'Present',
      checkIn: '09:02 AM',
      checkOut: '06:05 PM',
      totalHours: '9h 03m'
    },
    {
      day: 'Tue',
      date: '13 Aug',
      status: 'Present',
      checkIn: '08:55 AM',
      checkOut: '06:00 PM',
      totalHours: '9h 05m'
    },
    {
      day: 'Wed',
      date: '14 Aug',
      status: 'Present',
      checkIn: '09:10 AM',
      checkOut: '06:15 PM',
      totalHours: '9h 05m'
    },
    {
      day: 'Thu',
      date: '15 Aug',
      status: 'Present',
      checkIn: '09:00 AM',
      checkOut: '06:10 PM',
      totalHours: '9h 10m'
    },
    {
      day: 'Fri',
      date: '16 Aug',
      status: 'Present',
      checkIn: '08:58 AM',
      checkOut: '06:00 PM',
      totalHours: '9h 02m'
    },
    {
      day: 'Sat',
      date: '17 Aug',
      status: 'Present',
      checkIn: '09:05 AM',
      checkOut: '—',
      totalHours: '6h 20m (live)'
    }
  ];

  ngOnInit(): void {
    this.timer = setInterval(() => {
      if (this.checkedIn) {
        this.updateWorkingHours();
      }
    }, 60000);
  }

  updateWorkingHours(): void {
    this.hoursWorked = '6h 20m';
  }

  checkOut(): void {

    if (!this.checkedIn) {
      return;
    }

    this.checkedIn = false;

    this.status = 'Completed';

    this.checkOutTime = this.getCurrentTime();

    const currentRecord =
      this.attendanceRecords[this.attendanceRecords.length - 1];

    currentRecord.checkOut = this.checkOutTime;

    currentRecord.totalHours = this.hoursWorked;
  }

  getCurrentTime(): string {

    const now = new Date();

    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

  }

  ngOnDestroy(): void {

    if (this.timer) {
      clearInterval(this.timer);
    }

  }

}