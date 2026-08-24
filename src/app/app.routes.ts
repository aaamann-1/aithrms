import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { LiveFeedComponent } from './admin/live-feed/live-feed';
import { IndividualReports } from './admin/reports/Individual/individual';
import { TeamReportsComponent } from './admin/reports/Team/team';
import { StaffManagement } from './admin/staff-management/staff-management';
import { Attendance } from './admin/Attendance/attendance';
import { IssueCategoriesComponent } from './admin/issue-categories/issue-categories';
import { ExportReports } from './admin/export-reports/export-reports';
import { Settings } from './admin/settings/settings';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'settings', component: Settings },
  { path: 'admin/reports/individual', component: IndividualReports },
  { path: 'admin/reports/team', component: TeamReportsComponent },
  { path: 'admin/live-feed', component: LiveFeedComponent },
  { path: 'admin/staff-management', component: StaffManagement },
  { path: 'admin/attendance', component: Attendance },
  { path: 'admin/issue-categories', component: IssueCategoriesComponent },
  { path: 'admin/export-reports', component: ExportReports },
  { path: '**', redirectTo: '' }
];