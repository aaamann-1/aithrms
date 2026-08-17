import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type Status = 'Resolved' | 'Pending' | 'Escalated';
type Filter = 'All' | Status;

interface Activity {
  initials: string;
  name: string;
  client: string;
  clientId: string;
  category: string;
  duration: string;
  time: string;
  status: Status;
  avatar: string;
}

@Component({
  selector: 'app-live-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-feed.html',
  styleUrl: './live-feed.css'
})
export class LiveFeedComponent  {
  currentUser: any;
  profileDropdownOpen = false;
  notificationDropdownOpen = false;
  mobileMenuOpen = false;
  searchText = '';
  searchResults: Activity[] = [];
  activeFilter: Filter = 'All';
  readonly filters: Filter[] = ['All', 'Resolved', 'Pending', 'Escalated'];

  readonly activities: Activity[] = [
    { initials: 'RV', name: 'Rahul Verma', client: 'Sharma Enterprises', clientId: 'CLI-4821', category: 'Licensing', duration: '14m', time: '10:42 AM', status: 'Resolved', avatar: 'green' },
    { initials: 'PN', name: 'Priya Nair', client: 'Mehta & Sons Pvt Ltd', clientId: 'CLI-3309', category: 'Bill Format Modification', duration: '32m', time: '10:28 AM', status: 'Pending', avatar: 'blue' },
    { initials: 'AS', name: 'Amit Sharma', client: 'Rajkumar Trading', clientId: 'CLI-5517', category: 'Backup & Restore', duration: '1h 05m', time: '09:55 AM', status: 'Escalated', avatar: 'purple' },
    { initials: 'SJ', name: 'Sneha Joshi', client: 'Patel Pharma Ltd', clientId: 'CLI-2234', category: 'Wallet Activation', duration: '22m', time: '09:38 AM', status: 'Resolved', avatar: 'orange' },
    { initials: 'KM', name: 'Karan Mehta', client: 'Global Textiles Co', clientId: 'CLI-6601', category: 'Windows Formatting', duration: '48m', time: '09:15 AM', status: 'Pending', avatar: 'yellow' },
    { initials: 'DP', name: 'Divya Pillai', client: 'Sunrise Exports', clientId: 'CLI-1122', category: 'Installation', duration: '18m', time: '08:57 AM', status: 'Resolved', avatar: 'pink' }
  ];

  constructor(private router: Router) {
    const user = sessionStorage.getItem('currentUser');
    this.currentUser = user ? JSON.parse(user) : { name: 'Admin User', role: 'Administrator' };
  }

  get displayedActivities(): Activity[] {
    const query = this.searchText.trim().toLowerCase();
    return this.activities.filter(activity => {
      const matchesFilter = this.activeFilter === 'All' || activity.status === this.activeFilter;
      const searchable = [activity.name, activity.client, activity.clientId, activity.category, activity.status]
        .join(' ')
        .toLowerCase();
      return matchesFilter && (!query || searchable.includes(query));
    });
  }

  get userInitials(): string {
    return (this.currentUser?.name || 'Admin User').split(' ').map((part: string) => part[0]).join('').slice(0, 2).toUpperCase();
  }

  goTo(path: string): void {
    this.closeMenus();
    this.router.navigate([path]);
  }

  toggleProfileDropdown(): void {
    this.profileDropdownOpen = !this.profileDropdownOpen;
    this.notificationDropdownOpen = false;
  }

  toggleNotificationDropdown(): void {
    this.notificationDropdownOpen = !this.notificationDropdownOpen;
    this.profileDropdownOpen = false;
  }

  setFilter(filter: Filter): void { this.activeFilter = filter; }

  searchDashboard(): void { this.searchResults = this.displayedActivities; }

  clearSearch(): void {
    this.searchText = '';
    this.searchResults = [];
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.closeMenus();
    this.router.navigate(['/login']);
  }

  closeMenus(): void {
    this.profileDropdownOpen = false;
    this.notificationDropdownOpen = false;
    this.mobileMenuOpen = false;
  }
}