import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  selectedDate = this.getTodayDate();

  showNotifications = false;

  showProfile = false;

  constructor(private router: Router) {}

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

  openProfile(): void {
    this.showProfile = false;
    this.router.navigate(['/staff/profile']);
  }

  openSettings(): void {
    this.showProfile = false;
    this.router.navigate(['/staff/settings']);
  }

  getTodayDate(): string {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

}