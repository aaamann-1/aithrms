import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';

import { Dashboard } from './admin/dashboard/dashboard';
import { LiveFeedComponent } from './admin/live-feed/live-feed';
import { IssueCategoriesComponent } from './admin/issue-categories/issue-categories';
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
   {
  path: 'dashboard',
  component: Dashboard
},
{
  path: 'live-feed',
  component: LiveFeedComponent
},
{
  path: 'issue-categories',
  component: IssueCategoriesComponent
},
  {
    path: '**',
    redirectTo: ''
  }

];