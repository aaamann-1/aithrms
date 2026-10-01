import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';

type HalfKey = 'half1' | 'half2';

interface Session {
  in: number;
  out: number | null;
}

interface SavedDay {
  date: string;
  half1: Session[];
  half2: Session[];
}

interface HalfView {
  key: HalfKey;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  hoursWorked: string;
  checkedIn: boolean;
  canCheckIn: boolean;
  checkInText: string;
  marked: boolean;
  note: string;
}

interface AttendanceRecord {
  day: string;
  date: string;
  status: string;
  live: boolean;

  h1In: string;
  h1Out: string;
  h1Hours: string;

  h2In: string;
  h2Out: string;
  h2Hours: string;

  totalHours: string;
}

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class AttendanceComponent
  implements OnInit, OnDestroy {

  today = '';

  totalWorked = '0h 00m';

  selectedHalf: HalfKey = 'half1';

  half1: HalfView = {
    key: 'half1',
    checkInTime: '—',
    checkOutTime: '—',
    status: 'Not Started',
    hoursWorked: '0h 00m',
    checkedIn: false,
    canCheckIn: true,
    checkInText: 'Check In',
    marked: false,
    note: ''
  };

  half2: HalfView = {
    key: 'half2',
    checkInTime: '—',
    checkOutTime: '—',
    status: 'Not Started',
    hoursWorked: '0h 00m',
    checkedIn: false,
    canCheckIn: true,
    checkInText: 'Check In',
    marked: false,
    note: ''
  };

  attendanceRecords: AttendanceRecord[] = [];

  confirmKey: HalfKey | null = null;

  confirmLabel = '';

  /*
   * These flags prevent duplicate clicks.
   *
   * They are set immediately when the button is clicked,
   * before the HTTP request starts.
   */
  private checkingIn = false;
  private checkingOut = false;

  /*
   * Backend data kept only in component memory.
   *
   * PostgreSQL is the source of truth.
   * localStorage is NOT used.
   */
  private records: SavedDay[] = [];

  private timer:
    ReturnType<typeof setInterval> | undefined;

  constructor(
    private attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadAttendance();

    this.timer = setInterval(() => {
      this.refresh();
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /*
   * LOAD ATTENDANCE FROM BACKEND
   */
  loadAttendance(): void {
    this.attendanceService.getMyAttendance().subscribe({
      next: (records: any[]) => {
        this.populateRecordsFromBackend(records);
        this.refresh();
      },

      error: (err: any) => {
        console.error(
          'Failed to load attendance from backend:',
          err
        );

        this.refresh();
      }
    });
  }

  /*
   * Convert backend records into the structure
   * used by the existing UI.
   */
  private populateRecordsFromBackend(
    records: any[]
  ): void {

    const dayMap =
      new Map<string, SavedDay>();

    if (Array.isArray(records)) {

      for (const r of records) {

        if (!r.checkIn) {
          continue;
        }

        const inDate =
          new Date(r.checkIn);

        const key =
          this.dateKey(inDate);

        if (!dayMap.has(key)) {

          dayMap.set(key, {
            date: key,
            half1: [],
            half2: []
          });
        }

        const day =
          dayMap.get(key)!;

        const session: Session = {
          in: inDate.getTime(),

          out:
            r.checkOut
              ? new Date(r.checkOut).getTime()
              : null
        };

        const half =
          String(r.half || '').toLowerCase();

        if (half === 'half1') {
          day.half1.push(session);
        }

        if (half === 'half2') {
          day.half2.push(session);
        }
      }
    }

    for (const day of dayMap.values()) {

      day.half1.sort(
        (a, b) => a.in - b.in
      );

      day.half2.sort(
        (a, b) => a.in - b.in
      );
    }

    this.records =
      Array.from(dayMap.values());
  }

  selectHalf(key: HalfKey): void {
    this.selectedHalf = key;
    this.refresh();
  }

  /*
   * Find today's record from backend-loaded data.
   */
  private getTodayRecord(
    date: Date
  ): SavedDay {

    const key =
      this.dateKey(date);

    let record =
      this.records.find(
        item => item.date === key
      );

    if (!record) {

      record = {
        date: key,
        half1: [],
        half2: []
      };

      this.records.push(record);
    }

    return record;
  }

  private dateKey(date: Date): string {

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${date.getFullYear()}-${month}-${day}`;
  }

  private makeTime(
    date: Date,
    hour: number,
    minute: number
  ): number {

    const result =
      new Date(date);

    result.setHours(
      hour,
      minute,
      0,
      0
    );

    return result.getTime();
  }

  private formatTime(
    timestamp: number | null
  ): string {

    if (!timestamp) {
      return '—';
    }

    const date =
      new Date(timestamp);

    const hours =
      date.getHours();

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, '0');

    return `${hours % 12 || 12}:${minutes} ${
      hours < 12 ? 'AM' : 'PM'
    }`;
  }

  private formatDuration(
    milliseconds: number
  ): string {

    if (milliseconds <= 0) {
      return '0h 00m';
    }

    const totalMinutes =
      Math.floor(
        milliseconds / 60000
      );

    const hours =
      Math.floor(
        totalMinutes / 60
      );

    const minutes =
      totalMinutes % 60;

    return `${hours}h ${
      String(minutes).padStart(2, '0')
    }m`;
  }

  /*
   * 1st Half:
   * 09:30 AM - 02:00 PM
   *
   * 2nd Half:
   * 03:00 PM - 06:00 PM
   *
   * Lunch:
   * 02:00 PM - 03:00 PM
   *
   * Time outside these ranges does not count.
   */
  private calculateHalfHours(
    key: HalfKey,
    sessions: Session[],
    day: Date,
    now: Date
  ): number {

    let startHour = 9;
    let startMinute = 30;
    let endHour = 14;

    if (key === 'half2') {
      startHour = 15;
      startMinute = 0;
      endHour = 18;
    }

    const halfStart =
      this.makeTime(
        day,
        startHour,
        startMinute
      );

    const halfEnd =
      this.makeTime(
        day,
        endHour,
        0
      );

    let total = 0;

    for (const session of sessions) {

      const from =
        session.in;

      const to =
        session.out ??
        now.getTime();

      if (to <= from) {
        continue;
      }

      const start =
        Math.max(
          from,
          halfStart
        );

      const end =
        Math.min(
          to,
          halfEnd
        );

      if (end > start) {

        total +=
          end - start;
      }
    }

    return Math.max(
      total,
      0
    );
  }

  private isOpen(
    sessions: Session[]
  ): boolean {

    if (!sessions.length) {
      return false;
    }

    return (
      sessions[
        sessions.length - 1
      ].out === null
    );
  }

  /*
   * CHECK IN
   *
   * ONE CLICK ONLY.
   *
   * The processing flag is set immediately,
   * so a second click cannot send another request.
   */
  checkIn(
    key: HalfKey
  ): void {

    if (this.checkingIn) {
      return;
    }

    const record =
      this.getTodayRecord(
        new Date()
      );

    /*
     * Do not allow another Check In
     * while an existing session is open.
     */
    if (
      this.isOpen(
        record[key]
      )
    ) {
      return;
    }

    /*
     * IMPORTANT:
     * Set this BEFORE the HTTP request.
     */
    this.checkingIn = true;

    this.attendanceService
      .checkIn(key)
      .subscribe({

        next: () => {

          /*
           * Backend is now the source of truth.
           * Reload fresh data.
           */
          this.loadAttendance();

          this.checkingIn = false;
        },

        error: (err: any) => {

          this.checkingIn = false;

          const msg =
            err.error?.message ||
            'Check-in failed. Please try again.';

          alert(msg);
        }
      });
  }

  /*
   * OPEN CHECK-OUT CONFIRMATION POPUP.
   *
   * No backend request is made here.
   */
  askCheckOut(
    key: HalfKey
  ): void {

    if (this.checkingOut) {
      return;
    }

    const record =
      this.getTodayRecord(
        new Date()
      );

    if (
      !this.isOpen(
        record[key]
      )
    ) {
      return;
    }

    this.confirmKey = key;

    this.confirmLabel =
      key === 'half1'
        ? '1st Half'
        : '2nd Half';
  }

  /*
   * CANCEL CHECK-OUT
   */
  cancelCheckOut(): void {

    this.confirmKey = null;
    this.confirmLabel = '';
  }

  /*
   * CONFIRM CHECK-OUT
   *
   * ONE CONFIRM CLICK ONLY.
   */
  confirmCheckOut(): void {

    if (!this.confirmKey) {
      return;
    }

    /*
     * Prevent double confirmation clicks.
     */
    if (this.checkingOut) {
      return;
    }

    const key =
      this.confirmKey;

    /*
     * Set immediately BEFORE request.
     */
    this.checkingOut = true;

    /*
     * Close popup immediately.
     */
    this.confirmKey = null;
    this.confirmLabel = '';

    this.attendanceService
      .checkOut(key)
      .subscribe({

        next: () => {

          /*
           * Get fresh data from PostgreSQL.
           */
          this.loadAttendance();

          this.checkingOut = false;
        },

        error: (err: any) => {

          this.checkingOut = false;

          const msg =
            err.error?.message ||
            'Check-out failed. Please try again.';

          alert(msg);
        }
      });
  }

  private buildHalf(
    key: HalfKey,
    record: SavedDay,
    now: Date
  ): HalfView {

    const sessions =
      record[key];

    const open =
      this.isOpen(
        sessions
      );

    const last =
      sessions.length
        ? sessions[
            sessions.length - 1
          ]
        : null;

    let status =
      'Not Started';

    if (open) {

      status = 'Active';

    } else if (
      sessions.length > 0
    ) {

      status = 'Completed';
    }

    let note = '';

    if (
      now.getHours() >= 14 &&
      now.getHours() < 15
    ) {

      note =
        'Lunch Break · 2:00 PM – 3:00 PM';
    }

    const worked =
      this.calculateHalfHours(
        key,
        sessions,
        now,
        now
      );

    /*
     * Blue card:
     * first Check In
     * latest Check Out
     */
    const firstIn =
      sessions.length
        ? this.formatTime(
            sessions[0].in
          )
        : '—';

    const latestOut =
      last
        ? this.formatTime(
            last.out
          )
        : '—';

    return {

      key,

      checkInTime:
        firstIn,

      checkOutTime:
        latestOut,

      status,

      hoursWorked:
        this.formatDuration(
          worked
        ),

      checkedIn:
        open,

      canCheckIn:
        !open,

      checkInText:
        open
          ? '✓ Checked In'
          : 'Check In',

      marked:
        sessions.length > 0,

      note
    };
  }

  refresh(): void {

    const now =
      new Date();

    this.today =
      `${DAYS[now.getDay()]}, ${
        now.getDate()
      } ${
        MONTHS[now.getMonth()]
      }`;

    const record =
      this.getTodayRecord(
        now
      );

    this.half1 =
      this.buildHalf(
        'half1',
        record,
        now
      );

    this.half2 =
      this.buildHalf(
        'half2',
        record,
        now
      );

    const first =
      this.calculateHalfHours(
        'half1',
        record.half1,
        now,
        now
      );

    const second =
      this.calculateHalfHours(
        'half2',
        record.half2,
        now,
        now
      );

    this.totalWorked =
      this.formatDuration(
        first + second
      );

    this.buildWeek(now);
  }

  private buildWeek(
    now: Date
  ): void {

    /*
     * Find Monday.
     */
    const monday =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() -
          ((now.getDay() + 6) % 7)
      );

    const todayKey =
      this.dateKey(now);

    const rows:
      AttendanceRecord[] = [];

    /*
     * Monday to Saturday.
     * Sunday excluded.
     */
    for (
      let i = 0;
      i < 6;
      i++
    ) {

      const day =
        new Date(
          monday.getFullYear(),
          monday.getMonth(),
          monday.getDate() + i
        );

      const key =
        this.dateKey(day);

      let record =
        this.records.find(
          item =>
            item.date === key
        );

      if (!record) {

        record = {
          date: key,
          half1: [],
          half2: []
        };
      }

      const h1 =
        this.calculateHalfHours(
          'half1',
          record.half1,
          day,
          now
        );

      const h2 =
        this.calculateHalfHours(
          'half2',
          record.half2,
          day,
          now
        );

      const selectedSessions =
        this.selectedHalf === 'half1'
          ? record.half1
          : record.half2;

      const future =
        key > todayKey;

      const selectedOpen =
        this.isOpen(
          selectedSessions
        );

      const selectedMarked =
        selectedSessions.length > 0;

      let status =
        'Absent';

      if (future) {

        status = '—';

      } else if (selectedOpen) {

        status = 'Working';

      } else if (selectedMarked) {

        status = 'Present';

      } else if (key === todayKey) {

        status = 'Not Marked';
      }

      /*
       * All Check-In times vertically.
       */
      const h1Ins =
        record.half1
          .map(
            session =>
              this.formatTime(
                session.in
              )
          )
          .join('\n');

      /*
       * All Check-Out times vertically.
       */
      const h1Outs =
        record.half1
          .filter(
            session =>
              session.out !== null
          )
          .map(
            session =>
              this.formatTime(
                session.out
              )
          )
          .join('\n');

      const h2Ins =
        record.half2
          .map(
            session =>
              this.formatTime(
                session.in
              )
          )
          .join('\n');

      const h2Outs =
        record.half2
          .filter(
            session =>
              session.out !== null
          )
          .map(
            session =>
              this.formatTime(
                session.out
              )
          )
          .join('\n');

      rows.push({

        day:
          DAYS[
            day.getDay()
          ].slice(0, 3),

        date:
          `${day.getDate()} ${
            MONTHS[
              day.getMonth()
            ]
          }`,

        status,

        live:
          key === todayKey &&
          selectedOpen,

        h1In:
          h1Ins || '—',

        h1Out:
          h1Outs || '—',

        h1Hours:
          this.formatDuration(
            h1
          ),

        h2In:
          h2Ins || '—',

        h2Out:
          h2Outs || '—',

        h2Hours:
          this.formatDuration(
            h2
          ),

        totalHours:
          this.formatDuration(
            h1 + h2
          )
      });
    }

    this.attendanceRecords =
      rows;
  }
}