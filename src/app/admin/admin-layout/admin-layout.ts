import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    AdminNavbarComponent
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

  @ViewChild(RouterOutlet)
  routerOutlet!: RouterOutlet;

  onSearch(query: string): void {
    const currentPage: any = this.routerOutlet.component;

    if (currentPage && typeof currentPage.search === 'function') {
      currentPage.search(query);
    }
  }
}