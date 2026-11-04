import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
export class Navbar implements OnInit {

  @Output() menuToggle = new EventEmitter<void>();

  searchQuery = '';

  selectedDate = this.getTodayDate();

  showNotifications = false;

  showProfile = false;

  // Logged-in staff information
  currentUser: any = null;

  fullName = 'Staff';
  designation = 'Staff';
  avatarInitial = 'S';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadLoggedInUser();
  }

  loadLoggedInUser(): void {

    // First try the existing AuthService
    try {
      this.currentUser = this.authService.getCurrentUser();
    } catch (error) {
      console.warn('Could not get current user from AuthService:', error);
    }

    // Fallback to localStorage
    if (!this.currentUser) {

      const currentUserData =
        localStorage.getItem('currentUser');

      if (currentUserData) {
        try {
          this.currentUser = JSON.parse(currentUserData);
        } catch (error) {
          console.error(
            'Unable to read current user:',
            error
          );
        }
      }
    }

    this.fullName =
      this.currentUser?.fullName ||
      localStorage.getItem('fullName') ||
      'Staff';

    this.designation =
      this.currentUser?.designation ||
      localStorage.getItem('designation') ||
      this.currentUser?.role ||
      localStorage.getItem('role') ||
      'Staff';

    this.avatarInitial =
      this.getInitial(this.fullName);
  }

  getInitial(name: string): string {

    if (!name) {
      return 'S';
    }

    const cleanName = name
      .replace(/^(mr\.?|mrs\.?|ms\.?|miss\.?)\s+/i, '')
      .trim();

    return cleanName.charAt(0).toUpperCase() || 'S';
  }

  toggleMenu(): void {
    this.menuToggle.emit();
  }

  toggleNotifications(): void {

    this.showNotifications =
      !this.showNotifications;

    if (this.showNotifications) {
      this.showProfile = false;
    }
  }

  toggleProfile(): void {

    this.showProfile =
      !this.showProfile;

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

    const year =
      today.getFullYear();

    const month =
      String(today.getMonth() + 1)
        .padStart(2, '0');

    const day =
      String(today.getDate())
        .padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}