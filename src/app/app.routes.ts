import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';

// =========================
// ADMIN
// =========================

import { Dashboard } from './admin/dashboard/dashboard';
import { LiveFeedComponent } from './admin/live-feed/live-feed';
import { IndividualReports } from './admin/reports/individual/individual';
import { TeamReportsComponent } from './admin/reports/team/team';
import { StaffManagement } from './admin/staff-management/staff-management';
import { Attendance } from './admin/Attendance/attendance';
import { IssueCategoriesComponent } from './admin/issue-categories/issue-categories';
<<<<<<< HEAD
import { ExportReports } from './admin/export-reports/export-reports';

// =========================
// STAFF
// =========================

import { Dashboard as StaffDashboard } from './staff/dashboard/dashboard';
<<<<<<< HEAD
import { TaskEntry } from './staff/task-entry/task-entry';
=======
=======



//====================
//Staff imports
//========================

import { StaffNavigationComponent } from './staff/navigation/navigation';
import { AttendanceComponent } from './staff/attendance/attendance';
>>>>>>> 4c979d2 (Save local changes before pulling)
>>>>>>> 564ec9c3413476dac749072c5fcd850371bf930a

export const routes: Routes = [

  // =========================
  // PUBLIC PAGES
  // =========================

  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'forgot-password',
    component: ForgotPassword
  },


  // =========================
  // ADMIN PAGES
  // =========================

  {
    path: 'admin/dashboard',
    component: Dashboard
  },

  {
    path: 'admin/live-feed',
    component: LiveFeedComponent
  },

  {
    path: 'admin/staff-management',
    component: StaffManagement
  },

  {
    path: 'admin/attendance',
    component: Attendance
  },

  // =========================
  // ADMIN REPORTS
  // =========================

  {
    path: 'admin/reports/individual',
    component: IndividualReports
  },

  {
    path: 'admin/reports/team',
    component: TeamReportsComponent
  },

  // =========================
  // ADMIN OTHER PAGES
  // =========================

  {
    path: 'admin/issue-categories',
    component: IssueCategoriesComponent
  },

  {
    path: 'admin/export-reports',
    component: ExportReports
  },


  // =========================
  // STAFF DASHBOARD
  // =========================

  {
    path: 'staff/dashboard',
    component: StaffDashboard
  },

  {
  path: 'staff/task-entry',
  component: TaskEntry
},



// ==================================================
  // STAFF PAGES
  // ==================================================

  {
    path: 'staff',
    component: StaffNavigationComponent,

    children: [

      {
        path: 'attendance',
        component: AttendanceComponent
      }

    ]
  },
  
  // =========================
  // INVALID URL
  // =========================

  {
    path: '**',
    redirectTo: ''
  }

];