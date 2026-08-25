import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-staff-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Navbar
  ],
  templateUrl: './staff-layout.html',
  styleUrl: './staff-layout.css'
})
export class StaffLayout {

  sidebarCollapsed = false;

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}