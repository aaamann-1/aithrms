import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';

// =========================
// ADMIN
// =========================

import { Dashboard } from './admin/dashboard/dashboard';
<<<<<<< Updated upstream
import { LiveFeedComponent } from './admin/live-feed/live-feed';
import { IndividualReports } from './admin/reports/individual/individual';
import { TeamReportsComponent } from './admin/reports/team/team';
import { StaffManagement } from './admin/staff-management/staff-management';
import { Attendance } from './admin/Attendance/attendance';
import { IssueCategoriesComponent } from './admin/issue-categories/issue-categories';
import { ExportReports } from './admin/export-reports/export-reports';

// =========================
// STAFF
// =========================

import { StaffLayout } from './staff/staff-layout/staff-layout';
import { Dashboard as StaffDashboard } from './staff/dashboard/dashboard';
import { AttendanceComponent } from './staff/attendance/attendance';
import { TaskEntry } from './staff/task-entry/task-entry';
import { Profile } from './staff/profile/profile';

export const routes: Routes = [

  // =========================
  // PUBLIC PAGES - HRMS
  // =========================
=======
import { LiveFeedComponent} from './admin/live-feed/live-feed';
import { IndividualReports } from './admin/reports/individual/individual';

export const routes: Routes = [
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream

  // =========================
  // ADMIN
  // =========================

=======
  // ADMIN DASHBOARD
>>>>>>> Stashed changes
  {
    path: 'admin/dashboard',
    component: Dashboard
  },
<<<<<<< Updated upstream

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

=======
{
  path: 'live-feed',
  component: LiveFeedComponent
},
  // INDIVIDUAL REPORTS
>>>>>>> Stashed changes
  {
    path: 'admin/reports/individual',
    component: IndividualReports
  },

<<<<<<< Updated upstream
  {
    path: 'admin/reports/team',
    component: TeamReportsComponent
  },


  // =========================
  // ADMIN OTHER
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
      }

    ]
  },

  // =========================
  // INVALID URL
  // =========================

=======
  // Redirect old dashboard URL if needed
  {
    path: 'dashboard',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },

  {
    path: 'reports',
    redirectTo: 'admin/reports/individual',
    pathMatch: 'full'
  },

>>>>>>> Stashed changes
  {
    path: '**',
    redirectTo: ''
  }

];