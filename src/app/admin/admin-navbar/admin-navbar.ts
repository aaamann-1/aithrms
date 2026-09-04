import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css'
})
export class AdminNavbarComponent {
@Output() menuToggle = new EventEmitter<void>();
  searchQuery = '';

  selectedDate = '';

  notificationOpen = false;

  profileOpen = false;

  currentUser: any = null;


  notifications = [
    {
      title: 'New Ticket',
      message: 'A new support ticket has been created.',
      time: '5 min ago'
    },
    {
      title: 'Task Completed',
      message: 'Rahul completed a support task.',
      time: '15 min ago'
    },
    {
      title: 'New Staff',
      message: 'A new staff member has joined.',
      time: '30 min ago'
    }
  ];


  constructor(private router: Router) {

    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {

      try {
        this.currentUser = JSON.parse(savedUser);
      }
      catch {
        this.currentUser = null;
      }

    }


    const today = new Date();

    this.selectedDate =
      today.toISOString().split('T')[0];

  }

 toggleMenu(): void {
    this.menuToggle.emit();
  }
  /* SEARCH */

  performSearch(): void {

    const query = this.searchQuery.trim();

    if (!query) {
      return;
    }

    console.log('Searching:', query);

  }


  onSearchKey(event: KeyboardEvent): void {

    if (event.key === 'Enter') {
      this.performSearch();
    }

  }


  clearSearch(): void {
    this.searchQuery = '';
  }


  /* DATE */

  onDateChange(): void {

    console.log(
      'Selected date:',
      this.selectedDate
    );

  }


  getFormattedDate(): string {

    if (!this.selectedDate) {
      return '';
    }

    const date =
      new Date(this.selectedDate);

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  /* NOTIFICATIONS */

  toggleNotifications(): void {

    this.notificationOpen =
      !this.notificationOpen;

    this.profileOpen = false;

  }


  /* PROFILE */

  toggleProfile(): void {

    this.profileOpen =
      !this.profileOpen;

    this.notificationOpen = false;

  }


  openProfile(): void {

    this.profileOpen = false;

    this.router.navigate([
      '/admin/profile'
    ]);

  }


  openSettings(): void {

    this.profileOpen = false;

    this.router.navigate([
      '/admin/settings'
    ]);

  }


  logout(): void {

    localStorage.removeItem('isLoggedIn');

    localStorage.removeItem('currentUser');

    this.router.navigate(['/login']);

  }

}