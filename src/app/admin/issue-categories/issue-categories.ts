import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface IssueCategory {
  id: number;
  name: string;
  shortName: string;
  description: string;
  total: number;
  color: string;
  background: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

interface IssueCategoryApiResponse {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  total: number;
}

interface CategoryTask {
  id: number;
  userId: number;
  staffName: string;
  clientName: string;
  clientId: string;
  issueCategory: string;
  issueDescription: string;
  startTime: string;
  endTime: string;
  resolutionNotes: string;
  status: string;
  escalatedTo: string | null;
  createdAt: string;
  updatedAt: string | null;
}

interface CategoryTasksResponse {
  category: {
    id: number;
    name: string;
    description: string | null;
  };
  total: number;
  tasks: CategoryTask[];
}

@Component({
  selector: 'app-issue-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './issue-categories.html',
  styleUrl: './issue-categories.css'
})
export class IssueCategoriesComponent implements OnInit {

  currentUser: any;

  searchText = '';

  profileDropdownOpen = false;
  notificationDropdownOpen = false;

  sidebarCollapsed = false;

  selectedDate =
    new Date().toISOString().split('T')[0];

  private apiUrl =
    'http://localhost:5089/api/IssueCategories';

  categories: IssueCategory[] = [];

  isLoading = false;
  isSaving = false;

  selectedCategory: IssueCategory | null = null;

  categoryTasks: CategoryTask[] = [];

  isLoadingTasks = false;


  constructor(
    private router: Router,
    private http: HttpClient
  ) {

    const user =
      sessionStorage.getItem('currentUser');

    this.currentUser = user
      ? JSON.parse(user)
      : {
          name: 'Dev Sharma',
          role: 'Administrator'
        };
  }


  ngOnInit(): void {
    this.loadCategories();
  }


  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  loadCategories(): void {

    this.isLoading = true;

    this.http
      .get<IssueCategoryApiResponse[]>(
        this.apiUrl
      )
      .subscribe({

        next: (data) => {

          console.log(
            'Issue Categories:',
            data
          );

          this.categories =
            data
              .filter(
                category =>
                  category.isActive === true
              )
              .map(
                category =>
                  this.mapCategory(category)
              );

          console.log(
            'Mapped Categories:',
            this.categories
          );

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'Failed to load issue categories:',
            error
          );

          this.categories = [];

          this.isLoading = false;

          alert(
            error?.error?.message ||
            'Failed to load issue categories.'
          );
        }

      });
  }


  // =========================================================
  // MAP CATEGORY
  // =========================================================

  private mapCategory(
    category: IssueCategoryApiResponse
  ): IssueCategory {

    const style =
      this.getCategoryStyle(
        category.name
      );

    return {

      id: category.id,

      name: category.name,

      shortName: category.name,

      description:
        category.description ||
        'Support issue category',

      total:
        Number(category.total) || 0,

      color: style.color,

      background: style.background,

      isActive: category.isActive,

      createdAt: category.createdAt,

      updatedAt: category.updatedAt
    };
  }


  // =========================================================
  // CATEGORY COLORS
  // =========================================================

  private getCategoryStyle(
    name: string
  ): {
    color: string;
    background: string;
  } {

    switch (
      name.trim().toLowerCase()
    ) {

      case 'invoice':

        return {
          color: '#2f65e8',
          background: '#e8efff'
        };


      case 'payment':

        return {
          color: '#813cf0',
          background: '#f0e7ff'
        };


      case 'refund':

        return {
          color: '#07986a',
          background: '#dff5ed'
        };


      case 'account':

        return {
          color: '#df8200',
          background: '#fff0dd'
        };


      case 'billing plan':

        return {
          color: '#1095b6',
          background: '#e1f5fa'
        };


      case 'subscription':

        return {
          color: '#e32929',
          background: '#fde6e6'
        };


      case 'other':

        return {
          color: '#687b94',
          background: '#edf0f4'
        };


      default:

        return {
          color: '#2f65e8',
          background: '#e8efff'
        };
    }
  }


  // =========================================================
  // SEARCH
  // =========================================================

  get filteredCategories(): IssueCategory[] {

    const search =
      this.searchText
        .trim()
        .toLowerCase();

    if (!search) {
      return this.categories;
    }

    return this.categories.filter(
      category =>
        `${category.name} ${category.description}`
          .toLowerCase()
          .includes(search)
    );
  }


  // =========================================================
  // OPEN CATEGORY / VIEW ISSUES
  // =========================================================

  openCategory(
    category: IssueCategory
  ): void {

    console.log(
      'Clicked category:',
      category
    );


    // If same category is clicked again,
    // close the issue details
    if (
      this.selectedCategory?.id ===
      category.id
    ) {

      this.closeCategoryTasks();

      return;
    }


    // Select category
    this.selectedCategory = category;


    // Clear previous issues
    this.categoryTasks = [];


    // Show loading
    this.isLoadingTasks = true;


    const url =
      `${this.apiUrl}/${category.id}/tasks`;


    console.log(
      'Loading category issues from:',
      url
    );


    this.http
      .get<CategoryTasksResponse>(url)
      .subscribe({

        next: (response) => {

          console.log(
            'FULL CATEGORY RESPONSE:',
            response
          );


          console.log(
            'TASKS FROM API:',
            response?.tasks
          );


          // Store actual task details
          this.categoryTasks =
            response?.tasks ?? [];


          console.log(
            'TASKS STORED:',
            this.categoryTasks
          );


          console.log(
            'NUMBER OF TASKS:',
            this.categoryTasks.length
          );


          this.isLoadingTasks = false;
        },


        error: (error) => {

          console.error(
            'Failed to load category tasks:',
            error
          );


          this.categoryTasks = [];


          this.isLoadingTasks = false;


          alert(
            error?.error?.message ||
            'Failed to load issues for this category.'
          );
        }

      });
  }


  // =========================================================
  // CLOSE ISSUES
  // =========================================================

  closeCategoryTasks(): void {

    this.selectedCategory = null;

    this.categoryTasks = [];

    this.isLoadingTasks = false;
  }


  // =========================================================
  // USER INITIALS
  // =========================================================

  get userInitials(): string {

    return (
      this.currentUser?.name ||
      'Dev Sharma'
    )
      .split(' ')
      .map(
        (name: string) =>
          name[0]
      )
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }


  // =========================================================
  // FORMATTED DATE
  // =========================================================

  get formattedDate(): string {

    return new Date(
      `${this.selectedDate}T00:00:00`
    ).toLocaleDateString(
      'en-IN',
      {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }
    );
  }


  // =========================================================
  // ANALYTICS BAR
  // =========================================================

  getBarHeight(
    total: number
  ): string {

    const max =
      Math.max(
        ...this.categories.map(
          category =>
            category.total
        ),
        1
      );

    return `${
      (total / max) * 100
    }%`;
  }


  // =========================================================
  // TOTAL ISSUES
  // =========================================================

  get totalIssues(): number {

    return this.categories.reduce(
      (total, category) =>
        total + category.total,
      0
    );
  }


  // =========================================================
  // ADD CATEGORY
  // =========================================================

  addCategory(): void {

    const name =
      window.prompt(
        'Enter category name:'
      );

    if (!name?.trim()) {
      return;
    }


    const categoryName =
      name.trim();


    const alreadyExists =
      this.categories.some(
        category =>
          category.name.toLowerCase() ===
          categoryName.toLowerCase()
      );


    if (alreadyExists) {

      alert(
        'This category already exists.'
      );

      return;
    }


    const description =
      window.prompt(
        'Enter category description:',
        'New support issue category'
      );


    const request = {

      name: categoryName,

      description:
        description?.trim() ||
        'New support issue category',

      isActive: true
    };


    this.isSaving = true;


    this.http
      .post(
        this.apiUrl,
        request
      )
      .subscribe({

        next: () => {

          this.isSaving = false;

          alert(
            'Issue category added successfully.'
          );

          this.loadCategories();
        },


        error: (error) => {

          this.isSaving = false;

          console.error(
            'Failed to add category:',
            error
          );

          alert(
            error?.error?.message ||
            'Failed to add issue category.'
          );
        }

      });
  }


  // =========================================================
  // EDIT CATEGORY
  // =========================================================

  editCategory(
    category: IssueCategory
  ): void {

    const name =
      window.prompt(
        'Update category name:',
        category.name
      );


    if (!name?.trim()) {
      return;
    }


    const description =
      window.prompt(
        'Update category description:',
        category.description
      );


    const request = {

      name: name.trim(),

      description:
        description?.trim() ||
        category.description,

      isActive: true
    };


    this.isSaving = true;


    this.http
      .put(
        `${this.apiUrl}/${category.id}`,
        request
      )
      .subscribe({

        next: () => {

          this.isSaving = false;

          alert(
            'Issue category updated successfully.'
          );


          if (
            this.selectedCategory?.id ===
            category.id
          ) {

            this.closeCategoryTasks();
          }


          this.loadCategories();
        },


        error: (error) => {

          this.isSaving = false;

          console.error(
            'Failed to update category:',
            error
          );

          alert(
            error?.error?.message ||
            'Failed to update issue category.'
          );
        }

      });
  }


  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  deleteCategory(
    category: IssueCategory
  ): void {

    const confirmed =
      window.confirm(
        `Delete "${category.name}"?`
      );


    if (!confirmed) {
      return;
    }


    this.http
      .delete(
        `${this.apiUrl}/${category.id}`
      )
      .subscribe({

        next: () => {

          alert(
            'Issue category deleted successfully.'
          );


          if (
            this.selectedCategory?.id ===
            category.id
          ) {

            this.closeCategoryTasks();
          }


          this.loadCategories();
        },


        error: (error) => {

          console.error(
            'Failed to delete category:',
            error
          );

          alert(
            error?.error?.message ||
            'Failed to delete issue category.'
          );
        }

      });
  }


  // =========================================================
  // SIDEBAR
  // =========================================================

  toggleSidebar(): void {

    this.sidebarCollapsed =
      !this.sidebarCollapsed;
  }


  // =========================================================
  // NAVIGATION
  // =========================================================

  goTo(
    path: string
  ): void {

    this.profileDropdownOpen = false;

    this.notificationDropdownOpen = false;

    this.router.navigate([
      path
    ]);
  }


  // =========================================================
  // PROFILE DROPDOWN
  // =========================================================

  toggleProfileDropdown(): void {

    this.profileDropdownOpen =
      !this.profileDropdownOpen;

    this.notificationDropdownOpen =
      false;
  }


  // =========================================================
  // NOTIFICATION DROPDOWN
  // =========================================================

  toggleNotificationDropdown(): void {

    this.notificationDropdownOpen =
      !this.notificationDropdownOpen;

    this.profileDropdownOpen =
      false;
  }


  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    sessionStorage.removeItem(
      'currentUser'
    );

    this.router.navigate([
      '/login'
    ]);
  }

}