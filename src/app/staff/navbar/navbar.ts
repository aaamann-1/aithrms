import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  @Output() menuToggle = new EventEmitter<void>();

  searchQuery = '';

  selectedDate = '2026-08-19';

  showNotifications = false;

  showProfile = false;


  toggleMenu(): void {
    this.menuToggle.emit();
  }


  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;

    if (this.showNotifications) {
      this.showProfile = false;
    }
  }


  toggleProfile(): void {
    this.showProfile = !this.showProfile;

    if (this.showProfile) {
      this.showNotifications = false;
    }
  }


  getFormattedDate(): string {

    if (!this.selectedDate) {
      return '';
    }

    const date = new Date(this.selectedDate + 'T00:00:00');

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}