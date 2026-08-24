import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface IssueCategory {
  name: string;
  shortName: string;
  description: string;
  total: number;
  color: string;
  background: string;
}

@Component({
  selector: 'app-issue-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './issue-categories.html',
  styleUrl: './issue-categories.css'
})
export class IssueCategoriesComponent {
  currentUser: any;
  searchText = '';
  profileDropdownOpen = false;
  notificationDropdownOpen = false;

sidebarCollapsed = false;

toggleSidebar(): void {
  this.sidebarCollapsed = !this.sidebarCollapsed;
}

  selectedDate = new Date().toISOString().split('T')[0];

  categories: IssueCategory[] = [
    {
      name: 'Installation',
      shortName: 'Installation',
      description: 'Software installation and setup issues',
      total: 58,
      color: '#2f65e8',
      background: '#e8efff'
    },
    {
      name: 'Bill Format Modification',
      shortName: 'Bill',
      description: 'Invoice and bill template customization',
      total: 42,
      color: '#813cf0',
      background: '#f0e7ff'
    },
    {
      name: 'Backup & Restore',
      shortName: 'Backup',
      description: 'Data backup and recovery operations',
      total: 35,
      color: '#07986a',
      background: '#dff5ed'
    },
    {
      name: 'Licensing',
      shortName: 'Licensing',
      description: 'License activation and management',
      total: 31,
      color: '#df8200',
      background: '#fff0dd'
    },
    {
      name: 'Wallet Activation',
      shortName: 'Wallet',
      description: 'Digital wallet setup and activation',
      total: 24,
      color: '#1095b6',
      background: '#e1f5fa'
    },
    {
      name: 'Windows Formatting',
      shortName: 'Windows',
      description: 'OS formatting and reinstallation',
      total: 18,
      color: '#e32929',
      background: '#fde6e6'
    },
    {
      name: 'Others',
      shortName: 'Others',
      description: 'Miscellaneous support requests',
      total: 14,
      color: '#687b94',
      background: '#edf0f4'
    }
  ];

  constructor(private router: Router) {
    const user = sessionStorage.getItem('currentUser');
    this.currentUser = user
      ? JSON.parse(user)
      : { name: 'Dev Sharma', role: 'Administrator' };
  }

  get filteredCategories(): IssueCategory[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.categories;
    }

    return this.categories.filter(category =>
      `${category.name} ${category.description}`
        .toLowerCase()
        .includes(search)
    );
  }

  get userInitials(): string {
    return (this.currentUser?.name || 'Dev Sharma')
      .split(' ')
      .map((name: string) => name[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  get formattedDate(): string {
    return new Date(`${this.selectedDate}T00:00:00`).toLocaleDateString(
      'en-IN',
      {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    );
  }

  getBarHeight(total: number): string {
    return `${(total / 60) * 100}%`;
  }

  goTo(path: string): void {
    this.profileDropdownOpen = false;
    this.notificationDropdownOpen = false;
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

  addCategory(): void {
    const name = window.prompt('Enter category name:');

    if (!name?.trim()) {
      return;
    }

    this.categories.push({
      name: name.trim(),
      shortName: name.trim(),
      description: 'New support issue category',
      total: 0,
      color: '#2f65e8',
      background: '#e8efff'
    });
  }

  editCategory(category: IssueCategory): void {
    const name = window.prompt('Update category name:', category.name);

    if (name?.trim()) {
      category.name = name.trim();
      category.shortName = name.trim();
    }
  }

  deleteCategory(category: IssueCategory): void {
    if (window.confirm(`Delete "${category.name}"?`)) {
      this.categories = this.categories.filter(item => item !== category);
    }
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}