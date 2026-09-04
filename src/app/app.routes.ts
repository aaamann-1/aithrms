import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';


// =========================
// ADMIN
// =========================

import { AdminLayout } from './admin/admin-layout/admin-layout';

import { Dashboard } from './admin/dashboard/dashboard';
import { LiveFeedComponent } from './admin/live-feed/live-feed';
import { IndividualReports } from './admin/reports/Individual/individual';
import { TeamReportsComponent } from './admin/reports/Team/team';
import { StaffManagement } from './admin/staff-management/staff-management';
import { Attendance } from './admin/Attendance/attendance';
import { IssueCategoriesComponent } from './admin/issue-categories/issue-categories';
import { ExportReports } from './admin/export-reports/export-reports';
import { Settings } from './admin/settings/settings';
// =========================
// STAFF
// =========================

import { StaffLayout } from './staff/staff-layout/staff-layout';
import { Dashboard as StaffDashboard } from './staff/dashboard/dashboard';
import { AttendanceComponent } from './staff/attendance/attendance';
import { TaskEntry } from './staff/task-entry/task-entry';
import { Profile } from './staff/profile/profile';
import { MyReports } from './staff/my-reports/my-reports';


export const routes: Routes = [

  // =========================
  // PUBLIC PAGES - HRMS
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
  // ADMIN
  // =========================

  {
    path: 'admin',

    component: AdminLayout,

    children: [

      // DASHBOARD
      {
        path: 'dashboard',
        component: Dashboard
      },

      // LIVE ACTIVITY FEED
      {
        path: 'live-feed',
        component: LiveFeedComponent
      },

      // STAFF MANAGEMENT
      {
        path: 'staff-management',
        component: StaffManagement
      },

      // ATTENDANCE
      {
        path: 'attendance',
        component: Attendance
      },


      // =========================
      // ADMIN REPORTS
      // =========================

      {
        path: 'reports/individual',
        component: IndividualReports
      },

      {
        path: 'reports/team',
        component: TeamReportsComponent
      },


      // =========================
      // ADMIN OTHER
      // =========================

      {
        path: 'issue-categories',
        component: IssueCategoriesComponent
      },

      {
        path: 'export-reports',
        component: ExportReports
      },
{
  path: 'settings',
  component: Settings
},

      // DEFAULT ADMIN PAGE
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  },

  // =========================
  // STAFF
  // =========================

  {
    path: 'staff',

    component: StaffLayout,

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: StaffDashboard
      },

      {
        path: 'task-entry',
        component: TaskEntry
      },

      {
        path: 'attendance',
        component: AttendanceComponent
      },

      {
        path: 'profile',
        component: Profile
      },

      {
        path: 'my-reports',
        component: MyReports
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