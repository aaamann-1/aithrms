import { Routes } from '@angular/router';
//import { authGuard } from './auth.guard';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';

// ADMIN

import { AdminLayout } from './admin/admin-layout/admin-layout';

import { Dashboard } from './admin/dashboard/dashboard';
import { LiveFeedComponent } from './admin/live-feed/live-feed';
import { IndividualReports } from './admin/reports/individual/individual';
import { TeamReportsComponent } from './admin/reports/team/team';
import { StaffManagement } from './admin/staff-management/staff-management';
import { Attendance } from './admin/Attendance/attendance';
import { IssueCategoriesComponent } from './admin/issue-categories/issue-categories';
import { Employee } from './admin/employee/employee';
import { EmployeeForm } from './admin/employee-form/employee-form';
import { ExportReports } from './admin/export-reports/export-reports';
import { Settings } from './admin/settings/settings';
import { Profile as AdminProfile } from './admin/profile/profile';
// =========================
// STAFF

import { StaffLayout } from './staff/staff-layout/staff-layout';
import { Dashboard as StaffDashboard } from './staff/dashboard/dashboard';
import { AttendanceComponent } from './staff/attendance/attendance';
import { TaskEntry } from './staff/task-entry/task-entry';
import { Profile } from './staff/profile/profile';
import { MyReports } from './staff/my-reports/my-reports';

export const routes: Routes = [

  // PUBLIC PAGES - HRMS

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

  // ADMIN

  {
    path: 'admin',
    component: AdminLayout,
    children: [

      // DASHBOARD
       {
      path: 'dashboard',
      component: Dashboard
    },

      {
        path: 'live-feed',
        component: LiveFeedComponent
      },

      {
        path: 'staff-management',
        component: StaffManagement
      },

       {
  path: 'employee',
  component: Employee
},

{
    path: 'employee/new',
    component: EmployeeForm
  },
  
      {
        path: 'attendance',
        component: Attendance
      },

      // ADMIN REPORTS

      {
        path: 'reports/individual',
        component: IndividualReports
      },

      {
        path: 'reports/team',
        component: TeamReportsComponent
      },

      // ADMIN OTHER

      {
        path: 'issue-categories',
        component: IssueCategoriesComponent
      },

      {
        path: 'export-reports',
        component: ExportReports
      },

{
  path: 'profile',
  component: AdminProfile
},

      // DEFAULT ADMIN PAGE
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  },

{
  path: 'admin/settings',
  component: Settings
},
  // =========================
  // STAFF

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

  // INVALID URL

  {
    path: '**',
    redirectTo: ''
  }

];