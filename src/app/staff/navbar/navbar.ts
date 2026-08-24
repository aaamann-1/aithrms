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

  // Today's date by default
  selectedDate = this.getTodayDate();

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


  getTodayDate(): string {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

}