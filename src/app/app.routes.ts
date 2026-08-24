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
import { StaffManagement } from './admin/staff-management/staff-management';
import { Attendance } from './admin/Attendance/attendance';

// =========================
// STAFF
// =========================

import { Dashboard as StaffDashboard } from './staff/dashboard/dashboard';

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
  // STAFF DASHBOARD
  // =========================

  {
    path: 'staff/dashboard',
    component: StaffDashboard
  },


  // =========================
  // INVALID URL
  // =========================

  {
    path: '**',
    redirectTo: ''
  }

];