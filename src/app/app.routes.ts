import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';

import { Dashboard } from './admin/dashboard/dashboard';
import { Attendance } from './admin/Attendance/attendance';

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
    path: 'admin/attendance',
    component: Attendance
  },

  // =========================
  // DEFAULT
  // =========================

  {
    path: '**',
    redirectTo: ''
  }

];